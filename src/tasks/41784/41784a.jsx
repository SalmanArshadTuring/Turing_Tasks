import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";

const DAYS_OF_WEEK = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const HabitCard = ({ habit, onComplete, onDelete }) => {
  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>{habit.name}</CardTitle>
        <CardDescription>Current streak: {habit.streak} days</CardDescription>
      </CardHeader>
      <CardContent>
        <Progress value={(habit.streak / 30) * 100} className="mb-2" />
        <div className="grid grid-cols-7 gap-1 mb-2">
          {DAYS_OF_WEEK.map((day, index) => (
            <div
              key={day}
              className={`text-center p-1 text-xs ${
                habit.completedDays.includes(index)
                  ? "bg-green-500 text-white"
                  : "bg-gray-200"
              }`}
            >
              {day}
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button onClick={() => onComplete(habit.id)}>Complete</Button>
        <Button variant="destructive" onClick={() => onDelete(habit.id)}>
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
};

const AddHabitForm = ({ onAdd }) => {
  const [habitName, setHabitName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (habitName.trim()) {
      onAdd(habitName.trim());
      setHabitName("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <div className="flex space-x-2">
        <Input
          type="text"
          value={habitName}
          onChange={(e) => setHabitName(e.target.value)}
          placeholder="Enter new habit"
          className="flex-grow"
        />
        <Button type="submit">Add Habit</Button>
      </div>
    </form>
  );
};

const ProgressChart = ({ habits }) => {
  const maxStreak = Math.max(...habits.map((h) => h.streak), 0);

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>Progress Chart</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-40 flex items-end space-x-2">
          {habits.map((habit) => (
            <div
              key={habit.id}
              className="bg-blue-500 w-8"
              style={{
                height: `${(habit.streak / maxStreak) * 100}%`,
              }}
            >
              <div className="text-xs text-center text-white">
                {habit.streak}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default function App() {
  const [habits, setHabits] = useState(() => {
    const savedHabits = localStorage.getItem("habits");
    return savedHabits ? JSON.parse(savedHabits) : [];
  });

  useEffect(() => {
    localStorage.setItem("habits", JSON.stringify(habits));
  }, [habits]);

  const addHabit = (name) => {
    const newHabit = {
      id: Date.now(),
      name,
      streak: 0,
      completedDays: [],
    };
    setHabits([...habits, newHabit]);
  };

  const completeHabit = (id) => {
    setHabits(
      habits.map((habit) => {
        if (habit.id === id) {
          const today = new Date().getDay();
          if (!habit.completedDays.includes(today)) {
            return {
              ...habit,
              streak: habit.streak + 1,
              completedDays: [...habit.completedDays, today],
            };
          }
        }
        return habit;
      })
    );
  };

  const deleteHabit = (id) => {
    setHabits(habits.filter((habit) => habit.id !== id));
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 max-w-md">
      <h1 className="text-2xl font-bold mb-4">Habit Tracker</h1>
      <AddHabitForm onAdd={addHabit} />
      <ProgressChart habits={habits} />
      {habits.map((habit) => (
        <HabitCard
          key={habit.id}
          habit={habit}
          onComplete={completeHabit}
          onDelete={deleteHabit}
        />
      ))}
    </div>
  );
}