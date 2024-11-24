import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const initialRecipes = [
  {
    id: 1,
    title: "Spaghetti Carbonara",
    preview: "Classic Italian pasta dish with eggs, cheese, and bacon.",
    image: "https://www.allrecipes.com/thmb/a_0W8yk_LLCtH-VPqg2uLD9I5Pk=/0x512/filters:no_upscale():max_bytes(150000):strip_icc()/11973-spaghetti-carbonara-ii-DDMFS-4x3-6edea51e421e4457ac0c3269f3be5157.jpg",
    ingredients: [
      "400g spaghetti",
      "200g pancetta",
      "4 large eggs",
      "100g Pecorino Romano cheese",
      "100g Parmesan cheese",
      "Freshly ground black pepper",
    ],
    steps: [
      "Cook spaghetti in salted water until al dente.",
      "Fry pancetta until crispy.",
      "Whisk eggs and cheese in a bowl.",
      "Drain pasta and mix with pancetta.",
      "Add egg mixture and stir quickly.",
      "Season with black pepper and serve.",
    ],
  },
  {
    id: 2,
    title: "Chicken Stir Fry",
    preview: "Quick and easy Asian-inspired chicken dish with vegetables.",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRcf4aSq01-Cw0-iKHuAGYgz20BvXOFV9yprA&s",
    ingredients: [
      "500g chicken breast, sliced",
      "1 bell pepper, sliced",
      "1 onion, sliced",
      "2 cloves garlic, minced",
      "2 tbsp soy sauce",
      "1 tbsp vegetable oil",
    ],
    steps: [
      "Heat oil in a wok or large frying pan.",
      "Stir-fry chicken until golden.",
      "Add vegetables and garlic, cook for 2-3 minutes.",
      "Add soy sauce and stir well.",
      "Cook for another 2 minutes and serve hot.",
    ],
  },
  {
    id: 3,
    title: "lentil soup",
    preview: "Hearty and nutritious soup perfect for cold days.",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4mLl3I9HXiPpjtr00lIcrYCYterKHUABw0w&s",
    ingredients: [
      "200g red lentils",
      "1 onion, diced",
      "2 carrots, diced",
      "2 celery stalks, diced",
      "1L vegetable broth",
      "1 tsp cumin",
      "Salt and pepper to taste",
    ],
    steps: [
      "Sauté onion, carrots, and celery in a pot.",
      "Add lentils and vegetable broth.",
      "Bring to a boil, then simmer for 20 minutes.",
      "Add cumin, salt, and pepper.",
      "Blend if desired and serve hot.",
    ],
  },
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
        <img src={recipe.image} alt={recipe.title} className="w-full h-40 object-cover mb-4" />
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

function RecipeForm({ onSave }) {
  const [newRecipe, setNewRecipe] = useState({
    title: "",
    preview: "",
    image: "",
    ingredients: [""],
    steps: [""],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewRecipe((prevRecipe) => ({
      ...prevRecipe,
      [name]: value,
    }));
  };

  const handleAddIngredient = () => {
    setNewRecipe((prevRecipe) => ({
      ...prevRecipe,
      ingredients: [...prevRecipe.ingredients, ""],
    }));
  };

  const handleAddStep = () => {
    setNewRecipe((prevRecipe) => ({
      ...prevRecipe,
      steps: [...prevRecipe.steps, ""],
    }));
  };

  const handleSave = () => {
    onSave(newRecipe);
    setNewRecipe({
      title: "",
      preview: "",
      image: "",
      ingredients: [""],
      steps: [""],
    });
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Add a New Recipe</h2>
      <input
        type="text"
        name="title"
        value={newRecipe.title}
        onChange={handleChange}
        placeholder="Recipe Title"
        className="border p-2 mb-4 w-full"
      />
      <input
        type="text"
        name="preview"
        value={newRecipe.preview}
        onChange={handleChange}
        placeholder="Recipe Preview"
        className="border p-2 mb-4 w-full"
      />
      <input
        type="text"
        name="image"
        value={newRecipe.image}
        onChange={handleChange}
        placeholder="Image URL"
        className="border p-2 mb-4 w-full"
      />
      <div className="mb-4">
        <h3 className="text-xl font-semibold mb-2">Ingredients</h3>
        {newRecipe.ingredients.map((ingredient, index) => (
          <input
            key={index}
            type="text"
            name={`ingredient-${index}`}
            value={ingredient}
            onChange={(e) => {
              const updatedIngredients = [...newRecipe.ingredients];
              updatedIngredients[index] = e.target.value;
              setNewRecipe((prevRecipe) => ({
                ...prevRecipe,
                ingredients: updatedIngredients,
              }));
            }}
            placeholder="Ingredient"
            className="border p-2 mb-2 w-full"
          />
        ))}
        <Button onClick={handleAddIngredient}>Add Ingredient</Button>
      </div>
      <div className="mb-4">
        <h3 className="text-xl font-semibold mb-2">Steps</h3>
        {newRecipe.steps.map((step, index) => (
          <input
            key={index}
            type="text"
            name={`step-${index}`}
            value={step}
            onChange={(e) => {
              const updatedSteps = [...newRecipe.steps];
              updatedSteps[index] = e.target.value;
              setNewRecipe((prevRecipe) => ({
                ...prevRecipe,
                steps: updatedSteps,
              }));
            }}
            placeholder="Step"
            className="border p-2 mb-2 w-full"
          />
        ))}
        <Button onClick={handleAddStep}>Add Step</Button>
      </div>
      <Button onClick={handleSave}>Save Recipe</Button>
    </div>
  );
}

export default function App() {
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [recipes, setRecipes] = useState(initialRecipes);

  const handleRecipeClick = (recipe) => {
    setSelectedRecipe(recipe);
  };

  const handleBackClick = () => {
    setSelectedRecipe(null);
  };

  const handleSaveRecipe = (newRecipe) => {
    setRecipes((prevRecipes) => [
      ...prevRecipes,
      { ...newRecipe, id: prevRecipes.length + 1 },
    ]);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Recipe Viewer</h1>
      {selectedRecipe ? (
        <RecipeDetail recipe={selectedRecipe} onBack={handleBackClick} />
      ) : (
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {recipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onClick={() => handleRecipeClick(recipe)}
              />
            ))}
          </div>
          <RecipeForm onSave={handleSaveRecipe} />
        </div>
      )}
    </div>
  );
}
