
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

    // Generate the meal plan prompt
    const prompt = `Generate a 7-day meal plan with ${preferences.mealsPerDay} meals per day. 
    Diet type: ${preferences.dietType}
    Health goal: ${preferences.healthGoal}
    ${preferences.ingredients ? `Include these ingredients where possible: ${preferences.ingredients}` : ''}
    
    Format the response as JSON with this structure:
    {
      "days": [
        {
          "day": "Monday",
          "meals": [
            {
              "name": "meal name",
              "type": "breakfast/lunch/dinner/snack",
              "calories": number,
              "protein": number,
              "carbs": number,
              "fat": number,
              "description": "brief description"
            }
          ]
        }
      ]
    }`

    console.log('Generating meal plan with prompt:', prompt)

    // Generate content
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()
    
    console.log('Received response from Gemini:', text)

    try {
      const mealPlan = JSON.parse(text)

      // Store each daily plan
      for (const day of mealPlan.days) {
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

        if (dailyPlanError) throw dailyPlanError
        console.log(`Saved daily plan for ${day.day}:`, dailyPlan)
      }

      return new Response(
        JSON.stringify({ success: true, message: 'Meal plan generated and saved successfully' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    } catch (parseError) {
      console.error('Failed to parse Gemini response:', parseError)
      throw new Error('Failed to parse meal plan data')
    }
  } catch (error) {
    console.error('Error in generate-meal-plan function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})

