import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";

const categories = ["Tech", "Clothing", "Books", "Home", "Other"];
const priorities = ["Low", "Medium", "High"];

const WishlistForm = ({ addItem }) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name && price && category && priority) {
      addItem({ name, price: parseFloat(price), category, priority, purchased: false });
      setName("");
      setPrice("");
      setCategory("");
      setPriority("");
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Add Wishlist Item</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Item Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter item name"
            />
          </div>
          <div>
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Enter price"
              min="0"
              step="0.01"
            />
          </div>
          <div>
            <Label htmlFor="category">Category</Label>
            <Select onValueChange={setCategory} value={category}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
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
          <div>
            <Label htmlFor="priority">Priority</Label>
            <Select onValueChange={setPriority} value={priority}>
              <SelectTrigger>
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                {priorities.map((pri) => (
                  <SelectItem key={pri} value={pri}>
                    {pri}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button type="submit">Add Item</Button>
        </form>
      </CardContent>
    </Card>
  );
};

const WishlistTable = ({ items, togglePurchased, removeItem }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Wishlist Items</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Purchased</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.name}</TableCell>
                <TableCell>${item.price.toFixed(2)}</TableCell>
                <TableCell>{item.category}</TableCell>
                <TableCell>{item.priority}</TableCell>
                <TableCell>
                  <Checkbox
                    checked={item.purchased}
                    onCheckedChange={() => togglePurchased(index)}
                  />
                </TableCell>
                <TableCell>
                  <Button variant="destructive" onClick={() => removeItem(index)}>
                    Remove
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

const WishlistSummary = ({ items }) => {
  const totalCost = items.reduce((sum, item) => sum + item.price, 0);
  const purchasedCost = items
    .filter((item) => item.purchased)
    .reduce((sum, item) => sum + item.price, 0);
  const remainingCost = totalCost - purchasedCost;

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Wishlist Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Total Cost: ${totalCost.toFixed(2)}</p>
        <p>Purchased: ${purchasedCost.toFixed(2)}</p>
        <p>Remaining: ${remainingCost.toFixed(2)}</p>
      </CardContent>
    </Card>
  );
};

export default function App() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const savedItems = localStorage.getItem("wishlistItems");
    if (savedItems) {
      setItems(JSON.parse(savedItems));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("wishlistItems", JSON.stringify(items));
  }, [items]);

  const addItem = (newItem) => {
    setItems([...items, newItem]);
  };

  const togglePurchased = (index) => {
    const updatedItems = [...items];
    updatedItems[index].purchased = !updatedItems[index].purchased;
    setItems(updatedItems);
  };

  const removeItem = (index) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
  };

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-6">Personal Wishlist Organizer</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <WishlistForm addItem={addItem} />
          <WishlistSummary items={items} />
        </div>
        <div>
          <WishlistTable
            items={items}
            togglePurchased={togglePurchased}
            removeItem={removeItem}
          />
        </div>
      </div>
    </div>
  );
}