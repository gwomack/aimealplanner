
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai@0.2.0"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const genAI = new GoogleGenerativeAI(Deno.env.get('GEMINI_API_KEY') || '')
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

    const { weeklyPlanId, preferences } = await req.json()
    console.log('Received request for weekly plan:', weeklyPlanId, 'with preferences:', preferences)

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Generate the meal plan prompt with more explicit formatting instructions
    const prompt = `Generate a 7-day meal plan with ${preferences.mealsPerDay} meals per day. 
    Diet type: ${preferences.dietType}
    Health goal: ${preferences.healthGoal}
    ${preferences.ingredients ? `Include these ingredients where possible: ${preferences.ingredients}` : ''}
    
    You must respond with valid JSON that exactly matches this structure:
    {
      "days": [
        {
          "day": "Monday",
          "meals": [
            {
              "name": "meal name",
              "type": "breakfast",
              "calories": 500,
              "protein": 20,
              "carbs": 30,
              "fat": 15,
              "description": "brief description"
            }
          ]
        }
      ]
    }
    
    Ensure that:
    1. All numeric values are actual numbers, not strings
    2. The "type" field must be one of: "breakfast", "lunch", "dinner", "snack"
    3. The "day" field must be a capitalized day name: Monday, Tuesday, etc.
    4. Include exactly 7 days in order starting from Monday
    5. Each day must have exactly ${preferences.mealsPerDay} meals
    6. All fields are required for each meal`

    console.log('Generating meal plan with prompt:', prompt)

    // Generate content
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()
    
    console.log('Received raw response from Gemini:', text)

    try {
      // Try to clean the response in case there's any markdown or extra text
      const jsonStartIndex = text.indexOf('{')
      const jsonEndIndex = text.lastIndexOf('}') + 1
      const jsonText = text.slice(jsonStartIndex, jsonEndIndex)
      
      console.log('Attempting to parse JSON:', jsonText)
      
      const mealPlan = JSON.parse(jsonText)

      // Validate the structure
      if (!mealPlan.days || !Array.isArray(mealPlan.days)) {
        throw new Error('Invalid meal plan structure: missing days array')
      }

      // Store each daily plan
      for (const day of mealPlan.days) {
        if (!day.day || !day.meals || !Array.isArray(day.meals)) {
          console.error('Invalid day structure:', day)
          throw new Error(`Invalid structure for day: ${day.day}`)
        }

        const { data: dailyPlan, error: dailyPlanError } = await supabaseClient
          .from('daily_meal_plans')
          .insert({
            weekly_plan_id: weeklyPlanId,
            day_of_week: day.day.toLowerCase(),
            meals: day.meals,
            model_provider: 'gemini'
          })
          .select()
          .single()

        if (dailyPlanError) {
          console.error(`Error saving daily plan for ${day.day}:`, dailyPlanError)
          throw dailyPlanError
        }
        console.log(`Saved daily plan for ${day.day}:`, dailyPlan)
      }

      return new Response(
        JSON.stringify({ success: true, message: 'Meal plan generated and saved successfully' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    } catch (parseError) {
      console.error('Failed to parse Gemini response:', parseError)
      console.error('Response that failed to parse:', text)
      return new Response(
        JSON.stringify({ 
          error: 'Failed to parse meal plan data', 
          details: parseError.message,
          rawResponse: text 
        }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }
  } catch (error) {
    console.error('Error in generate-meal-plan function:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.stack
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})

