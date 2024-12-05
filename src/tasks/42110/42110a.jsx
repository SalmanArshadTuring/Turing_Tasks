import React, { useState, useEffect } from "react";
// import { DragDropContext, Droppable, Draggable } from "@/components/ui/dnd";
import {
    DragDropContext,
    Droppable,
    Draggable,
  } from "@hello-pangea/dnd";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const initialPlaylists = [
  {
    id: "1",
    title: "My Favorites",
    description: "A collection of my favorite songs",
    songs: [
      { id: "1", title: "Song 1", artist: "Artist 1", duration: 180, genre: "Pop", mood: "Happy" },
      { id: "2", title: "Song 2", artist: "Artist 2", duration: 240, genre: "Rock", mood: "Energetic" },
    ],
  },
];

export default function App() {
  const [playlists, setPlaylists] = useState(initialPlaylists);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [filter, setFilter] = useState({ genre: "", mood: "" });

  useEffect(() => {
    const savedPlaylists = localStorage.getItem("playlists");
    if (savedPlaylists) {
      setPlaylists(JSON.parse(savedPlaylists));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("playlists", JSON.stringify(playlists));
  }, [playlists]);

  const addPlaylist = (title, description) => {
    const newPlaylist = {
      id: Date.now().toString(),
      title,
      description,
      songs: [],
    };
    setPlaylists([...playlists, newPlaylist]);
  };

  const updatePlaylist = (id, title, description) => {
    setPlaylists(
      playlists.map((playlist) =>
        playlist.id === id ? { ...playlist, title, description } : playlist
      )
    );
  };

  const deletePlaylist = (id) => {
    setPlaylists(playlists.filter((playlist) => playlist.id !== id));
    if (selectedPlaylist && selectedPlaylist.id === id) {
      setSelectedPlaylist(null);
    }
  };

  const addSong = (playlistId, song) => {
    setPlaylists(
      playlists.map((playlist) =>
        playlist.id === playlistId
          ? { ...playlist, songs: [...playlist.songs, { ...song, id: Date.now().toString() }] }
          : playlist
      )
    );
  };

  const deleteSong = (playlistId, songId) => {
    setPlaylists(
      playlists.map((playlist) =>
        playlist.id === playlistId
          ? { ...playlist, songs: playlist.songs.filter((song) => song.id !== songId) }
          : playlist
      )
    );
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const sourceIndex = result.source.index;
    const destIndex = result.destination.index;

    if (result.type === "playlist") {
      const reorderedPlaylists = Array.from(playlists);
      const [reorderedItem] = reorderedPlaylists.splice(sourceIndex, 1);
      reorderedPlaylists.splice(destIndex, 0, reorderedItem);
      setPlaylists(reorderedPlaylists);
    } else if (result.type === "song") {
      const playlistId = result.source.droppableId;
      const playlist = playlists.find((p) => p.id === playlistId);
      const reorderedSongs = Array.from(playlist.songs);
      const [reorderedItem] = reorderedSongs.splice(sourceIndex, 1);
      reorderedSongs.splice(destIndex, 0, reorderedItem);
      setPlaylists(
        playlists.map((p) =>
          p.id === playlistId ? { ...p, songs: reorderedSongs } : p
        )
      );
    }
  };

  const exportPlaylist = (playlist) => {
    const dataStr = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(playlist)
    )}`;
    const downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `${playlist.title}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const resetPlaylists = () => {
    setPlaylists(initialPlaylists);
    setSelectedPlaylist(null);
  };

  const filteredSongs = selectedPlaylist
    ? selectedPlaylist.songs.filter(
        (song) =>
          (!filter.genre || song.genre === filter.genre) &&
          (!filter.mood || song.mood === filter.mood)
      )
    : [];

  const totalDuration = filteredSongs.reduce((sum, song) => sum + song.duration, 0);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Music Playlist App</h1>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Droppable droppableId="playlists" type="playlist">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                <h2 className="text-2xl font-semibold mb-2">Playlists</h2>
                {playlists.map((playlist, index) => (
                  <Draggable key={playlist.id} draggableId={playlist.id} index={index}>
                    {(provided) => (
                      <Card
                        className="mb-2"
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <CardHeader>
                          <CardTitle>{playlist.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p>{playlist.description}</p>
                          <div className="mt-2">
                            <Button onClick={() => setSelectedPlaylist(playlist)}>View</Button>
                            <Button onClick={() => deletePlaylist(playlist.id)} className="ml-2">
                              Delete
                            </Button>
                            <Button onClick={() => exportPlaylist(playlist)} className="ml-2">
                              Export
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
          <div>
            <h2 className="text-2xl font-semibold mb-2">
              {selectedPlaylist ? selectedPlaylist.title : "Select a Playlist"}
            </h2>
            {selectedPlaylist && (
              <>
                <div className="mb-4">
                  <Select
                    value={filter.genre}
                    onChange={(e) => setFilter({ ...filter, genre: e.target.value })}
                  >
                    <option value="">All Genres</option>
                    <option value="Pop">Pop</option>
                    <option value="Rock">Rock</option>
                    <option value="Hip Hop">Hip Hop</option>
                  </Select>
                  <Select
                    value={filter.mood}
                    onChange={(e) => setFilter({ ...filter, mood: e.target.value })}
                    className="ml-2"
                  >
                    <option value="">All Moods</option>
                    <option value="Happy">Happy</option>
                    <option value="Sad">Sad</option>
                    <option value="Energetic">Energetic</option>
                  </Select>
                </div>
                <Droppable droppableId={selectedPlaylist.id} type="song">
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef}>
                      {filteredSongs.map((song, index) => (
                        <Draggable key={song.id} draggableId={song.id} index={index}>
                          {(provided) => (
                            <Card
                              className="mb-2"
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <CardContent>
                                <p>{song.title} - {song.artist}</p>
                                <p>Duration: {song.duration}s | Genre: {song.genre} | Mood: {song.mood}</p>
                                <Button
                                  onClick={() => deleteSong(selectedPlaylist.id, song.id)}
                                  className="mt-2"
                                >
                                  Remove
                                </Button>
                              </CardContent>
                            </Card>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
                <div className="mt-4">
                  <p>Total Duration: {totalDuration}s</p>
                  <Progress value={(totalDuration / 3600) * 100} className="mt-2" />
                </div>
              </>
            )}
          </div>
        </div>
      </DragDropContext>
      <div className="mt-4">
        <Dialog>
          <DialogTrigger asChild>
            <Button>Add Playlist</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Playlist</DialogTitle>
            </DialogHeader>
            <AddPlaylistForm onSubmit={addPlaylist} />
          </DialogContent>
        </Dialog>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="ml-2">Add Song</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Song</DialogTitle>
            </DialogHeader>
            <AddSongForm onSubmit={(song) => addSong(selectedPlaylist.id, song)} />
          </DialogContent>
        </Dialog>
        <Button onClick={resetPlaylists} className="ml-2">
          Reset Playlists
        </Button>
      </div>
    </div>
  );
}

function AddPlaylistForm({ onSubmit }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(title, description);
    setTitle("");
    setDescription("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Playlist Title"
        className="mb-2"
      />
      <Input
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Playlist Description"
        className="mb-2"
      />
      <Button type="submit">Add Playlist</Button>
    </form>
  );
}

function AddSongForm({ onSubmit }) {
  const [song, setSong] = useState({
    title: "",
    artist: "",
    duration: 0,
    genre: "",
    mood: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(song);
    setSong({ title: "", artist: "", duration: 0, genre: "", mood: "" });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input
        value={song.title}
        onChange={(e) => setSong({ ...song, title: e.target.value })}
        placeholder="Song Title"
        className="mb-2"
      />
      <Input
        value={song.artist}
        onChange={(e) => setSong({ ...song, artist: e.target.value })}
        placeholder="Artist"
        className="mb-2"
      />
      <Input
        type="number"
        value={song.duration}
        onChange={(e) => setSong({ ...song, duration: parseInt(e.target.value) })}
        placeholder="Duration (seconds)"
        className="mb-2"
      />
      <Select
        value={song.genre}
        onChange={(e) => setSong({ ...song, genre: e.target.value })}
        className="mb-2"
      >
        <option value="">Select Genre</option>
        <option value="Pop">Pop</option>
        <option value="Rock">Rock</option>
        <option value="Hip Hop">Hip Hop</option>
      </Select>
      <Select
        value={song.mood}
        onChange={(e) => setSong({ ...song, mood: e.target.value })}
        className="mb-2"
      >
        <option value="">Select Mood</option>
        <option value="Happy">Happy</option>
        <option value="Sad">Sad</option>
        <option value="Energetic">Energetic</option>
      </Select>
      <Button type="submit">Add Song</Button>
    </form>
  );
}