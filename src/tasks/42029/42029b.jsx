import React, { useState, useEffect } from 'react';
import { 
  Card, CardContent, CardHeader, CardTitle,
  
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {Alert} from "@/components/ui/alert"
// Button, Input, Label, Alert

const metrics = ['weight', 'heartRate', 'steps', 'sleep'];

const MetricCard = ({ metric, data, onAdd, onEdit, onDelete }) => {
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState('');
  const [editDate, setEditDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editing) {
      onEdit(metric, editValue, editDate);
    } else {
      onAdd(metric, editValue, editDate);
    }
    setEditing(false);
  };

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>{metric}</CardTitle>
      </CardHeader>
      <CardContent>
        {editing ? (
          <form onSubmit={handleSubmit}>
            <Input type="number" value={editValue} onChange={(e) => setEditValue(e.target.value)} placeholder="Value" />
            <Input type="date" value={editDate} onChange={(e) => setEditDate(e.target.value)} className="mt-2" />
            <Button type="submit" className="mt-2">Save</Button>
          </form>
        ) : (
          <Button onClick={() => setEditing(true)}>Add Data</Button>
        )}
        {data.map((entry, idx) => (
          <div key={idx} className="flex justify-between items-center mt-2">
            <span>{entry.date}: {entry.value}</span>
            <Button variant="destructive" onClick={() => onDelete(metric, idx)}>Delete</Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

const Chart = ({ data }) => (
  <div style={{ height: '200px', background: '#f0f0f0', margin: '10px 0', borderRadius: '4px' }}>
    {/* Placeholder for chart */}
    <div style={{ textAlign: 'center', paddingTop: '90px' }}>Chart Placeholder</div>
  </div>
);

const GoalIndicator = ({ current, goal }) => {
  const progress = Math.min((current / goal) * 100, 100);
  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
      <div className={`bg-blue-600 h-2.5 rounded-full`} style={{ width: `${progress}%` }}></div>
    </div>
  );
};

export default function App() {
  const [healthData, setHealthData] = useState(() => {
    const savedData = localStorage.getItem('healthData');
    return savedData ? JSON.parse(savedData) : metrics.reduce((acc, metric) => ({ ...acc, [metric]: [] }), {});
  });
  const [goals, setGoals] = useState({ weight: 70, heartRate: 60, steps: 10000, sleep: 8 });

  useEffect(() => {
    localStorage.setItem('healthData', JSON.stringify(healthData));
  }, [healthData]);

  const addData = (metric, value, date) => {
    setHealthData(prev => ({
      ...prev,
      [metric]: [...prev[metric], { value, date }]
    }));
  };

  const editData = (metric, newValue, date, index) => {
    setHealthData(prev => {
      const updated = [...prev[metric]];
      updated[index] = { value: newValue, date };
      return { ...prev, [metric]: updated };
    });
  };

  const deleteData = (metric, index) => {
    setHealthData(prev => ({
      ...prev,
      [metric]: prev[metric].filter((_, i) => i !== index)
    }));
  };

  const exportData = () => {
    const element = document.createElement('a');
    const file = new Blob([JSON.stringify(healthData, null, 2)], {type: 'text/json'});
    element.href = URL.createObjectURL(file);
    element.download = "health_data.json";
    document.body.appendChild(element);
    element.click();
  };

  return (
    <div className="container mx-auto p-4 sm:p-6">
      <h1 className="text-2xl font-bold mb-4">Health Statistics Tracker</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {metrics.map(metric => (
          <MetricCard 
            key={metric} 
            metric={metric} 
            data={healthData[metric]} 
            onAdd={addData} 
            onEdit={(value, date) => editData(metric, value, date, healthData[metric].length - 1)} 
            onDelete={deleteData} 
          />
        ))}
      </div>
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Goals</CardTitle>
        </CardHeader>
        <CardContent>
          {metrics.map(metric => {
            const current = healthData[metric].reduce((sum, entry) => sum + parseFloat(entry.value), 0);
            return (
              <div key={metric} className="mb-2">
                <Label>{metric}</Label>
                <Input type="number" value={goals[metric]} onChange={e => setGoals({ ...goals, [metric]: e.target.value })} />
                <GoalIndicator current={current} goal={goals[metric]} />
              </div>
            );
          })}
        </CardContent>
      </Card>
      <Button onClick={exportData} className="mt-4">Export Data</Button>
      <Alert className="mt-4">
        Remember to log your health metrics daily!
      </Alert>
    </div>
  );
}