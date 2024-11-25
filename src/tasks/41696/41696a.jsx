import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const meals = {
  breakfast: [
    { name: "Oatmeal", desc: "A warm bowl of oatmeal with fruits and nuts." },
    { name: "Pancakes", desc: "Fluffy pancakes with maple syrup." },
    // Add more breakfast options here
  ],
  lunch: [
    { name: "Caesar Salad", desc: "Fresh greens with Caesar dressing, croutons, and parmesan." },
    { name: "Grilled Chicken Wrap", desc: "Chicken, veggies, and sauce wrapped in a tortilla." },
    // Add more lunch options here
  ],
  dinner: [
    { name: "Spaghetti Bolognese", desc: "Classic pasta with rich meat sauce." },
    { name: "Vegetable Stir Fry", desc: "Colorful veggies stir-fried with tofu or meat." },
    // Add more dinner options here
  ]
};

function MealCard({ meal, description }) {
  return (
    <Card className="sm:max-w-sm mx-auto">
      <CardHeader>
        <CardTitle>{meal}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{description}</p>
      </CardContent>
    </Card>
  );
}

function MealPlanner() {
  const [selectedMeals, setSelectedMeals] = useState({ breakfast: null, lunch: null, dinner: null });

  const pickMeal = (type) => {
    const mealOptions = meals[type];
    const randomMeal = mealOptions[Math.floor(Math.random() * mealOptions.length)];
    setSelectedMeals(prev => ({ ...prev, [type]: randomMeal }));
  };

  const resetPlanner = () => {
    setSelectedMeals({ breakfast: null, lunch: null, dinner: null });
  };

  return (
    <div className="flex flex-col items-center p-4 space-y-4">
      <h1 className="text-2xl font-bold">Random Meal Planner</h1>
      <div className="space-y-2">
        {['breakfast', 'lunch', 'dinner'].map(type => (
          <div key={type}>
            <Button 
              onClick={() => pickMeal(type)} 
              className="w-full sm:w-auto mb-2"
            >
              {`Generate ${type.charAt(0).toUpperCase() + type.slice(1)}`}
            </Button>
            {selectedMeals[type] && <MealCard meal={selectedMeals[type].name} description={selectedMeals[type].desc} />}
          </div>
        ))}
      </div>
      <Button onClick={resetPlanner} variant="outline" className="mt-4">
        Reset Planner
      </Button>
    </div>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <MealPlanner />
    </div>
  );
}