import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const attractions = [
  {
    id: 1,
    name: "Central Park",
    description: "A large public park in New York City.",
    category: "Park",
    location: "New York, NY",
    rating: 4.8,
    hours: "6:00 AM - 1:00 AM",
    image: "https://s3.amazonaws.com/assets.centralparknyc.org/media/images/_1650x1238_crop_center-center_none/Park-Aerial_20190604_03.jpg",
  },
  {
    id: 2,
    name: "The Louvre",
    description: "The world's largest art museum in Paris.",
    category: "Museum",
    location: "Paris, France",
    rating: 4.7,
    hours: "9:00 AM - 6:00 PM",
    image: "https://media.architecturaldigest.com/photos/5900cc370638dd3b70018b33/16:9/w_2991,h_1682,c_limit/Secrets%20of%20Louvre%201.jpg",
  },
  // Add more attractions here
];

function AttractionCard({ attraction, onAddToItinerary, onMarkFavorite }) {
  return (
    <Card className="w-full sm:w-72 mx-auto mb-4">
      <CardHeader>
        <CardTitle>{attraction.name}</CardTitle>
        <CardDescription>{attraction.category}</CardDescription>
      </CardHeader>
      <CardContent>
        <img src={attraction.image} alt={attraction.name} className="w-full h-40 object-cover mb-2 rounded" />
        <p>{attraction.description}</p>
        <p className="text-sm text-gray-500">Location: {attraction.location}</p>
        <p className="text-sm text-gray-500">Rating: {attraction.rating}</p>
        <p className="text-sm text-gray-500">Hours: {attraction.hours}</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={() => onAddToItinerary(attraction)}
        >
          Add to Itinerary
        </button>
        <button
          className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
          onClick={() => onMarkFavorite(attraction)}
        >
          Mark Favorite
        </button>
      </CardFooter>
    </Card>
  );
}

function Itinerary({ itinerary, onRemoveFromItinerary, onExport }) {
  return (
    <div className="mt-6">
      <h2 className="text-lg font-bold mb-4">Your Itinerary</h2>
      {itinerary.length === 0 ? (
        <p>No attractions added yet.</p>
      ) : (
        itinerary.map((item) => (
          <Card key={item.id} className="mb-4">
            <CardHeader>
              <CardTitle>{item.name}</CardTitle>
            </CardHeader>
            <CardFooter>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                onClick={() => onRemoveFromItinerary(item)}
              >
                Remove
              </button>
            </CardFooter>
          </Card>
        ))
      )}
      <button
        className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        onClick={onExport}
      >
        Export Itinerary
      </button>
    </div>
  );
}

export default function App() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [itinerary, setItinerary] = useState([]);
  const [favorites, setFavorites] = useState([]);

  const filteredAttractions = attractions.filter((a) => {
    return (
      a.name.toLowerCase().includes(search.toLowerCase()) &&
      (categoryFilter === "" || a.category === categoryFilter)
    );
  });

  const addToItinerary = (attraction) => {
    if (!itinerary.find((item) => item.id === attraction.id)) {
      setItinerary([...itinerary, attraction]);
    }
  };

  const removeFromItinerary = (attraction) => {
    setItinerary(itinerary.filter((item) => item.id !== attraction.id));
  };

  const markFavorite = (attraction) => {
    if (!favorites.find((item) => item.id === attraction.id)) {
      setFavorites([...favorites, attraction]);
    }
  };

  const exportItinerary = () => {
    const json = JSON.stringify(itinerary, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "itinerary.json";
    link.click();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">City Guide App</h1>
      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mb-6">
        <input
          type="text"
          placeholder="Search attractions"
          className="p-2 border rounded w-full sm:w-auto"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="p-2 border rounded w-full sm:w-auto"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="">All Categories</option>
          <option value="Park">Park</option>
          <option value="Museum">Museum</option>
          {/* Add more categories as needed */}
        </select>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAttractions.map((attraction) => (
          <AttractionCard
            key={attraction.id}
            attraction={attraction}
            onAddToItinerary={addToItinerary}
            onMarkFavorite={markFavorite}
          />
        ))}
      </div>
      <Itinerary
        itinerary={itinerary}
        onRemoveFromItinerary={removeFromItinerary}
        onExport={exportItinerary}
      />
    </div>
  );
}
