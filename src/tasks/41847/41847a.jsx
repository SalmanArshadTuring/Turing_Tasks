import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const PET_STATES = {
  IDLE: "idle",
  EATING: "eating",
  PLAYING: "playing",
  SLEEPING: "sleeping",
};

const PET_ANIMATIONS = {
  [PET_STATES.IDLE]: "animate-bounce",
  [PET_STATES.EATING]: "animate-pulse",
  [PET_STATES.PLAYING]: "animate-spin",
  [PET_STATES.SLEEPING]: "animate-pulse",
};

const Pet = ({ state, happiness }) => {
  const petEmoji = {
    [PET_STATES.IDLE]: "🐶",
    [PET_STATES.EATING]: "🍖",
    [PET_STATES.PLAYING]: "🎾",
    [PET_STATES.SLEEPING]: "💤",
  };

  return (
    <div className={`text-8xl ${PET_ANIMATIONS[state]}`}>
      {petEmoji[state]}
    </div>
  );
};

const ActionButton = ({ onClick, disabled, children }) => (
  <Button
    onClick={onClick}
    disabled={disabled}
    className="w-full sm:w-auto"
  >
    {children}
  </Button>
);

export default function App() {
  const [petState, setPetState] = useState(PET_STATES.IDLE);
  const [happiness, setHappiness] = useState(50);
  const [age, setAge] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setHappiness((prev) => Math.max(0, prev - 1));
      setAge((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const feed = () => {
    setPetState(PET_STATES.EATING);
    setHappiness((prev) => Math.min(100, prev + 10));
    setTimeout(() => setPetState(PET_STATES.IDLE), 2000);
  };

  const play = () => {
    setPetState(PET_STATES.PLAYING);
    setHappiness((prev) => Math.min(100, prev + 15));
    setTimeout(() => setPetState(PET_STATES.IDLE), 2000);
  };

  const sleep = () => {
    setPetState(PET_STATES.SLEEPING);
    setHappiness((prev) => Math.min(100, prev + 5));
    setTimeout(() => setPetState(PET_STATES.IDLE), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-300 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Virtual Pet
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-center">
            <Pet state={petState} happiness={happiness} />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-semibold">Happiness:</span>
              <span>{happiness}%</span>
            </div>
            <Progress value={happiness} className="w-full" />
          </div>
          <div className="text-center">
            <span className="font-semibold">Age: </span>
            <span>{age} seconds</span>
          </div>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            <ActionButton
              onClick={feed}
              disabled={petState !== PET_STATES.IDLE}
            >
              Feed
            </ActionButton>
            <ActionButton
              onClick={play}
              disabled={petState !== PET_STATES.IDLE}
            >
              Play
            </ActionButton>
            <ActionButton
              onClick={sleep}
              disabled={petState !== PET_STATES.IDLE}
            >
              Sleep
            </ActionButton>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}