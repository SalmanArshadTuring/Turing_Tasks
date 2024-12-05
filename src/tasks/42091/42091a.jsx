import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const ALARM_SOUNDS = ['beep', 'chime', 'whistle'];

function Timer({ timer, onStart, onPause, onReset, onDelete, onUpdate }) {
  const [timeLeft, setTimeLeft] = useState(timer.duration);
  const [running, setRunning] = useState(false);
  const [intervalId, setIntervalId] = useState(null);

  useEffect(() => {
    if (running && timeLeft > 0) {
      const id = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
      setIntervalId(id);
      return () => clearInterval(id);
    } else if (timeLeft === 0) {
      setRunning(false);
      new Audio(`/sounds/${timer.alarm}.mp3`).play(); // Assume sound files are in public/sounds
    }
  }, [running, timeLeft]);

  const handleStartPause = () => {
    if (!running) {
      onStart(timer.id);
      setRunning(true);
    } else {
      onPause(timer.id);
      setRunning(false);
      clearInterval(intervalId);
    }
  };

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>{timer.label}</CardTitle>
      </CardHeader>
      <CardContent>
        <div>
          {Math.floor(timeLeft / 60)}:
          {String(timeLeft % 60).padStart(2, '0')}
        </div>
        <Button onClick={handleStartPause}>
          {running ? 'Pause' : 'Start'}
        </Button>
        <Button onClick={() => onReset(timer.id)} className="ml-2">
          Reset
        </Button>
        <Button onClick={() => onDelete(timer.id)} className="ml-2 bg-red-500">
          Delete
        </Button>
        <Select
          defaultValue={timer.alarm}
          onValueChange={(value) => onUpdate(timer.id, { alarm: value })}
        >
          <SelectTrigger>
            <Button>{timer.alarm}</Button>
          </SelectTrigger>
          <SelectContent>
            {ALARM_SOUNDS.map((sound) => (
              <SelectItem key={sound} value={sound}>
                {sound}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );
}

export default function App() {
  const [timers, setTimers] = useState(
    () => JSON.parse(localStorage.getItem('timers')) || []
  );
  const [label, setLabel] = useState('');
  const [duration, setDuration] = useState(60);
  const [category, setCategory] = useState('work');

  useEffect(() => {
    localStorage.setItem('timers', JSON.stringify(timers));
  }, [timers]);

  const addTimer = () => {
    if (label && duration > 0) {
      setTimers([
        ...timers,
        { id: Date.now(), label, duration, category, alarm: 'beep' },
      ]);
      setLabel('');
      setDuration(60);
    }
  };

  const updateTimer = (id, updates) => {
    setTimers(timers.map((t) => (t.id === id ? { ...t, ...updates } : t)));
  };

  const bulkAction = (action) => {
    timers.forEach((t) => action(t.id));
  };

  return (
    <div className="container mx-auto p-4 sm:p-8">
      <h1 className="text-2xl font-bold mb-4">Timer App</h1>
      <Card>
        <CardContent>
          <Input
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="Timer Label"
            className="mb-2"
          />
          <Input
            type="number"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            placeholder="Duration in seconds"
            className="mb-2"
          />
          <Select defaultValue={category} onValueChange={setCategory}>
            <SelectTrigger>
              <Button>{category}</Button>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="work">Work</SelectItem>
              <SelectItem value="exercise">Exercise</SelectItem>
              <SelectItem value="study">Study</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={addTimer} className="mt-2 w-full">
            Add Timer
          </Button>
        </CardContent>
      </Card>
      <div className="mt-4">
        <Button
          onClick={() => bulkAction((id) => updateTimer(id, { running: true }))}
        >
          Start All
        </Button>
        <Button
          onClick={() => bulkAction((id) => updateTimer(id, { running: false }))}
          className="ml-2"
        >
          Pause All
        </Button>
        <Button
          onClick={() => bulkAction((id) => updateTimer(id, { duration: 0 }))}
          className="ml-2"
        >
          Reset All
        </Button>
      </div>
      <div className="mt-4 grid sm:grid-cols-2 gap-4">
        {timers.map((timer) => (
          <Timer
            key={timer.id}
            timer={timer}
            onStart={(id) => updateTimer(id, { running: true })}
            onPause={(id) => updateTimer(id, { running: false })}
            onReset={(id) =>
              updateTimer(id, { duration: timer.duration, running: false })
            }
            onDelete={(id) => setTimers(timers.filter((t) => t.id !== id))}
            onUpdate={updateTimer}
          />
        ))}
      </div>
    </div>
  );
}
