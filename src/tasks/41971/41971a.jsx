import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {Select, SelectItem} from "@/components/ui/select"

const plantTypes = ['Tomato', 'Rose', 'Basil', 'Sunflower'];

function PlantCard({ plant, onWater, onDelete }) {
  return (
    <Card className="mb-4 sm:w-full md:w-1/2 lg:w-1/3">
      <CardHeader>
        <CardTitle>{plant.name}</CardTitle>
        <CardDescription>{plant.type}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Last Watered: {plant.lastWatered.toLocaleDateString()}</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button onClick={() => onWater(plant.id)}>Water Now</Button>
        <Button onClick={() => onDelete(plant.id)} variant="destructive">Remove</Button>
      </CardFooter>
    </Card>
  );
}

function AddPlantForm({ onSubmit }) {
  const [name, setName] = useState('');
  const [type, setType] = useState(plantTypes[0]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ name, type, lastWatered: new Date() });
    setName('');
    setType(plantTypes[0]);
  };

  return (
    <Card>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <Label htmlFor="plantName">Plant Name</Label>
          <Input id="plantName" value={name} onChange={e => setName(e.target.value)} required />
          <Label htmlFor="plantType">Type</Label>
          <Select value={type} onChange={e => setType(e.target.value)}>
            {plantTypes.map(pt => <SelectItem key={pt} value={pt}>{pt}</SelectItem>)}
          </Select>
          <Button type="submit" className="mt-4">Add Plant</Button>
        </form>
      </CardContent>
    </Card>
  );
}

export default function App() {
  const [plants, setPlants] = useState([]);

  useEffect(() => {
    const savedPlants = JSON.parse(localStorage.getItem('gardenPlants') || '[]');
    setPlants(savedPlants);
  }, []);

  useEffect(() => {
    localStorage.setItem('gardenPlants', JSON.stringify(plants));
  }, [plants]);

  const addPlant = (plant) => {
    setPlants([...plants, { id: Date.now(), ...plant }]);
  };

  const waterPlant = (id) => {
    setPlants(plants.map(p => p.id === id ? { ...p, lastWatered: new Date() } : p));
  };

  const deletePlant = (id) => {
    setPlants(plants.filter(p => p.id !== id));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Virtual Gardening Planner</h1>
      <AddPlantForm onSubmit={addPlant} />
      <div className="flex flex-wrap -mx-2">
        {plants.map(plant => (
          <PlantCard 
            key={plant.id} 
            plant={plant} 
            onWater={waterPlant} 
            onDelete={deletePlant} 
          />
        ))}
      </div>
      <div className="mt-8 text-center">
        <h2 className="text-xl mb-2">Planting Tips</h2>
        <p>Water your plants regularly, but don't overwater. Check soil moisture before watering.</p>
      </div>
    </div>
  );
}