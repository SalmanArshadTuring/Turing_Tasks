import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter} from "@/components/ui/card";
import {  Button} from "@/components/ui/button"
import {  Input} from "@/components/ui/input"
import { Select,  SelectItem } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {Slider} from "@/components/ui/slider"
const themes = [
  "Retro 80s",
  "Tropical Beach",
  "Glamour Hollywood",
  "Sci-Fi Space",
  "Medieval Fantasy"
];

function GuestList({ guests, setGuests }) {
  const addGuest = () => setGuests([...guests, '']);
  const updateGuest = (index, value) => {
    const newGuests = [...guests];
    newGuests[index] = value;
    setGuests(newGuests);
  };
  const removeGuest = (index) => {
    const newGuests = guests.filter((_, i) => i !== index);
    setGuests(newGuests);
  };

  return (
    <div className="space-y-2">
      {guests.map((guest, index) => (
        <div key={index} className="flex items-center space-x-2">
          <Input 
            value={guest} 
            onChange={(e) => updateGuest(index, e.target.value)} 
            placeholder={`Guest ${index + 1}`} 
            className="flex-grow"
          />
          <Button variant="destructive" onClick={() => removeGuest(index)}>Remove</Button>
        </div>
      ))}
      <Button onClick={addGuest}>Add Guest</Button>
    </div>
  );
}

export default function App() {
  const [theme, setTheme] = useState('');
  const [guests, setGuests] = useState(['']);
  const [budget, setBudget] = useState(50);

  const resetForm = () => {
    setTheme('');
    setGuests(['']);
    setBudget(50);
  };

  return (
    <div className="flex flex-col items-center p-4 sm:p-8 space-y-6 bg-gray-100 min-h-screen">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Party Planner</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Party Theme</Label>
            <Select value={theme} onValueChange={setTheme}>
              <SelectItem value="">Choose a theme</SelectItem>
              {themes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
            </Select>
          </div>

          <div>
            <Label>Guest List</Label>
            <GuestList guests={guests} setGuests={setGuests} />
          </div>

          <div>
            <Label htmlFor="budget">Budget: ${budget}</Label>
            <Slider 
              id="budget" 
              defaultValue={[50]} 
              max={500} 
              step={10} 
              onValueChange={setBudget}
            />
          </div>
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button onClick={resetForm}>Reset</Button>
          <Button variant="outline">Confirm Plan</Button>
        </CardFooter>
      </Card>

      <Card className="w-full max-w-lg mt-4">
        <CardHeader>
          <CardTitle>Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p><strong>Theme:</strong> {theme || 'Not selected'}</p>
          <p><strong>Guests:</strong> {guests.filter(g => g.trim() !== '').length > 0 ? guests.filter(g => g.trim() !== '').join(', ') : 'No guests added'}</p>
          <p><strong>Budget:</strong> ${budget}</p>
        </CardContent>
      </Card>
    </div>
  );
}