import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle,
} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Alert} from "@/components/ui/alert";


const currentDate = () => new Date().toISOString().split('T')[0];

function FoodItem({ item, onDelete, onUpdate }) {
  const [editMode, setEditMode] = useState(false);
  const [expiry, setExpiry] = useState(item.expiry);

  return (
    <Card className="mb-4">
      <CardHeader>
        {editMode ? (
          <Input value={item.name} onChange={(e) => onUpdate({ ...item, name: e.target.value })} />
        ) : (
          <CardTitle>{item.name}</CardTitle>
        )}
      </CardHeader>
      <CardContent>
        {editMode ? (
          <Input 
            type="date" 
            value={expiry} 
            onChange={(e) => { 
              setExpiry(e.target.value); 
              onUpdate({ ...item, expiry: e.target.value });
            }} 
          />
        ) : (
          <p>Expires: {item.expiry}</p>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button onClick={() => setEditMode(!editMode)}>{editMode ? 'Save' : 'Edit'}</Button>
        <Button variant="destructive" onClick={() => onDelete(item.id)}>Delete</Button>
      </CardFooter>
    </Card>
  );
}

function Pantry() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: '', expiry: currentDate() });

  const addItem = () => {
    if (newItem.name) {
      setItems([...items, { ...newItem, id: Date.now() }]);
      setNewItem({ name: '', expiry: currentDate() });
    }
  };

  const deleteItem = (id) => setItems(items.filter(item => item.id !== id));

  const updateItem = (updatedItem) => {
    setItems(items.map(item => item.id === updatedItem.id ? updatedItem : item));
  };

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Add New Item</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Input 
            placeholder="Item name" 
            value={newItem.name} 
            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })} 
          />
          <Input 
            type="date" 
            value={newItem.expiry} 
            onChange={(e) => setNewItem({ ...newItem, expiry: e.target.value })} 
          />
          <Button onClick={addItem}>Add to Pantry</Button>
        </CardContent>
      </Card>
      {items.map(item => (
        <FoodItem key={item.id} item={item} onDelete={deleteItem} onUpdate={updateItem} />
      ))}
    </div>
  );
}

function RecipeSuggestions({ items }) {
  // This is a placeholder for recipe logic. In a real app, you'd integrate with a recipe API.
  const suggestedRecipes = ["Pasta", "Salad", "Stir Fry"];

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Recipe Suggestions</CardTitle>
      </CardHeader>
      <CardContent>
        {suggestedRecipes.map((recipe, idx) => (
          <p key={idx}>{recipe}</p>
        ))}
      </CardContent>
    </Card>
  );
}

function ExpirationAlerts({ items }) {
  const expiringSoon = items.filter(item => {
    const expiryDate = new Date(item.expiry);
    const today = new Date();
    const timeDiff = expiryDate.getTime() - today.getTime();
    const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return diffDays <= 3 && diffDays > 0;
  });

  return (
    <Alert variant="warning" className="mt-4">
      <Alert.Title>Items Expiring Soon</Alert.Title>
      {expiringSoon.map(item => (
        <p key={item.id}>{item.name} - {item.expiry}</p>
      ))}
    </Alert>
  );
}

function ShoppingList({ items }) {
  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Shopping List</CardTitle>
      </CardHeader>
      <CardContent>
        {items.map(item => (
          <div key={item.id} className="flex justify-between">
            <span>{item.name}</span>
            <Button variant="outline">Add to Cart</Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export default function App() {
  const [view, setView] = useState('pantry');
  const [pantryItems, setPantryItems] = useState([]);

  return (
    <div className="min-h-screen bg-gray-100 sm:p-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-around mb-4">
          <Button onClick={() => setView('pantry')}>Pantry</Button>
          <Button onClick={() => setView('recipes')}>Recipes</Button>
          <Button onClick={() => setView('alerts')}>Alerts</Button>
          <Button onClick={() => setView('shopping')}>Shopping</Button>
        </div>
        {view === 'pantry' && <Pantry items={pantryItems} setItems={setPantryItems} />}
        {view === 'recipes' && <RecipeSuggestions items={pantryItems} />}
        {view === 'alerts' && <ExpirationAlerts items={pantryItems} />}
        {view === 'shopping' && <ShoppingList items={pantryItems} />}
      </div>
    </div>
  );
}