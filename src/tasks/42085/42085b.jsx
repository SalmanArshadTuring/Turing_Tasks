import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";

const initialDonations = [
  { id: 1, donor: "John Doe", amount: 100, date: "2023-01-01", charity: "Red Cross" },
  { id: 2, donor: "Jane Smith", amount: 200, date: "2023-02-15", charity: "UNICEF" },
  { id: 3, donor: "Bob Johnson", amount: 150, date: "2023-03-10", charity: "WWF" },
];

const initialGoals = {
  "Red Cross": 1000,
  "UNICEF": 2000,
  "WWF": 1500,
};

function DonationForm({ addDonation, editDonation, donationToEdit, setDonationToEdit }) {
  const [donor, setDonor] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [charity, setCharity] = useState("");

  useEffect(() => {
    if (donationToEdit) {
      setDonor(donationToEdit.donor);
      setAmount(donationToEdit.amount);
      setDate(donationToEdit.date);
      setCharity(donationToEdit.charity);
    }
  }, [donationToEdit]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (donationToEdit) {
      editDonation({ ...donationToEdit, donor, amount: Number(amount), date, charity });
      setDonationToEdit(null);
    } else {
      addDonation({ donor, amount: Number(amount), date, charity });
    }
    setDonor("");
    setAmount("");
    setDate("");
    setCharity("");
  };

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>{donationToEdit ? "Edit Donation" : "Add Donation"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="donor">Donor Name</Label>
            <Input id="donor" value={donor} onChange={(e) => setDonor(e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="amount">Amount</Label>
            <Input id="amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="date">Date</Label>
            <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="charity">Charity</Label>
            <Input id="charity" value={charity} onChange={(e) => setCharity(e.target.value)} required />
          </div>
          <Button type="submit">{donationToEdit ? "Update" : "Add"} Donation</Button>
        </form>
      </CardContent>
    </Card>
  );
}

function DonationList({ donations, deleteDonation, setDonationToEdit, filter }) {
  const filteredDonations = donations.filter((donation) => {
    return (
      donation.donor.toLowerCase().includes(filter.toLowerCase()) ||
      donation.charity.toLowerCase().includes(filter.toLowerCase()) ||
      donation.date.includes(filter)
    );
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Donations</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {filteredDonations.map((donation) => (
            <li key={donation.id} className="flex justify-between items-center">
              <span>{donation.donor} - ${donation.amount} to {donation.charity} on {donation.date}</span>
              <div>
                <Button onClick={() => setDonationToEdit(donation)} className="mr-2">Edit</Button>
                <Button onClick={() => deleteDonation(donation.id)} variant="destructive">Delete</Button>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

function DonationSummary({ donations }) {
  const totalDonations = donations.reduce((sum, donation) => sum + donation.amount, 0);
  const averageDonation = totalDonations / donations.length || 0;
  const topDonors = [...donations]
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 3)
    .map((donation) => donation.donor);

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>Donation Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Total Donations: ${totalDonations}</p>
        <p>Average Donation: ${averageDonation.toFixed(2)}</p>
        <p>Top Donors: {topDonors.join(", ")}</p>
      </CardContent>
    </Card>
  );
}

function DonationChart({ donations }) {
  const chartData = donations.reduce((acc, donation) => {
    acc[donation.date] = (acc[donation.date] || 0) + donation.amount;
    return acc;
  }, {});

  const maxAmount = Math.max(...Object.values(chartData));

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>Donation Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex h-40 items-end space-x-2">
          {Object.entries(chartData).map(([date, amount]) => (
            <div key={date} className="flex flex-col items-center">
              <div
                className="bg-blue-500 w-8"
                style={{ height: `${(amount / maxAmount) * 100}%` }}
              ></div>
              <span className="text-xs mt-1">{date}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function CharityGoals({ donations, goals }) {
  const charityTotals = donations.reduce((acc, donation) => {
    acc[donation.charity] = (acc[donation.charity] || 0) + donation.amount;
    return acc;
  }, {});

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>Charity Goals</CardTitle>
      </CardHeader>
      <CardContent>
        {Object.entries(goals).map(([charity, goal]) => {
          const total = charityTotals[charity] || 0;
          const progress = (total / goal) * 100;
          return (
            <div key={charity} className="mb-4">
              <Label>{charity}</Label>
              <Progress value={progress} className="mt-2" />
              <p className="text-sm mt-1">
                ${total} / ${goal} ({progress.toFixed(1)}%)
              </p>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

export default function App() {
  const [donations, setDonations] = useState(initialDonations);
  const [donationToEdit, setDonationToEdit] = useState(null);
  const [filter, setFilter] = useState("");
  const [goals, setGoals] = useState(initialGoals);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const newAlerts = [];
    Object.entries(goals).forEach(([charity, goal]) => {
      const total = donations
        .filter((d) => d.charity === charity)
        .reduce((sum, d) => sum + d.amount, 0);
      if (total >= goal && !alerts.some((a) => a.charity === charity)) {
        newAlerts.push({ charity, message: `Goal reached for ${charity}!` });
      }
    });
    setAlerts([...alerts, ...newAlerts]);
  }, [donations, goals]);

  const addDonation = (donation) => {
    setDonations([...donations, { ...donation, id: Date.now() }]);
  };

  const editDonation = (updatedDonation) => {
    setDonations(donations.map((d) => (d.id === updatedDonation.id ? updatedDonation : d)));
  };

  const deleteDonation = (id) => {
    setDonations(donations.filter((d) => d.id !== id));
  };

  const exportData = () => {
    const dataStr = JSON.stringify(donations);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    const exportFileDefaultName = "donations.json";
    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Charity Donation Tracker</h1>
      {alerts.map((alert, index) => (
        <Alert key={index} className="mb-4">
          <AlertTitle>Goal Reached!</AlertTitle>
          <AlertDescription>{alert.message}</AlertDescription>
        </Alert>
      ))}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <DonationForm
            addDonation={addDonation}
            editDonation={editDonation}
            donationToEdit={donationToEdit}
            setDonationToEdit={setDonationToEdit}
          />
          <DonationSummary donations={donations} />
          <CharityGoals donations={donations} goals={goals} />
        </div>
        <div>
          <Card className="mb-4">
            <CardHeader>
              <CardTitle>Filter Donations</CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                placeholder="Filter by donor, charity, or date"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              />
            </CardContent>
          </Card>
          <DonationList
            donations={donations}
            deleteDonation={deleteDonation}
            setDonationToEdit={setDonationToEdit}
            filter={filter}
          />
          <DonationChart donations={donations} />
          <Button onClick={exportData} className="mt-4">Export Data</Button>
        </div>
      </div>
    </div>
  );
}