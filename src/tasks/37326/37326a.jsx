import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

function PhysicsLawSelector({ onSelect }) {
  const [selectedLaw, setSelectedLaw] = useState('');

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>Select a Physics Law</CardTitle>
      </CardHeader>
      <CardContent>
        <select 
          value={selectedLaw} 
          onChange={(e) => {
            setSelectedLaw(e.target.value);
            onSelect(e.target.value);
          }}
          className="w-full p-2 border rounded"
        >
          <option value="">Choose one</option>
          <option value="newton1">Newton's First Law</option>
          <option value="newton2">Newton's Second Law</option>
          <option value="newton3">Newton's Third Law</option>
          <option value="kineticEnergy">Kinetic Energy</option>
          <option value="potentialEnergy">Potential Energy</option>
          <option value="workDone">Work Done</option>
          <option value="power">Power</option>
        </select>
      </CardContent>
    </Card>
  );
}

function NewtonLawComponent({ law }) {
  const [mass, setMass] = useState(1);
  const [force, setForce] = useState(1);
  const [acceleration, setAcceleration] = useState(0);

  const calculate = () => {
    if (law === 'newton2') {
      setAcceleration(force / mass);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{law}</CardTitle>
      </CardHeader>
      <CardContent>
        {law === 'newton2' && (
          <>
            <Label htmlFor="mass">Mass (kg)</Label>
            <Slider 
              value={[mass]} 
              onValueChange={setMass} 
              max={100} 
              className="mb-4"
            />
            <Label htmlFor="force">Force (N)</Label>
            <Slider 
              value={[force]} 
              onValueChange={setForce} 
              max={100} 
              className="mb-4"
            />
            <Button onClick={calculate}>Calculate Acceleration</Button>
            <p>Acceleration: {acceleration.toFixed(2)} m/s²</p>
          </>
        )}
        {/* Add other laws here */}
      </CardContent>
    </Card>
  );
}

export default function App() {
  const [currentLaw, setCurrentLaw] = useState('');

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold mb-4 text-center">Physics Explorer</h1>
      <PhysicsLawSelector onSelect={setCurrentLaw} />
      {currentLaw && <NewtonLawComponent law={currentLaw} />}
    </div>
  );
}