import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const storesList = [
  { id: 1, name: "Store A", location: "Downtown", logo: "logoA.png" },
  { id: 2, name: "Store B", location: "Uptown", logo: "logoB.png" },
];

export default function App() {
  const [groceryLists, setGroceryLists] = useState([]);
  const [storeName, setStoreName] = useState("");
  const [budget, setBudget] = useState(0);
  const [newItem, setNewItem] = useState({ name: "", quantity: "", note: "", priority: "Low" });

  const handleAddList = (listName, description) => {
    setGroceryLists([...groceryLists, { name: listName, description, items: [] }]);
  };

  const handleAddItem = (listIndex) => {
    const updatedLists = [...groceryLists];
    updatedLists[listIndex].items.push({ ...newItem, purchased: false });
    setGroceryLists(updatedLists);
    setNewItem({ name: "", quantity: "", note: "", priority: "Low" });
  };

  const handleDeleteItem = (listIndex, itemIndex) => {
    const updatedLists = [...groceryLists];
    updatedLists[listIndex].items.splice(itemIndex, 1);
    setGroceryLists(updatedLists);
  };

  const handleMarkAsPurchased = (listIndex, itemIndex) => {
    const updatedLists = [...groceryLists];
    updatedLists[listIndex].items[itemIndex].purchased = true;
    setGroceryLists(updatedLists);
  };

  const handleStoreSelection = (store) => {
    setStoreName(store.name);
  };

  const handleSetBudget = (amount) => {
    setBudget(amount);
  };

  const getBestDeal = (item) => {
    if (item.priceComparison && item.priceComparison.length > 0) {
      return item.priceComparison.reduce((prev, current) =>
        prev.price < current.price ? prev : current
      );
    }
    return null;
  };

  return (
    <div className="container mx-auto p-4">
      <header className="text-center mb-8">
        <h1 className="text-2xl font-bold">Grocery List Manager</h1>
        <div>
          <label className="mr-2">Set Budget: </label>
          <input
            type="number"
            value={budget}
            onChange={(e) => handleSetBudget(e.target.value)}
            className="p-2 border rounded"
            placeholder="Set your budget"
          />
        </div>
      </header>

      <section className="mb-6">
        <h2 className="text-xl font-semibold">Your Lists</h2>
        <div className="space-y-4">
          {groceryLists.map((list, listIndex) => (
            <Card key={listIndex}>
              <CardHeader>
                <CardTitle>{list.name}</CardTitle>
                <CardDescription>{list.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {list.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex justify-between items-center">
                      <div>
                        <p>{item.name} - {item.quantity}</p>
                        {item.note && <small>{item.note}</small>}
                        {item.purchased && <span className="text-green-500"> (Purchased)</span>}
                      </div>
                      {!item.purchased && (
                        <button
                          onClick={() => handleMarkAsPurchased(listIndex, itemIndex)}
                          className="bg-green-500 text-white p-1 rounded"
                        >
                          Mark as Purchased
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteItem(listIndex, itemIndex)}
                        className="bg-red-500 text-white p-1 rounded"
                      >
                        Delete
                      </button>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <button
                  onClick={() => handleAddItem(listIndex)}
                  className="bg-blue-500 text-white p-2 rounded"
                >
                  Add Item
                </button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold">Stores</h2>
        <div className="space-y-4">
          {storesList.map((store) => (
            <div key={store.id} className="flex justify-between items-center p-4 border rounded shadow-md">
              <div>
                <p>{store.name}</p>
                <small>{store.location}</small>
              </div>
              <button
                onClick={() => handleStoreSelection(store)}
                className="bg-blue-500 text-white p-1 rounded"
              >
                Select Store
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold">Add New Item</h2>
        <div className="space-y-4">
          <input
            type="text"
            value={newItem.name}
            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
            className="p-2 border rounded w-full"
            placeholder="Item Name"
          />
          <input
            type="text"
            value={newItem.quantity}
            onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
            className="p-2 border rounded w-full"
            placeholder="Quantity"
          />
          <textarea
            value={newItem.note}
            onChange={(e) => setNewItem({ ...newItem, note: e.target.value })}
            className="p-2 border rounded w-full"
            placeholder="Notes"
          />
          <select
            value={newItem.priority}
            onChange={(e) => setNewItem({ ...newItem, priority: e.target.value })}
            className="p-2 border rounded w-full"
          >
            <option value="Low">Low Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="High">High Priority</option>
          </select>
        </div>
      </section>
    </div>
  );
}
