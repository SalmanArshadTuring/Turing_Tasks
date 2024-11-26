import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const weatherOptions = ['Sunny', 'Rainy', 'Cold', 'Hot'];
const defaultItems = ['Passport', 'Wallet', 'Phone Charger', 'Toothbrush'];

function ChecklistItem({ item, checked, onToggle }) {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox checked={checked} onCheckedChange={onToggle} />
      <Label>{item}</Label>
    </div>
  );
}

function PackingList({ items, onToggle }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Packing List</CardTitle>
      </CardHeader>
      <CardContent>
        {items.map((item, idx) => (
          <ChecklistItem 
            key={idx} 
            item={item.name} 
            checked={item.checked} 
            onToggle={() => onToggle(idx)} 
          />
        ))}
      </CardContent>
    </Card>
  );
}

function TripForm({ onSubmit, onLoadTemplate }) {
  const [destination, setDestination] = useState('');
  const [duration, setDuration] = useState('');
  const [weather, setWeather] = useState(weatherOptions[0]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Trip Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <Input 
          type="text" 
          placeholder="Destination" 
          value={destination} 
          onChange={(e) => setDestination(e.target.value)} 
        />
        <Input 
          type="number" 
          placeholder="Duration (days)" 
          value={duration} 
          onChange={(e) => setDuration(e.target.value)} 
        />
        <select 
          value={weather} 
          onChange={(e) => setWeather(e.target.value)} 
          className="w-full p-2 border rounded"
        >
          {weatherOptions.map((option, idx) => (
            <option key={idx} value={option}>{option}</option>
          ))}
        </select>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button onClick={onSubmit}>Generate Checklist</Button>
        <Button variant="secondary" onClick={onLoadTemplate}>Load Template</Button>
      </CardFooter>
    </Card>
  );
}

export default function App() {
  const [items, setItems] = useState(defaultItems.map(name => ({ name, checked: false })));
  const [templates, setTemplates] = useState(() => {
    const savedTemplates = localStorage.getItem('packingTemplates');
    try {
      return savedTemplates ? JSON.parse(savedTemplates) : {}; // Safely handle parsing
    } catch (error) {
      console.error('Error parsing saved templates:', error);
      return {}; // Return an empty object if parsing fails
    }
  });

  useEffect(() => {
    localStorage.setItem('packingTemplates', JSON.stringify(templates));
  }, [templates]);

  const handleToggle = (index) => {
    setItems(prev => 
      prev.map((item, idx) => idx === index ? { ...item, checked: !item.checked } : item)
    );
  };

  const generateChecklist = () => {
    let newItems = [...defaultItems];
    if (duration > 7) newItems.push('Extra Clothes');
    if (weather === 'Rainy') newItems.push('Umbrella');
    // Add more conditions as needed
    setItems(newItems.map(name => ({ name, checked: false })));
  };

  const saveTemplate = () => {
    const templateName = prompt("Enter template name:");
    if (templateName) {
      setTemplates(prev => ({ ...prev, [templateName]: items }));
    }
  };

  const loadTemplate = () => {
    const templateName = prompt("Enter template name to load:");
    if (templateName && templates[templateName]) {
      setItems(templates[templateName]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
      <div className="max-w-2xl mx-auto space-y-4">
        <TripForm onSubmit={generateChecklist} onLoadTemplate={loadTemplate} />
        <PackingList items={items} onToggle={handleToggle} />
        <Button onClick={saveTemplate} variant="outline">Save as Template</Button>
      </div>
    </div>
  );
}
