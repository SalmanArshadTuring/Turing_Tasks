import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function App() {
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [newPlaylist, setNewPlaylist] = useState({ title: "", description: "" });
  const [filter, setFilter] = useState({ genre: "", mood: "" });

  const addPlaylist = () => {
    setPlaylists([
      ...playlists,
      { id: Date.now(), ...newPlaylist, songs: [], totalDuration: 0 },
    ]);
    setNewPlaylist({ title: "", description: "" });
  };

  const deletePlaylist = (id) => {
    setPlaylists(playlists.filter((p) => p.id !== id));
    if (selectedPlaylist?.id === id) setSelectedPlaylist(null);
  };

  const addSong = (playlistId, song) => {
    setPlaylists(
      playlists.map((p) =>
        p.id === playlistId
          ? {
              ...p,
              songs: [...p.songs, { id: Date.now(), ...song }],
              totalDuration: p.totalDuration + parseInt(song.duration, 10),
            }
          : p
      )
    );
  };

  const resetPlaylists = () => {
    setPlaylists([]);
    setSelectedPlaylist(null);
  };

  const exportPlaylists = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(playlists));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "playlists.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="p-4 sm:p-8 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold text-center mb-6">Music Playlist App</h1>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Create Playlist</CardTitle>
          <CardDescription>Customize your playlist title and description</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Playlist Title"
              value={newPlaylist.title}
              onChange={(e) =>
                setNewPlaylist({ ...newPlaylist, title: e.target.value })
              }
              className="border rounded px-2 py-1"
            />
            <input
              type="text"
              placeholder="Playlist Description"
              value={newPlaylist.description}
              onChange={(e) =>
                setNewPlaylist({ ...newPlaylist, description: e.target.value })
              }
              className="border rounded px-2 py-1"
            />
            <button
              onClick={addPlaylist}
              className="bg-blue-500 text-white rounded px-4 py-2"
            >
              Add Playlist
            </button>
          </div>
        </CardContent>
      </Card>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {playlists.map((playlist) => (
          <Card key={playlist.id}>
            <CardHeader>
              <CardTitle>{playlist.title}</CardTitle>
              <CardDescription>{playlist.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Total Duration: {playlist.totalDuration} mins</p>
              {playlist.songs
                .filter(
                  (song) =>
                    (!filter.genre || song.genre === filter.genre) &&
                    (!filter.mood || song.mood === filter.mood)
                )
                .map((song) => (
                  <div key={song.id} className="border-b py-2">
                    <p>
                      <strong>{song.title}</strong> - {song.artist} ({song.duration} mins)
                    </p>
                    <p className="text-sm">
                      Genre: {song.genre} | Mood: {song.mood}
                    </p>
                    <a
                      href={song.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline"
                    >
                      Listen to Song
                    </a>
                  </div>
                ))}
              <button
                onClick={() => setSelectedPlaylist(playlist)}
                className="text-blue-500 mt-2 underline"
              >
                Add Song
              </button>
              <button
                onClick={() => deletePlaylist(playlist.id)}
                className="text-red-500 ml-4 underline"
              >
                Delete Playlist
              </button>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedPlaylist && (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Add Song to {selectedPlaylist.title}</CardTitle>
            <CardDescription>Specify song details</CardDescription>
          </CardHeader>
          <CardContent>
            <AddSongForm
              onSubmit={(song) => {
                addSong(selectedPlaylist.id, song);
                setSelectedPlaylist(null);
              }}
              onCancel={() => setSelectedPlaylist(null)}
            />
          </CardContent>
        </Card>
      )}

      <div className="mt-6 flex gap-4">
        <button
          onClick={resetPlaylists}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Reset Playlists
        </button>
        <button
          onClick={exportPlaylists}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Export Playlists
        </button>
      </div>
    </div>
  );
}

function AddSongForm({ onSubmit, onCancel }) {
  const [song, setSong] = useState({
    title: "",
    artist: "",
    duration: "",
    genre: "",
    mood: "",
    link: "",
  });

  return (
    <div className="flex flex-col gap-4">
      <input
        type="text"
        placeholder="Song Title"
        value={song.title}
        onChange={(e) => setSong({ ...song, title: e.target.value })}
        className="border rounded px-2 py-1"
      />
      <input
        type="text"
        placeholder="Artist"
        value={song.artist}
        onChange={(e) => setSong({ ...song, artist: e.target.value })}
        className="border rounded px-2 py-1"
      />
      <input
        type="number"
        placeholder="Duration (mins)"
        value={song.duration}
        onChange={(e) => setSong({ ...song, duration: e.target.value })}
        className="border rounded px-2 py-1"
      />
      <input
        type="text"
        placeholder="Genre"
        value={song.genre}
        onChange={(e) => setSong({ ...song, genre: e.target.value })}
        className="border rounded px-2 py-1"
      />
      <input
        type="text"
        placeholder="Mood"
        value={song.mood}
        onChange={(e) => setSong({ ...song, mood: e.target.value })}
        className="border rounded px-2 py-1"
      />
      <input
        type="url"
        placeholder="Song Link"
        value={song.link}
        onChange={(e) => setSong({ ...song, link: e.target.value })}
        className="border rounded px-2 py-1"
      />
      <div className="flex gap-4">
        <button
          onClick={() => onSubmit(song)}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Song
        </button>
        <button
          onClick={onCancel}
          className="bg-gray-300 px-4 py-2 rounded"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
