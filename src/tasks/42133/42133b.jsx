import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function AuctionItem({ item, onBid, highestBid, user }) {
  const [bidAmount, setBidAmount] = useState('');
  const timeLeft = Math.max(0, 300 - (Date.now() - item.startTime) / 1000);

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>{item.name}</CardTitle>
        <CardDescription>{item.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div>Starting Price: ${item.startingPrice}</div>
        <div>Current Bid: ${highestBid.amount || item.startingPrice}</div>
        <div>Current Winner: {highestBid.bidder || 'No bids yet'}</div>
        <div>Time Left: {Math.floor(timeLeft / 60)}:{('0' + Math.floor(timeLeft % 60)).slice(-2)}</div>
        {user !== item.host && (
          <>
            <Label htmlFor="bidAmount">Your Bid</Label>
            <Input 
              id="bidAmount" 
              type="number" 
              value={bidAmount} 
              onChange={(e) => setBidAmount(e.target.value)} 
              placeholder="Enter your bid"
            />
            <Button onClick={() => {
              if (bidAmount > highestBid.amount) {
                onBid(item.id, parseFloat(bidAmount), user);
                setBidAmount('');
              }
            }}>Bid</Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}

function BidHistory({ bids }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Bid History</CardTitle>
      </CardHeader>
      <CardContent>
        {bids.map((bid, idx) => (
          <div key={idx}>{bid.bidder}: ${bid.amount}</div>
        ))}
      </CardContent>
    </Card>
  );
}

function MyAuctions({ auctions, user }) {
  return (
    <div>
      <h2 className="text-lg font-bold mb-4">My Auctions</h2>
      {auctions.filter(a => a.host === user).map(item => (
        <Card key={item.id} className="mb-4">
          <CardContent>
            <CardTitle>{item.name}</CardTitle>
            <p>{item.winner ? `Sold to ${item.winner} for $${item.highestBid}` : 'In Progress'}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState(`User${Math.floor(Math.random() * 1000)}`);
  const [auctions, setAuctions] = useState([]);
  const [newAuction, setNewAuction] = useState({ name: '', description: '', startingPrice: '' });
  const [currentTime, setCurrentTime] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleBid = (id, amount, bidder) => {
    setAuctions(auctions.map(auction => 
      auction.id === id ? { 
        ...auction, 
        bids: [...auction.bids, { amount, bidder, time: Date.now() }],
        highestBid: { amount, bidder } 
      } : auction
    ));
  };

  const startAuction = () => {
    if (newAuction.name && newAuction.startingPrice) {
      setAuctions([...auctions, {
        ...newAuction, 
        id: Date.now(), 
        host: user, 
        startTime: Date.now(),
        bids: [],
        highestBid: { amount: 0, bidder: null }
      }]);
      setNewAuction({ name: '', description: '', startingPrice: '' });
    }
  };

  return (
    <div className="container mx-auto p-4 sm:p-6">
      <h1 className="text-2xl font-bold mb-4">Mini Auction App</h1>
      <div className="mb-4">
        <Input 
          value={user} 
          onChange={(e) => setUser(e.target.value)} 
          placeholder="Enter your username"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <h2 className="text-lg font-bold mb-4">Create Auction</h2>
          <Input 
            value={newAuction.name} 
            onChange={(e) => setNewAuction({...newAuction, name: e.target.value})} 
            placeholder="Item Name"
          />
          <Input 
            value={newAuction.description} 
            onChange={(e) => setNewAuction({...newAuction, description: e.target.value})} 
            placeholder="Description"
            className="my-2"
          />
          <Input 
            value={newAuction.startingPrice} 
            onChange={(e) => setNewAuction({...newAuction, startingPrice: e.target.value})} 
            type="number" 
            placeholder="Starting Price"
          />
          <Button onClick={startAuction} className="mt-2">Start Auction</Button>
        </div>
        <MyAuctions auctions={auctions} user={user} />
      </div>
      <div className="mt-6">
        {auctions.map(item => (
          <div key={item.id} className="mb-6">
            <AuctionItem 
              item={item} 
              onBid={handleBid} 
              highestBid={item.highestBid || { amount: item.startingPrice, bidder: '' }} 
              user={user}
            />
            <BidHistory bids={item.bids} />
          </div>
        ))}
      </div>
    </div>
  );
}