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
import { Label } from "@/components/ui/label";

// Mock data for products
const mockProducts = [
  { id: 1, name: "Digital Art Piece", price: 10, type: "Artwork", preview: "art-preview.jpg" },
  { id: 2, name: "E-book on Mindfulness", price: 5, type: "E-book", preview: "ebook-preview.jpg" },
  { id: 3, name: "Synthwave Music Track", price: 3, type: "Music", preview: "music-preview.jpg" },
];

function ProductCard({ product, onBuy }) {
  return (
    <Card className="sm:w-full w-[300px]">
      <CardHeader>
        <CardTitle>{product.name}</CardTitle>
        <CardDescription>{product.type}</CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">
        <img src={product.preview} alt={product.name} className="max-h-48 object-cover" />
      </CardContent>
      <CardFooter>
        <p className="text-sm text-muted-foreground">${product.price}</p>
        <Button onClick={() => onBuy(product)}>Buy Now</Button>
      </CardFooter>
    </Card>
  );
}

function UserProfile() {
  return (
    <div className="p-4">
      <h2 className="text-lg font-bold">User Profile</h2>
      <Label htmlFor="username">Username</Label>
      <Input id="username" placeholder="Enter username" className="mb-4" />
      <Label htmlFor="email">Email</Label>
      <Input id="email" type="email" placeholder="Enter email" />
    </div>
  );
}

function Checkout({ product, onCancel }) {
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);

  const handlePayment = () => {
    setIsPaymentProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      alert('Payment Successful!');
      setIsPaymentProcessing(false);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <Card className="w-[90%] sm:w-[500px]">
        <CardHeader>
          <CardTitle>Checkout</CardTitle>
        </CardHeader>
        <CardContent>
          <h3>{product.name}</h3>
          <p>Price: ${product.price}</p>
          <Button disabled={isPaymentProcessing} onClick={handlePayment}>
            {isPaymentProcessing ? 'Processing...' : 'Pay Now'}
          </Button>
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default function App() {
  const [selectedProduct, setSelectedProduct] = useState(null);

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold mb-4">Digital Marketplace</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockProducts.map(product => (
          <ProductCard key={product.id} product={product} onBuy={setSelectedProduct} />
        ))}
      </div>
      {selectedProduct && (
        <Checkout 
          product={selectedProduct} 
          onCancel={() => setSelectedProduct(null)} 
        />
      )}
      <div className="mt-8">
        <UserProfile />
      </div>
    </div>
  );
}