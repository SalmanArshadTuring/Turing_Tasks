import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

const preloadedArtifacts = [
  {
    id: 1,
    title: "Ancient Greek Vase",
    description: "A beautifully preserved ceramic vase from ancient Greece.",
    period: "5th century BCE",
    origin: "Athens, Greece",
    significance: "Depicts scenes from Greek mythology",
    category: "Pottery",
    image: "https://example.com/greek-vase.jpg",
    model: "https://example.com/greek-vase.glb",
  },
  {
    id: 2,
    title: "Roman Gladius",
    description: "A short sword used by Roman legionaries.",
    period: "1st century CE",
    origin: "Roman Empire",
    significance: "Standard weapon of Roman infantry",
    category: "Weapons",
    image: "https://example.com/roman-gladius.jpg",
    model: "https://example.com/roman-gladius.glb",
  },
  // Add more preloaded artifacts here
];

function ArtifactCard({ artifact, onSelect, isFavorite, onToggleFavorite }) {
  return (
    <Card className="w-full sm:w-64 m-2">
      <CardHeader>
        <CardTitle>{artifact.title}</CardTitle>
        <CardDescription>{artifact.period}</CardDescription>
      </CardHeader>
      <CardContent>
        <img src={artifact.image} alt={artifact.title} className="w-full h-40 object-cover mb-2" />
        <p className="text-sm">{artifact.description}</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button onClick={() => onSelect(artifact)}>View 3D</Button>
        <Button
          variant={isFavorite ? "secondary" : "outline"}
          onClick={() => onToggleFavorite(artifact)}
        >
          {isFavorite ? "★" : "☆"}
        </Button>
      </CardFooter>
    </Card>
  );
}

function ArtifactViewer({ artifact }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (artifact && canvasRef.current) {
      // Here you would initialize and render the 3D model
      // using a library like Three.js or React Three Fiber
      console.log("Render 3D model:", artifact.model);
    }
  }, [artifact]);

  if (!artifact) return null;

  return (
    <div className="w-full h-96 bg-gray-100 relative">
      <canvas ref={canvasRef} className="w-full h-full" />
      <div className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-75 p-4">
        <h3 className="text-lg font-bold">{artifact.title}</h3>
        <p>Origin: {artifact.origin}</p>
        <p>Period: {artifact.period}</p>
        <p>Significance: {artifact.significance}</p>
      </div>
    </div>
  );
}

export default function App() {
  const [artifacts, setArtifacts] = useState(preloadedArtifacts);
  const [selectedArtifact, setSelectedArtifact] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [visited, setVisited] = useState([]);
  const [filter, setFilter] = useState("");

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const newArtifact = {
        id: artifacts.length + 1,
        title: file.name,
        description: "User uploaded artifact",
        period: "Unknown",
        origin: "User Collection",
        significance: "Personal artifact",
        category: "Uploaded",
        image: URL.createObjectURL(file),
        model: URL.createObjectURL(file),
      };
      setArtifacts([...artifacts, newArtifact]);
    }
  };

  const handleSelectArtifact = (artifact) => {
    setSelectedArtifact(artifact);
    if (!visited.includes(artifact.id)) {
      setVisited([...visited, artifact.id]);
    }
  };

  const handleToggleFavorite = (artifact) => {
    setFavorites((prevFavorites) =>
      prevFavorites.includes(artifact.id)
        ? prevFavorites.filter((id) => id !== artifact.id)
        : [...prevFavorites, artifact.id]
    );
  };

  const filteredArtifacts = artifacts.filter(
    (artifact) =>
      artifact.title.toLowerCase().includes(filter.toLowerCase()) ||
      artifact.category.toLowerCase().includes(filter.toLowerCase())
  );

  const clearUploads = () => {
    setArtifacts(preloadedArtifacts);
    setSelectedArtifact(null);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">3D Historical Artifact Explorer</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="col-span-1 sm:col-span-2">
          <ArtifactViewer artifact={selectedArtifact} />
        </div>
        <div className="col-span-1">
          <Tabs defaultValue="gallery">
            <TabsList className="w-full">
              <TabsTrigger value="gallery">Gallery</TabsTrigger>
              <TabsTrigger value="favorites">Favorites</TabsTrigger>
              <TabsTrigger value="visited">Visited</TabsTrigger>
            </TabsList>
            <TabsContent value="gallery">
              <div className="mb-4">
                <Label htmlFor="filter">Filter artifacts:</Label>
                <Input
                  id="filter"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  placeholder="Search by title or category"
                />
              </div>
              <ScrollArea className="h-96">
                <div className="flex flex-wrap">
                  {filteredArtifacts.map((artifact) => (
                    <ArtifactCard
                      key={artifact.id}
                      artifact={artifact}
                      onSelect={handleSelectArtifact}
                      isFavorite={favorites.includes(artifact.id)}
                      onToggleFavorite={handleToggleFavorite}
                    />
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
            <TabsContent value="favorites">
              <ScrollArea className="h-96">
                <div className="flex flex-wrap">
                  {artifacts
                    .filter((artifact) => favorites.includes(artifact.id))
                    .map((artifact) => (
                      <ArtifactCard
                        key={artifact.id}
                        artifact={artifact}
                        onSelect={handleSelectArtifact}
                        isFavorite={true}
                        onToggleFavorite={handleToggleFavorite}
                      />
                    ))}
                </div>
              </ScrollArea>
            </TabsContent>
            <TabsContent value="visited">
              <ScrollArea className="h-96">
                <div className="flex flex-wrap">
                  {artifacts
                    .filter((artifact) => visited.includes(artifact.id))
                    .map((artifact) => (
                      <ArtifactCard
                        key={artifact.id}
                        artifact={artifact}
                        onSelect={handleSelectArtifact}
                        isFavorite={favorites.includes(artifact.id)}
                        onToggleFavorite={handleToggleFavorite}
                      />
                    ))}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <div className="mt-4">
        <Label htmlFor="file-upload">Upload 3D Model:</Label>
        <Input id="file-upload" type="file" onChange={handleFileUpload} accept=".obj,.glb" />
      </div>
      <div className="mt-4">
        <Button onClick={clearUploads}>Clear Uploaded Artifacts</Button>
      </div>
      <div className="mt-4">
        <h2 className="text-xl font-bold mb-2">Categories:</h2>
        <div className="flex flex-wrap gap-2">
          {Array.from(new Set(artifacts.map((a) => a.category))).map((category) => (
            <Badge key={category} variant="secondary" onClick={() => setFilter(category)}>
              {category}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}