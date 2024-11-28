import React, { useState, useEffect } from 'react';
import {  Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectItem } from "@/components/ui/select";

// Mock data for stores
const stores = [
  { id: 1, name: 'SuperMart', location: 'Downtown', logo: 'logo1.png' },
  { id: 2, name: 'GreenGrocers', location: 'Uptown', logo: 'logo2.png' },
];

function GroceryList() {
  const [lists, setLists] = useState([]);
  const [currentList, setCurrentList] = useState({ name: '', description: '', items: [] });
  const [selectedStore, setSelectedStore] = useState(stores[0].id);

  const addItem = () => {
    setCurrentList(prev => ({
      ...prev,
      items: [...prev.items, { name: '', quantity: 1, note: '', priority: 'Medium', prices: {}, purchased: false }]
    }));
  };

  const updateItem = (index, field, value) => {
    const updatedItems = [...currentList.items];
    if (field === 'price') {
      updatedItems[index].prices[selectedStore] = value;
    } else {
      updatedItems[index][field] = value;
    }
    setCurrentList({ ...currentList, items: updatedItems });
  };

  const togglePurchased = (index) => {
    const items = [...currentList.items];
    items[index].purchased = !items[index].purchased;
    setCurrentList({ ...currentList, items });
  };

  const saveList = () => {
    setLists([...lists, currentList]);
    setCurrentList({ name: '', description: '', items: [] });
  };

  const bestPrice = (prices) => {
    const priceEntries = Object.entries(prices).map(([storeId, price]) => [stores.find(s => s.id == storeId), price]);
    return priceEntries.reduce((min, current) => (!min.price || current[1] < min.price ? { store: current[0], price: current[1] } : min), { price: null });
  };

  return (
    <div className="container mx-auto p-4 sm:p-6">
      <Card>
        <CardHeader>
          <CardTitle>Create New List</CardTitle>
        </CardHeader>
        <CardContent>
          <Input 
            value={currentList.name} 
            onChange={(e) => setCurrentList({...currentList, name: e.target.value})} 
            placeholder="List Name" 
          />
          <Input 
            className="mt-2" 
            value={currentList.description} 
            onChange={(e) => setCurrentList({...currentList, description: e.target.value})} 
            placeholder="Description" 
          />
          {currentList.items.map((item, index) => (
            <div key={index} className="mt-4">
              <Input 
                value={item.name} 
                onChange={(e) => updateItem(index, 'name', e.target.value)} 
                placeholder="Item Name" 
              />
              <Input 
                type="number" 
                className="mt-2" 
                value={item.quantity} 
                onChange={(e) => updateItem(index, 'quantity', e.target.value)} 
                placeholder="Quantity" 
              />
              <Input 
                className="mt-2" 
                value={item.note} 
                onChange={(e) => updateItem(index, 'note', e.target.value)} 
                placeholder="Note" 
              />
              <Select 
                value={item.priority} 
                onValueChange={(value) => updateItem(index, 'priority', value)}
              >
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
              </Select>
              <Input 
                className="mt-2" 
                type="number" 
                placeholder={`Price at ${stores.find(s => s.id === selectedStore)?.name}`}
                onChange={(e) => updateItem(index, 'price', e.target.value)} 
              />
              <Button onClick={() => togglePurchased(index)} className="mt-2">
                {item.purchased ? 'Unmark as Purchased' : 'Mark as Purchased'}
              </Button>
            </div>
          ))}
          <Button onClick={addItem} className="mt-4">Add Item</Button>
          <Button onClick={saveList} className="mt-2">Save List</Button>
        </CardContent>
      </Card>

      <div className="mt-6">
        <Select onValueChange={setSelectedStore}>
          {stores.map(store => <SelectItem key={store.id} value={store.id}>{store.name}</SelectItem>)}
        </Select>
        {lists.map((list, idx) => (
          <Card key={idx} className="mt-4">
            <CardHeader>
              <CardTitle>{list.name}</CardTitle>
            </CardHeader>
            <CardContent>
              {list.items.map((item, i) => (
                <div key={i} className="border-b pb-2 mb-2">
                  <p>{item.name} - {item.quantity} - Priority: {item.priority}</p>
                  {item.purchased && <p className="text-green-500">Purchased</p>}
                  <div>
                    Best Price: {bestPrice(item.prices).price} at {bestPrice(item.prices).store?.name}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  return <GroceryList />;
}