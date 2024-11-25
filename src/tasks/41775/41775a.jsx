import React, { useState, useEffect } from 'react';
import { 
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,
} from "@/components/ui/card";
// Button, Select, SelectItem, Input, Label
import { 
    Button
  } from "@/components/ui/button";
  import { 
    Select
  } from "@/components/ui/select";
//   import { 
//     Input
//   } from "@/components/ui/input";
//   import { 
//     Label
//   } from "@/components/ui/label";

import { Bar } from 'react-chartjs-2';

const projects = ['Web Development', 'Graphic Design', 'Consulting', 'Marketing'];

function TimeEntryForm({ onAddTime }) {
  const [time, setTime] = useState('');
  const [project, setProject] = useState(projects[0]);
  const [isBillable, setIsBillable] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!time) return;
    onAddTime({ time: parseFloat(time), project, isBillable });
    setTime('');
  };

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>Log Time</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-2 mb-2">
            <Label htmlFor="time">Hours</Label>
            <Input id="time" type="number" step="0.1" value={time} onChange={e => setTime(e.target.value)} required />
          </div>
          <div className="grid gap-2 mb-2">
            <Label htmlFor="project">Project</Label>
            <Select id="project" value={project} onChange={e => setProject(e.target.value)}>
              {projects.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
            </Select>
          </div>
          <div className="flex items-center mb-2">
            <input type="checkbox" id="billable" checked={isBillable} onChange={() => setIsBillable(!isBillable)} className="mr-2" />
            <Label htmlFor="billable">Billable</Label>
          </div>
          <Button type="submit">Log Time</Button>
        </form>
      </CardContent>
    </Card>
  );
}

function TimeLog({ entries }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Time Log</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="list-none p-0">
          {entries.map((entry, index) => (
            <li key={index} className="flex justify-between py-1 border-b last:border-b-0">
              <span>{entry.project}</span>
              <span>{entry.time} hours ({entry.isBillable ? 'Billable' : 'Non-Billable'})</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

function ReportChart({ data }) {
  const chartData = {
    labels: projects,
    datasets: [
      {
        label: 'Billable Hours',
        data: data.billable,
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
      },
      {
        label: 'Non-Billable Hours',
        data: data.nonBillable,
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      }
    ],
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Time Report</CardTitle>
      </CardHeader>
      <CardContent>
        <Bar data={chartData} options={{ scales: { y: { beginAtZero: true } } }} />
      </CardContent>
    </Card>
  );
}

export default function App() {
  const [entries, setEntries] = useState([]);
  const [report, setReport] = useState(null);

  useEffect(() => {
    if (entries.length) {
      const billable = new Array(projects.length).fill(0);
      const nonBillable = new Array(projects.length).fill(0);
      entries.forEach(entry => {
        const index = projects.indexOf(entry.project);
        if (entry.isBillable) billable[index] += entry.time;
        else nonBillable[index] += entry.time;
      });
      setReport({ billable, nonBillable });
    }
  }, [entries]);

  const addTimeEntry = (entry) => {
    setEntries([...entries, entry]);
  };

  return (
    <div className="container mx-auto p-4 sm:max-w-lg">
      <TimeEntryForm onAddTime={addTimeEntry} />
      <TimeLog entries={entries} />
      {report && (
        <>
          <ReportChart data={report} />
          <Card className="mt-4">
            <CardFooter>
              <Button onClick={() => console.log('Generate PDF Report')}>Generate PDF Report</Button>
            </CardFooter>
          </Card>
        </>
      )}
    </div>
  );
}