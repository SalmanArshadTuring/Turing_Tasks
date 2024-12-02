import React, { useState, useEffect } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Toggle } from "@/components/ui/toggle";

const PhotoCard = ({ photo, onTagAdd, onTagDelete, onTagEdit }) => {
  const [newTag, setNewTag] = useState("");
  const [editingTag, setEditingTag] = useState(null);

  return (
    <Card className="w-full sm:w-64 m-2">
      <CardContent className="p-4">
        <img src={photo.url} alt={photo.name} className="w-full h-48 object-cover mb-2" />
        <p className="font-semibold">{photo.name}</p>
        <p className="text-sm text-gray-500">{new Date(photo.uploadTime).toLocaleString()}</p>
        <div className="flex flex-wrap mt-2">
          {photo.tags.map((tag, index) => (
            <Badge key={index} className="m-1">
              {editingTag === index ? (
                <Input
                  value={tag}
                  onChange={(e) => onTagEdit(photo.id, index, e.target.value)}
                  onBlur={() => setEditingTag(null)}
                  autoFocus
                  className="w-16 h-6 p-1"
                />
              ) : (
                <>
                  <span onClick={() => setEditingTag(index)}>{tag}</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onTagDelete(photo.id, tag)}
                    className="ml-1 p-0"
                  >
                    ×
                  </Button>
                </>
              )}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Input
          placeholder="Add tag"
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          className="mr-2"
        />
        <Button onClick={() => {
          onTagAdd(photo.id, newTag);
          setNewTag("");
        }}>Add</Button>
      </CardFooter>
    </Card>
  );
};

export default function App() {
  const [photos, setPhotos] = useState([]);
  const [filter, setFilter] = useState("");
  const [sortBy, setSortBy] = useState("uploadTime");
  const [isGridView, setIsGridView] = useState(true);

  useEffect(() => {
    // Simulating photo data
    setPhotos([
      { id: 1, name: "Beach", url: "https://picsum.photos/id/1011/300/200", tags: ["summer", "vacation"], uploadTime: Date.now() - 1000000 },
      { id: 2, name: "Mountain", url: "https://picsum.photos/id/1018/300/200", tags: ["hiking", "nature"], uploadTime: Date.now() - 2000000 },
      { id: 3, name: "City", url: "https://picsum.photos/id/1015/300/200", tags: ["urban", "architecture"], uploadTime: Date.now() - 3000000 },
    ]);
  }, []);

  const handlePhotoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newPhoto = {
          id: Date.now(),
          name: file.name,
          url: e.target.result,
          tags: [],
          uploadTime: Date.now(),
        };
        setPhotos([...photos, newPhoto]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTagAdd = (photoId, tag) => {
    setPhotos(photos.map(photo =>
      photo.id === photoId ? { ...photo, tags: [...photo.tags, tag] } : photo
    ));
  };

  const handleTagDelete = (photoId, tagToDelete) => {
    setPhotos(photos.map(photo =>
      photo.id === photoId ? { ...photo, tags: photo.tags.filter(tag => tag !== tagToDelete) } : photo
    ));
  };

  const handleTagEdit = (photoId, tagIndex, newTag) => {
    setPhotos(photos.map(photo =>
      photo.id === photoId ? {
        ...photo,
        tags: photo.tags.map((tag, index) => index === tagIndex ? newTag : tag)
      } : photo
    ));
  };

  const filteredPhotos = photos.filter(photo =>
    photo.tags.some(tag => tag.toLowerCase().includes(filter.toLowerCase()))
  );

  const sortedPhotos = [...filteredPhotos].sort((a, b) => {
    if (sortBy === "uploadTime") {
      return b.uploadTime - a.uploadTime;
    } else if (sortBy === "tag") {
      return a.tags[0]?.localeCompare(b.tags[0] || "");
    }
  });

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Photo Gallery</h1>
      <div className="mb-4">
        <Input
          type="file"
          accept="image/*"
          onChange={handlePhotoUpload}
          className="mb-2"
        />
        <Input
          placeholder="Filter by tag"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="mb-2"
        />
        <div className="flex items-center space-x-2">
          <Button onClick={() => setSortBy("uploadTime")}>Sort by Time</Button>
          <Button onClick={() => setSortBy("tag")}>Sort by Tag</Button>
          <Toggle
            pressed={isGridView}
            onPressedChange={setIsGridView}
          >
            {isGridView ? "Grid View" : "List View"}
          </Toggle>
        </div>
      </div>
      <div className={`${isGridView ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4' : 'space-y-4'}`}>
        {sortedPhotos.map(photo => (
          <PhotoCard
            key={photo.id}
            photo={photo}
            onTagAdd={handleTagAdd}
            onTagDelete={handleTagDelete}
            onTagEdit={handleTagEdit}
          />
        ))}
      </div>
    </div>
  );
}