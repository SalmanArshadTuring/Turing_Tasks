import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Toast, ToastProvider } from "@/components/ui/toast"; // Import ToastProvider

const alarmSounds = ["Beep", "Chime", "Bell", "Alarm"];
const categories = ["Work", "Exercise", "Study", "Personal"];

const Timer = ({ timer, onUpdate, onDelete }) => {
  const [remainingTime, setRemainingTime] = useState(timer.duration);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval;
    if (isRunning && remainingTime > 0) {
      interval = setInterval(() => {
        setRemainingTime((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setIsRunning(false);
            onUpdate({ ...timer, isCompleted: true });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, remainingTime, timer, onUpdate]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  const handleStart = () => setIsRunning(true);
  const handlePause = () => setIsRunning(false);
  const handleReset = () => {
    setIsRunning(false);
    setRemainingTime(timer.duration);
    onUpdate({ ...timer, isCompleted: false });
  };

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>{timer.label}</span>
          <span className="text-2xl font-bold">{formatTime(remainingTime)}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          <div>
            <p>Category: {timer.category}</p>
            <p>Alarm: {timer.alarmSound}</p>
          </div>
          <div>
            {!isRunning && remainingTime > 0 && (
              <Button onClick={handleStart} className="mr-2">
                Start
              </Button>
            )}
            {isRunning && (
              <Button onClick={handlePause} className="mr-2">
                Pause
              </Button>
            )}
            <Button onClick={handleReset} className="mr-2">
              Reset
            </Button>
            <Button onClick={() => onDelete(timer.id)} variant="destructive">
              Delete
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const TimerForm = ({ onAdd }) => {
  const [label, setLabel] = useState("");
  const [duration, setDuration] = useState("");
  const [category, setCategory] = useState("");
  const [alarmSound, setAlarmSound] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (label && duration && category && alarmSound) {
      onAdd({
        id: Date.now(),
        label,
        duration: parseInt(duration) * 60,
        category,
        alarmSound,
        isCompleted: false,
      });
      setLabel("");
      setDuration("");
      setCategory("");
      setAlarmSound("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <Input
        type="text"
        placeholder="Timer Label"
        value={label}
        onChange={(e) => setLabel(e.target.value)}
        className="mb-2"
      />
      <Input
        type="number"
        placeholder="Duration (minutes)"
        value={duration}
        onChange={(e) => setDuration(e.target.value)}
        className="mb-2"
      />
      <Select onValueChange={setCategory} value={category}>
        <SelectTrigger className="mb-2">
          <SelectValue placeholder="Select Category" />
        </SelectTrigger>
        <SelectContent>
          {categories.map((cat) => (
            <SelectItem key={cat} value={cat}>
              {cat}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select onValueChange={setAlarmSound} value={alarmSound}>
        <SelectTrigger className="mb-2">
          <SelectValue placeholder="Select Alarm Sound" />
        </SelectTrigger>
        <SelectContent>
          {alarmSounds.map((sound) => (
            <SelectItem key={sound} value={sound}>
              {sound}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button type="submit">Add Timer</Button>
    </form>
  );
};

export default function App() {
  const [timers, setTimers] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    const savedTimers = localStorage.getItem("timers");
    if (savedTimers) {
      setTimers(JSON.parse(savedTimers));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("timers", JSON.stringify(timers));
  }, [timers]);

  const addTimer = (newTimer) => {
    setTimers([...timers, newTimer]);
  };

  const updateTimer = (updatedTimer) => {
    setTimers(timers.map((t) => (t.id === updatedTimer.id ? updatedTimer : t)));
  };

  const deleteTimer = (id) => {
    setTimers(timers.filter((t) => t.id !== id));
  };

  const filteredTimers =
    activeCategory === "All"
      ? timers
      : timers.filter((t) => t.category === activeCategory);

  const startAllTimers = () => {
    setTimers(timers.map((t) => ({ ...t, isRunning: true })));
  };

  const pauseAllTimers = () => {
    setTimers(timers.map((t) => ({ ...t, isRunning: false })));
  };

  const resetAllTimers = () => {
    setTimers(
      timers.map((t) => ({ ...t, isRunning: false, isCompleted: false }))
    );
  };

  return (
    <ToastProvider>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">Timer App</h1>
        <TimerForm onAdd={addTimer} />
        <Tabs value={activeCategory} onValueChange={setActiveCategory}>
          <TabsList>
            <TabsTrigger value="All">All</TabsTrigger>
            {categories.map((cat) => (
              <TabsTrigger key={cat} value={cat}>
                {cat}
              </TabsTrigger>
            ))}
          </TabsList>
          <div className="my-4">
            <Button onClick={startAllTimers} className="mr-2">
              Start All
            </Button>
            <Button onClick={pauseAllTimers} className="mr-2">
              Pause All
            </Button>
            <Button onClick={resetAllTimers}>Reset All</Button>
          </div>
          <TabsContent value={activeCategory}>
            {filteredTimers.map((timer) => (
              <Timer
                key={timer.id}
                timer={timer}
                onUpdate={updateTimer}
                onDelete={deleteTimer}
              />
            ))}
          </TabsContent>
        </Tabs>
        <Toast />
      </div>
    </ToastProvider>
  );
}
