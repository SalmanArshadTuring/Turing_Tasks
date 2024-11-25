import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const projects = ["Project A", "Project B", "Project C"];

function TimeEntryForm({ onAddEntry }) {
  const [project, setProject] = useState(projects[0]);
  const [hours, setHours] = useState("");
  const [isBillable, setIsBillable] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (hours && project) {
      onAddEntry({ project, hours: parseFloat(hours), isBillable, date: new Date() });
      setHours("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Select value={project} onValueChange={setProject}>
        <SelectTrigger>
          <SelectValue placeholder="Select project" />
        </SelectTrigger>
        <SelectContent>
          {projects.map((p) => (
            <SelectItem key={p} value={p}>
              {p}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Input
        type="number"
        value={hours}
        onChange={(e) => setHours(e.target.value)}
        placeholder="Hours worked"
        step="0.5"
        min="0"
      />
      <div className="flex items-center space-x-2">
        <Switch id="billable" checked={isBillable} onCheckedChange={setIsBillable} />
        <Label htmlFor="billable">Billable</Label>
      </div>
      <Button type="submit">Log Time</Button>
    </form>
  );
}

function TimeLog({ entries }) {
  return (
    <div className="space-y-2">
      {entries.map((entry, index) => (
        <Card key={index}>
          <CardContent className="p-4">
            <p className="font-semibold">{entry.project}</p>
            <p>{entry.hours} hours - {entry.isBillable ? "Billable" : "Non-billable"}</p>
            <p className="text-sm text-gray-500">{entry.date.toLocaleString()}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function TimeChart({ entries }) {
  const totalHours = entries.reduce((sum, entry) => sum + entry.hours, 0);
  const billableHours = entries.filter(e => e.isBillable).reduce((sum, entry) => sum + entry.hours, 0);
  const nonBillableHours = totalHours - billableHours;

  return (
    <div className="flex h-4 bg-gray-200 rounded-full overflow-hidden">
      <div
        className="bg-green-500"
        style={{ width: `${(billableHours / totalHours) * 100}%` }}
      />
      <div
        className="bg-red-500"
        style={{ width: `${(nonBillableHours / totalHours) * 100}%` }}
      />
    </div>
  );
}

function TimeReport({ entries }) {
  const projectSummary = entries.reduce((acc, entry) => {
    if (!acc[entry.project]) {
      acc[entry.project] = { billable: 0, nonBillable: 0 };
    }
    if (entry.isBillable) {
      acc[entry.project].billable += entry.hours;
    } else {
      acc[entry.project].nonBillable += entry.hours;
    }
    return acc;
  }, {});

  return (
    <Card>
      <CardHeader>
        <CardTitle>Time Report</CardTitle>
      </CardHeader>
      <CardContent>
        {Object.entries(projectSummary).map(([project, hours]) => (
          <div key={project} className="mb-4">
            <h3 className="font-semibold">{project}</h3>
            <p>Billable: {hours.billable.toFixed(2)} hours</p>
            <p>Non-billable: {hours.nonBillable.toFixed(2)} hours</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export default function App() {
  const [entries, setEntries] = useState([]);
  const [showReport, setShowReport] = useState(false);

  useEffect(() => {
    const storedEntries = localStorage.getItem("timeEntries");
    if (storedEntries) {
      setEntries(JSON.parse(storedEntries).map(e => ({ ...e, date: new Date(e.date) })));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("timeEntries", JSON.stringify(entries));
  }, [entries]);

  const addEntry = (entry) => {
    setEntries([...entries, entry]);
  };

  const generateReport = () => {
    setShowReport(true);
  };

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-2xl font-bold mb-4">Freelancer Time Tracker</h1>
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Log Time</CardTitle>
        </CardHeader>
        <CardContent>
          <TimeEntryForm onAddEntry={addEntry} />
        </CardContent>
      </Card>
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Time Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <TimeChart entries={entries} />
        </CardContent>
      </Card>
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Recent Entries</CardTitle>
        </CardHeader>
        <CardContent>
          <TimeLog entries={entries.slice(-5).reverse()} />
        </CardContent>
      </Card>
      <Button onClick={generateReport} className="w-full mb-4">Generate Report</Button>
      {showReport && <TimeReport entries={entries} />}
    </div>
  );
}