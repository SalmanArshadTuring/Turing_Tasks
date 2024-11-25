import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, CalendarDays } from 'lucide-react';

const HabitCard = ({ habit, onComplete }) => (
  <Card className="mb-4 sm:mb-2">
    <CardHeader>
      <CardTitle>{habit.name}</CardTitle>
      <CardDescription>Streak: {habit.streak} days</CardDescription>
    </CardHeader>
    <CardFooter>
      <Button onClick={() => onComplete(habit.id)} variant="outline">
        <CheckCircle className="mr-2 h-4 w-4" /> Mark as Done
      </Button>
    </CardFooter>
  </Card>
);

const WeeklyView = ({ habits }) => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  return (
    <div className="grid grid-cols-7 gap-2 text-center text-xs sm:text-sm">
      {days.map(day => (
        <div key={day} className="p-1 bg-slate-100 rounded">
          {day}
          {habits.map(habit => (
            <div 
              key={habit.id} 
              className={`h-4 w-4 my-1 mx-auto rounded-full ${habit.weeklyProgress[day] ? 'bg-green-500' : 'bg-red-500'}`}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

const ProgressChart = ({ habits }) => (
  <div className="mt-4">
    {habits.map(habit => (
      <div key={habit.id} className="flex items-center mb-2">
        <CalendarDays className="mr-2" />
        <progress 
          className="progress progress-primary w-56 sm:w-80" 
          value={habit.streak} 
          max="30"
        ></progress>
        <span className="ml-2">{habit.streak}/30</span>
      </div>
    ))}
  </div>
);

export default function App() {
  const [habits, setHabits] = useState([
    { id: 1, name: 'Exercise', streak: 0, weeklyProgress: {} },
    { id: 2, name: 'Reading', streak: 0, weeklyProgress: {} }
  ]);

  useEffect(() => {
    const today = new Date().toLocaleString('en-us', {  weekday: 'long' });
    setHabits(prevHabits => 
      prevHabits.map(habit => ({
        ...habit,
        weeklyProgress: { ...habit.weeklyProgress, [today]: habit.streak > 0 }
      }))
    );
  }, [habits]);

  const completeHabit = (id) => {
    setHabits(prev => 
      prev.map(habit => 
        habit.id === id ? { ...habit, streak: habit.streak + (habit.streak === 0 || !habit.weeklyProgress[new Date().toLocaleString('en-us', { weekday: 'long' })] ? 1 : 0) } : habit
      )
    );
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 max-w-lg">
      <h1 className="text-2xl font-bold mb-4">Habit Tracker</h1>
      {habits.map(habit => (
        <HabitCard key={habit.id} habit={habit} onComplete={completeHabit} />
      ))}
      <Card>
        <CardContent>
          <CardTitle>Weekly Overview</CardTitle>
          <WeeklyView habits={habits} />
        </CardContent>
      </Card>
      <ProgressChart habits={habits} />
    </div>
  );
}