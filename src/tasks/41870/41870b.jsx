import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";

const presetTimers = {
  Beginner: [
    { type: "breathing", duration: 180 },
    { type: "silence", duration: 300 },
    { type: "music", duration: 120 },
  ],
  Intermediate: [
    { type: "breathing", duration: 300 },
    { type: "silence", duration: 600 },
    { type: "music", duration: 300 },
  ],
  Advanced: [
    { type: "breathing", duration: 420 },
    { type: "silence", duration: 900 },
    { type: "music", duration: 480 },
  ],
};

const sounds = ["ocean waves", "bird songs", "meditation chimes", "rain", "white noise"];

function IntervalInput({ interval, onChange, onDelete }) {
  return (
    <div className="flex items-center space-x-2 mb-2">
      <Select value={interval.type} onValueChange={(value) => onChange({ ...interval, type: value })}>
        <SelectTrigger className="w-[120px]">
          <SelectValue placeholder="Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="breathing">Breathing</SelectItem>
          <SelectItem value="silence">Silence</SelectItem>
          <SelectItem value="music">Music</SelectItem>
        </SelectContent>
      </Select>
      <Input
        type="number"
        value={interval.duration}
        onChange={(e) => onChange({ ...interval, duration: parseInt(e.target.value) })}
        className="w-20"
      />
      <Button variant="destructive" onClick={onDelete}>Delete</Button>
    </div>
  );
}

function TimerCreator({ onSave }) {
  const [intervals, setIntervals] = useState([{ type: "breathing", duration: 180 }]);

  const addInterval = () => {
    setIntervals([...intervals, { type: "silence", duration: 300 }]);
  };

  const updateInterval = (index, updatedInterval) => {
    const newIntervals = [...intervals];
    newIntervals[index] = updatedInterval;
    setIntervals(newIntervals);
  };

  const deleteInterval = (index) => {
    setIntervals(intervals.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    onSave(intervals);
    setIntervals([{ type: "breathing", duration: 180 }]);
  };

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>Create Custom Timer</CardTitle>
      </CardHeader>
      <CardContent>
        {intervals.map((interval, index) => (
          <IntervalInput
            key={index}
            interval={interval}
            onChange={(updatedInterval) => updateInterval(index, updatedInterval)}
            onDelete={() => deleteInterval(index)}
          />
        ))}
        <Button onClick={addInterval} className="mr-2">Add Interval</Button>
        <Button onClick={handleSave}>Save Timer</Button>
      </CardContent>
    </Card>
  );
}

function TimerDisplay({ intervals, onComplete }) {
  const [currentInterval, setCurrentInterval] = useState(0);
  const [timeLeft, setTimeLeft] = useState(intervals[0].duration);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let timer;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      if (currentInterval < intervals.length - 1) {
        setCurrentInterval((prev) => prev + 1);
        setTimeLeft(intervals[currentInterval + 1].duration);
      } else {
        setIsRunning(false);
        onComplete();
      }
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft, currentInterval, intervals, onComplete]);

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const progress = (intervals[currentInterval].duration - timeLeft) / intervals[currentInterval].duration * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{intervals[currentInterval].type}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-4xl font-bold mb-4">{formatTime(timeLeft)}</div>
        <Progress value={progress} className="mb-4" />
        <Button onClick={toggleTimer}>{isRunning ? "Pause" : "Start"}</Button>
      </CardContent>
    </Card>
  );
}

function ProgressTracker({ history }) {
  const totalTime = history.reduce((sum, session) => sum + session.duration, 0);
  const streak = history.filter((session, index) => {
    if (index === 0) return true;
    const prevDate = new Date(history[index - 1].date);
    const currentDate = new Date(session.date);
    return (currentDate - prevDate) / (1000 * 60 * 60 * 24) === 1;
  }).length;

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Progress Tracker</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Total Time Meditated: {Math.round(totalTime / 60)} minutes</p>
        <p>Current Streak: {streak} days</p>
      </CardContent>
    </Card>
  );
}

export default function App() {
  const [timers, setTimers] = useState([]);
  const [selectedTimer, setSelectedTimer] = useState(null);
  const [history, setHistory] = useState([]);
  const [selectedSound, setSelectedSound] = useState("ocean waves");

  const saveTimer = (newTimer) => {
    setTimers([...timers, newTimer]);
  };

  const selectPresetTimer = (preset) => {
    setSelectedTimer(presetTimers[preset]);
  };

  const completeSession = () => {
    const duration = selectedTimer.reduce((sum, interval) => sum + interval.duration, 0);
    setHistory([...history, { date: new Date().toISOString(), duration }]);
    setSelectedTimer(null);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Meditation Timer App</h1>
      
      <TimerCreator onSave={saveTimer} />

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Preset Timers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2">
            {Object.keys(presetTimers).map((preset) => (
              <Button key={preset} onClick={() => selectPresetTimer(preset)}>{preset}</Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Sound Selection</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={selectedSound} onValueChange={setSelectedSound}>
            <SelectTrigger>
              <SelectValue placeholder="Select a sound" />
            </SelectTrigger>
            <SelectContent>
              {sounds.map((sound) => (
                <SelectItem key={sound} value={sound}>{sound}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {selectedTimer && (
        <TimerDisplay intervals={selectedTimer} onComplete={completeSession} />
      )}

      <ProgressTracker history={history} />
    </div>
  );
}