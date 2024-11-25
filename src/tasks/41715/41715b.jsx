import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

function ProductCard({ product }) {
  const [isAdded, setIsAdded] = useState(false);

  const addToCart = () => {
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500); // Reset after 1.5 seconds for demo
  };

  return (
    <Card className="max-w-sm mx-auto bg-white shadow-lg rounded-lg overflow-hidden sm:max-w-md">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">{product.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">{product.description}</p>
        <div className="font-bold text-lg mb-2">Price: ${product.price}</div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={addToCart} 
          className={`w-full transition-colors duration-200 ${isAdded ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-500 hover:bg-blue-600'}`}
        >
          {isAdded ? 'Added!' : 'Add to Cart'}
        </Button>
      </CardFooter>
    </Card>
  );
}

export default function App() {
  const sampleProduct = {
    name: "EcoSmart LED Bulb",
    description: "An energy-efficient LED bulb that lasts up to 15,000 hours. Perfect for everyday use with a warm light output.",
    price: 9.99,
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <ProductCard product={sampleProduct} />
    </div>
  );
}