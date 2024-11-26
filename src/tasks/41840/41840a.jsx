import React, { useState } from 'react';
// import { 
//   Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, 
//   Input, Button, Select, SelectItem, Textarea, Dialog, DialogContent, 
//   DialogHeader, DialogFooter, DialogTitle, useToast, Toast, Toaster 
// } from "@/components/ui";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {useToast, Toaster }from "@/components/ui/toaster"



const Moods = ['Happy', 'Sad', 'Chill', 'Energetic'];
const Genres = ['Pop', 'Rock', 'Jazz', 'Classical'];

function SongCard({ song, onEdit, onDelete }) {
  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>{song.title}</CardTitle>
        <CardDescription>{song.artist}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Mood: {song.mood}</p>
        <p>Genre: {song.genre}</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button onClick={() => onEdit(song)}>Edit</Button>
        <Button onClick={() => onDelete(song)} variant="destructive">Delete</Button>
      </CardFooter>
    </Card>
  );
}

function SongForm({ onClose, onSubmit, initialSong = { title: '', artist: '', mood: '', genre: '' } }) {
  const [song, setSong] = useState(initialSong);
  const { toast } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!song.title || !song.artist) {
      toast({ variant: "destructive", title: "Error", description: "Title and Artist are required." });
      return;
    }
    onSubmit(song);
    onClose();
  };

  return (
    <Dialog open onClose={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{initialSong.id ? 'Edit Song' : 'Add Song'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <Input 
            value={song.title} 
            onChange={e => setSong({ ...song, title: e.target.value })} 
            placeholder="Song Title" 
            className="mb-2"
          />
          <Input 
            value={song.artist} 
            onChange={e => setSong({ ...song, artist: e.target.value })} 
            placeholder="Artist" 
            className="mb-2"
          />
          <Select value={song.mood} onChange={mood => setSong({ ...song, mood })}>
            <SelectItem value="">Select Mood</SelectItem>
            {Moods.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
          </Select>
          <Select value={song.genre} onChange={genre => setSong({ ...song, genre })} className="mt-2">
            <SelectItem value="">Select Genre</SelectItem>
            {Genres.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}
          </Select>
          <Button type="submit" className="mt-4 w-full">Save</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function App() {
  const [songs, setSongs] = useState([]);
  const [editingSong, setEditingSong] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const addSong = (song) => {
    setSongs([...songs, { ...song, id: Date.now() }]);
  };

  const updateSong = (updatedSong) => {
    setSongs(songs.map(s => s.id === updatedSong.id ? updatedSong : s));
  };

  const deleteSong = (song) => {
    setSongs(songs.filter(s => s.id !== song.id));
  };

  const sharePlaylist = () => {
    const text = songs.map(s => `${s.title} - ${s.artist}`).join('\n');
    navigator.clipboard.writeText(text).then(() => {
      alert('Playlist copied to clipboard!');
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
  };

  return (
    <div className="container mx-auto p-4 sm:p-6">
      <Toaster />
      <h1 className="text-2xl font-bold mb-4">My Playlist Creator</h1>
      <Button onClick={() => { setIsOpen(true); setEditingSong(null); }} className="mb-4">Add Song</Button>
      <SongForm 
        onClose={() => setIsOpen(false)} 
        onSubmit={editingSong ? updateSong : addSong} 
        initialSong={editingSong || {}} 
        open={isOpen} 
      />
      {songs.map(song => (
        <SongCard key={song.id} song={song} onEdit={setEditingSong} onDelete={deleteSong} />
      ))}
      {songs.length > 0 && (
        <Button onClick={sharePlaylist} className="mt-4">Share Playlist</Button>
      )}
    </div>
  );
}