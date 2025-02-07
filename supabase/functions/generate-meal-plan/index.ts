
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai@0.2.0"
import { cleanJsonResponse } from "./cleanJson.ts"
import { validateMealPlan } from "./validateMealPlan.ts"
import { generateMealPlanPrompt } from "./generatePrompt.ts"
import type { MealPlan, GenerateMealPlanRequest } from "./types.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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

    const { weeklyPlanId, preferences } = await req.json() as GenerateMealPlanRequest
    console.log('Received request for weekly plan:', weeklyPlanId, 'with preferences:', preferences)

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const prompt = generateMealPlanPrompt(preferences)
    console.log('Generating meal plan with prompt:', prompt)

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()
    
    console.log('Raw response from Gemini:', text)

    try {
      const cleanedText = cleanJsonResponse(text)
      console.log('Cleaned JSON text:', cleanedText)
      
      const mealPlan = JSON.parse(cleanedText) as MealPlan
      validateMealPlan(mealPlan, parseInt(preferences.mealsPerDay))

      // Store each daily plan
      for (const day of mealPlan.days) {
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
