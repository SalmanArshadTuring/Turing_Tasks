import React, { useState } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

const products = [
  {
    id: 1,
    name: "Digital Artwork: Sunset",
    description: "A beautiful digital painting of a sunset",
    price: 19.99,
    type: "artwork",
    preview: "🌅",
  },
  {
    id: 2,
    name: "E-book: React Mastery",
    description: "Learn React from beginner to advanced",
    price: 29.99,
    type: "ebook",
    preview: "📚",
  },
  {
    id: 3,
    name: "Music Track: Chill Vibes",
    description: "Relaxing electronic music track",
    price: 9.99,
    type: "music",
    preview: "🎵",
  },
];

function ProductCard({ product, onBuy }) {
  return (
    <Card className="w-full sm:w-64 m-2">
      <CardHeader>
        <CardTitle>{product.name}</CardTitle>
        <CardDescription>{product.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">${product.price.toFixed(2)}</p>
        <p className="text-4xl text-center my-4">{product.preview}</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">Preview</Button>
          </DialogTrigger>
          <DialogContent>
            <h3 className="text-lg font-semibold mb-2">Product Preview</h3>
            <p className="text-6xl text-center my-4">{product.preview}</p>
            <p>This is a preview of {product.name}.</p>
          </DialogContent>
        </Dialog>
        <Button onClick={() => onBuy(product)}>Buy Now</Button>
      </CardFooter>
    </Card>
  );
}

function ProductList({ onBuy }) {
  return (
    <div className="flex flex-wrap justify-center">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} onBuy={onBuy} />
      ))}
    </div>
  );
}

function Checkout({ product, onCancel, onComplete }) {
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate payment processing
    setTimeout(() => {
      onComplete();
    }, 1500);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Checkout</CardTitle>
        <CardDescription>Complete your purchase</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="product">Product</Label>
              <Input id="product" value={product.name} disabled />
            </div>
            <div>
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                value={`$${product.price.toFixed(2)}`}
                disabled
              />
            </div>
            <div>
              <Label htmlFor="card-number">Card Number</Label>
              <Input
                id="card-number"
                placeholder="1234 5678 9012 3456"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                required
              />
            </div>
            <div className="flex space-x-4">
              <div className="flex-1">
                <Label htmlFor="expiry-date">Expiry Date</Label>
                <Input
                  id="expiry-date"
                  placeholder="MM/YY"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  required
                />
              </div>
              <div className="flex-1">
                <Label htmlFor="cvv">CVV</Label>
                <Input
                  id="cvv"
                  placeholder="123"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>
          <div className="flex justify-between mt-6">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">Complete Purchase</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function UserProfile() {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>User Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="username">Username</Label>
            <Input id="username" value="johndoe" disabled />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" value="johndoe@example.com" disabled />
          </div>
          <div>
            <Label htmlFor="member-since">Member Since</Label>
            <Input id="member-since" value="January 1, 2023" disabled />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState("marketplace");
  const [checkoutProduct, setCheckoutProduct] = useState(null);
  const [purchaseComplete, setPurchaseComplete] = useState(false);

  const handleBuy = (product) => {
    setCheckoutProduct(product);
    setActiveTab("checkout");
  };

  const handleCancelCheckout = () => {
    setCheckoutProduct(null);
    setActiveTab("marketplace");
  };

  const handleCompletePurchase = () => {
    setPurchaseComplete(true);
    setTimeout(() => {
      setPurchaseComplete(false);
      setCheckoutProduct(null);
      setActiveTab("marketplace");
    }, 3000);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-6">
        Digital Goods Marketplace
      </h1>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
          <TabsTrigger value="checkout">Checkout</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
        </TabsList>
        <TabsContent value="marketplace">
          <ProductList onBuy={handleBuy} />
        </TabsContent>
        <TabsContent value="checkout">
          {checkoutProduct ? (
            purchaseComplete ? (
              <Card className="w-full max-w-md mx-auto">
                <CardContent className="pt-6">
                  <p className="text-center text-xl">
                    Thank you for your purchase!
                  </p>
                </CardContent>
              </Card>
            ) : (
              <Checkout
                product={checkoutProduct}
                onCancel={handleCancelCheckout}
                onComplete={handleCompletePurchase}
              />
            )
          ) : (
            <Card className="w-full max-w-md mx-auto">
              <CardContent className="pt-6">
                <p className="text-center">No product selected for checkout.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        <TabsContent value="profile">
          <UserProfile />
        </TabsContent>
      </Tabs>
    </div>
  );
}