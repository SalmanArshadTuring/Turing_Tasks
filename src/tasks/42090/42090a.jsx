import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";

const timeZones = [
  "UTC", "America/New_York", "America/Los_Angeles", "Europe/London", "Asia/Tokyo", "Australia/Sydney"
];

function TimeZoneConverter({ selectedTime, originTimeZone, targetTimeZone }) {
  const convertTime = () => {
    if (!selectedTime) return "";
    const originDate = new Date(selectedTime.toLocaleString("en-US", { timeZone: originTimeZone }));
    const targetDate = new Date(originDate.toLocaleString("en-US", { timeZone: targetTimeZone }));
    return targetDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex justify-between items-center mb-2">
      <span>{targetTimeZone}</span>
      <span>{convertTime()}</span>
    </div>
  );
}

function MeetingScheduler({ onSchedule }) {
  const [meetingTime, setMeetingTime] = useState(new Date());
  const [participants, setParticipants] = useState("");

  const handleSchedule = () => {
    onSchedule({ time: meetingTime, participants: participants.split(",") });
  };

  return (
    <div className="space-y-4">
      <Calendar
        mode="single"
        selected={meetingTime}
        onSelect={(date) => setMeetingTime(date)}
        className="rounded-md border"
      />
      <Input
        type="time"
        value={meetingTime.toTimeString().slice(0, 5)}
        onChange={(e) => {
          const [hours, minutes] = e.target.value.split(":");
          const newDate = new Date(meetingTime);
          newDate.setHours(hours);
          newDate.setMinutes(minutes);
          setMeetingTime(newDate);
        }}
      />
      <Input
        placeholder="Participants (comma-separated)"
        value={participants}
        onChange={(e) => setParticipants(e.target.value)}
      />
      <Button onClick={handleSchedule}>Schedule Meeting</Button>
    </div>
  );
}

export default function App() {
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [originTimeZone, setOriginTimeZone] = useState("UTC");
  const [selectedTimeZones, setSelectedTimeZones] = useState(["America/New_York", "Europe/London"]);
  const [customTimeZone, setCustomTimeZone] = useState("");
  const [scheduledMeetings, setScheduledMeetings] = useState([]);

  useEffect(() => {
    const savedTimeZones = localStorage.getItem("selectedTimeZones");
    if (savedTimeZones) {
      setSelectedTimeZones(JSON.parse(savedTimeZones));
    }
    const savedMeetings = localStorage.getItem("scheduledMeetings");
    if (savedMeetings) {
      setScheduledMeetings(JSON.parse(savedMeetings));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("selectedTimeZones", JSON.stringify(selectedTimeZones));
    localStorage.setItem("scheduledMeetings", JSON.stringify(scheduledMeetings));
  }, [selectedTimeZones, scheduledMeetings]);

  const addTimeZone = (timeZone) => {
    if (timeZone && !selectedTimeZones.includes(timeZone)) {
      setSelectedTimeZones([...selectedTimeZones, timeZone]);
    }
  };

  const removeTimeZone = (timeZone) => {
    setSelectedTimeZones(selectedTimeZones.filter((tz) => tz !== timeZone));
  };

  const handleScheduleMeeting = (meeting) => {
    setScheduledMeetings([...scheduledMeetings, meeting]);
  };

  const resetApp = () => {
    setSelectedTime(new Date());
    setOriginTimeZone("UTC");
    setSelectedTimeZones(["America/New_York", "Europe/London"]);
    setCustomTimeZone("");
    setScheduledMeetings([]);
    localStorage.removeItem("selectedTimeZones");
    localStorage.removeItem("scheduledMeetings");
  };

  const exportCalendar = () => {
    let icsContent = "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//TimeZoneConverter//EN\n";
    scheduledMeetings.forEach((meeting, index) => {
      icsContent += `BEGIN:VEVENT\n`;
      icsContent += `UID:${index}@timezonecoverter.com\n`;
      icsContent += `DTSTAMP:${meeting.time.toISOString().replace(/[-:]/g, "").split(".")[0]}Z\n`;
      icsContent += `DTSTART:${meeting.time.toISOString().replace(/[-:]/g, "").split(".")[0]}Z\n`;
      icsContent += `SUMMARY:Scheduled Meeting\n`;
      icsContent += `DESCRIPTION:Participants: ${meeting.participants.join(", ")}\n`;
      icsContent += `END:VEVENT\n`;
    });
    icsContent += "END:VCALENDAR";

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "meetings.ics";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 max-w-3xl">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Time-Zone Converter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
              <Input
                type="datetime-local"
                value={selectedTime.toISOString().slice(0, 16)}
                onChange={(e) => setSelectedTime(new Date(e.target.value))}
                className="flex-grow"
              />
              <Select value={originTimeZone} onValueChange={setOriginTimeZone}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Select time zone" />
                </SelectTrigger>
                <SelectContent>
                  {timeZones.map((tz) => (
                    <SelectItem key={tz} value={tz}>
                      {tz}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              {selectedTimeZones.map((tz) => (
                <div key={tz} className="flex justify-between items-center">
                  <TimeZoneConverter
                    selectedTime={selectedTime}
                    originTimeZone={originTimeZone}
                    targetTimeZone={tz}
                  />
                  <Button variant="outline" size="sm" onClick={() => removeTimeZone(tz)}>
                    Remove
                  </Button>
                </div>
              ))}
            </div>
            <div className="flex space-x-2">
              <Input
                placeholder="Custom time zone"
                value={customTimeZone}
                onChange={(e) => setCustomTimeZone(e.target.value)}
              />
              <Button onClick={() => addTimeZone(customTimeZone)}>Add</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Schedule Meeting</CardTitle>
        </CardHeader>
        <CardContent>
          <Dialog>
            <DialogTrigger asChild>
              <Button>Schedule New Meeting</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Schedule Meeting</DialogTitle>
              </DialogHeader>
              <MeetingScheduler onSchedule={handleScheduleMeeting} />
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Scheduled Meetings</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[200px]">
            {scheduledMeetings.map((meeting, index) => (
              <div key={index} className="mb-2 p-2 border rounded">
                <p>Time: {meeting.time.toLocaleString()}</p>
                <p>Participants: {meeting.participants.join(", ")}</p>
              </div>
            ))}
          </ScrollArea>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button onClick={resetApp}>Reset App</Button>
        <Button onClick={exportCalendar}>Export Calendar</Button>
      </div>
    </div>
  );
}