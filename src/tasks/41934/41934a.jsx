import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

function App() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: '', category: 'tech', priority: 'low', price: '', purchased: false });

  const addItem = () => {
    if (newItem.name && newItem.price) {
      setItems([...items, { ...newItem, id: Date.now() }]);
      setNewItem({ name: '', category: 'tech', priority: 'low', price: '', purchased: false });
    }
  };

  const removeItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  const togglePurchased = (id) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, purchased: !item.purchased } : item
    ));
  };

  const totalCost = items.reduce((sum, item) => item.purchased ? sum + parseFloat(item.price) : sum, 0);

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Wishlist Organizer</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 gap-4">
            <Input 
              value={newItem.name} 
              onChange={e => setNewItem({...newItem, name: e.target.value})} 
              placeholder="Item Name" 
            />
            <Input 
              value={newItem.price} 
              onChange={e => setNewItem({...newItem, price: e.target.value})} 
              placeholder="Price" 
              type="number" 
            />
            <Select onValueChange={value => setNewItem({...newItem, category: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tech">Tech</SelectItem>
                <SelectItem value="clothing">Clothing</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            <Select onValueChange={value => setNewItem({...newItem, priority: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button className="mt-4 w-full sm:w-auto" onClick={addItem}>Add Item</Button>
        </CardContent>
      </Card>

      <div className="mt-4 space-y-4">
        {items.map(item => (
          <Card key={item.id}>
            <CardHeader>
              <CardTitle>{item.name}</CardTitle>
              <CardDescription>
                {item.category} - ${item.price}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Priority: {item.priority}</p>
              <Checkbox 
                checked={item.purchased} 
                onCheckedChange={() => togglePurchased(item.id)}
                className="mt-2"
              >Purchased</Checkbox>
            </CardContent>
            <CardFooter>
              <Button onClick={() => removeItem(item.id)} variant="destructive">Remove</Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="mt-4 text-right">
        <p>Total Cost of Purchased Items: ${totalCost.toFixed(2)}</p>
      </div>
    </div>
  );
}

export default App;