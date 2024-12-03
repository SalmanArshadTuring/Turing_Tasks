import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

function App() {
  const [donations, setDonations] = useState([]);
  const [form, setForm] = useState({ donor: '', amount: '', date: '', charity: '' });
  const [filter, setFilter] = useState({ type: 'all', value: '' });
  const [goal, setGoal] = useState({ charity: '', amount: 1000 });

  const addDonation = (e) => {
    e.preventDefault();
    setDonations([...donations, { ...form, id: Date.now() }]);
    setForm({ donor: '', amount: '', date: '', charity: '' });
  };

  const deleteDonation = (id) => {
    setDonations(donations.filter(d => d.id !== id));
  };

  const editDonation = (id, updatedDonation) => {
    setDonations(donations.map(d => d.id === id ? { ...d, ...updatedDonation } : d));
  };

  const totalDonations = donations.reduce((sum, d) => sum + parseFloat(d.amount), 0);
  const averageDonation = totalDonations / donations.length || 0;

  const topDonors = donations.reduce((acc, donation) => {
    acc[donation.donor] = (acc[donation.donor] || 0) + parseFloat(donation.amount);
    return acc;
  }, {});
  const topDonorList = Object.entries(topDonors).sort((a, b) => b[1] - a[1]).slice(0, 3);

  const filteredDonations = donations.filter(d => {
    if (filter.type === 'all') return true;
    if (filter.type === 'date' && filter.value) {
      return new Date(d.date).getTime() >= new Date(filter.value[0]).getTime() && 
             new Date(d.date).getTime() <= new Date(filter.value[1]).getTime();
    }
    return d[filter.type].toLowerCase().includes(filter.value.toLowerCase());
  });

  const exportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(donations));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "donations.json");
    document.body.appendChild(downloadAnchorNode); 
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const goalProgress = donations.filter(d => d.charity === goal.charity).reduce((sum, d) => sum + parseFloat(d.amount), 0);
  const goalMet = goalProgress >= goal.amount;

  useEffect(() => {
    if (goalMet) {
      alert(`Goal for ${goal.charity} has been met or exceeded!`);
    }
  }, [goalProgress, goalMet, goal.charity]);

  return (
    <div className="container mx-auto p-4 sm:p-8">
      <Card>
        <CardHeader>
          <CardTitle>Charity Donation Tracker</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={addDonation} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input type="text" value={form.donor} onChange={e => setForm({...form, donor: e.target.value})} placeholder="Donor Name" required />
            <Input type="number" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} placeholder="Amount" required />
            <Input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} required />
            <Input type="text" value={form.charity} onChange={e => setForm({...form, charity: e.target.value})} placeholder="Charity Name" required />
            <Button type="submit" className="col-span-2 sm:col-span-1">Add Donation</Button>
          </form>
        </CardContent>
      </Card>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Total Donations: ${totalDonations.toFixed(2)}</p>
            <p>Average Donation: ${averageDonation.toFixed(2)}</p>
            <p>Top Donors:</p>
            <ul>
              {topDonorList.map(([name, amount]) => <li key={name}>{name}: ${amount.toFixed(2)}</li>)}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Goal Setting</CardTitle>
          </CardHeader>
          <CardContent>
            <Input 
              type="text" 
              value={goal.charity} 
              onChange={e => setGoal({...goal, charity: e.target.value})} 
              placeholder="Charity for Goal" 
            />
            <Input 
              type="number" 
              value={goal.amount} 
              onChange={e => setGoal({...goal, amount: e.target.value})} 
              placeholder="Goal Amount" 
            />
            <div className="mt-2">
              <div style={{width: `${Math.min(100, (goalProgress / goal.amount) * 100)}%`, height: '20px', backgroundColor: 'green'}} className="rounded"></div>
              <p>{goalProgress.toFixed(2)} / {goal.amount} ({((goalProgress / goal.amount) * 100).toFixed(2)}%)</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">Filter</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Filter by</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => setFilter({type: 'all', value: ''})}>All</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setFilter({type: 'donor', value: ''})}>Donor</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setFilter({type: 'charity', value: ''})}>Charity</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setFilter({type: 'date', value: ['', '']})}>Date Range</DropdownMenuItem>
          {filter.type !== 'all' && (
            <Input 
              type={filter.type === 'date' ? 'date' : 'text'} 
              onChange={e => setFilter({...filter, value: filter.type === 'date' ? [e.target.value, filter.value[1]] : e.target.value})} 
              placeholder={`Enter ${filter.type}`} 
            />
          )}
          {filter.type === 'date' && (
            <Input 
              type="date" 
              onChange={e => setFilter({...filter, value: [filter.value[0], e.target.value]})} 
            />
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <Button onClick={exportData} className="mt-4">Export Data</Button>

      <div className="mt-4">
        {filteredDonations.map(d => (
          <Card key={d.id} className="mb-2">
            <CardHeader>
              <CardTitle>{d.charity}</CardTitle>
              <CardDescription>By {d.donor} on {d.date}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Amount: ${d.amount}</p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button onClick={() => deleteDonation(d.id)}>Delete</Button>
              <Button onClick={() => editDonation(d.id, prompt("Edit donation:", JSON.stringify(d)))}>Edit</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default App;