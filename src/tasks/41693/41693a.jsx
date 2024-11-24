import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const recipes = [
  {
    id: 1,
    title: "Spaghetti Carbonara",
    preview: "Classic Italian pasta dish with eggs, cheese, and bacon.",
    ingredients: [
      "400g spaghetti",
      "200g pancetta",
      "4 large eggs",
      "100g Pecorino Romano cheese",
      "100g Parmesan cheese",
      "Freshly ground black pepper"
    ],
    steps: [
      "Cook spaghetti in salted water until al dente.",
      "Fry pancetta until crispy.",
      "Whisk eggs and cheese in a bowl.",
      "Drain pasta and mix with pancetta.",
      "Add egg mixture and stir quickly.",
      "Season with black pepper and serve."
    ]
  },
  {
    id: 2,
    title: "Chicken Stir Fry",
    preview: "Quick and easy Asian-inspired chicken dish with vegetables.",
    ingredients: [
      "500g chicken breast, sliced",
      "1 bell pepper, sliced",
      "1 onion, sliced",
      "2 cloves garlic, minced",
      "2 tbsp soy sauce",
      "1 tbsp vegetable oil"
    ],
    steps: [
      "Heat oil in a wok or large frying pan.",
      "Stir-fry chicken until golden.",
      "Add vegetables and garlic, cook for 2-3 minutes.",
      "Add soy sauce and stir well.",
      "Cook for another 2 minutes and serve hot."
    ]
  },
  {
    id: 3,
    title: "Vegetarian Lentil Soup",
    preview: "Hearty and nutritious soup perfect for cold days.",
    ingredients: [
      "200g red lentils",
      "1 onion, diced",
      "2 carrots, diced",
      "2 celery stalks, diced",
      "1L vegetable broth",
      "1 tsp cumin",
      "Salt and pepper to taste"
    ],
    steps: [
      "Sauté onion, carrots, and celery in a pot.",
      "Add lentils and vegetable broth.",
      "Bring to a boil, then simmer for 20 minutes.",
      "Add cumin, salt, and pepper.",
      "Blend if desired and serve hot."
    ]
  }
];

function RecipeCard({ recipe, onClick }) {
  return (
    <Card
      className="cursor-pointer hover:shadow-lg transition-shadow duration-300"
      onClick={onClick}
    >
      <CardHeader>
        <CardTitle>{recipe.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600">{recipe.preview}</p>
      </CardContent>
    </Card>
  );
}

function RecipeDetail({ recipe, onBack }) {
  return (
    <div className="max-w-2xl mx-auto p-4">
      <Button onClick={onBack} className="mb-4">
        Back to Recipes
      </Button>
      <h2 className="text-2xl font-bold mb-4">{recipe.title}</h2>
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Ingredients</h3>
        <ul className="list-disc pl-5">
          {recipe.ingredients.map((ingredient, index) => (
            <li key={index}>{ingredient}</li>
          ))}
        </ul>
      </div>
      <div>
        <h3 className="text-xl font-semibold mb-2">Steps</h3>
        <ol className="list-decimal pl-5">
          {recipe.steps.map((step, index) => (
            <li key={index} className="mb-2">
              {step}
            </li>
          ))}
        </ol>
      </div>
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
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Recipe Viewer</h1>
      {selectedRecipe ? (
        <RecipeDetail recipe={selectedRecipe} onBack={handleBackClick} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {recipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              onClick={() => handleRecipeClick(recipe)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
