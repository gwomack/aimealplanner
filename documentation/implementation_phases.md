# AI Meal Planner: LLM-Guided Implementation Phases  
**Goal:** Generate code via LLM prompts for rapid development.  

---

## Phase 1: Scaffold Next.js Frontend Skeleton  
### LLM Prompts for Code Generation  
1. **Landing Page**  
"Generate a Next.js 14 landing page with Tailwind CSS. Include:

Hero section with headline: 'AI Meal Planner for Busy People'.
Subheadline: 'Get personalized weekly meal plans based on your ingredients and goals'.
Two buttons: 'Get Started' (links to /signup) and 'Learn More' (scrolls to features).
Mobile-first design with dark/light mode toggle."

2. **Dashboard Layout**  
"Build a Next.js /plan/[id] page showing a weekly meal plan.
Features:

Tabs for each weekday (Monday-Sunday).
Under each tab, list 3 meals (breakfast, lunch, dinner) as cards.
Meal cards display name, calories, and placeholder ingredients.
Use shadcn/ui components for clean styling."

### Deliverables  
- [ ] Next.js app with `/`, `/dashboard`, `/plan/[id]` routes.  
- [ ] Tailwind CSS styling for core components.  
- [ ] Mock data file (`mockPlans.json`).  

---

## Phase 2: User Input Forms & State  
### LLM Prompts  
1. **Diet/Goals Form**  
"Create a multi-step form in Next.js for:

Diet type (dropdown: vegetarian, keto, etc.).
Demographics (age, weight, height inputs with validation).
Ingredients (tag input with custom labels).
Use React Hook Form + Zod for validation. Style with Tailwind."

2. **State Management**  
"Implement Zustand to store:

User’s dietary preferences.
Selected ingredients.
Generated meal plans.
Create a store with actions like addIngredient() and updatePlan()."

### Deliverables  
- [ ] Functional forms with validation.  
- [ ] Zustand store integration.  

---

## Phase 3: Supabase Backend Integration  
### LLM Prompts  
1. **Auth Setup**  
"Add Supabase email/password auth to Next.js. Include:

Signup/login pages.
Protected routes (users must be logged in for /dashboard).
Logout button in navbar. Use Supabase JS client v2."

2. **Database Schema**  
"Write SQL scripts for Supabase tables:

users: id, email, created_at
meal_plans: id, user_id (FK), plan_data (JSONB)
ingredients: id, user_id (FK), name, tags
Enable Row-Level Security (RLS) policies."

### Deliverables  
- [ ] Supabase auth flow.  
- [ ] Tables with RLS policies.  

---

## Phase 4: LLM Meal Generation Pipeline  
### LLM Prompts  
1. **API Service**  
"Create a Next.js API route (/api/generate-plan) that:

Takes user inputs (diet, ingredients, goals).
Calls DeepSeek API with this prompt template:
'Generate a {diet} meal plan for a {age}-year-old aiming to {goal}.
Use ONLY these ingredients: {ingredients}. Exclude: {allergies}.
Return JSON with calories, protein, carbs, fat per meal.'
Validates response against Zod schema."

### Deliverables  
- [ ] API route with error handling.  
- [ ] Zod validation schema.  

---

## Phase 5: Docker Deployment  
### LLM Prompt 
"Write a Dockerfile for a Next.js 14 app with:

Multi-stage build (build + production stages).
Node.js 20 + pnpm.
Environment variables for Supabase URL/key.
Include a docker-compose.yml with Nginx reverse proxy and SSL."
