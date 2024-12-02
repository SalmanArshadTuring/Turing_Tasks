import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const metrics = ["Weight", "Heart Rate", "Steps", "Sleep Hours"];

export default function App() {
  const [entries, setEntries] = useState([]);
  const [goals, setGoals] = useState({});
  const [currentMetric, setCurrentMetric] = useState(metrics[0]);
  const [currentValue, setCurrentValue] = useState("");
  const [editIndex, setEditIndex] = useState(-1);

  useEffect(() => {
    const storedEntries = localStorage.getItem("healthEntries");
    if (storedEntries) setEntries(JSON.parse(storedEntries));

    const storedGoals = localStorage.getItem("healthGoals");
    if (storedGoals) setGoals(JSON.parse(storedGoals));

    checkMissingEntries();
  }, []);

  useEffect(() => {
    localStorage.setItem("healthEntries", JSON.stringify(entries));
  }, [entries]);

  useEffect(() => {
    localStorage.setItem("healthGoals", JSON.stringify(goals));
  }, [goals]);

  const checkMissingEntries = () => {
    const today = new Date().toDateString();
    const hasTodayEntry = entries.some(entry => new Date(entry.timestamp).toDateString() === today);
    if (!hasTodayEntry) {
      alert("Don't forget to log your health metrics for today!");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editIndex === -1) {
      setEntries([...entries, { metric: currentMetric, value: currentValue, timestamp: new Date().toISOString() }]);
    } else {
      const updatedEntries = [...entries];
      updatedEntries[editIndex] = { ...updatedEntries[editIndex], value: currentValue };
      setEntries(updatedEntries);
      setEditIndex(-1);
    }
    setCurrentValue("");
  };

  const handleDelete = (index) => {
    setEntries(entries.filter((_, i) => i !== index));
  };

  const handleEdit = (index) => {
    setCurrentMetric(entries[index].metric);
    setCurrentValue(entries[index].value);
    setEditIndex(index);
  };

  const handleSetGoal = () => {
    const goal = prompt(`Set a goal for ${currentMetric}:`);
    if (goal) setGoals({ ...goals, [currentMetric]: goal });
  };

  const calculateProgress = (metric) => {
    const goal = goals[metric];
    if (!goal) return 0;
    const latestEntry = entries.filter(entry => entry.metric === metric).pop();
    if (!latestEntry) return 0;
    return Math.min((latestEntry.value / goal) * 100, 100);
  };

  const exportData = () => {
    const dataStr = JSON.stringify(entries);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    const exportFileDefaultName = 'health_data.json';
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const renderChart = (metric) => {
    const metricEntries = entries.filter(entry => entry.metric === metric).slice(-7);
    const maxValue = Math.max(...metricEntries.map(entry => entry.value));

    return (
      <div className="flex h-40 items-end space-x-2">
        {metricEntries.map((entry, index) => (
          <div
            key={index}
            className="bg-blue-500 w-8"
            style={{ height: `${(entry.value / maxValue) * 100}%` }}
            title={`${entry.value} on ${new Date(entry.timestamp).toLocaleDateString()}`}
          ></div>
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Health Statistics Tracker</h1>
      
      <form onSubmit={handleSubmit} className="mb-4">
        <Select value={currentMetric} onValueChange={setCurrentMetric}>
          <SelectTrigger className="w-full mb-2">
            <SelectValue placeholder="Select Metric" />
          </SelectTrigger>
          <SelectContent>
            {metrics.map(metric => (
              <SelectItem key={metric} value={metric}>{metric}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          type="number"
          value={currentValue}
          onChange={(e) => setCurrentValue(e.target.value)}
          placeholder="Enter value"
          className="mb-2"
        />
        <Button type="submit">{editIndex === -1 ? "Add Entry" : "Update Entry"}</Button>
      </form>

      <Button onClick={handleSetGoal} className="mb-4">Set Goal</Button>
      <Button onClick={exportData} className="mb-4 ml-2">Export Data</Button>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {metrics.map(metric => (
          <Card key={metric}>
            <CardHeader>
              <CardTitle>{metric}</CardTitle>
            </CardHeader>
            <CardContent>
              {renderChart(metric)}
              <div className="mt-2">
                Goal Progress: {calculateProgress(metric).toFixed(0)}%
                <div className="bg-gray-200 h-2 rounded-full mt-1">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: `${calculateProgress(metric)}%` }}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <h2 className="text-2xl font-bold mt-8 mb-4">Recent Entries</h2>
      {entries.slice(-10).reverse().map((entry, index) => (
        <Alert key={index} className="mb-2">
          <AlertTitle>{entry.metric}</AlertTitle>
          <AlertDescription>
            {entry.value} on {new Date(entry.timestamp).toLocaleString()}
            <Button onClick={() => handleEdit(entries.length - 1 - index)} className="ml-2">Edit</Button>
            <Button onClick={() => handleDelete(entries.length - 1 - index)} className="ml-2">Delete</Button>
          </AlertDescription>
        </Alert>
      ))}
    </div>
  );
}