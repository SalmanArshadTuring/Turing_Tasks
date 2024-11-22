import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

const laws = [
  { id: "newton1", name: "Newton's First Law" },
  { id: "newton2", name: "Newton's Second Law" },
  { id: "newton3", name: "Newton's Third Law" },
  { id: "kinetic", name: "Kinetic Energy" },
  { id: "potential", name: "Potential Energy" },
  { id: "work", name: "Work done" },
  { id: "power", name: "Power" },

];

const NewtonFirstLaw = () => (
  <Card className="w-full">
    <CardHeader>
      <CardTitle>Newton's First Law</CardTitle>
    </CardHeader>
    <CardContent>
      <p>An object at rest stays at rest and an object in motion stays in motion with the same speed and in the same direction unless acted upon by an unbalanced force.</p>
    </CardContent>
  </Card>
);

const Power = () => {
  const [workDone, setWorkDone] = useState(50);
  const [time, setTime] = useState(10);

  const power = time > 0 ? workDone / time : 0;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Power</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="workDone">Work Done (J)</Label>
            <Input
              id="workDone"
              type="number"
              value={workDone}
              onChange={(e) => setWorkDone(parseFloat(e.target.value) || 0)}
            />
          </div>
          <div>
            <Label htmlFor="time">Time (s)</Label>
            <Input
              id="time"
              type="number"
              value={time}
              onChange={(e) => setTime(parseFloat(e.target.value) || 0)}
            />
          </div>
          <div>
            <p>Power: {power.toFixed(2)} W</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};


const WorkDone = () => {
  const [force, setForce] = useState(10);
  const [distance, setDistance] = useState(5);
  const [angle, setAngle] = useState(0);

  const workDone = force * distance * Math.cos((angle * Math.PI) / 180);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Work Done</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="force">Force (N)</Label>
            <Input
              id="force"
              type="number"
              value={force}
              onChange={(e) => setForce(parseFloat(e.target.value) || 0)}
            />
          </div>
          <div>
            <Label htmlFor="distance">Distance (m)</Label>
            <Input
              id="distance"
              type="number"
              value={distance}
              onChange={(e) => setDistance(parseFloat(e.target.value) || 0)}
            />
          </div>
          <div>
            <Label htmlFor="angle">Angle (°)</Label>
            <Input
              id="angle"
              type="number"
              value={angle}
              onChange={(e) => setAngle(parseFloat(e.target.value) || 0)}
            />
          </div>
          <div>
            <p>Work Done: {workDone.toFixed(2)} J</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};


const NewtonSecondLaw = () => {
  const [mass, setMass] = useState(1);
  const [force, setForce] = useState(10);
  const acceleration = force / mass;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Newton's Second Law</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="mass">Mass (kg)</Label>
            <Input
              id="mass"
              type="number"
              value={mass}
              onChange={(e) => setMass(parseFloat(e.target.value) || 0)}
            />
          </div>
          <div>
            <Label htmlFor="force">Force (N)</Label>
            <Input
              id="force"
              type="number"
              value={force}
              onChange={(e) => setForce(parseFloat(e.target.value) || 0)}
            />
          </div>
          <div>
            <p>Acceleration: {acceleration.toFixed(2)} m/s²</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const NewtonThirdLaw = () => (
  <Card className="w-full">
    <CardHeader>
      <CardTitle>Newton's Third Law</CardTitle>
    </CardHeader>
    <CardContent>
      <p>For every action, there is an equal and opposite reaction.</p>
    </CardContent>
  </Card>
);

const KineticEnergy = () => {
  const [mass, setMass] = useState(1);
  const [velocity, setVelocity] = useState(10);
  const kineticEnergy = 0.5 * mass * velocity * velocity;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Kinetic Energy</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="mass">Mass (kg)</Label>
            <Input
              id="mass"
              type="number"
              value={mass}
              onChange={(e) => setMass(parseFloat(e.target.value) || 0)}
            />
          </div>
          <div>
            <Label htmlFor="velocity">Velocity (m/s)</Label>
            <Input
              id="velocity"
              type="number"
              value={velocity}
              onChange={(e) => setVelocity(parseFloat(e.target.value) || 0)}
            />
          </div>
          <div>
            <p>Kinetic Energy: {kineticEnergy.toFixed(2)} J</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const PotentialEnergy = () => {
  const [mass, setMass] = useState(1);
  const [height, setHeight] = useState(10);
  const g = 9.8; // acceleration due to gravity
  const potentialEnergy = mass * g * height;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Potential Energy</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="mass">Mass (kg)</Label>
            <Input
              id="mass"
              type="number"
              value={mass}
              onChange={(e) => setMass(parseFloat(e.target.value) || 0)}
            />
          </div>
          <div>
            <Label htmlFor="height">Height (m)</Label>
            <Input
              id="height"
              type="number"
              value={height}
              onChange={(e) => setHeight(parseFloat(e.target.value) || 0)}
            />
          </div>
          <div>
            <p>Potential Energy: {potentialEnergy.toFixed(2)} J</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default function App() {
  const [selectedLaw, setSelectedLaw] = useState(null);

  const renderLawComponent = () => {
    switch (selectedLaw) {
      case "newton1":
        return <NewtonFirstLaw />;
      case "newton2":
        return <NewtonSecondLaw />;
      case "newton3":
        return <NewtonThirdLaw />;
      case "kinetic":
        return <KineticEnergy />;
      case "potential":
        return <PotentialEnergy />;
      case "work":
        return <WorkDone />;
      case "power":
        return <Power />;
      default:
        return null;
    }
  };
  

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-bold mb-6">Physics Concepts Explorer</h1>
      <div className="mb-6">
        <Select onValueChange={setSelectedLaw}>
          <SelectTrigger className="w-full sm:w-[300px]">
            <SelectValue placeholder="Select a physics law" />
          </SelectTrigger>
          <SelectContent>
            {laws.map((law) => (
              <SelectItem key={law.id} value={law.id}>
                {law.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {renderLawComponent()}
    </div>
  );
}