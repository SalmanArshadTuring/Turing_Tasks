import React, { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { PieChart } from "react-minimal-pie-chart";

export default function App() {
  const [activities, setActivities] = useState(() => {
    const savedActivities = localStorage.getItem('activities');
    return savedActivities ? JSON.parse(savedActivities) : [];
  });
  const [newActivity, setNewActivity] = useState({ name: '', duration: '', category: '', description: '' });
  const [chartConfig, setChartConfig] = useState({ colors: {}, showCategories: true });

  useEffect(() => {
    localStorage.setItem('activities', JSON.stringify(activities));
  }, [activities]);

  const addActivity = () => {
    if (newActivity.name && newActivity.duration) {
      setActivities([...activities, { ...newActivity, id: Date.now() }]);
      setNewActivity({ name: '', duration: '', category: '', description: '' });
    }
  };

  const deleteActivity = (id) => {
    setActivities(activities.filter(activity => activity.id !== id));
  };

  const updateColor = (activityName, color) => {
    setChartConfig(prev => ({...prev, colors: {...prev.colors, [activityName]: color}}));
  };

  const toggleCategory = () => {
    setChartConfig(prev => ({...prev, showCategories: !prev.showCategories}));
  };

  const resetActivities = () => {
    setActivities([]);
    setChartConfig({ colors: {}, showCategories: true });
  };

  const exportToJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(activities));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", "activity_log.json");
    document.body.appendChild(downloadAnchorNode); 
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const captureChart = () => {
    const canvas = document.querySelector('canvas');
    if (canvas) {
      canvas.toBlob(blob => {
        const a = document.createElement('a');
        document.body.appendChild(a);
        a.href = URL.createObjectURL(blob);
        a.download = 'pie_chart.png';
        a.click();
        a.remove();
      });
    }
  };

  const totalDuration = activities.reduce((acc, act) => acc + parseFloat(act.duration), 0);

  return (
    <div className="flex flex-col items-center p-4 sm:p-8 space-y-6 w-full max-w-lg mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Time Management Pie Chart</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Input 
              value={newActivity.name} 
              onChange={e => setNewActivity({...newActivity, name: e.target.value})} 
              placeholder="Activity Name" 
            />
            <Input 
              type="number" 
              value={newActivity.duration} 
              onChange={e => setNewActivity({...newActivity, duration: e.target.value})} 
              placeholder="Duration (hours)" 
            />
            <Input 
              value={newActivity.category} 
              onChange={e => setNewActivity({...newActivity, category: e.target.value})} 
              placeholder="Category (optional)" 
            />
            <Input 
              value={newActivity.description} 
              onChange={e => setNewActivity({...newActivity, description: e.target.value})} 
              placeholder="Description (optional)" 
            />
            <Button onClick={addActivity}>Add Activity</Button>
          </div>
        </CardContent>
      </Card>

      <Card className="w-full">
        <CardHeader>
          <CardTitle>Activity Pie Chart</CardTitle>
        </CardHeader>
        <CardContent className="relative">
          {totalDuration > 0 ? (
            <PieChart
              data={activities.map(act => ({ title: act.name, value: parseFloat(act.duration), color: chartConfig.colors[act.name] || '#'+(Math.random()*0xFFFFFF<<0).toString(16)}))}
              label={({ dataEntry }) => `${dataEntry.title}: ${dataEntry.value} hours`}
              labelStyle={{ fontSize: '5px', fill: '#121212' }}
            />
          ) : (
            <p className="text-center">No activities logged yet.</p>
          )}
          <div className="absolute top-0 right-0 p-2">
            <Button onClick={captureChart}>Export Chart</Button>
          </div>
        </CardContent>
        <CardFooter>
          <div className="flex justify-between items-center">
            <div>
              {activities.map(act => (
                <div key={act.id} className="flex items-center space-x-2">
                  <input 
                    type="color" 
                    value={chartConfig.colors[act.name] || '#000000'} 
                    onChange={e => updateColor(act.name, e.target.value)} 
                  />
                  <span>{act.name}</span>
                </div>
              ))}
            </div>
            <Checkbox checked={chartConfig.showCategories} onCheckedChange={toggleCategory}>Show Categories</Checkbox>
          </div>
        </CardFooter>
      </Card>

      <Card>
        <CardContent>
          <Button onClick={resetActivities} className="w-full bg-red-500 hover:bg-red-600">Reset All</Button>
          <Button onClick={exportToJson} className="mt-2 w-full">Export JSON</Button>
        </CardContent>
      </Card>

      {activities.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Logged Activities</CardTitle>
          </CardHeader>
          <CardContent>
            {activities.map(act => (
              <div key={act.id} className="flex justify-between items-center border-b pb-2 mb-2">
                <span>{act.name} - {act.duration}h</span>
                <Button onClick={() => deleteActivity(act.id)} variant="destructive">Delete</Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}