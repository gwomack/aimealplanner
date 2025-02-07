
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai@0.2.0"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

type Meal = {
  name: string
  type: "breakfast" | "lunch" | "dinner" | "snack"
  calories: number
  protein: number
  carbs: number
  fat: number
  description: string
}

type DayPlan = {
  day: string
  meals: Meal[]
}

type MealPlan = {
  days: DayPlan[]
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const genAI = new GoogleGenerativeAI(Deno.env.get('GEMINI_API_KEY') || '')
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-pro',
      generationConfig: {
        maxOutputTokens: 30000, // Increased to handle larger responses
        temperature: 0.3 // Reduced for more consistent output
      }
    })

    const { weeklyPlanId, preferences } = await req.json()
    console.log('Received request for weekly plan:', weeklyPlanId, 'with preferences:', preferences)

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const prompt = `Generate a 7-day meal plan with ${preferences.mealsPerDay} meals per day that follows these specifications EXACTLY:
    Diet type: ${preferences.dietType}
    Health goal: ${preferences.healthGoal}
    ${preferences.ingredients ? `Include these ingredients where possible: ${preferences.ingredients}` : ''}
    
    Response format:
    - Each meal MUST have these exact fields: name, type, calories, protein, carbs, fat, description
    - All numeric values MUST be numbers (not strings)
    - The "type" field must be exactly one of: "breakfast", "lunch", "dinner", "snack"
    - The "day" field must be a capitalized day name: Monday, Tuesday, etc.
    - Include exactly 7 days starting from Monday
    - Each day must have exactly ${preferences.mealsPerDay} meals
    - Keep descriptions short (under 50 characters)
    - Keep meal names short (under 30 characters)
    - All field values must be properly quoted strings or numbers
    - ONLY return a valid JSON object without any explanation or markdown formatting
    
    Example of expected format:
    {
      "days": [
        {
          "day": "Monday",
          "meals": [
            {
              "name": "Oatmeal with Berries",
              "type": "breakfast",
              "calories": 300,
              "protein": 10,
              "carbs": 40,
              "fat": 8,
              "description": "Oatmeal topped with mixed berries"
            }
          ]
        }
      ]
    }`

    console.log('Generating meal plan with prompt:', prompt)

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()
    
    console.log('Raw response from Gemini:', text)

    try {
      // Clean the response text to handle potential truncation
      let cleanedText = text
        .replace(/```json\s*|\s*```/g, '') // Remove markdown
        .replace(/^[\s\n]*{/, '{')        // Clean leading whitespace
        .trim()
      
      // If the JSON is truncated, try to fix it by adding missing closing brackets
      if (!cleanedText.endsWith('}')) {
        const openBraces = (cleanedText.match(/{/g) || []).length
        const closeBraces = (cleanedText.match(/}/g) || []).length
        const missingBraces = openBraces - closeBraces
        
        if (missingBraces > 0) {
          cleanedText = cleanedText.replace(/[^}]*$/, '') // Remove truncated content
          cleanedText += '}'.repeat(missingBraces) // Add missing closing braces
        }
      }
      
      console.log('Cleaned JSON text:', cleanedText)
      
      // Parse and validate the JSON structure
      const mealPlan = JSON.parse(cleanedText) as MealPlan

      // Validate meal plan structure
      if (!mealPlan.days || !Array.isArray(mealPlan.days)) {
        throw new Error('Invalid meal plan structure: missing days array')
      }

      if (mealPlan.days.length !== 7) {
        throw new Error(`Expected 7 days, got ${mealPlan.days.length}`)
      }

      // Store each daily plan
      for (const day of mealPlan.days) {
        // Validate day structure
        if (!day.day || !day.meals || !Array.isArray(day.meals)) {
          console.error('Invalid day structure:', day)
          throw new Error(`Invalid structure for day: ${day.day}`)
        }

        if (day.meals.length !== parseInt(preferences.mealsPerDay)) {
          throw new Error(`Expected ${preferences.mealsPerDay} meals for ${day.day}, got ${day.meals.length}`)
        }

        // Validate each meal
        for (const meal of day.meals) {
          // Check all required fields are present and of correct type
          if (typeof meal.name !== 'string' || meal.name.length === 0) {
            throw new Error(`Invalid or missing meal name in ${day.day}`)
          }
          if (!['breakfast', 'lunch', 'dinner', 'snack'].includes(meal.type)) {
            throw new Error(`Invalid meal type "${meal.type}" in ${day.day}`)
          }
          if (typeof meal.calories !== 'number' || meal.calories <= 0) {
            throw new Error(`Invalid calories value in ${day.day}`)
          }
          if (typeof meal.protein !== 'number' || meal.protein < 0) {
            throw new Error(`Invalid protein value in ${day.day}`)
          }
          if (typeof meal.carbs !== 'number' || meal.carbs < 0) {
            throw new Error(`Invalid carbs value in ${day.day}`)
          }
          if (typeof meal.fat !== 'number' || meal.fat < 0) {
            throw new Error(`Invalid fat value in ${day.day}`)
          }
          if (typeof meal.description !== 'string' || meal.description.length === 0) {
            throw new Error(`Invalid or missing meal description in ${day.day}`)
          }
        }

        const { data: dailyPlan, error: dailyPlanError } = await supabaseClient
          .from('daily_meal_plans')
          .insert({
            weekly_plan_id: weeklyPlanId,
            day_of_week: day.day,
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
        JSON.stringify({ 
          success: true, 
          message: 'Meal plan generated and saved successfully' 
        }),
        { 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json' 
          } 
        }
      )

    } catch (parseError) {
      console.error('Failed to parse or validate meal plan:', parseError)
      console.error('Response that failed:', text)
      
      return new Response(
        JSON.stringify({ 
          error: 'Failed to parse or validate meal plan data', 
          details: parseError.message,
          rawResponse: text 
        }),
        { 
          status: 500,
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json' 
          }
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
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        }
      }
    )
  }
})
