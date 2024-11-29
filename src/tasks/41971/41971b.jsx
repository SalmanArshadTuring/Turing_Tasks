import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";

const plants = [
  { id: 1, name: "Tomato", waterFrequency: 2, tip: "Plant in full sun" },
  { id: 2, name: "Basil", waterFrequency: 3, tip: "Pinch off flower buds to promote leaf growth" },
  { id: 3, name: "Carrot", waterFrequency: 4, tip: "Thin seedlings for better growth" },
  { id: 4, name: "Lettuce", waterFrequency: 2, tip: "Harvest outer leaves for continuous growth" },
];

const GardenGrid = ({ garden, onPlantSelect }) => {
  return (
    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 sm:gap-4">
      {garden.map((cell, index) => (
        <div
          key={index}
          className="h-20 sm:h-24 border border-gray-300 rounded flex items-center justify-center cursor-pointer"
          onClick={() => onPlantSelect(index)}
        >
          {cell ? cell.name : "+"}
        </div>
      ))}
    </div>
  );
};

const PlantSelector = ({ onSelect }) => {
  return (
    <Select onValueChange={onSelect}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select a plant" />
      </SelectTrigger>
      <SelectContent>
        {plants.map((plant) => (
          <SelectItem key={plant.id} value={plant.name}>
            {plant.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

const WateringSchedule = ({ garden }) => {
  const [date, setDate] = useState(new Date());

  const plantsToWater = garden.filter((plant) => {
    if (!plant) return false;
    const daysUntilWatering = plant.waterFrequency - (date.getDate() % plant.waterFrequency);
    return daysUntilWatering === 0;
  });

  return (
    <div className="space-y-4">
      <Calendar
        mode="single"
        selected={date}
        onSelect={(newDate) => setDate(newDate)}
        className="rounded-md border"
      />
      <h3 className="text-lg font-semibold">Plants to water today:</h3>
      <ul className="list-disc pl-5">
        {plantsToWater.map((plant, index) => (
          <li key={index}>{plant.name}</li>
        ))}
      </ul>
    </div>
  );
};

const PlantingTips = ({ garden }) => {
  return (
    <div className="space-y-4">
      {garden
        .filter((plant) => plant !== null)
        .map((plant, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle>{plant.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{plant.tip}</p>
            </CardContent>
          </Card>
        ))}
    </div>
  );
};

export default function App() {
  const [garden, setGarden] = useState(Array(12).fill(null));
  const [selectedCell, setSelectedCell] = useState(null);

  const handlePlantSelect = (index) => {
    setSelectedCell(index);
  };

  const handlePlantAdd = (plantName) => {
    if (selectedCell !== null) {
      const newGarden = [...garden];
      newGarden[selectedCell] = plants.find((p) => p.name === plantName);
      setGarden(newGarden);
      setSelectedCell(null);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">Virtual Gardening Planner</h1>
      <Tabs defaultValue="garden" className="space-y-4">
        <TabsList>
          <TabsTrigger value="garden">Garden Layout</TabsTrigger>
          <TabsTrigger value="watering">Watering Schedule</TabsTrigger>
          <TabsTrigger value="tips">Planting Tips</TabsTrigger>
        </TabsList>
        <TabsContent value="garden" className="space-y-4">
          <GardenGrid garden={garden} onPlantSelect={handlePlantSelect} />
          {selectedCell !== null && (
            <PlantSelector onSelect={handlePlantAdd} />
          )}
        </TabsContent>
        <TabsContent value="watering">
          <WateringSchedule garden={garden} />
        </TabsContent>
        <TabsContent value="tips">
          <PlantingTips garden={garden} />
        </TabsContent>
      </Tabs>
    </div>
  );
}