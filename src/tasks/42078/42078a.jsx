import React, { useState, useCallback } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const TABLE_SIZE = 8;

function Table({ id, attendees, onDrop, constraints }) {
  const [, drag] = useDrag({
    type: 'ATTENDEE',
    item: { tableId: id },
  });

  const isConstraintViolated = (attendee) => {
    const seatedHere = attendees.filter(a => a.tableId === id);
    return constraints.some(constraint => {
      if (constraint.type === 'together' && constraint.ids.includes(attendee.id)) {
        return !constraint.ids.every(id => seatedHere.some(a => a.id === id));
      } else if (constraint.type === 'apart' && constraint.ids.includes(attendee.id)) {
        return seatedHere.some(a => constraint.ids.includes(a.id) && a.id !== attendee.id);
      }
      return false;
    });
  };

  return (
    <div ref={drag} className="border-2 border-dashed border-gray-300 p-4 m-2 rounded-lg w-64">
      <h3 className="text-center mb-2">Table {id}</h3>
      <div className="grid grid-cols-2 gap-2">
        {Array.from({ length: TABLE_SIZE }, (_, i) => (
          <div key={i} className="border p-2 rounded text-center">
            {attendees.find(a => a.seat === i && a.tableId === id)?.name || 'Empty'}
            {attendees.find(a => a.seat === i && a.tableId === id && isConstraintViolated(a)) && (
              <span className="text-red-500 ml-1">⚠️</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function Attendee({ attendee, draggable }) {
  const [, drag] = useDrag({
    type: 'ATTENDEE',
    item: { id: attendee.id },
    canDrag: draggable,
  });

  return (
    <div ref={drag} className={`p-2 m-1 border rounded ${draggable ? 'cursor-move' : ''}`}>
      {attendee.name}
    </div>
  );
}

function AppContent() {
  const [attendees, setAttendees] = useState([
    { id: 1, name: 'Alice', tableId: null, seat: null },
    { id: 2, name: 'Bob', tableId: null, seat: null },
    // More attendees...
  ]);
  const [tables, setTables] = useState(5);
  const [constraints, setConstraints] = useState([
    { type: 'together', ids: [1, 2] }, // Alice and Bob should sit together
  ]);

  const [, drop] = useDrop({
    accept: 'ATTENDEE',
    drop: (item, monitor) => {
      const delta = monitor.getDifferenceFromInitialOffset();
      const left = Math.round(item.left + delta.x);
      const top = Math.round(item.top + delta.y);
      moveAttendee(item.id, left, top);
    },
  });

  const moveAttendee = useCallback((id, left, top) => {
    setAttendees(current => 
      current.map(a => a.id === id ? { ...a, tableId: null, seat: null } : a)
    );
  }, []);

  const handleDropOnTable = (tableId, seat) => (item) => {
    setAttendees(current => 
      current.map(a => a.id === item.id ? { ...a, tableId, seat } : a)
    );
  };

  const saveArrangement = () => {
    const blob = new Blob([JSON.stringify(attendees.map(({ name, ...rest }) => rest))], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'seating_arrangement.json';
    link.click();
  };

  const resetArrangement = () => {
    setAttendees(current => current.map(a => ({ ...a, tableId: null, seat: null })));
  };

  return (
    <div ref={drop} className="p-4 sm:p-8">
      <Card>
        <CardHeader>
          <CardTitle>Event Seating Arranger</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
            <Label htmlFor="tables">Number of Tables</Label>
            <Input 
              id="tables" 
              type="number" 
              value={tables} 
              onChange={e => setTables(Number(e.target.value))} 
              className="w-full sm:w-1/3"
            />
          </div>
          <div className="flex flex-wrap justify-center">
            {Array.from({ length: tables }, (_, i) => (
              <div key={i} onDrop={() => handleDropOnTable(i, null)} onDragOver={(e) => e.preventDefault()}>
                <Table id={i} attendees={attendees} constraints={constraints} />
              </div>
            ))}
          </div>
          <div className="mt-4">
            <h2 className="text-lg font-bold mb-2">Attendees</h2>
            <div className="flex flex-wrap">
              {attendees.map(attendee => (
                <Attendee key={attendee.id} attendee={attendee} draggable={attendee.tableId === null} />
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button onClick={saveArrangement}>Save Arrangement</Button>
          <Button onClick={resetArrangement}>Reset</Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <AppContent />
    </DndProvider>
  );
}
