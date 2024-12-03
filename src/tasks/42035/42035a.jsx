import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle,
  
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";


// Button,
//   Input,
//   Textarea,
//   Checkbox,

const initialRooms = [
  { id: 1, name: "Math Study Group", members: ["Alice", "Bob"], notes: [], files: [] },
];

export default function App() {
  const [rooms, setRooms] = useState(initialRooms);
  const [currentRoom, setCurrentRoom] = useState(initialRooms[0]);
  const [newNote, setNewNote] = useState({ title: '', content: '', important: false });
  const [newFile, setNewFile] = useState(null);

  const handleCreateRoom = () => {
    const newRoom = { id: rooms.length + 1, name: `New Room ${rooms.length + 1}`, members: [], notes: [], files: [] };
    setRooms([...rooms, newRoom]);
    setCurrentRoom(newRoom);
  };

  const handleAddNote = () => {
    if (newNote.title) {
      const updatedNotes = [...currentRoom.notes, { ...newNote, id: Date.now() }];
      setCurrentRoom({ ...currentRoom, notes: updatedNotes });
      setNewNote({ title: '', content: '', important: false });
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewFile(file);
      // Here you would typically upload the file to a server or handle it locally
      // For simplicity, we'll just keep it in state
      setCurrentRoom(prev => ({ ...prev, files: [...prev.files, file.name] }));
    }
  };

  const handleDownload = (filename) => {
    // Placeholder for download logic, actual implementation would fetch the file
    console.log(`Downloading ${filename}`);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col sm:flex-row">
        <div className="sm:w-1/4 p-2">
          <Card>
            <CardHeader>
              <CardTitle>Study Rooms</CardTitle>
            </CardHeader>
            <CardContent>
              {rooms.map(room => (
                <div key={room.id} onClick={() => setCurrentRoom(room)} className="cursor-pointer hover:bg-gray-100 p-2">
                  {room.name}
                </div>
              ))}
            </CardContent>
            <CardFooter>
              <Button onClick={handleCreateRoom}>Create Room</Button>
            </CardFooter>
          </Card>
        </div>
        <div className="sm:w-3/4 p-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>{currentRoom.name}</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="mb-4">
                <Input 
                  value={newNote.title} 
                  onChange={(e) => setNewNote({...newNote, title: e.target.value})} 
                  placeholder="Note Title" 
                />
                <Textarea 
                  value={newNote.content} 
                  onChange={(e) => setNewNote({...newNote, content: e.target.value})} 
                  placeholder="Note Content" 
                  className="mt-2"
                />
                <Checkbox 
                  checked={newNote.important} 
                  onCheckedChange={(checked) => setNewNote({...newNote, important: checked})} 
                >
                  Important
                </Checkbox>
                <Button onClick={handleAddNote} className="mt-2">Add Note</Button>
              </div>
              <div>
                <h3 className="font-bold mb-2">Notes:</h3>
                {currentRoom.notes.map(note => (
                  <Card key={note.id} className="mb-2">
                    <CardContent>
                      <p className={note.important ? "text-red-500" : ""}>{note.title}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div className="mt-4">
                <input type="file" onChange={handleFileUpload} className="file-input file-input-bordered w-full max-w-xs" />
                <h3 className="font-bold mt-4 mb-2">Files:</h3>
                {currentRoom.files.map(file => (
                  <div key={file} className="flex justify-between items-center">
                    <span>{file}</span>
                    <Button onClick={() => handleDownload(file)}>Download</Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}