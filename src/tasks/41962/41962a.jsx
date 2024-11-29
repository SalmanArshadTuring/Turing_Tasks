import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const InvoiceItem = ({ item, onUpdate, onRemove }) => {
  return (
    <div className="flex flex-col sm:flex-row gap-2 mb-2">
      <Input
        placeholder="Description"
        value={item.description}
        onChange={(e) => onUpdate({ ...item, description: e.target.value })}
        className="flex-grow"
      />
      <Input
        type="number"
        placeholder="Quantity"
        value={item.quantity}
        onChange={(e) => onUpdate({ ...item, quantity: e.target.value })}
        className="w-20"
      />
      <Input
        type="number"
        placeholder="Unit Price"
        value={item.unitPrice}
        onChange={(e) => onUpdate({ ...item, unitPrice: e.target.value })}
        className="w-24"
      />
      <Button onClick={onRemove} variant="destructive" className="w-full sm:w-auto">
        Remove
      </Button>
    </div>
  );
};

const Summary = ({ items, taxRate }) => {
  const subtotal = items.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  );
  const taxAmount = subtotal * (taxRate / 100);
  const total = subtotal + taxAmount;

  return (
    <div className="mt-4">
      <div className="flex justify-between">
        <span>Subtotal:</span>
        <span>${subtotal.toFixed(2)}</span>
      </div>
      <div className="flex justify-between">
        <span>Tax ({taxRate}%):</span>
        <span>${taxAmount.toFixed(2)}</span>
      </div>
      <div className="flex justify-between font-bold">
        <span>Total:</span>
        <span>${total.toFixed(2)}</span>
      </div>
    </div>
  );
};

export default function App() {
  const [clientInfo, setClientInfo] = useState({ name: "", address: "" });
  const [items, setItems] = useState([]);
  const [taxRate, setTaxRate] = useState(0);

  const addItem = () => {
    setItems([...items, { id: Date.now(), description: "", quantity: 1, unitPrice: 0 }]);
  };

  const updateItem = (updatedItem) => {
    setItems(items.map((item) => (item.id === updatedItem.id ? updatedItem : item)));
  };

  const removeItem = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Invoice Generator</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Label htmlFor="clientName">Client Name</Label>
            <Input
              id="clientName"
              value={clientInfo.name}
              onChange={(e) => setClientInfo({ ...clientInfo, name: e.target.value })}
              className="mb-2"
            />
            <Label htmlFor="clientAddress">Client Address</Label>
            <Input
              id="clientAddress"
              value={clientInfo.address}
              onChange={(e) => setClientInfo({ ...clientInfo, address: e.target.value })}
            />
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Invoice Items</h3>
            {items.map((item) => (
              <InvoiceItem
                key={item.id}
                item={item}
                onUpdate={updateItem}
                onRemove={() => removeItem(item.id)}
              />
            ))}
            <Button onClick={addItem} className="mt-2">
              Add Item
            </Button>
          </div>

          <div className="mb-4">
            <Label htmlFor="taxRate">Tax Rate (%)</Label>
            <Input
              id="taxRate"
              type="number"
              value={taxRate}
              onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
              className="w-24"
            />
          </div>

          <Summary items={items} taxRate={taxRate} />
        </CardContent>
      </Card>
    </div>
  );
}