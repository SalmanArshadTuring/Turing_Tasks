
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle,
  
} from "@/components/ui/card";
import {Button} from "@/components/ui/button";

const emojis = ['😊', '😢', '😠', '🤔', '😴', '🎉', '💪', '🍔'];

const EmojiButton = ({ emoji, onClick, selected }) => (
  <Button 
    variant={selected ? "default" : "outline"} 
    onClick={() => onClick(emoji)}
    className="m-1"
  >
    {emoji}
  </Button>
);

const DayEntry = ({ day, onSelectEmoji }) => {
  const [selectedEmoji, setSelectedEmoji] = useState(null);

  return (
    <Card className="mb-4 sm:mb-2">
      <CardHeader>
        <CardTitle>{day}</CardTitle>
      </CardHeader>
      <CardContent>
        {emojis.map(emoji => (
          <EmojiButton 
            key={emoji} 
            emoji={emoji} 
            onClick={emoji => {
              setSelectedEmoji(emoji);
              onSelectEmoji(day, emoji);
            }} 
            selected={selectedEmoji === emoji}
          />
        ))}
      </CardContent>
    </Card>
  );
};

const WeeklyHeatMap = ({ weekData }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Emoji Heatmap</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-7 gap-1">
        {Object.entries(weekData).map(([day, emoji]) => (
          <div key={day} className="text-center p-2 bg-gray-100 dark:bg-gray-800">
            <span>{emoji || '❓'}</span>
            <p className="text-xs">{day}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default function App() {
  const [diary, setDiary] = useState(() => {
    const savedDiary = localStorage.getItem('emojiDiary');
    return savedDiary ? JSON.parse(savedDiary) : {};
  });

  useEffect(() => {
    localStorage.setItem('emojiDiary', JSON.stringify(diary));
  }, [diary]);

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const [currentWeek, setCurrentWeek] = useState(0);

  const handleEmojiSelect = (day, emoji) => {
    setDiary(prev => ({
      ...prev,
      [currentWeek]: {
        ...prev[currentWeek],
        [day]: emoji
      }
    }));
  };

  const weekData = diary[currentWeek] || {};

  return (
    <div className="p-4 max-w-lg mx-auto sm:px-6 lg:px-8">
      <Card>
        <CardHeader>
          <CardTitle>Emoji Diary</CardTitle>
          <CardDescription>Log your week with emojis!</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Button onClick={() => setCurrentWeek(currentWeek - 1)} disabled={currentWeek === 0}>Previous Week</Button>
            <Button className="ml-2" onClick={() => setCurrentWeek(currentWeek + 1)}>Next Week</Button>
          </div>
          {days.map(day => (
            <DayEntry key={day} day={day} onSelectEmoji={handleEmojiSelect} />
          ))}
        </CardContent>
      </Card>
      <WeeklyHeatMap weekData={weekData} />
    </div>
  );
}