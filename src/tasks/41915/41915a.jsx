import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { Label } from "@/components/ui/label";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

function App() {
  const [artworks, setArtworks] = useState([]);
  const [formData, setFormData] = useState({ title: '', category: 'Painting', description: '', price: '', forSale: false });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.title && formData.price) {
      setArtworks([...artworks, { ...formData, id: Date.now() }]);
      setFormData({ title: '', category: 'Painting', description: '', price: '', forSale: false });
    }
  };

  const ArtworkCard = ({ artwork, onPurchase }) => (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>{artwork.title}</CardTitle>
        <CardDescription>{artwork.category}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>{artwork.description}</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <span>{artwork.price ? `$${artwork.price}` : 'Not for Sale'}</span>
        {artwork.forSale && <Button onClick={() => onPurchase(artwork)}>Purchase</Button>}
      </CardFooter>
    </Card>
  );

  return (
    <div className="container mx-auto p-4 sm:p-8">
      <h1 className="text-3xl font-bold mb-6">Digital Art Portfolio</h1>
      
      {/* Artwork Submission Form */}
      <form onSubmit={handleSubmit} className="mb-8 space-y-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input id="title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
        </div>
        <div>
          <Label htmlFor="category">Category</Label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">{formData.category}</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Categories</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setFormData({...formData, category: 'Painting'})}>Painting</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFormData({...formData, category: 'Digital'})}>Digital</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFormData({...formData, category: 'Sculpture'})}>Sculpture</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <Input id="description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
        </div>
        <div>
          <Label htmlFor="price">Price</Label>
          <Input id="price" type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} required />
        </div>
        <div>
          <Label>
            <Input type="checkbox" checked={formData.forSale} onChange={e => setFormData({...formData, forSale: e.target.checked})} /> For Sale
          </Label>
        </div>
        <Button type="submit">Add Artwork</Button>
      </form>

      {/* Artwork Listings */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {artworks.map(artwork => (
          <ArtworkCard key={artwork.id} artwork={artwork} onPurchase={() => alert(`Purchasing ${artwork.title} for $${artwork.price}`)} />
        ))}
      </div>
    </div>
  );
}

export default App;