import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

const attractions = [
  { id: 1, name: "City Museum", category: "Museum", visited: false, favorite: false, image: "museum.jpg", description: "An eclectic mixture of children's playground, funhouse, and architectural marvel." },
  { id: 2, name: "Central Park", category: "Park", visited: false, favorite: false, image: "park.jpg", description: "A large public, urban park in the heart of the city." },
  // Add more attractions here...
];

export default function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [itinerary, setItinerary] = useState([]);
  const [filteredAttractions, setFilteredAttractions] = useState(attractions);

  useEffect(() => {
    const results = attractions.filter(attraction => 
      attraction.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterCategory === '' || attraction.category === filterCategory)
    );
    setFilteredAttractions(results);
  }, [searchTerm, filterCategory]);

  const addToItinerary = (attraction) => {
    setItinerary(prev => [...prev, attraction]);
  };

  const toggleVisited = (id) => {
    setFilteredAttractions(prev => 
      prev.map(attr => attr.id === id ? { ...attr, visited: !attr.visited } : attr)
    );
  };

  const toggleFavorite = (id) => {
    setFilteredAttractions(prev => 
      prev.map(attr => attr.id === id ? { ...attr, favorite: !attr.favorite } : attr)
    );
  };

  const resetAll = () => {
    setSearchTerm('');
    setFilterCategory('');
    setItinerary([]);
    setFilteredAttractions(attractions.map(attr => ({ ...attr, visited: false, favorite: false })));
  };

  const exportItinerary = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(itinerary));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", "itinerary.json");
    document.body.appendChild(downloadAnchorNode); 
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <div className="container mx-auto p-4 sm:p-6">
      <h1 className="text-2xl font-bold mb-4">City Guide App</h1>
      <div className="mb-4">
        <Input 
          placeholder="Search attractions..." 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)} 
          className="mb-2"
        />
        <select 
          value={filterCategory} 
          onChange={(e) => setFilterCategory(e.target.value)}
          className="p-2 border rounded w-full sm:w-1/2 mb-2"
        >
          <option value="">All Categories</option>
          <option value="Museum">Museum</option>
          <option value="Park">Park</option>
        </select>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filteredAttractions.map(attraction => (
          <Card key={attraction.id}>
            <CardHeader>
              <CardTitle>{attraction.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <img src={attraction.image} alt={attraction.name} className="mb-2 w-full h-40 object-cover"/>
              <CardDescription>{attraction.description}</CardDescription>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button onClick={() => addToItinerary(attraction)}>Add to Itinerary</Button>
              <div>
                <Checkbox checked={attraction.visited} onChange={() => toggleVisited(attraction.id)} /> Visited
                <Checkbox checked={attraction.favorite} onChange={() => toggleFavorite(attraction.id)} /> Favorite
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
      <div className="mt-4">
        <h2 className="text-xl font-semibold">My Itinerary</h2>
        <ul>
          {itinerary.map(item => <li key={item.id}>{item.name}</li>)}
        </ul>
        <Button onClick={exportItinerary} className="mt-2">Export Itinerary</Button>
        <Button onClick={resetAll} className="mt-2 ml-2">Reset All</Button>
      </div>
    </div>
  );
}