import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const TimerCard = ({ timer, onStart, onPause, onReset, onDelete }) => {
  return (
    <Card className="w-full sm:w-80 mx-auto my-4">
      <CardHeader>
        <CardTitle>{timer.label}</CardTitle>
        <CardDescription>Category: {timer.category}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-semibold text-center">
          {`${Math.floor(timer.remainingTime / 60)}:${
            timer.remainingTime % 60 < 10 ? "0" : ""
          }${timer.remainingTime % 60}`}
        </p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <button
          className="px-4 py-2 bg-green-500 text-white rounded"
          onClick={() => onStart(timer.id)}
        >
          Start
        </button>
        <button
          className="px-4 py-2 bg-yellow-500 text-white rounded"
          onClick={() => onPause(timer.id)}
        >
          Pause
        </button>
        <button
          className="px-4 py-2 bg-red-500 text-white rounded"
          onClick={() => onReset(timer.id)}
        >
          Reset
        </button>
        <button
          className="px-4 py-2 bg-gray-500 text-white rounded"
          onClick={() => onDelete(timer.id)}
        >
          Delete
        </button>
      </CardFooter>
    </Card>
  );
};

export default function App() {
  const [timers, setTimers] = useState([]);
  const [newTimer, setNewTimer] = useState({
    label: "",
    duration: 0,
    category: "work",
    sound: "default",
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setTimers((prevTimers) =>
        prevTimers.map((timer) => {
          if (timer.running && timer.remainingTime > 0) {
            return { ...timer, remainingTime: timer.remainingTime - 1 };
          }
          if (timer.remainingTime === 0 && timer.running) {
            // Play the alarm sound from an online source
            const audio = new Audio("https://www.soundjay.com/button/sounds/beep-07.mp3");
            audio.play();

            // Show an alert
            alert(`${timer.label} has ended!`);
            return { ...timer, running: false };
          }
          return timer;
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleStart = (id) => {
    setTimers((prevTimers) =>
      prevTimers.map((timer) =>
        timer.id === id ? { ...timer, running: true } : timer
      )
    );
  };

  const handlePause = (id) => {
    setTimers((prevTimers) =>
      prevTimers.map((timer) =>
        timer.id === id ? { ...timer, running: false } : timer
      )
    );
  };

  const handleReset = (id) => {
    setTimers((prevTimers) =>
      prevTimers.map((timer) =>
        timer.id === id
          ? { ...timer, running: false, remainingTime: timer.duration }
          : timer
      )
    );
  };

  const handleDelete = (id) => {
    setTimers((prevTimers) => prevTimers.filter((timer) => timer.id !== id));
  };

  const handleAddTimer = () => {
    if (!newTimer.label || newTimer.duration <= 0) {
      alert("Please enter a valid label and duration.");
      return;
    }

    setTimers([
      ...timers,
      {
        ...newTimer,
        id: Date.now(),
        remainingTime: newTimer.duration,
        running: false,
      },
    ]);
    setNewTimer({ label: "", duration: 0, category: "work", sound: "default" });
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto">
        <Card className="mb-8 p-4">
          <CardHeader>
            <CardTitle>Create a Timer</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-4">
              <input
                type="text"
                placeholder="Label"
                className="px-4 py-2 border rounded"
                value={newTimer.label}
                onChange={(e) =>
                  setNewTimer({ ...newTimer, label: e.target.value })
                }
              />
              <input
                type="number"
                placeholder="Duration (seconds)"
                className="px-4 py-2 border rounded"
                value={newTimer.duration}
                onChange={(e) =>
                  setNewTimer({
                    ...newTimer,
                    duration: parseInt(e.target.value),
                  })
                }
              />
              <select
                className="px-4 py-2 border rounded"
                value={newTimer.category}
                onChange={(e) =>
                  setNewTimer({ ...newTimer, category: e.target.value })
                }
              >
                <option value="work">Work</option>
                <option value="exercise">Exercise</option>
                <option value="study">Study</option>
              </select>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded"
                onClick={handleAddTimer}
              >
                Add Timer
              </button>
            </div>
          </CardContent>
        </Card>
        <div>
          {timers.map((timer) => (
            <TimerCard
              key={timer.id}
              timer={timer}
              onStart={handleStart}
              onPause={handlePause}
              onReset={handleReset}
              onDelete={handleDelete}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
