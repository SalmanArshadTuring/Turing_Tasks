import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const PetStatus = ({ hunger, happiness, playfulness }) => (
  <div className="grid grid-cols-3 gap-2">
    <div>
      <p>Hunger</p>
      <Progress value={100 - hunger} />
    </div>
    <div>
      <p>Happiness</p>
      <Progress value={happiness} />
    </div>
    <div>
      <p>Playfulness</p>
      <Progress value={playfulness} />
    </div>
  </div>
);

const PetAnimation = ({ mood }) => {
  const [animationClass, setAnimationClass] = useState('');

  useEffect(() => {
    switch (mood) {
      case 'happy':
        setAnimationClass('animate-bounce');
        break;
      case 'sad':
        setAnimationClass('animate-wiggle-slow');
        break;
      default:
        setAnimationClass('');
    }
  }, [mood]);

  return <div className={`w-24 h-24 bg-yellow-300 rounded-full ${animationClass}`} />;
};

function App() {
  const [hunger, setHunger] = useState(0);
  const [happiness, setHappiness] = useState(50);
  const [playfulness, setPlayfulness] = useState(50);
  const [mood, setMood] = useState('neutral');

  useEffect(() => {
    const timer = setInterval(() => {
      setHunger(h => Math.min(h + 5, 100));
      setHappiness(h => Math.max(h - 2, 0));
      setPlayfulness(p => Math.max(p - 3, 0));

      if (hunger > 70) setMood('sad');
      else if (happiness > 70 && playfulness > 70) setMood('happy');
      else setMood('neutral');
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  const feedPet = () => {
    setHunger(h => Math.max(h - 30, 0));
    setHappiness(h => Math.min(h + 10, 100));
  };

  const playWithPet = () => {
    setPlayfulness(p => Math.min(p + 20, 100));
    setHappiness(h => Math.min(h + 15, 100));
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-50 p-4 sm:p-8">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>My Digital Pet</CardTitle>
          <CardDescription>Take care of your virtual friend!</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <PetAnimation mood={mood} />
          <PetStatus hunger={hunger} happiness={happiness} playfulness={playfulness} />
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button onClick={feedPet}>Feed</Button>
          <Button onClick={playWithPet}>Play</Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default App;