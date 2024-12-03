import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const activities = [
  { name: "Walking", mets: 3.5 },
  { name: "Running", mets: 8 },
  { name: "Cycling", mets: 6 },
  { name: "Swimming", mets: 7 },
];

const intensities = [
  { name: "Low", factor: 0.8 },
  { name: "Medium", factor: 1 },
  { name: "High", factor: 1.2 },
];

const CalorieCalculator = ({ onSave }) => {
  const [activity, setActivity] = useState(activities[0]);
  const [intensity, setIntensity] = useState(intensities[1]);
  const [duration, setDuration] = useState(30);
  const [weight, setWeight] = useState(70);
  const [age, setAge] = useState(30);
  const [calories, setCalories] = useState(0);

  const calculateCalories = () => {
    const mets = activity.mets * intensity.factor;
    const caloriesPerMinute = (mets * 3.5 * weight) / 200;
    const totalCalories = caloriesPerMinute * duration;
    setCalories(Math.round(totalCalories));
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Calorie Burn Calculator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Select
          value={activity.name}
          onValueChange={(value) => setActivity(activities.find((a) => a.name === value))}
        >
          {activities.map((a) => (
            <option key={a.name} value={a.name}>
              {a.name}
            </option>
          ))}
        </Select>
        <Select
          value={intensity.name}
          onValueChange={(value) => setIntensity(intensities.find((i) => i.name === value))}
        >
          {intensities.map((i) => (
            <option key={i.name} value={i.name}>
              {i.name}
            </option>
          ))}
        </Select>
        <Input
          type="number"
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
          placeholder="Duration (minutes)"
        />
        <Input
          type="number"
          value={weight}
          onChange={(e) => setWeight(Number(e.target.value))}
          placeholder="Weight (kg)"
        />
        <Input
          type="number"
          value={age}
          onChange={(e) => setAge(Number(e.target.value))}
          placeholder="Age"
        />
        <Button onClick={calculateCalories}>Calculate</Button>
        {calories > 0 && (
          <div className="text-center">
            <p className="text-2xl font-bold">{calories} calories</p>
            <Button onClick={() => onSave({ activity: activity.name, intensity: intensity.name, duration, calories })}>
              Save Activity
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const ActivityHistory = ({ activities }) => (
  <Card className="w-full max-w-md">
    <CardHeader>
      <CardTitle>Activity History</CardTitle>
    </CardHeader>
    <CardContent>
      <ul className="space-y-2">
        {activities.map((activity, index) => (
          <li key={index} className="border-b pb-2">
            <p className="font-semibold">{activity.activity}</p>
            <p>
              {activity.intensity} intensity, {activity.duration} minutes
            </p>
            <p>{activity.calories} calories burned</p>
          </li>
        ))}
      </ul>
    </CardContent>
  </Card>
);

const CalorieBurnChart = ({ activities }) => {
  const chartData = activities.map((activity, index) => ({
    x: index,
    y: activity.calories,
  }));

  const maxCalories = Math.max(...chartData.map((d) => d.y));

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Calorie Burn Over Time</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 flex items-end space-x-2">
          {chartData.map((d, i) => (
            <div
              key={i}
              className="bg-blue-500 w-8"
              style={{ height: `${(d.y / maxCalories) * 100}%` }}
            >
              <div className="text-xs text-center">{d.y}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const GoalSetting = ({ goal, setGoal, activities }) => {
  const totalCalories = activities.reduce((sum, activity) => sum + activity.calories, 0);
  const progress = Math.min((totalCalories / goal) * 100, 100);

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Calorie Burn Goal</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          type="number"
          value={goal}
          onChange={(e) => setGoal(Number(e.target.value))}
          placeholder="Set calorie goal"
        />
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-blue-600 h-2.5 rounded-full"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="text-center">
          {totalCalories} / {goal} calories ({Math.round(progress)}%)
        </p>
      </CardContent>
    </Card>
  );
};

export default function App() {
  const [activities, setActivities] = useState([]);
  const [goal, setGoal] = useState(2000);

  const saveActivity = (activity) => {
    setActivities([...activities, activity]);
  };

  const exportData = () => {
    const dataStr = JSON.stringify(activities);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = 'calorie_burn_data.json';
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div className="container mx-auto p-4 space-y-8">
      <h1 className="text-3xl font-bold text-center mb-8">Calorie Burn Estimator</h1>
      <Tabs defaultValue="calculator" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="calculator">Calculator</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="chart">Chart</TabsTrigger>
          <TabsTrigger value="goal">Goal</TabsTrigger>
        </TabsList>
        <TabsContent value="calculator">
          <CalorieCalculator onSave={saveActivity} />
        </TabsContent>
        <TabsContent value="history">
          <ActivityHistory activities={activities} />
        </TabsContent>
        <TabsContent value="chart">
          <CalorieBurnChart activities={activities} />
        </TabsContent>
        <TabsContent value="goal">
          <GoalSetting goal={goal} setGoal={setGoal} activities={activities} />
        </TabsContent>
      </Tabs>
      <Button onClick={exportData} className="mt-4">Export Data</Button>
    </div>
  );
}