import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const MOCK_ITEMS = [
  { id: 1, name: "Milk", expiry: "2023-07-10", location: "fridge" },
  { id: 2, name: "Bread", expiry: "2023-07-15", location: "pantry" },
  { id: 3, name: "Eggs", expiry: "2023-07-20", location: "fridge" },
];

const MOCK_RECIPES = [
  { id: 1, name: "French Toast", ingredients: ["Bread", "Eggs", "Milk"] },
  { id: 2, name: "Scrambled Eggs", ingredients: ["Eggs", "Milk"] },
];

function ItemList({ items, onDelete }) {
  return (
    <div className="space-y-2">
      {items.map((item) => (
        <Card key={item.id} className="flex justify-between items-center p-2">
          <div>
            <span className="font-bold">{item.name}</span>
            <Badge className="ml-2">{item.location}</Badge>
          </div>
          <div>
            <span className="mr-2">Expires: {item.expiry}</span>
            <Button variant="destructive" size="sm" onClick={() => onDelete(item.id)}>
              Delete
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}

function AddItemForm({ onAdd }) {
  const [name, setName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [location, setLocation] = useState("fridge");

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd({ name, expiry, location });
    setName("");
    setExpiry("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <Input
        type="text"
        placeholder="Item name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <Input
        type="date"
        value={expiry}
        onChange={(e) => setExpiry(e.target.value)}
        required
      />
      <select
        className="w-full p-2 border rounded"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      >
        <option value="fridge">Fridge</option>
        <option value="pantry">Pantry</option>
      </select>
      <Button type="submit" className="w-full">Add Item</Button>
    </form>
  );
}

function RecipeSuggestions({ items }) {
  const itemNames = items.map((item) => item.name.toLowerCase());
  const suggestedRecipes = MOCK_RECIPES.filter((recipe) =>
    recipe.ingredients.every((ingredient) =>
      itemNames.includes(ingredient.toLowerCase())
    )
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recipe Suggestions</CardTitle>
      </CardHeader>
      <CardContent>
        {suggestedRecipes.length > 0 ? (
          <ul className="list-disc pl-5">
            {suggestedRecipes.map((recipe) => (
              <li key={recipe.id}>{recipe.name}</li>
            ))}
          </ul>
        ) : (
          <p>No recipes available with current items.</p>
        )}
      </CardContent>
    </Card>
  );
}

function ExpirationAlerts({ items }) {
  const today = new Date();
  const soonToExpire = items.filter((item) => {
    const expiryDate = new Date(item.expiry);
    const diffDays = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
    return diffDays <= 3 && diffDays > 0;
  });

  return (
    <div className="space-y-2">
      {soonToExpire.map((item) => (
        <Alert key={item.id} variant="warning">
          <AlertTitle>Expiring Soon!</AlertTitle>
          <AlertDescription>
            {item.name} will expire on {item.expiry}
          </AlertDescription>
        </Alert>
      ))}
    </div>
  );
}

function ShoppingList({ items }) {
  const lowStockItems = items.filter((item) => {
    const expiryDate = new Date(item.expiry);
    const today = new Date();
    return expiryDate <= today;
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Shopping List</CardTitle>
      </CardHeader>
      <CardContent>
        {lowStockItems.length > 0 ? (
          <ul className="list-disc pl-5">
            {lowStockItems.map((item) => (
              <li key={item.id}>{item.name}</li>
            ))}
          </ul>
        ) : (
          <p>No items needed at the moment.</p>
        )}
      </CardContent>
    </Card>
  );
}

export default function App() {
  const [items, setItems] = useState(MOCK_ITEMS);

  const addItem = (newItem) => {
    setItems([...items, { ...newItem, id: Date.now() }]);
  };

  const deleteItem = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">Fridge & Pantry Tracker</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Your Items</h2>
          <ItemList items={items} onDelete={deleteItem} />
          <h3 className="text-xl font-semibold mt-6 mb-2">Add New Item</h3>
          <AddItemForm onAdd={addItem} />
        </div>
        
        <div>
          <h2 className="text-2xl font-semibold mb-4">Recipes & Alerts</h2>
          <RecipeSuggestions items={items} />
          <h3 className="text-xl font-semibold mt-6 mb-2">Expiration Alerts</h3>
          <ExpirationAlerts items={items} />
          <h3 className="text-xl font-semibold mt-6 mb-2">Shopping List</h3>
          <ShoppingList items={items} />
        </div>
      </div>
    </div>
  );
}