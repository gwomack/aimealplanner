# Project Requirements Document (PRD): AI Meal Planner  
**Version:** 1.0 (MVP)  
**Date:** [Insert Date]  

---

## 1. Project Overview  
### Objective  
Build a minimal AI-powered meal planning web app that generates structured meal plans based on user inputs (dietary preferences, ingredients, goals) and returns nutrition data via LLM APIs.  

---

## 2. Key User Inputs  
Users must provide:  
1. **Diet Type**: Anything, Vegetarian, Vegan, Ketogenic, Paleo, Mediterranean, Low Carb.  
2. **Demographics**: Age, Height (cm), Weight (kg), Sex (Male/Female/Other).  
3. **Goals**: Build Muscle, Lose Weight, Eat Healthy.  
4. **Meal Count**: Number of meals per day (default: 3).  
5. **Allergies/Exclusions**: Ingredients to avoid (e.g., peanuts, shellfish).  
6. **Ingredients**: Ingredients available in their pantry (optional).  

---

## 3. Functional Requirements  
### AI Meal Plan Generator  
#### Prompt Strategy  
- **No Ingredients Provided**:  
  "Suggest diverse {diet_type} meals for a {age}-year-old {sex} ({height}cm, {weight}kg) aiming to {goal}.  
  Meals/day: {meal_count}. Exclude: {allergies}. Return JSON."  

- **Ingredients Provided**:  
  "Generate {diet_type} meals STRICTLY USING ONLY THESE INGREDIENTS: {ingredients_list}.  
  For a {age}-year-old {sex} ({height}cm, {weight}kg) aiming to {goal}.  
  Meals/day: {meal_count}. Exclude: {allergies}. Return JSON."  

#### Structured JSON Output  
{
  "meal_plan": [
    {
      "week_day": "Monday",
      "meals": [
        {
          "meal_name": "Mediterranean Vegetable Omelette",
          "calories": "250 cal",
          "protein": "20g",
          "carbs": "15g",
          "fat": "10g",
          "ingredients": [
            "150g eggs",
            "100g spinach",
            "50g bell peppers"
          ]
        }
      ]
    }
  ]
}

### Error Handling  
1. **API Retries**:  
   - 3 retries for failed requests (DeepSeek → Gemini fallback).  
   - Exponential backoff (1s, 3s, 5s delays).  
2. **Timeouts**:  
   - 15-second timeout per API call.  
   - Display: "Meal generation is taking longer than expected. Please wait or try again."  
3. **Empty Ingredients Scenario**:  
   - Add disclaimer: "Suggestions may include ingredients not in your pantry."  

---

## 4. Non-Functional Requirements  
### Validation  
- **Input Validation**:  
  - Required fields: Diet type, demographics, goals.  
  - Numeric range checks (e.g., age 18-120, weight 40-200kg).  
- **Output Validation**:  
  - Ensure LLM response matches JSON schema.  
  - Reject responses with ingredients not in user’s pantry (if provided).  

### Security  
- API keys stored in environment variables (Vercel/Supabase).  

---

## 5. Risks & Mitigations  
| Risk | Mitigation |  
|------|------------|  
| LLM ignores ingredient constraints | Append "STRICTLY USE ONLY" to prompts when ingredients exist. |  
| API quota limits | Monitor usage; alert at 80% quota. |  
| Invalid meal names (e.g., "Burger") | Block non-specific meal names with regex validation. |  

---

**Ready for development!**  