import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const attractions = [
  {
    id: 1,
    name: "Central Park",
    description: "Iconic urban park with various attractions.",
    image: "https://example.com/central-park.jpg",
    category: "Parks",
    rating: 4.8,
    location: { lat: 40.7829, lng: -73.9654 },
    hours: "6:00 AM - 1:00 AM",
  },
  {
    id: 2,
    name: "Metropolitan Museum of Art",
    description: "World-renowned art museum with extensive collections.",
    image: "https://example.com/met-museum.jpg",
    category: "Museums",
    rating: 4.7,
    location: { lat: 40.7794, lng: -73.9632 },
    hours: "10:00 AM - 5:00 PM",
  },
  // Add more attractions here
];

const AttractionCard = ({ attraction, onAddToItinerary, onToggleFavorite, onToggleVisited }) => {
  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>{attraction.name}</CardTitle>
        <CardDescription>{attraction.category}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>{attraction.description}</p>
        <p>Rating: {attraction.rating}</p>
        <p>Hours: {attraction.hours}</p>
      </CardContent>
      <CardFooter>
        <Button onClick={() => onAddToItinerary(attraction)}>Add to Itinerary</Button>
        <Checkbox onClick={() => onToggleFavorite(attraction.id)} />
        <Checkbox onClick={() => onToggleVisited(attraction.id)} />
      </CardFooter>
    </Card>
  );
};

const ItineraryPlanner = ({ itinerary, onRemoveFromItinerary, onSaveItinerary, onExportItinerary, onResetItinerary }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Itinerary</CardTitle>
      </CardHeader>
      <CardContent>
        {itinerary.map((item, index) => (
          <div key={index} className="flex justify-between items-center mb-2">
            <span>{item.name}</span>
            <Button onClick={() => onRemoveFromItinerary(index)}>Remove</Button>
          </div>
        ))}
      </CardContent>
      <CardFooter>
        <Button onClick={onSaveItinerary}>Save</Button>
        <Button onClick={onExportItinerary}>Export</Button>
        <Button onClick={onResetItinerary}>Reset</Button>
      </CardFooter>
    </Card>
  );
};

const AttractionDetails = ({ attraction }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>View Details</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{attraction.name}</DialogTitle>
        </DialogHeader>
        <div>
          <p>{attraction.description}</p>
          <p>Category: {attraction.category}</p>
          <p>Rating: {attraction.rating}</p>
          <p>Hours: {attraction.hours}</p>
          {/* Add a map view here */}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default function App() {
  const [filteredAttractions, setFilteredAttractions] = useState(attractions);
  const [itinerary, setItinerary] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [visited, setVisited] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  useEffect(() => {
    const filtered = attractions.filter(
      (attraction) =>
        attraction.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (categoryFilter === "" || attraction.category === categoryFilter)
    );
    setFilteredAttractions(filtered);
  }, [searchTerm, categoryFilter]);

  const handleAddToItinerary = (attraction) => {
    setItinerary([...itinerary, attraction]);
  };

  const handleRemoveFromItinerary = (index) => {
    const newItinerary = [...itinerary];
    newItinerary.splice(index, 1);
    setItinerary(newItinerary);
  };

  const handleToggleFavorite = (id) => {
    setFavorites(favorites.includes(id) ? favorites.filter((fav) => fav !== id) : [...favorites, id]);
  };

  const handleToggleVisited = (id) => {
    setVisited(visited.includes(id) ? visited.filter((vis) => vis !== id) : [...visited, id]);
  };

  const handleSaveItinerary = () => {
    localStorage.setItem("itinerary", JSON.stringify(itinerary));
  };

  const handleExportItinerary = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(itinerary));
    const downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "itinerary.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleResetItinerary = () => {
    setItinerary([]);
    setFavorites([]);
    setVisited([]);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">City Guide App</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Input
            type="text"
            placeholder="Search attractions"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-4"
          />
          <Select value={categoryFilter} onValueChange={setCategoryFilter} className="mb-4">
            <option value="">All Categories</option>
            <option value="Parks">Parks</option>
            <option value="Museums">Museums</option>
            {/* Add more categories */}
          </Select>
          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="favorites">Favorites</TabsTrigger>
              <TabsTrigger value="visited">Visited</TabsTrigger>
            </TabsList>
            <TabsContent value="all">
              {filteredAttractions.map((attraction) => (
                <AttractionCard
                  key={attraction.id}
                  attraction={attraction}
                  onAddToItinerary={handleAddToItinerary}
                  onToggleFavorite={handleToggleFavorite}
                  onToggleVisited={handleToggleVisited}
                />
              ))}
            </TabsContent>
            <TabsContent value="favorites">
              {filteredAttractions
                .filter((attraction) => favorites.includes(attraction.id))
                .map((attraction) => (
                  <AttractionCard
                    key={attraction.id}
                    attraction={attraction}
                    onAddToItinerary={handleAddToItinerary}
                    onToggleFavorite={handleToggleFavorite}
                    onToggleVisited={handleToggleVisited}
                  />
                ))}
            </TabsContent>
            <TabsContent value="visited">
              {filteredAttractions
                .filter((attraction) => visited.includes(attraction.id))
                .map((attraction) => (
                  <AttractionCard
                    key={attraction.id}
                    attraction={attraction}
                    onAddToItinerary={handleAddToItinerary}
                    onToggleFavorite={handleToggleFavorite}
                    onToggleVisited={handleToggleVisited}
                  />
                ))}
            </TabsContent>
          </Tabs>
        </div>
        <div>
          <ItineraryPlanner
            itinerary={itinerary}
            onRemoveFromItinerary={handleRemoveFromItinerary}
            onSaveItinerary={handleSaveItinerary}
            onExportItinerary={handleExportItinerary}
            onResetItinerary={handleResetItinerary}
          />
        </div>
      </div>
    </div>
  );
}