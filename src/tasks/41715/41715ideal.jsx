import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const products = [
    {
      id: 1,
      name: "Wireless Earbuds",
      description: "High-quality sound with noise cancellation",
      price: 129.99,
      features: ["Bluetooth 5.0", "24h battery life", "Water-resistant"],
    },
    {
      id: 2,
      name: "Smart Watch",
      description: "Track your fitness and stay connected",
      price: 199.99,
      features: ["Heart rate monitor", "GPS", "Sleep tracking"],
    },
    {
      id: 3,
      name: "Laptop",
      description: "High-performance laptop for work and play",
      price: 999.99,
      features: ["16GB RAM", "512GB SSD", "Intel i7 Processor"],
    },
    {
      id: 4,
      name: "Smartphone",
      description: "Latest model with amazing camera quality",
      price: 799.99,
      features: ["5G connectivity", "108MP camera", "5000mAh battery"],
    },
    {
      id: 5,
      name: "Bluetooth Speaker",
      description: "Portable speaker with deep bass and clear sound",
      price: 89.99,
      features: ["IPX7 waterproof", "12h battery life", "Wireless connection"],
    },
    {
      id: 6,
      name: "4K TV",
      description: "Ultra HD resolution with smart features",
      price: 599.99,
      features: ["HDR support", "Built-in apps", "Wi-Fi enabled"],
    },
  ];
  

const ProductCard = ({ product, onAddToCart }) => {
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = () => {
    setIsAdding(true);
    setTimeout(() => {
      onAddToCart(product);
      setIsAdding(false);
    }, 500);
  };

  return (
    <Card className="w-full max-w-sm mx-auto overflow-hidden transition-shadow duration-300 hover:shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-bold">{product.name}</CardTitle>
        <CardDescription className="text-sm text-gray-500">
          {product.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="mb-4 space-y-2">
          {product.features.map((feature, index) => (
            <li key={index} className="flex items-center">
              <svg
                className="w-4 h-4 mr-2 text-green-500"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M5 13l4 4L19 7"></path>
              </svg>
              {feature}
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <span className="text-2xl font-bold">${product.price.toFixed(2)}</span>
        <Button
          onClick={handleAddToCart}
          className={`transition-all duration-300 ${
            isAdding ? "bg-green-500 hover:bg-green-600" : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {isAdding ? "Adding..." : "Add to Cart"}
        </Button>
      </CardFooter>
    </Card>
  );
};

const ProductGrid = ({ products, onAddToCart }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
      ))}
    </div>
  );
};

const CartBadge = ({ count }) => {
  return (
    <div className="fixed top-4 right-4 z-10">
      <Badge variant="destructive" className="text-lg px-3 py-1">
        {count}
      </Badge>
    </div>
  );
};

const CartModal = ({ isVisible, cartItems, onClose }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-96">
        <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
        {cartItems.length === 0 ? (
          <p className="text-gray-500">Your cart is empty.</p>
        ) : (
          <ul className="space-y-2">
            {cartItems.map((item, index) => (
              <li key={index} className="flex justify-between items-center">
                <span>{item.name}</span>
                <span>${item.price.toFixed(2)}</span>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-4 flex justify-end">
          <Button onClick={onClose} className="bg-red-500 hover:bg-red-600">
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [cartItems, setCartItems] = useState([]);
  const [isCartVisible, setIsCartVisible] = useState(false);

  const handleAddToCart = (product) => {
    setCartItems((prevItems) => [...prevItems, product]);
  };

  const toggleCartVisibility = () => {
    setIsCartVisible((prev) => !prev);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Featured Products</h1>
      <CartBadge count={cartItems.length} />
      <div className="flex justify-center mb-4">
        <Button onClick={toggleCartVisibility} className="bg-gray-800 text-white px-4 py-2 rounded-lg">
          {isCartVisible ? "Hide Cart" : "Show Cart"}
        </Button>
      </div>
      <ProductGrid products={products} onAddToCart={handleAddToCart} />
      <CartModal
        isVisible={isCartVisible}
        cartItems={cartItems}
        onClose={toggleCartVisibility}
      />
    </div>
  );
}
