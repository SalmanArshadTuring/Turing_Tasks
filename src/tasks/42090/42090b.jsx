import React, { useState } from 'react';
import { format, addHours, subHours } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectItem } from '@/components/ui/select';
import { timezones } from 'timezones-list';
import { Calendar } from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

// Correctly map timezones to { label, value } structure
// const timeZoneList = timezones.map(tz => ({
//   label: tz.label, // Human-readable timezone name
//   value: tz.tzCode // IANA timezone code
// }));

function App() {
  const [meetingTime, setMeetingTime] = useState(new Date());
  const [originZone, setOriginZone] = useState('UTC');
  const [zones, setZones] = useState(['America/New_York', 'Europe/London', 'Asia/Tokyo']);
  const [meetings, setMeetings] = useState([]);
  const [showCalendar, setShowCalendar] = useState(false);

  const handleAddZone = (zone) => {
    if (!zones.includes(zone) && zone) {
      setZones([...zones, zone]);
    }
  };

  const handleRemoveZone = (zoneToRemove) => {
    setZones(zones.filter(zone => zone !== zoneToRemove));
  };

  const convertTime = (time, fromZone, toZone) => {
    const fromOffset = timezones.find(tz => tz.tzCode === fromZone)?.utcOffset || 0;
    const toOffset = timezones.find(tz => tz.tzCode === toZone)?.utcOffset || 0;
    return addHours(subHours(time, fromOffset), toOffset);
  };

  const handleScheduleMeeting = () => {
    const newMeeting = {
      time: meetingTime,
      zones: zones,
      participants: ['user1@example.com', 'user2@example.com'], // Example participants
    };
    setMeetings([...meetings, newMeeting]);
    setShowCalendar(true);
  };

  const exportICalendar = () => {
    const event = {
      title: 'Scheduled Meeting',
      start: meetingTime,
      duration: { hours: 1 },
      attendees: meetings[meetings.length - 1]?.participants || [],
    };
    // Placeholder for exporting to iCal
    console.log('Exporting to iCalendar:', event);
  };

  return (
    <div className="flex flex-col items-center p-4 space-y-4 bg-gray-100 min-h-screen sm:px-8">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Time Zone Converter</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            type="datetime-local"
            value={meetingTime.toISOString().slice(0, 16)}
            onChange={(e) => setMeetingTime(new Date(e.target.value))}
            className="mb-4"
          />
          <Select value={originZone} onValueChange={setOriginZone}>
            {timezones.map((tz) => (
              <SelectItem key={tz.value} value={tz.value}>
                {tz.label}
              </SelectItem>
            ))}
          </Select>
          <div className="mt-4">
            {zones.map((zone) => (
              <div key={zone} className="flex justify-between items-center mb-2">
                <span>{zone}</span>
                <Button variant="destructive" onClick={() => handleRemoveZone(zone)}>
                  Remove
                </Button>
              </div>
            ))}
            <Select onValueChange={handleAddZone}>
              <SelectItem value="">Add Time Zone</SelectItem>
              {timezones.filter((tz) => !zones.includes(tz.value)).map((tz) => (
                <SelectItem key={tz.value} value={tz.value}>
                  {tz.label}
                </SelectItem>
              ))}
            </Select>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleScheduleMeeting}>Schedule Meeting</Button>
          <Button onClick={exportICalendar} className="ml-2">
            Export to Calendar
          </Button>
        </CardFooter>
      </Card>

      {zones.map((zone) => (
        <Card key={zone} className="w-full max-w-lg">
          <CardContent>
            <h3 className="text-lg font-semibold">{zone}</h3>
            <p>{format(convertTime(meetingTime, originZone, zone), 'yyyy-MM-dd HH:mm')}</p>
          </CardContent>
        </Card>
      ))}

      {showCalendar && (
        <div className="mt-4 w-full max-w-lg">
          <Calendar
            value={meetingTime}
            onChange={setMeetingTime}
            tileContent={({ date }) =>
              meetings.some((m) => m.time.toDateString() === date.toDateString()) ? '📅' : null
            }
          />
        </div>
      )}

      <Button
        className="mt-4"
        onClick={() => {
          setZones(['America/New_York', 'Europe/London', 'Asia/Tokyo']);
          setMeetings([]);
          setShowCalendar(false);
        }}
      >
        Reset All
      </Button>
    </div>
  );
}

export default App;
