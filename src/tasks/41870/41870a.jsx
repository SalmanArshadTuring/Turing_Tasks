import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectItem } from "@/components/ui/select";

const TimerInterval = ({ interval, onDelete, onChange }) => {
  return (
    <Card className="mb-2">
      <CardHeader>
        <CardTitle>{interval.name || 'New Interval'}</CardTitle>
      </CardHeader>
      <CardContent>
        <Input 
          type="text" 
          placeholder="Interval Name" 
          value={interval.name} 
          onChange={(e) => onChange('name', e.target.value)} 
        />
        <Input 
          type="number" 
          placeholder="Duration in minutes" 
          value={interval.duration} 
          onChange={(e) => onChange('duration', e.target.value)} 
        />
        <Select onChange={(value) => onChange('type', value)}>
          <SelectItem value="breathing">Breathing</SelectItem>
          <SelectItem value="silence">Silence</SelectItem>
          <SelectItem value="music">Music</SelectItem>
        </Select>
        <Button onClick={onDelete}>Delete</Button>
      </CardContent>
    </Card>
  );
};

export default function App() {
  const [timers, setTimers] = useState([]);
  const [currentTimer, setCurrentTimer] = useState({ intervals: [] });
  const [running, setRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [currentIntervalIndex, setCurrentIntervalIndex] = useState(0);

  useEffect(() => {
    let intervalId;
    if (running && timeLeft > 0) {
      intervalId = setInterval(() => {
        setTimeLeft(timeLeft => timeLeft - 1);
      }, 1000);
    } else if (running && timeLeft === 0) {
      if (currentIntervalIndex + 1 < currentTimer.intervals.length) {
        setCurrentIntervalIndex(currentIntervalIndex + 1);
        setTimeLeft(currentTimer.intervals[currentIntervalIndex + 1].duration * 60);
      } else {
        setRunning(false);
      }
    }
    return () => clearInterval(intervalId);
  }, [running, timeLeft, currentIntervalIndex, currentTimer]);

  const addInterval = () => {
    setCurrentTimer(prev => ({
      ...prev,
      intervals: [...prev.intervals, { name: '', duration: 1, type: 'breathing' }]
    }));
  };

  const updateInterval = (index, key, value) => {
    const updatedIntervals = [...currentTimer.intervals];
    updatedIntervals[index][key] = value;
    setCurrentTimer(prev => ({ ...prev, intervals: updatedIntervals }));
  };

  const startTimer = () => {
    setRunning(true);
    setTimeLeft(currentTimer.intervals[0].duration * 60);
    setCurrentIntervalIndex(0);
  };

  return (
    <div className="container mx-auto p-4 sm:p-8">
      <Card>
        <CardHeader>
          <CardTitle>Meditation Timer</CardTitle>
        </CardHeader>
        <CardContent>
          {currentTimer.intervals.map((interval, index) => (
            <TimerInterval 
              key={index} 
              interval={interval} 
              onDelete={() => {
                const updated = currentTimer.intervals.filter((_, i) => i !== index);
                setCurrentTimer(prev => ({ ...prev, intervals: updated }));
              }}
              onChange={(key, value) => updateInterval(index, key, value)}
            />
          ))}
          <Button onClick={addInterval}>Add Interval</Button>
          <Button onClick={startTimer} disabled={running || currentTimer.intervals.length === 0}>
            {running ? 'Running...' : 'Start Timer'}
          </Button>
          {running && (
            <CardDescription className="mt-4">
              <div>Current: {currentTimer.intervals[currentIntervalIndex].name}</div>
              <div>Time Left: {Math.floor(timeLeft / 60)}:{('0' + (timeLeft % 60)).slice(-2)}</div>
            </CardDescription>
          )}
        </CardContent>
      </Card>
    </div>
  );
}