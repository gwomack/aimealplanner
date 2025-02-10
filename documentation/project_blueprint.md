# Project Blueprint Document: AI Meal Planner  
**Objective**: Build a web app that generates weekly meal plans using AI (DeepSeek/Gemini), tailored to user’s ingredients and dietary goals.  

---

## Tech Stack  
- **Frontend**: Next.js 14 (App Router), Tailwind CSS, shadcn/ui components.  
- **Backend**: Supabase (Auth, PostgreSQL DB, Storage).  
- **State Management**: Zustand.  
- **Deployment**: Docker + self-hosted VPS (Ubuntu).  

---

## Core Features (MVP Scope)  
1. **Landing Page**: Explain app value + CTA to signup.  
2. **Auth**: Email/password signup/login (Supabase).  
3. **Profile Settings**:  
   - Demographics (age, height, weight).  
   - Dietary restrictions (allergies, diet type).  
4. **Ingredients Management**:  
   - Add/remove ingredients with custom tags (user-defined).  
5. **AI Meal Generation**:  
   - Generate 7-day meal plans via DeepSeek/Gemini APIs.  
   - Output: Meal names, calories, macros, ingredients.  
6. **Dashboard**:  
   - View saved meal plans.  
   - KPIs: Weekly calories, avg. protein/carbs/fat.  

---

## File Structure  
```plaintext
/src  
├── app  
│   ├── (auth)  
│   │   ├── signup/page.tsx  
│   │   └── login/page.tsx  
│   ├── dashboard/page.tsx  
│   └── plan/[id]/page.tsx  
├── components  
│   ├── ui (shadcn)
|   ├── preline (dropdowns/modals) 
│   ├── MealCard.tsx  
│   └── IngredientTagInput.tsx  
├── lib  
│   ├── supabase/client.ts  
│   └── store.ts (Zustand)  
├── public (images/fonts)  
└── styles (Tailwind globals)  

## Dependencies

**dependencies:**
- shadcn nextjs template
- preline
- tailwindcss
- @supabase/supabase-js
- zod (validation)
- @hookform/resolvers
- zustand

**devDependencies:**
- @types/node  
- typescript  
- jest (testing)
