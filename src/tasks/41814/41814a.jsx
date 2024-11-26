import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { X } from "lucide-react";

const themes = [
  "Tropical Paradise",
  "Retro 80s",
  "Superhero Extravaganza",
  "Elegant Masquerade",
  "Space Adventure"
];

const GuestList = ({ guests, setGuests }) => {
  const [newGuest, setNewGuest] = useState("");

  const addGuest = () => {
    if (newGuest.trim()) {
      setGuests([...guests, newGuest.trim()]);
      setNewGuest("");
    }
  };

  const removeGuest = (index) => {
    setGuests(guests.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-2">
      <div className="flex space-x-2">
        <Input
          value={newGuest}
          onChange={(e) => setNewGuest(e.target.value)}
          placeholder="Enter guest name"
          className="flex-grow"
        />
        <Button onClick={addGuest}>Add</Button>
      </div>
      <ul className="space-y-1">
        {guests.map((guest, index) => (
          <li key={index} className="flex items-center justify-between bg-gray-100 p-2 rounded">
            <span>{guest}</span>
            <Button variant="ghost" size="sm" onClick={() => removeGuest(index)}>
              <X className="h-4 w-4" />
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
};

const Summary = ({ theme, guests, budget }) => (
  <Card>
    <CardHeader>
      <CardTitle>Party Summary</CardTitle>
    </CardHeader>
    <CardContent>
      <p><strong>Theme:</strong> {theme}</p>
      <p><strong>Guests:</strong> {guests.join(", ")}</p>
      <p><strong>Budget:</strong> ${budget}</p>
    </CardContent>
  </Card>
);

export default function App() {
  const [theme, setTheme] = useState("");
  const [guests, setGuests] = useState([]);
  const [budget, setBudget] = useState(500);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const resetForm = () => {
    setTheme("");
    setGuests([]);
    setBudget(500);
    setIsConfirmed(false);
  };

  const confirmPlan = () => {
    if (theme && guests.length > 0) {
      setIsConfirmed(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Dynamic Party Planner</CardTitle>
          <CardDescription>Plan your perfect party experience</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Theme</label>
            <Select value={theme} onValueChange={setTheme}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a theme" />
              </SelectTrigger>
              <SelectContent>
                {themes.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Guest List</label>
            <GuestList guests={guests} setGuests={setGuests} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Budget: ${budget}
            </label>
            <Slider
              min={100}
              max={5000}
              step={50}
              value={[budget]}
              onValueChange={(value) => setBudget(value[0])}
            />
          </div>

          {isConfirmed && (
            <Summary theme={theme} guests={guests} budget={budget} />
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={resetForm}>
            Reset
          </Button>
          <Button onClick={confirmPlan} disabled={!theme || guests.length === 0}>
            {isConfirmed ? "Update Plan" : "Confirm Plan"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}