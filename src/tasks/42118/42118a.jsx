import React, { useState, useRef } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";

const initialArtifacts = [
  {
    id: 1,
    title: "Roman Coin",
    description: "A coin from the Roman Empire",
    category: "Currency",
    src: "/path/to/coin.glb",
    image: "/path/to/coin.jpg",
  },
  {
    id: 2,
    title: "Egyptian Amulet",
    description: "An amulet from Ancient Egypt",
    category: "Relic",
    src: "/path/to/amulet.glb",
    image: "/path/to/amulet.jpg",
  },
  // Add more artifacts here
];

// Placeholder for ThreeDViewer
function PlaceholderViewer({ modelSrc, onLoad }) {
  React.useEffect(() => {
    onLoad();
  }, [onLoad]);

  return (
    <div className="h-40 bg-gray-200 flex items-center justify-center">
      <p>3D Viewer Placeholder</p>
    </div>
  );
}

export default function App() {
  const [artifacts, setArtifacts] = useState(initialArtifacts);
  const [favorites, setFavorites] = useState([]);
  const [visited, setVisited] = useState([]);
  const fileInputRef = useRef(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && (file.name.endsWith(".obj") || file.name.endsWith(".glb"))) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const newArtifact = {
          id: Date.now(),
          title: file.name,
          description: "Uploaded by user",
          category: "User Upload",
          src: event.target.result,
          image: URL.createObjectURL(file),
        };
        setArtifacts([...artifacts, newArtifact]);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const markVisited = (id) => {
    if (!visited.includes(id)) setVisited([...visited, id]);
  };

  const resetArtifacts = () => {
    setArtifacts(initialArtifacts);
    fileInputRef.current.value = "";
  };

  return (
    <div className="container mx-auto p-4">
      <Tabs defaultValue="gallery" className="w-full">
        <TabsList>
          <TabsTrigger value="gallery">Gallery</TabsTrigger>
          <TabsTrigger value="upload">Upload</TabsTrigger>
          <TabsTrigger value="favorites">Favorites</TabsTrigger>
        </TabsList>
        <TabsContent value="gallery">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {artifacts.map((artifact) => (
              <ArtifactCard
                key={artifact.id}
                artifact={artifact}
                onFavorite={toggleFavorite}
                isFavorite={favorites.includes(artifact.id)}
                onVisit={() => markVisited(artifact.id)}
                isVisited={visited.includes(artifact.id)}
              />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="upload">
          <div className="flex flex-col space-y-4">
            <Input
              ref={fileInputRef}
              type="file"
              accept=".obj,.glb"
              onChange={handleFileUpload}
            />
            <Button onClick={resetArtifacts}>Reset Artifacts</Button>
          </div>
        </TabsContent>
        <TabsContent value="favorites">
          <ScrollArea className="h-96">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {artifacts
                .filter((a) => favorites.includes(a.id))
                .map((artifact) => (
                  <ArtifactCard
                    key={artifact.id}
                    artifact={artifact}
                    onFavorite={toggleFavorite}
                    isFavorite={true}
                    onVisit={() => {}}
                    isVisited={visited.includes(artifact.id)}
                  />
                ))}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ArtifactCard({ artifact, onFavorite, isFavorite, onVisit, isVisited }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{artifact.title}</CardTitle>
        <CardDescription>{artifact.category}</CardDescription>
      </CardHeader>
      <PlaceholderViewer modelSrc={artifact.src} onLoad={onVisit} />
      <CardContent>
        <p>{artifact.description}</p>
        <Label>
          <Checkbox checked={isVisited} readOnly /> Visited
        </Label>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          onClick={() => onFavorite(artifact.id)}
          variant={isFavorite ? "destructive" : "default"}
        >
          {isFavorite ? "Unfavorite" : "Favorite"}
        </Button>
      </CardFooter>
    </Card>
  );
}
