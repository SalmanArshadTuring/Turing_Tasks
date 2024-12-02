import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

function App() {
  const [photos, setPhotos] = useState([]);
  const [view, setView] = useState('grid');
  const [sortBy, setSortBy] = useState('uploadTime');
  const [filterTags, setFilterTags] = useState([]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotos(prevPhotos => [
          ...prevPhotos, 
          { id: Date.now(), src: reader.result, tags: [], uploaded: new Date() }
        ]);
      };
      reader.readAsDataURL(file);
    }
  };

  const addTag = (photoId, tag) => {
    setPhotos(photos.map(photo => 
      photo.id === photoId ? { ...photo, tags: [...photo.tags, tag] } : photo
    ));
  };

  const removeTag = (photoId, tagToRemove) => {
    setPhotos(photos.map(photo => 
      photo.id === photoId ? { ...photo, tags: photo.tags.filter(tag => tag !== tagToRemove) } : photo
    ));
  };

  const toggleFilterTag = (tag) => {
    setFilterTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const filteredPhotos = photos.filter(photo => 
    filterTags.length === 0 || filterTags.every(tag => photo.tags.includes(tag))
  );

  const sortedPhotos = [...filteredPhotos].sort((a, b) => {
    if (sortBy === 'uploadTime') return b.uploaded - a.uploaded;
    if (sortBy === 'alphabetical') return a.tags.join('').localeCompare(b.tags.join(''));
    return 0;
  });

  return (
    <div className="container mx-auto p-4 sm:p-6">
      <h1 className="text-3xl font-bold mb-4">Photo Gallery</h1>
      <div className="flex flex-wrap justify-between mb-4">
        <div>
          <Button>
            <label htmlFor="fileUpload" className="cursor-pointer">Upload Photo</label>
          </Button>
          <Input id="fileUpload" type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
        </div>
        <div className="flex items-center">
          <Button onClick={() => setView(view === 'grid' ? 'list' : 'grid')}>
            Toggle {view === 'grid' ? 'List' : 'Grid'}
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Sort By</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setSortBy('uploadTime')}>Upload Time</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy('alphabetical')}>Alphabetical</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="mb-4">
        <Label>Filter by Tags:</Label>
        {Array.from(new Set(photos.flatMap(photo => photo.tags))).map(tag => (
          <Checkbox key={tag} checked={filterTags.includes(tag)} onCheckedChange={() => toggleFilterTag(tag)}>{tag}</Checkbox>
        ))}
      </div>

      <div className={view === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4' : 'flex flex-col gap-4'}>
        {sortedPhotos.map(photo => (
          <PhotoCard key={photo.id} photo={photo} addTag={addTag} removeTag={removeTag} view={view} />
        ))}
      </div>
    </div>
  );
}

function PhotoCard({ photo, addTag, removeTag, view }) {
  const [newTag, setNewTag] = useState('');
  const [isEditingTags, setIsEditingTags] = useState(false);

  return (
    <Card className={view === 'grid' ? 'h-full' : 'flex'}>
      <CardHeader>
        <CardTitle>{photo.id}</CardTitle>
      </CardHeader>
      <CardContent className={view === 'grid' ? 'flex-grow' : ''}>
        <img src={photo.src} alt="Uploaded" className="w-full h-48 object-cover mb-2" />
        <div>
          {photo.tags.map(tag => (
            <span key={tag} className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
              {tag} 
              {isEditingTags && <button onClick={() => removeTag(photo.id, tag)} className="ml-1 text-red-500">x</button>}
            </span>
          ))}
        </div>
        {isEditingTags ? (
          <div>
            <Input 
              value={newTag} 
              onChange={e => setNewTag(e.target.value)} 
              placeholder="New tag"
            />
            <Button onClick={() => {addTag(photo.id, newTag); setNewTag('');}} className="mt-2">Add Tag</Button>
          </div>
        ) : (
          <Button onClick={() => setIsEditingTags(true)} className="mt-2">Edit Tags</Button>
        )}
      </CardContent>
      {view === 'list' && <CardFooter>
        <p>Uploaded: {photo.uploaded.toLocaleString()}</p>
      </CardFooter>}
    </Card>
  );
}

export default App;