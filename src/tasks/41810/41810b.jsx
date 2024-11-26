import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const weatherOptions = ["Sunny", "Rainy", "Cold", "Hot", "Snowy"];
const durationOptions = ["1-3 days", "4-7 days", "1-2 weeks", "2+ weeks"];

const defaultItems = [
  "Toothbrush",
  "Toothpaste",
  "Deodorant",
  "Shampoo",
  "Soap",
  "Underwear",
  "Socks",
  "T-shirts",
  "Pants",
  "Shoes",
];

const PackingList = ({ items, onToggleItem, onRemoveItem }) => (
  <ul className="space-y-2">
    {items.map((item, index) => (
      <li key={index} className="flex items-center space-x-2">
        <Checkbox
          id={`item-${index}`}
          checked={item.packed}
          onCheckedChange={() => onToggleItem(index)}
        />
        <Label htmlFor={`item-${index}`} className="flex-grow">
          {item.name}
        </Label>
        <Button variant="ghost" size="sm" onClick={() => onRemoveItem(index)}>
          Remove
        </Button>
      </li>
    ))}
  </ul>
);

const PackingTemplate = ({ template, onApply, onDelete }) => (
  <Card className="mb-4">
    <CardHeader>
      <CardTitle>{template.name}</CardTitle>
    </CardHeader>
    <CardContent>
      <p>Destination: {template.destination}</p>
      <p>Weather: {template.weather}</p>
      <p>Duration: {template.duration}</p>
      <div className="mt-4 space-x-2">
        <Button onClick={() => onApply(template)}>Apply</Button>
        <Button variant="destructive" onClick={() => onDelete(template.name)}>
          Delete
        </Button>
      </div>
    </CardContent>
  </Card>
);

export default function App() {
  const [destination, setDestination] = useState("");
  const [weather, setWeather] = useState("");
  const [duration, setDuration] = useState("");
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState("");
  const [templates, setTemplates] = useState([]);

  useEffect(() => {
    const storedTemplates = localStorage.getItem("packingTemplates");
    if (storedTemplates) {
      setTemplates(JSON.parse(storedTemplates));
    }
  }, []);

  const generatePackingList = () => {
    let generatedItems = [...defaultItems];

    if (weather === "Rainy") {
      generatedItems.push("Umbrella", "Rain jacket");
    } else if (weather === "Cold" || weather === "Snowy") {
      generatedItems.push("Warm coat", "Gloves", "Scarf", "Hat");
    } else if (weather === "Hot") {
      generatedItems.push("Sunscreen", "Sunglasses", "Hat");
    }

    if (duration === "1-2 weeks" || duration === "2+ weeks") {
      generatedItems.push("Laundry bag");
    }

    setItems(generatedItems.map(item => ({ name: item, packed: false })));
  };

  const addItem = () => {
    if (newItem.trim()) {
      setItems([...items, { name: newItem.trim(), packed: false }]);
      setNewItem("");
    }
  };

  const toggleItem = (index) => {
    const updatedItems = [...items];
    updatedItems[index].packed = !updatedItems[index].packed;
    setItems(updatedItems);
  };

  const removeItem = (index) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
  };

  const saveTemplate = () => {
    const templateName = prompt("Enter a name for this packing template:");
    if (templateName) {
      const newTemplate = {
        name: templateName,
        destination,
        weather,
        duration,
        items: items.map(item => item.name),
      };
      const updatedTemplates = [...templates, newTemplate];
      setTemplates(updatedTemplates);
      localStorage.setItem("packingTemplates", JSON.stringify(updatedTemplates));
    }
  };

  const applyTemplate = (template) => {
    setDestination(template.destination);
    setWeather(template.weather);
    setDuration(template.duration);
    setItems(template.items.map(item => ({ name: item, packed: false })));
  };

  const deleteTemplate = (templateName) => {
    const updatedTemplates = templates.filter(t => t.name !== templateName);
    setTemplates(updatedTemplates);
    localStorage.setItem("packingTemplates", JSON.stringify(updatedTemplates));
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">Dynamic Packing Checklist</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Trip Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="destination">Destination</Label>
            <Input
              id="destination"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Enter destination"
            />
          </div>
          <div>
            <Label htmlFor="weather">Weather</Label>
            <Select value={weather} onValueChange={setWeather}>
              <SelectTrigger id="weather">
                <SelectValue placeholder="Select weather" />
              </SelectTrigger>
              <SelectContent>
                {weatherOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="duration">Duration</Label>
            <Select value={duration} onValueChange={setDuration}>
              <SelectTrigger id="duration">
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                {durationOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={generatePackingList}>Generate Packing List</Button>
        </CardContent>
      </Card>

      {items.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Packing List</CardTitle>
          </CardHeader>
          <CardContent>
            <PackingList
              items={items}
              onToggleItem={toggleItem}
              onRemoveItem={removeItem}
            />
            <div className="mt-4 flex space-x-2">
              <Input
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                placeholder="Add new item"
                onKeyPress={(e) => e.key === "Enter" && addItem()}
              />
              <Button onClick={addItem}>Add</Button>
            </div>
            <Button className="mt-4" onClick={saveTemplate}>
              Save as Template
            </Button>
          </CardContent>
        </Card>
      )}

      {templates.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Saved Templates</CardTitle>
          </CardHeader>
          <CardContent>
            {templates.map((template) => (
              <PackingTemplate
                key={template.name}
                template={template}
                onApply={applyTemplate}
                onDelete={deleteTemplate}
              />
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}