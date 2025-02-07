
export function generateMealPlanPrompt(preferences: { dietType: string; healthGoal: string; mealsPerDay: string; ingredients?: string }): string {
  return `Generate a 7-day meal plan with ${preferences.mealsPerDay} meals per day that follows these specifications EXACTLY:
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
}
