import React, { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

const recurrenceOptions = [
  { value: "none", label: "None" },
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
];

const reminderOptions = [
  { value: "1day", label: "1 day before" },
  { value: "1hour", label: "1 hour before" },
  { value: "30min", label: "30 minutes before" },
];

function EventModal({ isOpen, onClose, onSave, event }) {
  const [title, setTitle] = useState(event?.title || "");
  const [date, setDate] = useState(event?.date || new Date());
  const [recurrence, setRecurrence] = useState(event?.recurrence || "none");
  const [description, setDescription] = useState(event?.description || "");
  const [location, setLocation] = useState(event?.location || "");
  const [endDate, setEndDate] = useState(event?.endDate || null);
  const [reminder, setReminder] = useState(event?.reminder || "1hour");

  const handleSave = () => {
    onSave({ id: event?.id || Date.now(), title, date, recurrence, description, location, endDate, reminder });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{event ? "Edit Event" : "Create Event"}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">Title</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="date" className="text-right">Date</Label>
            <Input id="date" type="date" value={date.toISOString().split('T')[0]} onChange={(e) => setDate(new Date(e.target.value))} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="recurrence" className="text-right">Recurrence</Label>
            <Select id="recurrence" value={recurrence} onValueChange={setRecurrence} className="col-span-3">
              {recurrenceOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </Select>
          </div>
          {recurrence !== "none" && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="endDate" className="text-right">End Date</Label>
              <Input id="endDate" type="date" value={endDate?.toISOString().split('T')[0] || ""} onChange={(e) => setEndDate(e.target.value ? new Date(e.target.value) : null)} className="col-span-3" />
            </div>
          )}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">Description</Label>
            <Input id="description" value={description} onChange={(e) => setDescription(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="location" className="text-right">Location</Label>
            <Input id="location" value={location} onChange={(e) => setLocation(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="reminder" className="text-right">Reminder</Label>
            <Select id="reminder" value={reminder} onValueChange={setReminder} className="col-span-3">
              {reminderOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function EventItem({ event, onEdit, onDelete }) {
  return (
    <div className="bg-white p-2 rounded shadow mb-2">
      <h3 className="font-bold">{event.title}</h3>
      <p className="text-sm">{event.date.toLocaleString()}</p>
      <div className="mt-2">
        <Button size="sm" onClick={() => onEdit(event)}>Edit</Button>
        <Button size="sm" variant="destructive" className="ml-2" onClick={() => onDelete(event.id)}>Delete</Button>
      </div>
    </div>
  );
}

export default function App() {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  useEffect(() => {
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    const checkReminders = setInterval(() => {
      const now = new Date();
      events.forEach((event) => {
        const eventDate = new Date(event.date);
        const reminderTime = new Date(eventDate.getTime() - getReminderOffset(event.reminder));
        if (now >= reminderTime && now < eventDate) {
          new Notification(event.title, {
            body: `Reminder: Your event starts ${event.reminder === "1day" ? "tomorrow" : "soon"}`,
          });
        }
      });
    }, 60000);

    return () => clearInterval(checkReminders);
  }, [events]);

  const getReminderOffset = (reminder) => {
    switch (reminder) {
      case "1day": return 24 * 60 * 60 * 1000;
      case "1hour": return 60 * 60 * 1000;
      case "30min": return 30 * 60 * 1000;
      default: return 0;
    }
  };

  const handleSaveEvent = (event) => {
    if (editingEvent) {
      setEvents(events.map((e) => (e.id === event.id ? event : e)));
    } else {
      setEvents([...events, event]);
    }
    setEditingEvent(null);
  };

  const handleEditEvent = (event) => {
    setEditingEvent(event);
    setIsModalOpen(true);
  };

  const handleDeleteEvent = (id) => {
    setEvents(events.filter((event) => event.id !== id));
  };

  const getRecurringEvents = (event, start, end) => {
    const recurringEvents = [];
    let currentDate = new Date(event.date);

    while (currentDate <= end && (!event.endDate || currentDate <= event.endDate)) {
      if (currentDate >= start) {
        recurringEvents.push({ ...event, date: new Date(currentDate) });
      }

      switch (event.recurrence) {
        case "daily":
          currentDate.setDate(currentDate.getDate() + 1);
          break;
        case "weekly":
          currentDate.setDate(currentDate.getDate() + 7);
          break;
        case "monthly":
          currentDate.setMonth(currentDate.getMonth() + 1);
          break;
        default:
          return recurringEvents;
      }
    }

    return recurringEvents;
  };

  const filteredEvents = events.flatMap((event) => {
    const monthStart = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
    const monthEnd = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0);
    return getRecurringEvents(event, monthStart, monthEnd);
  });

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Event Calendar</h1>
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="w-full sm:w-2/3">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="rounded-md border"
          />
        </div>
        <div className="w-full sm:w-1/3">
          <Button onClick={() => setIsModalOpen(true)}>Add Event</Button>
          <h2 className="text-xl font-semibold mt-4 mb-2">Events for {selectedDate.toDateString()}</h2>
          {filteredEvents
            .filter((event) => event.date.toDateString() === selectedDate.toDateString())
            .map((event) => (
              <EventItem
                key={event.id}
                event={event}
                onEdit={handleEditEvent}
                onDelete={handleDeleteEvent}
              />
            ))}
        </div>
      </div>
      <EventModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingEvent(null);
        }}
        onSave={handleSaveEvent}
        event={editingEvent}
      />
    </div>
  );
}