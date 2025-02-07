
export function generateMealPlanPrompt(preferences: { dietType: string; healthGoal: string; mealsPerDay: string; ingredients?: string }): string {
  return `You are a meal plan generator. Generate EXACTLY 7 days of meals starting from Monday. 
    Diet type: ${preferences.dietType}
    Health goal: ${preferences.healthGoal}
    ${preferences.ingredients ? `Include these ingredients where possible: ${preferences.ingredients}` : ''}
    
    STRICT FORMAT REQUIREMENTS:
    1. You MUST generate EXACTLY 7 days
    2. Days MUST be Monday through Sunday in order
    3. Each day MUST include EXACTLY ${preferences.mealsPerDay} meals
    4. Each meal MUST have these fields:
       - name (string, max 30 chars)
       - type (exactly one of: breakfast, lunch, dinner, snack)
       - calories (number)
       - protein (number)
       - carbs (number)
       - fat (number)
       - description (string, max 50 chars)
    5. Return ONLY a valid JSON object with this structure:
    {
      "days": [
        {
          "day": "Monday",
          "meals": [...]
        },
        {
          "day": "Tuesday",
          "meals": [...]
        }
        // and so on for ALL 7 days
      ]
    }`
}
