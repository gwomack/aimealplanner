
# App Navigation Structure
Version: 1.2 (Refined MVP)

## Logged-Out User

### Landing Page
- Hero section with CTA ("Get Started").
- Links: [Sign Up] | [Login].

## Logged-In User
### Primary Navigation (Sidebar/Top Bar)

#### Dashboard (Weekly Plans Management)
- List of saved Meal Plans:
  - Weekly Meal Plan Details.
    - Click plan to see details.
    - If no plans exist: "No meal plans yet! Tap below to get started.".
  - Create new weekly meal plan.
- KPIs:
  - Total weekly calories.
  - Average protein/carbs/fat per day.
  - "Nutrition score" (e.g., "Balanced", "High Protein").

### View Weeky Meal Plan
- List the meals of the day.
  - Meals as grouped by day of the week.
    - User can navigate the days of the week to see its contents.
  - User view the ingredients of the meals.
  - some KPIs of the meal and per week day.

#### Generate New Plan
- Form steps:
  - Diet & Goals:
    - Diet type (dropdown).
    - Meal count per day.
    - Goals (build muscle, lose weight, etc.).
  - Ingredients (optional):
    - Add ingredients with custom tags (e.g., "freezer", "pantry").
    - Tags are for user organization only (LLM receives raw ingredient names).

#### Profile & Settings
- Demographics: Age, height, weight, sex.
- Dietary Restrictions: Allergies, ingredient exclusions.
- Account Settings: Email/password updates.
- Logout

### Mobile Navigation

- Hamburger menu: [Dashboard] | [Generate Plan] | [Profile] | [Logout].
- FAB on Dashboard to quickly generate a new plan.

## Key Interactions

### Dashboard:
- No editing: Users can only view meal details and KPIs. user can create new meal plan
  - No plan regeneration.

### Ingredients Input:
- Add ingredients with user-defined tags (e.g., "my_spices", "weekly_groceries").
- Tags display as groups (e.g., "Group: my_spices → paprika, cumin").

## Notes

- Tags: Purely organizational; ignored by LLM (only ingredient names are sent).
