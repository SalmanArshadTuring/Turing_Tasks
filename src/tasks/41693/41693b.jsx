import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const recipes = [
  {
    id: 1,
    title: "Chocolate Chip Cookies",
    ingredients: ["flour", "sugar", "chocolate chips", "eggs"],
    steps: ["Mix ingredients", "Bake at 350°F for 10 minutes"],
  },
  {
    id: 2,
    title: "Spaghetti Bolognese",
    ingredients: ["spaghetti", "ground beef", "tomato sauce", "onion", "garlic"],
    steps: ["Cook pasta", "Fry beef with onions and garlic", "Add sauce and simmer"],
  },
  // Add more recipes here...
];

function RecipeCard({ recipe, onClick }) {
  return (
    <Card className="mb-4 shadow-lg hover:shadow-xl transition-shadow duration-300" onClick={() => onClick(recipe)}>
      <CardHeader>
        <CardTitle>{recipe.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>Click for details</CardDescription>
      </CardContent>
    </Card>
  );
}

function RecipeDetail({ recipe, onBack }) {
  return (
    <div className="p-4 max-w-lg mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>{recipe.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <h3 className="font-bold mb-2">Ingredients:</h3>
          <ul className="list-disc pl-5">
            {recipe.ingredients.map((ingredient, idx) => (
              <li key={idx}>{ingredient}</li>
            ))}
          </ul>
          <h3 className="font-bold mt-4 mb-2">Steps:</h3>
          <ol className="list-decimal pl-5">
            {recipe.steps.map((step, idx) => (
              <li key={idx}>{step}</li>
            ))}
          </ol>
        </CardContent>
        <CardFooter>
          <Button onClick={onBack} className="w-full">Back to Recipes</Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default function App() {
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  const handleRecipeClick = (recipe) => {
    setSelectedRecipe(recipe);
  };

  const handleBackClick = () => {
    setSelectedRecipe(null);
  };

  return (
    <div className="bg-gray-100 min-h-screen p-4 sm:p-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Recipe Viewer</h1>
      {selectedRecipe ? (
        <RecipeDetail recipe={selectedRecipe} onBack={handleBackClick} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {recipes.map(recipe => (
            <RecipeCard key={recipe.id} recipe={recipe} onClick={handleRecipeClick} />
          ))}
        </div>
      )}
    </div>
  );
}