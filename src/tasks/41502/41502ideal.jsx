import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const categories = [
  "Food", "Transportation", "Housing", "Utilities", "Entertainment", "Healthcare", "Other"
];

function TransactionForm({ addTransaction }) {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("expense");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || !category) return;
    addTransaction({
      id: Date.now(),
      amount: type === "income" ? parseFloat(amount) : -parseFloat(amount),
      category,
      description,
      date: new Date().toISOString(),
    });
    setAmount("");
    setCategory("");
    setDescription("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex space-x-2">
        <Input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount"
          required
        />
        <Select value={category} onValueChange={setCategory} required>
          <SelectTrigger>
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Input
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description (optional)"
      />
      <div className="flex items-center space-x-2">
        <Switch
          id="transaction-type"
          checked={type === "income"}
          onCheckedChange={(checked) => setType(checked ? "income" : "expense")}
        />
        <Label htmlFor="transaction-type">Income</Label>
      </div>
      <Button type="submit">Add Transaction</Button>
    </form>
  );
}

function TransactionList({ transactions, filter }) {
  const filteredTransactions = transactions.filter((t) => 
    filter === "all" || (filter === "income" ? t.amount > 0 : t.amount < 0)
  );

  return (
    <div className="space-y-2">
      {filteredTransactions.map((t) => (
        <Card key={t.id}>
          <CardContent className="flex justify-between items-center p-4">
            <div>
              <p className="font-bold">{t.category}</p>
              <p className="text-sm text-gray-500">{t.description}</p>
            </div>
            <p className={`font-bold ${t.amount > 0 ? "text-green-500" : "text-red-500"}`}>
              ${Math.abs(t.amount).toFixed(2)}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function Chart({ transactions }) {
  const categoryTotals = categories.reduce((acc, category) => {
    const total = transactions
      .filter((t) => t.category === category && t.amount < 0)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    acc[category] = total;
    return acc;
  }, {});

  const totalExpenses = Object.values(categoryTotals).reduce((a, b) => a + b, 0) || 1;

  return (
    <div className="flex flex-wrap justify-center">
      {Object.entries(categoryTotals).map(([category, amount]) => (
        <div key={category} className="flex flex-col items-center m-2">
          <div
            className="w-16 bg-blue-500"
            style={{ height: `${(amount / totalExpenses) * 100}px` }}
          ></div>
          <p className="text-xs mt-1">{category}</p>
        </div>
      ))}
    </div>
  );
}

export default function App() {
  const [transactions, setTransactions] = useState([]);
  const [filter, setFilter] = useState("all");
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedTransactions = JSON.parse(localStorage.getItem("transactions") || "[]");
    setTransactions(savedTransactions);
  }, []);

  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);

  const addTransaction = (transaction) => {
    setTransactions([...transactions, transaction]);
  };

  const balance = transactions.reduce((acc, t) => acc + t.amount, 0);

  return (
    <div className={`min-h-screen p-4 ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100"}`}>
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Budget Tracker</h1>
          <Switch
            checked={darkMode}
            onCheckedChange={setDarkMode}
            className="ml-4"
          />
        </div>

        <Card className={darkMode ? "bg-gray-800" : ""}>
          <CardHeader>
            <CardTitle>Add Transaction</CardTitle>
          </CardHeader>
          <CardContent>
            <TransactionForm addTransaction={addTransaction} />
          </CardContent>
        </Card>

        <Card className={`mt-4 ${darkMode ? "bg-gray-800" : ""}`}>
          <CardHeader>
            <CardTitle>Balance: ${balance.toFixed(2)}</CardTitle>
          </CardHeader>
          <CardContent>
            <Chart transactions={transactions} />
          </CardContent>
        </Card>

        <Card className={`mt-4 ${darkMode ? "bg-gray-800" : ""}`}>
          <CardHeader>
            <CardTitle>Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="income">Income</SelectItem>
                <SelectItem value="expense">Expense</SelectItem>
              </SelectContent>
            </Select>
            <TransactionList transactions={transactions} filter={filter} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
