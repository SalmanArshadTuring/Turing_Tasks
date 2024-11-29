import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

function App() {
  const [client, setClient] = useState({ name: '', address: '' });
  const [items, setItems] = useState([{ description: '', quantity: 1, price: 0 }]);
  const [taxRate, setTaxRate] = useState(0);
  const [itemIdCounter, setItemIdCounter] = useState(1);

  const handleClientChange = (field, value) => {
    setClient(prev => ({ ...prev, [field]: value }));
  };

  const addItem = () => {
    setItems(prev => [...prev, { id: itemIdCounter, description: '', quantity: 1, price: 0 }]);
    setItemIdCounter(prev => prev + 1);
  };

  const updateItem = (id, field, value) => {
    setItems(prev => 
      prev.map(item => 
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const removeItem = (id) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const calculateSubtotal = () => 
    items.reduce((sum, item) => sum + (item.quantity * item.price), 0);

  const calculateTax = () => 
    (calculateSubtotal() * taxRate) / 100;

  const total = () => 
    calculateSubtotal() + calculateTax();

  return (
    <div className="min-h-screen bg-background p-4 sm:p-8">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Invoice Generator</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <Input 
              label="Client Name" 
              value={client.name} 
              onChange={(e) => handleClientChange('name', e.target.value)} 
            />
            <Input 
              label="Client Address" 
              value={client.address} 
              onChange={(e) => handleClientChange('address', e.target.value)} 
            />
            <Label>Tax Rate (%)</Label>
            <Input 
              type="number" 
              value={taxRate} 
              onChange={(e) => setTaxRate(Number(e.target.value))} 
            />
            <Button onClick={addItem}>Add Item</Button>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell><Input value={item.description} onChange={(e) => updateItem(item.id, 'description', e.target.value)} /></TableCell>
                    <TableCell><Input type="number" value={item.quantity} onChange={(e) => updateItem(item.id, 'quantity', Number(e.target.value))} /></TableCell>
                    <TableCell><Input type="number" value={item.price} onChange={(e) => updateItem(item.id, 'price', Number(e.target.value))} /></TableCell>
                    <TableCell className="text-right"><Button variant="destructive" onClick={() => removeItem(item.id)}>Delete</Button></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter>
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>${calculateSubtotal().toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax:</span>
            <span>${calculateTax().toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold">
            <span>Total:</span>
            <span>${total().toFixed(2)}</span>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

export default App;