import React, { useState, useEffect } from "react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const moods = ["Happy", "Sad", "Energetic", "Calm", "Romantic"];
const genres = ["Pop", "Rock", "Hip Hop", "Jazz", "Classical", "Electronic"];

const SongCard = ({ song, onEdit, onDelete }) => (
  <Card className="w-full sm:w-64 m-2">
    <CardHeader>
      <CardTitle className="text-lg">{song.title}</CardTitle>
      <CardDescription>{song.artist}</CardDescription>
    </CardHeader>
    <CardContent>
      <p>Mood: {song.mood}</p>
      <p>Genre: {song.genre}</p>
    </CardContent>
    <CardFooter className="flex justify-between">
      <Button variant="outline" onClick={() => onEdit(song)}>Edit</Button>
      <Button variant="destructive" onClick={() => onDelete(song.id)}>Delete</Button>
    </CardFooter>
  </Card>
);

const SongForm = ({ onSubmit, initialValues = {} }) => {
  const [title, setTitle] = useState(initialValues.title || "");
  const [artist, setArtist] = useState(initialValues.artist || "");
  const [mood, setMood] = useState(initialValues.mood || "");
  const [genre, setGenre] = useState(initialValues.genre || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ title, artist, mood, genre });
    setTitle("");
    setArtist("");
    setMood("");
    setGenre("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        placeholder="Song Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <Input
        placeholder="Artist"
        value={artist}
        onChange={(e) => setArtist(e.target.value)}
        required
      />
      <Select value={mood} onValueChange={setMood} required>
        <SelectTrigger>
          <SelectValue placeholder="Select Mood" />
        </SelectTrigger>
        <SelectContent>
          {moods.map((m) => (
            <SelectItem key={m} value={m}>{m}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={genre} onValueChange={setGenre} required>
        <SelectTrigger>
          <SelectValue placeholder="Select Genre" />
        </SelectTrigger>
        <SelectContent>
          {genres.map((g) => (
            <SelectItem key={g} value={g}>{g}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button type="submit">Add Song</Button>
    </form>
  );
};

const PlaylistSummary = ({ songs }) => (
  <div className="bg-gray-100 p-4 rounded-lg">
    <h2 className="text-xl font-bold mb-2">Playlist Summary</h2>
    <p>Total Songs: {songs.length}</p>
    <p>Genres: {[...new Set(songs.map((s) => s.genre))].join(", ")}</p>
    <p>Moods: {[...new Set(songs.map((s) => s.mood))].join(", ")}</p>
  </div>
);

export default function App() {
  const [songs, setSongs] = useState([]);
  const [editingSong, setEditingSong] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const savedSongs = localStorage.getItem("playlist");
    if (savedSongs) {
      setSongs(JSON.parse(savedSongs));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("playlist", JSON.stringify(songs));
  }, [songs]);

  const addSong = (song) => {
    setSongs([...songs, { ...song, id: Date.now() }]);
  };

  const updateSong = (updatedSong) => {
    setSongs(songs.map((s) => (s.id === updatedSong.id ? updatedSong : s)));
    setEditingSong(null);
  };

  const deleteSong = (id) => {
    setSongs(songs.filter((s) => s.id !== id));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Custom Playlist Creator</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <h2 className="text-2xl font-semibold mb-2">Add New Song</h2>
          <SongForm onSubmit={addSong} />
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-2">Playlist</h2>
          <div className="flex flex-wrap">
            {songs.map((song) => (
              <SongCard
                key={song.id}
                song={song}
                onEdit={setEditingSong}
                onDelete={deleteSong}
              />
            ))}
          </div>
        </div>
      </div>
      <Dialog open={!!editingSong} onOpenChange={() => setEditingSong(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Song</DialogTitle>
          </DialogHeader>
          <SongForm onSubmit={updateSong} initialValues={editingSong} />
        </DialogContent>
      </Dialog>
      <div className="mt-8">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>Generate Shareable Summary</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Playlist Summary</DialogTitle>
            </DialogHeader>
            <PlaylistSummary songs={songs} />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}