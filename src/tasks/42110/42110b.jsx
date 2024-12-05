import React, { useState, useMemo } from 'react'; // Ensure this line is uncommented
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const App = () => {
  const [playlists, setPlaylists] = useState([]);
  const [currentPlaylist, setCurrentPlaylist] = useState(null);
  const [newSong, setNewSong] = useState({ title: '', artist: '', duration: '', genre: '', mood: '' });

  const addPlaylist = () => {
    setPlaylists([...playlists, { id: Date.now(), title: 'New Playlist', description: '', songs: [] }]);
  };

  const deletePlaylist = (id) => {
    setPlaylists(playlists.filter(p => p.id !== id));
  };

  const updatePlaylist = (id, field, value) => {
    setPlaylists(playlists.map(p => 
      p.id === id ? { ...p, [field]: value } : p
    ));
  };

  const addSong = () => {
    if (currentPlaylist !== null) {
      const updatedPlaylist = playlists.find(p => p.id === currentPlaylist);
      updatedPlaylist.songs.push({ ...newSong, id: Date.now() });
      setPlaylists([...playlists]);
      setNewSong({ title: '', artist: '', duration: '', genre: '', mood: '' });
    }
  };

  const deleteSong = (playlistId, songId) => {
    const updated = playlists.map(p => {
      if (p.id === playlistId) {
        return { ...p, songs: p.songs.filter(s => s.id !== songId) };
      }
      return p;
    });
    setPlaylists(updated);
  };

  const totalDuration = useMemo(() => {
    if (!currentPlaylist) return 0;
    return playlists.find(p => p.id === currentPlaylist)?.songs.reduce((acc, song) => acc + parseFloat(song.duration || 0), 0);
  }, [currentPlaylist, playlists]);

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(playlists);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setPlaylists(items);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
      <h1 className="text-2xl font-bold mb-4">Music Playlist Manager</h1>
      <Button onClick={addPlaylist}>Add Playlist</Button>
      
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="playlists">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {playlists.map((playlist, index) => (
                <Draggable key={playlist.id} draggableId={playlist.id.toString()} index={index}>
                  {(provided) => (
                    <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                      <Card>
                        <CardHeader>
                          <CardTitle>
                            <Input 
                              value={playlist.title} 
                              onChange={(e) => updatePlaylist(playlist.id, 'title', e.target.value)} 
                              placeholder="Playlist Title"
                            />
                          </CardTitle>
                          <CardDescription>
                            <Input 
                              value={playlist.description} 
                              onChange={(e) => updatePlaylist(playlist.id, 'description', e.target.value)} 
                              placeholder="Description"
                            />
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <Button onClick={() => setCurrentPlaylist(playlist.id)}>Manage Songs</Button>
                          <Button onClick={() => deletePlaylist(playlist.id)} className="ml-2">Delete</Button>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {currentPlaylist !== null && (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>{playlists.find(p => p.id === currentPlaylist)?.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              {['title', 'artist', 'duration', 'genre', 'mood'].map((field) => (
                <Input 
                  key={field}
                  value={newSong[field]}
                  onChange={(e) => setNewSong({ ...newSong, [field]: e.target.value })}
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  className="mb-2"
                />
              ))}
              <Button onClick={addSong}>Add Song</Button>
            </div>
            <div>
              Total Duration: {totalDuration} minutes
              <progress className="w-full" value={totalDuration} max="600"></progress>
            </div>
            <ul>
              {playlists.find(p => p.id === currentPlaylist)?.songs.map((song) => (
                <li key={song.id} className="flex justify-between items-center p-2 border-b">
                  {song.title} - {song.artist}
                  <Button onClick={() => deleteSong(currentPlaylist, song.id)}>Remove</Button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default App;
