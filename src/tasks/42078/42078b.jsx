import React, { useState, useEffect } from "react";
// import { DragDropContext, Droppable, Draggable } from "@/components/ui/dnd";
import {
    DragDropContext,
    Droppable,
    Draggable,
  } from "@hello-pangea/dnd";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const initialAttendees = [
  { id: "1", name: "John Doe", constraints: [] },
  { id: "2", name: "Jane Smith", constraints: [] },
  { id: "3", name: "Bob Johnson", constraints: [] },
];

const initialTables = [
  { id: "table1", name: "Table 1", seats: 8, proximity: "stage" },
  { id: "table2", name: "Table 2", seats: 8, proximity: "exit" },
];

export default function App() {
  const [attendees, setAttendees] = useState(initialAttendees);
  const [tables, setTables] = useState(initialTables);
  const [seating, setSeating] = useState({});
  const [violations, setViolations] = useState([]);

  useEffect(() => {
    checkConstraints();
  }, [seating]);

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination } = result;
    const attendeeId = result.draggableId;

    setSeating((prev) => {
      const newSeating = { ...prev };
      delete newSeating[source.droppableId];
      newSeating[destination.droppableId] = attendeeId;
      return newSeating;
    });
  };

  const checkConstraints = () => {
    const newViolations = [];

    attendees.forEach((attendee) => {
      attendee.constraints.forEach((constraint) => {
        if (constraint.type === "together" && seating[attendee.id] !== seating[constraint.attendeeId]) {
          newViolations.push(`${attendee.name} should be seated with ${constraint.attendeeName}`);
        }
        if (constraint.type === "apart" && seating[attendee.id] === seating[constraint.attendeeId]) {
          newViolations.push(`${attendee.name} should not be seated with ${constraint.attendeeName}`);
        }
      });
    });

    setViolations(newViolations);
  };

  const addTable = (name, seats, proximity) => {
    const newTable = { id: `table${tables.length + 1}`, name, seats: parseInt(seats), proximity };
    setTables([...tables, newTable]);
  };

  const addAttendee = (name) => {
    const newAttendee = { id: `${attendees.length + 1}`, name, constraints: [] };
    setAttendees([...attendees, newAttendee]);
  };

  const addConstraint = (attendeeId, constraintType, constrainedAttendeeId) => {
    setAttendees((prev) =>
      prev.map((attendee) =>
        attendee.id === attendeeId
          ? {
              ...attendee,
              constraints: [
                ...attendee.constraints,
                { type: constraintType, attendeeId: constrainedAttendeeId, attendeeName: attendees.find((a) => a.id === constrainedAttendeeId).name },
              ],
            }
          : attendee
      )
    );
  };

  const saveSeating = () => {
    const arrangement = { tables, attendees, seating };
    const blob = new Blob([JSON.stringify(arrangement)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "seating_arrangement.json";
    a.click();
  };

  const resetSeating = () => {
    setSeating({});
    setViolations([]);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Event Seating Arranger</h1>
      <div className="flex flex-wrap gap-4 mb-4">
        <AddTableDialog addTable={addTable} />
        <AddAttendeeDialog addAttendee={addAttendee} />
        <AddConstraintDialog attendees={attendees} addConstraint={addConstraint} />
        <Button onClick={saveSeating}>Save Arrangement</Button>
        <Button onClick={resetSeating}>Reset Seating</Button>
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex flex-wrap gap-4">
          <Droppable droppableId="attendees" direction="horizontal">
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps} className="flex flex-wrap gap-2 p-4 bg-gray-100 rounded">
                {attendees.map((attendee, index) => (
                  <Draggable key={attendee.id} draggableId={attendee.id} index={index}>
                    {(provided) => (
                      <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                        <AttendeeCard attendee={attendee} />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {tables.map((table) => (
            <Droppable key={table.id} droppableId={table.id}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`p-4 rounded ${snapshot.isDraggingOver ? "bg-blue-100" : "bg-gray-100"}`}
                >
                  <h3 className="text-lg font-semibold mb-2">
                    {table.name} ({table.proximity})
                  </h3>
                  {Array.from({ length: table.seats }).map((_, seatIndex) => {
                    const attendeeId = Object.entries(seating).find(([tableId, attId]) => tableId === table.id && seatIndex === parseInt(attId))?.[1];
                    const attendee = attendees.find((a) => a.id === attendeeId);
                    return (
                      <div key={seatIndex} className="mb-2">
                        {attendee ? <AttendeeCard attendee={attendee} /> : <div className="h-12 bg-gray-200 rounded"></div>}
                      </div>
                    );
                  })}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
      {violations.length > 0 && (
        <div className="mt-4 p-4 bg-red-100 rounded">
          <h3 className="text-lg font-semibold mb-2">Constraint Violations:</h3>
          <ul className="list-disc pl-4">
            {violations.map((violation, index) => (
              <li key={index}>{violation}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function AttendeeCard({ attendee }) {
  return (
    <Card className="w-40">
      <CardHeader>
        <CardTitle className="text-sm">{attendee.name}</CardTitle>
      </CardHeader>
      <CardContent>
        {attendee.constraints.map((constraint, index) => (
          <div key={index} className="text-xs">
            {constraint.type}: {constraint.attendeeName}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function AddTableDialog({ addTable }) {
  const [name, setName] = useState("");
  const [seats, setSeats] = useState("");
  const [proximity, setProximity] = useState("");

  const handleSubmit = () => {
    if (name && seats && proximity) {
      addTable(name, seats, proximity);
      setName("");
      setSeats("");
      setProximity("");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Add Table</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Table</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="seats" className="text-right">
              Seats
            </Label>
            <Input id="seats" type="number" value={seats} onChange={(e) => setSeats(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="proximity" className="text-right">
              Proximity
            </Label>
            <Select onValueChange={setProximity}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select proximity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="stage">Near Stage</SelectItem>
                <SelectItem value="exit">Near Exit</SelectItem>
                <SelectItem value="center">Center</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button onClick={handleSubmit}>Add Table</Button>
      </DialogContent>
    </Dialog>
  );
}

function AddAttendeeDialog({ addAttendee }) {
  const [name, setName] = useState("");

  const handleSubmit = () => {
    if (name) {
      addAttendee(name);
      setName("");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Add Attendee</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Attendee</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" />
          </div>
        </div>
        <Button onClick={handleSubmit}>Add Attendee</Button>
      </DialogContent>
    </Dialog>
  );
}

function AddConstraintDialog({ attendees, addConstraint }) {
  const [attendeeId, setAttendeeId] = useState("");
  const [constraintType, setConstraintType] = useState("");
  const [constrainedAttendeeId, setConstrainedAttendeeId] = useState("");

  const handleSubmit = () => {
    if (attendeeId && constraintType && constrainedAttendeeId) {
      addConstraint(attendeeId, constraintType, constrainedAttendeeId);
      setAttendeeId("");
      setConstraintType("");
      setConstrainedAttendeeId("");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Add Constraint</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Constraint</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="attendee" className="text-right">
              Attendee
            </Label>
            <Select onValueChange={setAttendeeId}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select attendee" />
              </SelectTrigger>
              <SelectContent>
                {attendees.map((attendee) => (
                  <SelectItem key={attendee.id} value={attendee.id}>
                    {attendee.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="constraintType" className="text-right">
              Constraint Type
            </Label>
            <Select onValueChange={setConstraintType}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select constraint type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="together">Seated Together</SelectItem>
                <SelectItem value="apart">Seated Apart</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="constrainedAttendee" className="text-right">
              Constrained Attendee
            </Label>
            <Select onValueChange={setConstrainedAttendeeId}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select constrained attendee" />
              </SelectTrigger>
              <SelectContent>
                {attendees.filter((a) => a.id !== attendeeId).map((attendee) => (
                  <SelectItem key={attendee.id} value={attendee.id}>
                    {attendee.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button onClick={handleSubmit}>Add Constraint</Button>
      </DialogContent>
    </Dialog>
  );
}