import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectItem } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { PieChart } from 'react-minimal-pie-chart';

const CATEGORIES = ['Food', 'Transportation', 'Housing', 'Entertainment', 'Savings', 'Other'];

function TransactionForm({ onAddTransaction }) {
  const [type, setType] = useState('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount) return;
    onAddTransaction({
      type, amount: parseFloat(amount), category, description, id: Date.now()
    });
    setAmount('');
    setDescription('');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Transaction</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-2 mb-2">
            <Select onValueChange={setType}>
              <SelectItem value="income">Income</SelectItem>
              <SelectItem value="expense">Expense</SelectItem>
            </Select>
            <Input 
              type="number" 
              placeholder="Amount" 
              value={amount} 
              onChange={(e) => setAmount(e.target.value)} 
              required 
            />
            <Select onValueChange={setCategory}>
              {CATEGORIES.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
            </Select>
            <Input 
              placeholder="Description (optional)" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
            />
          </div>
          <Button type="submit">Add</Button>
        </form>
      </CardContent>
    </Card>
  );
}

function TransactionList({ transactions, onDelete }) {
  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        {transactions.map((t) => (
          <div key={t.id} className="flex justify-between items-center border-b py-2">
            <span>{t.description || t.category}</span>
            <span className={t.type === 'expense' ? 'text-red-500' : 'text-green-500'}>
              {t.type === 'expense' ? '-' : '+'}${t.amount}
            </span>
            <Button variant="destructive" onClick={() => onDelete(t.id)}>Delete</Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function BudgetSummary({ transactions }) {
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const balance = totalIncome - totalExpense;

  const expenseByCategory = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});

  return (
    <Card>
      <CardHeader>
        <CardTitle>Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <p>Balance: <span className={balance >= 0 ? 'text-green-500' : 'text-red-500'}>${balance.toFixed(2)}</span></p>
          <p>Income: ${totalIncome.toFixed(2)}</p>
          <p>Expenses: ${totalExpense.toFixed(2)}</p>
        </div>
        <PieChart
          data={Object.keys(expenseByCategory).map(key => ({ title: key, value: expenseByCategory[key], color: `#${Math.floor(Math.random()*16777215).toString(16)}` }))}
          label={({ dataEntry }) => `${dataEntry.title}: ${dataEntry.value.toFixed(2)}`}
          labelStyle={{ fontSize: '5px', fill: '#121212' }}
        />
      </CardContent>
    </Card>
  );
}

export default function App() {
  const [transactions, setTransactions] = useState(() => JSON.parse(localStorage.getItem('transactions')) || []);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  const addTransaction = (transaction) => setTransactions(current => [...current, transaction]);
  const deleteTransaction = (id) => setTransactions(current => current.filter(t => t.id !== id));

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} p-4 transition-colors duration-300 sm:px-8`}>
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Budget Tracker</h1>
          <Switch checked={darkMode} onCheckedChange={() => setDarkMode(!darkMode)} />
        </div>
        <TransactionForm onAddTransaction={addTransaction} />
        <BudgetSummary transactions={transactions} />
        <TransactionList transactions={transactions} onDelete={deleteTransaction} />
      </div>
    </div>
  );
}