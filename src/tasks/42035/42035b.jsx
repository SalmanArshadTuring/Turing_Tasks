import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

const StudyRoom = ({ room, onLeave }) => {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  const sendMessage = () => {
    if (message.trim()) {
      setChat([...chat, { user: "You", text: message }]);
      setMessage("");
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>{room.name}</CardTitle>
        <CardDescription>Study room for {room.subject}</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="chat">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="chat">Chat</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
            <TabsTrigger value="files">Files</TabsTrigger>
          </TabsList>
          <TabsContent value="chat">
            <ScrollArea className="h-[300px] w-full border rounded-md p-4">
              {chat.map((msg, index) => (
                <div key={index} className="mb-2">
                  <strong>{msg.user}:</strong> {msg.text}
                </div>
              ))}
            </ScrollArea>
            <div className="flex mt-4">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-grow mr-2"
              />
              <Button onClick={sendMessage}>Send</Button>
            </div>
          </TabsContent>
          <TabsContent value="notes">
            <NotesList roomId={room.id} />
          </TabsContent>
          <TabsContent value="files">
            <FileUploader roomId={room.id} />
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter>
        <Button onClick={onLeave} variant="outline">
          Leave Room
        </Button>
      </CardFooter>
    </Card>
  );
};

const NotesList = ({ roomId }) => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");

  const addNote = () => {
    if (newNote.trim()) {
      setNotes([...notes, { id: Date.now(), text: newNote, important: false, completed: false }]);
      setNewNote("");
    }
  };

  const toggleNoteStatus = (id, status) => {
    setNotes(notes.map(note =>
      note.id === id ? { ...note, [status]: !note[status] } : note
    ));
  };

  return (
    <div>
      <Textarea
        value={newNote}
        onChange={(e) => setNewNote(e.target.value)}
        placeholder="Add a new note..."
        className="mb-2"
      />
      <Button onClick={addNote} className="mb-4">Add Note</Button>
      <ScrollArea className="h-[200px] w-full border rounded-md p-4">
        {notes.map((note) => (
          <div key={note.id} className="flex items-center justify-between mb-2">
            <span>{note.text}</span>
            <div>
              <Badge
                variant={note.important ? "default" : "outline"}
                className="mr-2 cursor-pointer"
                onClick={() => toggleNoteStatus(note.id, "important")}
              >
                Important
              </Badge>
              <Badge
                variant={note.completed ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => toggleNoteStatus(note.id, "completed")}
              >
                Completed
              </Badge>
            </div>
          </div>
        ))}
      </ScrollArea>
    </div>
  );
};

const FileUploader = ({ roomId }) => {
  const [files, setFiles] = useState([]);

  const handleFileUpload = (e) => {
    const newFiles = Array.from(e.target.files);
    setFiles([...files, ...newFiles]);
  };

  return (
    <div>
      <Input type="file" onChange={handleFileUpload} className="mb-4" />
      <ScrollArea className="h-[200px] w-full border rounded-md p-4">
        {files.map((file, index) => (
          <div key={index} className="flex items-center justify-between mb-2">
            <span>{file.name}</span>
            <Button variant="outline" size="sm">Download</Button>
          </div>
        ))}
      </ScrollArea>
    </div>
  );
};

const CreateRoomDialog = ({ onCreateRoom }) => {
  const [roomName, setRoomName] = useState("");
  const [subject, setSubject] = useState("");

  const handleCreate = () => {
    if (roomName && subject) {
      onCreateRoom({ id: Date.now(), name: roomName, subject });
      setRoomName("");
      setSubject("");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Create Study Room</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Study Room</DialogTitle>
          <DialogDescription>
            Set up a new virtual study room for your group.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="subject" className="text-right">
              Subject
            </Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleCreate}>Create Room</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default function App() {
  const [rooms, setRooms] = useState([]);
  const [currentRoom, setCurrentRoom] = useState(null);

  const createRoom = (room) => {
    setRooms([...rooms, room]);
  };

  const joinRoom = (room) => {
    setCurrentRoom(room);
  };

  const leaveRoom = () => {
    setCurrentRoom(null);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Virtual Study Groups</h1>
      {currentRoom ? (
        <StudyRoom room={currentRoom} onLeave={leaveRoom} />
      ) : (
        <div>
          <CreateRoomDialog onCreateRoom={createRoom} />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
            {rooms.map((room) => (
              <Card key={room.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle>{room.name}</CardTitle>
                  <CardDescription>{room.subject}</CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button onClick={() => joinRoom(room)}>Join Room</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}