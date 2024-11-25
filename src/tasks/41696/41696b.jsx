import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const meals = {
  breakfast: [
    { name: "Avocado Toast", description: "Whole grain toast topped with mashed avocado and a poached egg." },
    { name: "Greek Yogurt Parfait", description: "Layers of Greek yogurt, granola, and mixed berries." },
    { name: "Veggie Omelette", description: "Fluffy omelette filled with spinach, mushrooms, and feta cheese." },
  ],
  lunch: [
    { name: "Quinoa Salad", description: "Protein-packed quinoa with roasted vegetables and lemon vinaigrette." },
    { name: "Grilled Chicken Wrap", description: "Whole wheat wrap with grilled chicken, lettuce, tomato, and hummus." },
    { name: "Lentil Soup", description: "Hearty lentil soup with carrots, celery, and aromatic herbs." },
  ],
  dinner: [
    { name: "Baked Salmon", description: "Oven-baked salmon fillet with roasted asparagus and wild rice." },
    { name: "Vegetarian Stir-Fry", description: "Colorful mix of tofu and vegetables in a savory soy-ginger sauce." },
    { name: "Lean Beef Tacos", description: "Soft corn tortillas with seasoned lean beef, pico de gallo, and guacamole." },
  ],
};

const MealCard = ({ title, meal }) => (
  <Card className="w-full mb-4">
    <CardHeader>
      <CardTitle className="text-lg font-semibold">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <h3 className="font-medium">{meal.name}</h3>
      <p className="text-sm text-gray-600">{meal.description}</p>
    </CardContent>
  </Card>
);

const MealButton = ({ title, onClick }) => (
  <Button
    onClick={onClick}
    className="w-full mb-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
  >
    Generate {title}
  </Button>
);

export default function App() {
  const [selectedMeals, setSelectedMeals] = useState({
    breakfast: null,
    lunch: null,
    dinner: null,
  });

  const generateMeal = (mealType) => {
    const randomIndex = Math.floor(Math.random() * meals[mealType].length);
    setSelectedMeals((prevMeals) => ({
      ...prevMeals,
      [mealType]: meals[mealType][randomIndex],
    }));
  };

  const resetPlanner = () => {
    setSelectedMeals({
      breakfast: null,
      lunch: null,
      dinner: null,
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-center mb-6">Random Meal Planner</h1>
        <div className="space-y-4">
          <MealButton title="Breakfast" onClick={() => generateMeal("breakfast")} />
          <MealButton title="Lunch" onClick={() => generateMeal("lunch")} />
          <MealButton title="Dinner" onClick={() => generateMeal("dinner")} />
        </div>
        <div className="mt-8">
          {selectedMeals.breakfast && <MealCard title="Breakfast" meal={selectedMeals.breakfast} />}
          {selectedMeals.lunch && <MealCard title="Lunch" meal={selectedMeals.lunch} />}
          {selectedMeals.dinner && <MealCard title="Dinner" meal={selectedMeals.dinner} />}
        </div>
        {(selectedMeals.breakfast || selectedMeals.lunch || selectedMeals.dinner) && (
          <Button
            onClick={resetPlanner}
            className="w-full mt-6 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded"
          >
            Reset Planner
          </Button>
        )}
      </div>
    </div>
  );
}