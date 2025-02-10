# AI Meal Planner 🍽️

![Meal Plan](/public/screenshot-meal-plan.png)

## 🌟 Overview

A web application that generates meal plans using AI. The app takes user inputs including dietary restrictions, available ingredients, and nutritional goals to create customized daily or weekly meal plans with recipes and nutritional information.

## ✨ Features

- 🤖 **AI-Powered Meal Generation**: Utilizes advanced AI models to create personalized meal plans
- 🥗 **Dietary Customization**: Supports various diet types (Vegetarian, Vegan, Keto, Paleo, etc.)
- 📊 **Nutrition Tracking**: Detailed macro and micronutrient information for each meal
- 🏷️ **Ingredient Management**: Track your pantry and get recipes based on available ingredients
- 📱 **Responsive Design**: Seamless experience across all devices
- 🔐 **Secure Authentication**: Protected user data and preferences

## 🚀 Live Demo

Try it out: [Demo Link](#) *(Coming Soon)*

## 🛠️ Tech Stack

- **Frontend**:
  - Next.js 14 (App Router)
  - Tailwind CSS
  - shadcn/ui components
  - Zustand (State Management)

- **Backend**:
  - Supabase (Authentication & Database)
  - PostgreSQL

- **AI Integration**:
  - Advanced Language Models
  - Structured JSON Output
  - Intelligent Error Handling

## 💻 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Supabase account

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/ai-meal-planner.git
cd ai-meal-planner
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Set up environment variables
```bash
cp .env.example .env.local
```
Fill in your environment variables:
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- AI_API_KEY

4. Run the development server
```bash
npm run dev
# or
yarn dev
```

Visit `http://localhost:3000` to see the application.

## 📖 Usage

1. **Sign Up/Login**: Create an account or login to access personalized features
2. **Set Your Profile**: Input your demographics and dietary preferences
3. **Add Ingredients**: (Optional) List ingredients you have available
4. **Generate Meal Plan**: Get AI-generated meal plans tailored to your needs
5. **View & Save**: Save your favorite meal plans for future reference

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

![Version](https://img.shields.io/badge/version-0.0.0-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![Tailwind](https://img.shields.io/badge/Tailwind-3.0-38bdf8)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178c6)
![Supabase](https://img.shields.io/badge/Supabase-Database-3fcf8e)
![shadcn/ui](https://img.shields.io/badge/UI-shadcn%2Fui-000000)
![Zustand](https://img.shields.io/badge/State-Zustand-brown)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933)
