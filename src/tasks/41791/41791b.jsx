import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const emojis = [
  "😊", "😢", "😡", "😴", "🏃", "🍔", "📚", "🎮", "🎵", "🎨", "💼", "🏠"
];

const EmojiSelector = ({ onSelect }) => (
  <div className="grid grid-cols-6 gap-2">
    {emojis.map((emoji) => (
      <Button
        key={emoji}
        variant="outline"
        className="text-2xl p-2"
        onClick={() => onSelect(emoji)}
      >
        {emoji}
      </Button>
    ))}
  </div>
);

const DailyEntry = ({ date, emojis, onAddEmoji }) => {
  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>{date.toDateString()}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2 mb-2">
          {emojis.map((emoji, index) => (
            <span key={index} className="text-2xl">
              {emoji}
            </span>
          ))}
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">Add Emoji</Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <EmojiSelector onSelect={onAddEmoji} />
          </PopoverContent>
        </Popover>
      </CardContent>
    </Card>
  );
};

const WeeklySummary = ({ entries }) => {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>Weekly Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1">
          {days.map((day) => (
            <div key={day} className="text-center font-bold">
              {day}
            </div>
          ))}
          {entries.map((entry, index) => (
            <div key={index} className="text-center">
              {entry.emojis[0] || ""}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default function App() {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    const today = new Date();
    const pastWeek = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      return { date, emojis: [] };
    }).reverse();
    setEntries(pastWeek);
  }, []);

  const addEmojiToDay = (date, emoji) => {
    setEntries((prevEntries) =>
      prevEntries.map((entry) =>
        entry.date.toDateString() === date.toDateString()
          ? { ...entry, emojis: [...entry.emojis, emoji] }
          : entry
      )
    );
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 max-w-md">
      <h1 className="text-3xl font-bold mb-6 text-center">Emoji Diary</h1>
      <WeeklySummary entries={entries} />
      {entries.map((entry) => (
        <DailyEntry
          key={entry.date.toISOString()}
          date={entry.date}
          emojis={entry.emojis}
          onAddEmoji={(emoji) => addEmojiToDay(entry.date, emoji)}
        />
      ))}
    </div>
  );
}