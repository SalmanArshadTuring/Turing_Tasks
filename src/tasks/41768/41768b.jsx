import React, { useState, useEffect } from 'react';
import { format, addDays, eachDayOfInterval, startOfWeek, endOfWeek, startOfMonth, endOfMonth, isSameDay } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

function App() {
  const [events, setEvents] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [modalOpen, setModalOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState({ title: '', date: new Date(), recurrence: 'none', description: '', location: '', reminder: 'none' });

  const days = eachDayOfInterval({
    start: startOfWeek(currentDate),
    end: endOfWeek(currentDate)
  });

  const handleAddEvent = (event) => {
    setEvents([...events, { ...event, id: Date.now() }]);
    setModalOpen(false);
  };

  const handleRemoveEvent = (id) => {
    setEvents(events.filter(e => e.id !== id));
  };

  const handleEditEvent = (updatedEvent) => {
    setEvents(events.map(e => e.id === updatedEvent.id ? updatedEvent : e));
    setModalOpen(false);
  };

  const openEditModal = (event) => {
    setCurrentEvent(event);
    setModalOpen(true);
  };

  const getRecurringEvents = () => {
    return events.filter(event => event.recurrence !== 'none').flatMap(event => {
      let dates = [];
      let nextDate = new Date(event.date);
      while (nextDate <= (event.endDate || new Date(2100, 0, 1))) {
        if (event.recurrence === 'daily') nextDate = addDays(nextDate, 1);
        if (event.recurrence === 'weekly') nextDate = addDays(nextDate, 7);
        if (event.recurrence === 'monthly') nextDate.setMonth(nextDate.getMonth() + 1);
        if (nextDate <= (event.endDate || new Date(2100, 0, 1))) dates.push(new Date(nextDate));
      }
      return dates.map(date => ({...event, date}));
    });
  };

  const EventModal = ({ event, onClose }) => (
    <Dialog open={modalOpen} onOpenChange={setModalOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{event.id ? "Edit Event" : "Add Event"}</DialogTitle>
        </DialogHeader>
        <CardContent>
          <Input placeholder="Title" value={event.title} onChange={e => setCurrentEvent({...event, title: e.target.value})} />
          {/* Add more inputs for date, recurrence, description, location, reminder */}
        </CardContent>
        <DialogFooter>
          <Button onClick={() => event.id ? handleEditEvent(event) : handleAddEvent(event)}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Calendar</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2">
            {days.map(day => (
              <div key={day.toString()} className="border p-2 text-center">
                <div>{format(day, 'EEE dd')}</div>
                {events.concat(getRecurringEvents()).filter(e => isSameDay(e.date, day)).map(event => (
                  <div key={event.id} className="cursor-pointer" onClick={() => openEditModal(event)}>
                    {event.title}
                    <Button size="sm" onClick={(e) => {e.stopPropagation(); handleRemoveEvent(event.id);}}>X</Button>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </CardContent>
        <CardContent>
          <Button onClick={() => setModalOpen(true)}>Add Event</Button>
        </CardContent>
      </Card>
      <EventModal event={currentEvent} onClose={() => setModalOpen(false)} />
    </div>
  );
}

export default App;