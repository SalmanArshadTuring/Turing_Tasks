import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const App = () => {
  const [uploadedModels, setUploadedModels] = useState([]);
  const [curatedGallery, setCuratedGallery] = useState([]);
  const [selectedArtifact, setSelectedArtifact] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [visited, setVisited] = useState([]);
  const [filterTag, setFilterTag] = useState("All");

  useEffect(() => {
    // Preload curated artifacts (example data)
    setCuratedGallery([
      {
        id: 1,
        title: "Ancient Vase",
        description: "A Greek vase from 500 BC.",
        image: "https://upload.wikimedia.org/wikipedia/commons/0/00/Tresor_Lyon_Vaise-Buste.jpg",
        origin: "Greece",
        period: "500 BC",
        tags: ["Ancient", "Ceramic"],
      },
      {
        id: 2,
        title: "Roman Helmet",
        description: "A Roman centurion's helmet from 50 AD.",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTB9hhcCdGKSCzWW_w-rwS2TOX0ur2f4ZunCA&s",
        origin: "Rome",
        period: "50 AD",
        tags: ["Ancient", "Metal"],
      },
    ]);
  }, []);

  const handleFileUpload = (event) => {
    const files = event.target.files;
    const models = Array.from(files).map((file) => ({ id: Date.now() + file.name, name: file.name }));
    setUploadedModels((prev) => [...prev, ...models]);
  };

  const handleSelectArtifact = (artifact) => {
    setSelectedArtifact(artifact);
    if (!visited.find((item) => item.id === artifact.id)) {
      setVisited((prev) => [...prev, artifact]);
    }
  };

  const toggleFavorite = (artifact) => {
    if (favorites.find((item) => item.id === artifact.id)) {
      setFavorites((prev) => prev.filter((item) => item.id !== artifact.id));
    } else {
      setFavorites((prev) => [...prev, artifact]);
    }
  };

  const clearUploads = () => {
    setUploadedModels([]);
  };

  const filteredGallery = filterTag === "All"
    ? curatedGallery
    : curatedGallery.filter((item) => item.tags.includes(filterTag));

  return (
    <div className="p-4 sm:p-8">
      <h1 className="text-2xl font-bold mb-4">3D Historical Artifact Explorer</h1>
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Upload Your Artifacts</h2>
        <input
          type="file"
          accept=".obj,.glb"
          multiple
          onChange={handleFileUpload}
          className="block w-full border border-gray-300 rounded-lg p-2"
        />
        <button
          onClick={clearUploads}
          className="mt-2 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
        >
          Clear Uploads
        </button>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Curated Gallery</h2>
        <div className="flex space-x-4 mb-4">
          {[
            "All",
            ...new Set(curatedGallery.flatMap((item) => item.tags)),
          ].map((tag) => (
            <button
              key={tag}
              onClick={() => setFilterTag(tag)}
              className={`px-3 py-1 rounded-md ${
                filterTag === tag
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredGallery.map((artifact) => (
            <Card
              key={artifact.id}
              onClick={() => handleSelectArtifact(artifact)}
              className="cursor-pointer"
            >
              <CardHeader>
                <CardTitle>{artifact.title}</CardTitle>
                <CardDescription>{artifact.period}</CardDescription>
              </CardHeader>
              <CardContent>
                <img src={artifact.image} alt={artifact.title} className="w-full h-40 object-cover" />
              </CardContent>
              <CardFooter>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(artifact);
                  }}
                  className="text-sm text-blue-500 hover:underline"
                >
                  {favorites.find((item) => item.id === artifact.id)
                    ? "Remove from Favorites"
                    : "Add to Favorites"}
                </button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      {selectedArtifact && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Artifact Details</h2>
          <Card>
            <CardHeader>
              <CardTitle>{selectedArtifact.title}</CardTitle>
              <CardDescription>{selectedArtifact.origin}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>{selectedArtifact.description}</p>
              <p className="mt-2 text-sm text-gray-500">Period: {selectedArtifact.period}</p>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Your Uploaded Models</h2>
        {uploadedModels.length === 0 ? (
          <p className="text-gray-500">No models uploaded yet.</p>
        ) : (
          <ul className="list-disc ml-6">
            {uploadedModels.map((model) => (
              <li key={model.id}>{model.name}</li>
            ))}
          </ul>
        )}
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Favorites</h2>
        {favorites.length === 0 ? (
          <p className="text-gray-500">No favorites added yet.</p>
        ) : (
          <ul className="list-disc ml-6">
            {favorites.map((artifact) => (
              <li key={artifact.id}>{artifact.title}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default App;
