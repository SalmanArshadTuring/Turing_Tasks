import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AuctionItem = ({ item, onBid, timeLeft, currentUser }) => {
  const [bidAmount, setBidAmount] = useState(item.currentBid + 1);

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{item.name}</CardTitle>
        <CardDescription>{item.description}</CardDescription>
      </CardHeader>
      <CardContent>
        {item.image && (
          <img src={item.image} alt={item.name} className="w-full h-48 object-cover mb-4 rounded-md" />
        )}
        <div className="flex justify-between items-center mb-4">
          <span className="font-bold">Current Bid: ${item.currentBid}</span>
          <span className="text-sm">Time Left: {timeLeft}s</span>
        </div>
        <div className="flex space-x-2">
          <Input
            type="number"
            value={bidAmount}
            onChange={(e) => setBidAmount(Math.max(item.currentBid + 1, parseInt(e.target.value)))}
            className="w-2/3"
          />
          <Button onClick={() => onBid(item.id, bidAmount)} className="w-1/3">
            Bid
          </Button>
        </div>
      </CardContent>
      <CardFooter>
        <div className="w-full">
          <h4 className="font-semibold mb-2">Bid History</h4>
          {item.bidHistory.map((bid, index) => (
            <div key={index} className="flex justify-between items-center text-sm">
              <span>{bid.user === currentUser ? "You" : bid.user}</span>
              <span>${bid.amount}</span>
            </div>
          ))}
        </div>
      </CardFooter>
    </Card>
  );
};

const AuctionForm = ({ onSubmit }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [startingPrice, setStartingPrice] = useState(1);
  const [image, setImage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ name, description, startingPrice, image });
    setName("");
    setDescription("");
    setStartingPrice(1);
    setImage("");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Host a New Auction</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Item Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Textarea
            placeholder="Item Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <Input
            type="number"
            placeholder="Starting Price"
            value={startingPrice}
            onChange={(e) => setStartingPrice(Math.max(1, parseInt(e.target.value)))}
            required
          />
          <Input
            placeholder="Image URL (optional)"
            value={image}
            onChange={(e) => setImage(e.target.value)}
          />
          <Button type="submit">Start Auction</Button>
        </form>
      </CardContent>
    </Card>
  );
};

const MyAuctions = ({ auctions, currentUser }) => {
  return (
    <div className="space-y-4">
      {auctions
        .filter((auction) => auction.host === currentUser)
        .map((auction) => (
          <Card key={auction.id}>
            <CardHeader>
              <CardTitle>{auction.name}</CardTitle>
              <CardDescription>
                Status: {auction.timeLeft > 0 ? "Active" : "Ended"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Starting Price: ${auction.startingPrice}</p>
              <p>Current Bid: ${auction.currentBid}</p>
              {auction.timeLeft === 0 && (
                <p>Winner: {auction.bidHistory[0]?.user || "No bids"}</p>
              )}
            </CardContent>
          </Card>
        ))}
    </div>
  );
};

export default function App() {
  const [auctions, setAuctions] = useState([]);
  const [currentUser, setCurrentUser] = useState("User1");
  const [activeTab, setActiveTab] = useState("live");

  useEffect(() => {
    const timer = setInterval(() => {
      setAuctions((prevAuctions) =>
        prevAuctions.map((auction) => ({
          ...auction,
          timeLeft: Math.max(0, auction.timeLeft - 1),
        }))
      );
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleNewAuction = (item) => {
    const newAuction = {
      id: Date.now(),
      ...item,
      currentBid: item.startingPrice,
      timeLeft: 300, // 5 minutes
      bidHistory: [],
      host: currentUser,
    };
    setAuctions([...auctions, newAuction]);
  };

  const handleBid = (auctionId, amount) => {
    setAuctions((prevAuctions) =>
      prevAuctions.map((auction) =>
        auction.id === auctionId && auction.timeLeft > 0 && amount > auction.currentBid
          ? {
              ...auction,
              currentBid: amount,
              bidHistory: [{ user: currentUser, amount }, ...auction.bidHistory],
            }
          : auction
      )
    );
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Mini-Auction App</h1>
      <div className="mb-4">
        <Avatar>
          <AvatarImage src={`https://avatar.vercel.sh/${currentUser}.png`} />
          <AvatarFallback>{currentUser[0]}</AvatarFallback>
        </Avatar>
        <Badge className="ml-2">{currentUser}</Badge>
      </div>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="live">Live Auctions</TabsTrigger>
          <TabsTrigger value="host">Host Auction</TabsTrigger>
          <TabsTrigger value="my">My Auctions</TabsTrigger>
        </TabsList>
        <TabsContent value="live">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {auctions
              .filter((auction) => auction.timeLeft > 0)
              .map((auction) => (
                <AuctionItem
                  key={auction.id}
                  item={auction}
                  onBid={handleBid}
                  timeLeft={auction.timeLeft}
                  currentUser={currentUser}
                />
              ))}
          </div>
        </TabsContent>
        <TabsContent value="host">
          <AuctionForm onSubmit={handleNewAuction} />
        </TabsContent>
        <TabsContent value="my">
          <MyAuctions auctions={auctions} currentUser={currentUser} />
        </TabsContent>
      </Tabs>
    </div>
  );
}