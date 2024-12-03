import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription,
  CardFooter 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectContent, SelectValue, SelectItem } from "@/components/ui/select";

const activities = ['Walking', 'Running', 'Cycling'];
const intensities = ['Low', 'Medium', 'High'];

function App() {
  const [activity, setActivity] = useState(activities[0]);
  const [duration, setDuration] = useState('');
  const [intensity, setIntensity] = useState(intensities[0]);
  const [weight, setWeight] = useState('70'); // kg
  const [age, setAge] = useState('30');
  const [logs, setLogs] = useState([]);
  const [goal, setGoal] = useState(2000); // daily calorie goal

  const calculateCalories = () => {
    const baseCalories = {
      'Walking': 4.5,
      'Running': 10,
      'Cycling': 6.8
    }[activity] * parseInt(weight);
    const intensityFactor = {'Low': 1, 'Medium': 1.2, 'High': 1.5}[intensity];
    const timeFactor = parseInt(duration) / 60;
    return Math.round(baseCalories * intensityFactor * timeFactor);
  };

  const addLog = () => {
    const calories = calculateCalories();
    setLogs([...logs, { 
      activity, 
      duration, 
      intensity, 
      calories, 
      date: new Date().toLocaleDateString() 
    }]);
  };

  const exportLogs = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(logs));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "calorie_logs.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const totalBurned = logs.reduce((sum, log) => sum + log.calories, 0);

  return (
    <div className="container mx-auto p-4 sm:p-6">
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Calorie Burn Estimator</CardTitle>
        </CardHeader>
        <CardContent>
          <Select onValueChange={setActivity}>
            <SelectTrigger>
              <SelectValue placeholder="Select activity" />
            </SelectTrigger>
            <SelectContent>
              {activities.map(act => (
                <SelectItem key={act} value={act}>{act}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input 
            type="number" 
            placeholder="Duration (min)" 
            value={duration} 
            onChange={(e) => setDuration(e.target.value)} 
            className="mt-2"
          />

          <Select onValueChange={setIntensity} className="mt-2">
            <SelectTrigger>
              <SelectValue placeholder="Select intensity" />
            </SelectTrigger>
            <SelectContent>
              {intensities.map(int => (
                <SelectItem key={int} value={int}>{int}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="mt-2 flex gap-2">
            <Input type="number" placeholder="Weight (kg)" value={weight} onChange={(e) => setWeight(e.target.value)} />
            <Input type="number" placeholder="Age" value={age} onChange={(e) => setAge(e.target.value)} />
          </div>
          <Button onClick={addLog} className="mt-4 w-full">Calculate & Log</Button>
        </CardContent>
      </Card>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Activity History</CardTitle>
        </CardHeader>
        <CardContent>
          {logs.map((log, idx) => (
            <div key={idx} className="border-b pb-2 mb-2 last:border-b-0">
              <p>{log.activity} - {log.duration} min - {log.calories} cal</p>
            </div>
          ))}
        </CardContent>
        <CardFooter>
          <Button onClick={exportLogs}>Export Logs</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-2">
            <Input 
              type="number" 
              placeholder="Daily Calorie Goal" 
              value={goal} 
              onChange={(e) => setGoal(e.target.value)} 
            />
          </div>
          <div className="h-4 bg-gray-200 rounded">
            <div style={{ width: `${(totalBurned / goal) * 100}%` }} className="h-full bg-blue-500 rounded"></div>
          </div>
          <p className="mt-2">Burned: {totalBurned} cal / Goal: {goal} cal</p>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
