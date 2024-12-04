import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const colors = [
  "bg-red-500",
  "bg-blue-500",
  "bg-green-500",
  "bg-yellow-500",
  "bg-purple-500",
  "bg-pink-500",
  "bg-indigo-500",
  "bg-orange-500",
];

function ActivityForm({ addActivity }) {
  const [name, setName] = useState("");
  const [duration, setDuration] = useState("");
  const [category, setCategory] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name && duration) {
      addActivity({ name, duration: parseFloat(duration), category });
      setName("");
      setDuration("");
      setCategory("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        placeholder="Activity name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <Input
        type="number"
        placeholder="Duration (hours)"
        value={duration}
        onChange={(e) => setDuration(e.target.value)}
        step="0.25"
        min="0"
        required
      />
      <Input
        placeholder="Category (optional)"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      />
      <Button type="submit">Add Activity</Button>
    </form>
  );
}

function PieChart({ activities, showCategories }) {
  const total = activities.reduce((sum, activity) => sum + activity.duration, 0);

  return (
    <div className="relative w-64 h-64">
      {activities.map((activity, index) => {
        const percentage = (activity.duration / total) * 100;
        const rotate = index > 0 ? activities.slice(0, index).reduce((sum, a) => sum + (a.duration / total) * 360, 0) : 0;
        return (
          <div
            key={activity.name}
            className={`absolute inset-0 ${activity.color}`}
            style={{
              clipPath: `conic-gradient(from ${rotate}deg, currentColor ${percentage}%, transparent 0)`,
            }}
          >
            {showCategories && activity.category && (
              <div className="absolute inset-0 flex items-center justify-center text-white text-xs">
                {activity.category}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function ActivityList({ activities, deleteActivity, updateActivity }) {
  return (
    <ul className="space-y-2">
      {activities.map((activity, index) => (
        <li key={index} className="flex items-center justify-between">
          <span>{activity.name} ({activity.duration}h)</span>
          <div className="flex items-center space-x-2">
            <Select
              value={activity.color}
              onValueChange={(color) => updateActivity(index, { ...activity, color })}
            >
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Color" />
              </SelectTrigger>
              <SelectContent>
                {colors.map((color) => (
                  <SelectItem key={color} value={color}>
                    <div className={`w-4 h-4 rounded-full ${color}`}></div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={() => deleteActivity(index)} variant="destructive" size="sm">
              Delete
            </Button>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default function App() {
  const [activities, setActivities] = useState([]);
  const [showCategories, setShowCategories] = useState(false);

  useEffect(() => {
    const savedActivities = localStorage.getItem("activities");
    if (savedActivities) {
      setActivities(JSON.parse(savedActivities));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("activities", JSON.stringify(activities));
  }, [activities]);

  const addActivity = (activity) => {
    setActivities([...activities, { ...activity, color: colors[activities.length % colors.length] }]);
  };

  const deleteActivity = (index) => {
    setActivities(activities.filter((_, i) => i !== index));
  };

  const updateActivity = (index, updatedActivity) => {
    setActivities(activities.map((activity, i) => (i === index ? updatedActivity : activity)));
  };

  const resetActivities = () => {
    setActivities([]);
  };

  const exportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(activities));
    const downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "activities.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const exportImage = () => {
    const svg = document.querySelector(".pie-chart svg");
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = "pie-chart.png";
      downloadLink.href = pngFile;
      downloadLink.click();
    };
    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-bold mb-6">Time Management Pie Chart</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Log Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ActivityForm addActivity={addActivity} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <ActivityList
              activities={activities}
              deleteActivity={deleteActivity}
              updateActivity={updateActivity}
            />
          </CardContent>
        </Card>
      </div>
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Pie Chart</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <PieChart activities={activities} showCategories={showCategories} />
          <div className="mt-4 flex items-center space-x-2">
            <Switch
              id="show-categories"
              checked={showCategories}
              onCheckedChange={setShowCategories}
            />
            <Label htmlFor="show-categories">Show Categories</Label>
          </div>
        </CardContent>
      </Card>
      <div className="mt-6 flex flex-wrap gap-4">
        <Button onClick={resetActivities}>Reset Activities</Button>
        <Button onClick={exportJSON}>Export JSON</Button>
        <Button onClick={exportImage}>Export Image</Button>
      </div>
    </div>
  );
}