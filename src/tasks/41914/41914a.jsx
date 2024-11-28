import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const PRIORITY_OPTIONS = ["High", "Medium", "Low"];
const STORES = ["Walmart", "Target", "Costco", "Whole Foods", "Kroger"];

function GroceryList({ list, onUpdateList, onDeleteList }) {
  const [newItem, setNewItem] = useState({ name: "", quantity: "", priority: "Medium" });

  const addItem = () => {
    if (newItem.name && newItem.quantity) {
      onUpdateList({
        ...list,
        items: [...list.items, { ...newItem, purchased: false, prices: [] }],
      });
      setNewItem({ name: "", quantity: "", priority: "Medium" });
    }
  };

  const updateItem = (index, updates) => {
    const updatedItems = list.items.map((item, i) =>
      i === index ? { ...item, ...updates } : item
    );
    onUpdateList({ ...list, items: updatedItems });
  };

  const deleteItem = (index) => {
    const updatedItems = list.items.filter((_, i) => i !== index);
    onUpdateList({ ...list, items: updatedItems });
  };

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>{list.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-2 mb-4">
          <Input
            placeholder="Item name"
            value={newItem.name}
            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
          />
          <Input
            placeholder="Quantity"
            value={newItem.quantity}
            onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
          />
          <Select
            value={newItem.priority}
            onValueChange={(value) => setNewItem({ ...newItem, priority: value })}
          >
            {PRIORITY_OPTIONS.map((option) => (
              <Select.Option key={option} value={option}>
                {option}
              </Select.Option>
            ))}
          </Select>
          <Button onClick={addItem}>Add Item</Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Purchased</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {list.items.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>{item.priority}</TableCell>
                <TableCell>
                  <Checkbox
                    checked={item.purchased}
                    onCheckedChange={(checked) => updateItem(index, { purchased: checked })}
                  />
                </TableCell>
                <TableCell>
                  <Button variant="destructive" onClick={() => deleteItem(index)}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function PriceComparison({ item, onUpdatePrices }) {
  const [newPrice, setNewPrice] = useState({ store: "", price: "", date: "" });

  const addPrice = () => {
    if (newPrice.store && newPrice.price && newPrice.date) {
      onUpdatePrices([...item.prices, newPrice]);
      setNewPrice({ store: "", price: "", date: "" });
    }
  };

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>Price Comparison for {item.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-2 mb-4">
          <Select
            value={newPrice.store}
            onValueChange={(value) => setNewPrice({ ...newPrice, store: value })}
          >
            {STORES.map((store) => (
              <Select.Option key={store} value={store}>
                {store}
              </Select.Option>
            ))}
          </Select>
          <Input
            placeholder="Price"
            value={newPrice.price}
            onChange={(e) => setNewPrice({ ...newPrice, price: e.target.value })}
          />
          <Input
            type="date"
            value={newPrice.date}
            onChange={(e) => setNewPrice({ ...newPrice, date: e.target.value })}
          />
          <Button onClick={addPrice}>Add Price</Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Store</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {item.prices.map((price, index) => (
              <TableRow key={index}>
                <TableCell>{price.store}</TableCell>
                <TableCell>${price.price}</TableCell>
                <TableCell>{price.date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export default function App() {
  const [lists, setLists] = useState([]);
  const [newListName, setNewListName] = useState("");
  const [selectedList, setSelectedList] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    const savedLists = localStorage.getItem("groceryLists");
    if (savedLists) {
      setLists(JSON.parse(savedLists));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("groceryLists", JSON.stringify(lists));
  }, [lists]);

  const createList = () => {
    if (newListName) {
      setLists([...lists, { name: newListName, items: [] }]);
      setNewListName("");
    }
  };

  const updateList = (updatedList) => {
    setLists(lists.map((list) => (list.name === updatedList.name ? updatedList : list)));
  };

  const deleteList = (listName) => {
    setLists(lists.filter((list) => list.name !== listName));
    setSelectedList(null);
  };

  const updatePrices = (updatedPrices) => {
    const updatedList = {
      ...selectedList,
      items: selectedList.items.map((item) =>
        item.name === selectedItem.name ? { ...item, prices: updatedPrices } : item
      ),
    };
    updateList(updatedList);
    setSelectedItem(null);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Grocery List App</h1>
      <div className="flex flex-col space-y-2 mb-4">
        <Input
          placeholder="New list name"
          value={newListName}
          onChange={(e) => setNewListName(e.target.value)}
        />
        <Button onClick={createList}>Create List</Button>
      </div>
      {lists.map((list) => (
        <Card key={list.name} className="mb-4">
          <CardHeader>
            <CardTitle>{list.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={() => setSelectedList(list)}>View/Edit</Button>
            <Button variant="destructive" onClick={() => deleteList(list.name)}>
              Delete
            </Button>
          </CardContent>
        </Card>
      ))}
      {selectedList && (
        <GroceryList
          list={selectedList}
          onUpdateList={updateList}
          onDeleteList={deleteList}
        />
      )}
      {selectedList &&
        selectedList.items.map((item) => (
          <Button key={item.name} onClick={() => setSelectedItem(item)}>
            Compare Prices: {item.name}
          </Button>
        ))}
      {selectedItem && (
        <PriceComparison item={selectedItem} onUpdatePrices={updatePrices} />
      )}
    </div>
  );
}