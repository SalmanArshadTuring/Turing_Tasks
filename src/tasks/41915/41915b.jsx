import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const initialArtworks = [
  {
    id: 1,
    title: "Abstract Harmony",
    category: "Painting",
    description: "A vibrant abstract piece exploring color and form.",
    price: 500,
    image: "https://placeholder.com/300x200",
  },
  {
    id: 2,
    title: "Digital Dreams",
    category: "Digital Art",
    description: "A surreal digital landscape inspired by dreams.",
    price: 250,
    image: "https://placeholder.com/300x200",
  },
];

const ArtworkCard = ({ artwork, onPurchase }) => {
  return (
    <Card className="w-full sm:w-64 m-2">
      <CardHeader>
        <CardTitle>{artwork.title}</CardTitle>
        <CardDescription>{artwork.category}</CardDescription>
      </CardHeader>
      <CardContent>
        <img src={artwork.image} alt={artwork.title} className="w-full h-40 object-cover mb-2" />
        <p className="text-sm">{artwork.description}</p>
        <p className="font-bold mt-2">${artwork.price}</p>
      </CardContent>
      <CardFooter>
        <Button onClick={() => onPurchase(artwork)}>Purchase</Button>
      </CardFooter>
    </Card>
  );
};

const AddArtworkForm = ({ onAddArtwork }) => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddArtwork({
      id: Date.now(),
      title,
      category,
      description,
      price: parseFloat(price),
      image: "https://placeholder.com/300x200",
    });
    setTitle("");
    setCategory("");
    setDescription("");
    setPrice("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="category">Category</Label>
        <Select value={category} onValueChange={setCategory} required>
          <SelectTrigger>
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Painting">Painting</SelectItem>
            <SelectItem value="Digital Art">Digital Art</SelectItem>
            <SelectItem value="Sculpture">Sculpture</SelectItem>
            <SelectItem value="Photography">Photography</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="price">Price</Label>
        <Input
          id="price"
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
      </div>
      <Button type="submit">Add Artwork</Button>
    </form>
  );
};

export default function App() {
  const [artworks, setArtworks] = useState(initialArtworks);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddArtwork = (newArtwork) => {
    setArtworks([...artworks, newArtwork]);
    setShowAddForm(false);
  };

  const handlePurchase = (artwork) => {
    alert(`Thank you for purchasing "${artwork.title}" for $${artwork.price}!`);
  };

  const filteredArtworks = selectedCategory === "All"
    ? artworks
    : artworks.filter((artwork) => artwork.category === selectedCategory);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Digital Art Portfolio</h1>
      <div className="flex flex-col sm:flex-row justify-between mb-4">
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Categories</SelectItem>
            <SelectItem value="Painting">Painting</SelectItem>
            <SelectItem value="Digital Art">Digital Art</SelectItem>
            <SelectItem value="Sculpture">Sculpture</SelectItem>
            <SelectItem value="Photography">Photography</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={() => setShowAddForm(!showAddForm)} className="mt-2 sm:mt-0">
          {showAddForm ? "Cancel" : "Add New Artwork"}
        </Button>
      </div>
      {showAddForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Add New Artwork</CardTitle>
          </CardHeader>
          <CardContent>
            <AddArtworkForm onAddArtwork={handleAddArtwork} />
          </CardContent>
        </Card>
      )}
      <div className="flex flex-wrap justify-center sm:justify-start">
        {filteredArtworks.map((artwork) => (
          <ArtworkCard key={artwork.id} artwork={artwork} onPurchase={handlePurchase} />
        ))}
      </div>
    </div>
  );
}