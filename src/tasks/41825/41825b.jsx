import React, { useState, useEffect } from 'react';
import { 
  Card, CardContent, CardFooter, CardHeader, CardTitle,
} from "@/components/ui/card";
// Button, Input, Checkbox, Select, Option
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Select} from "@/components/ui/select"
// import {Option} from "@/components/ui/option"



const languages = ['Spanish', 'French', 'German', 'Japanese'];

function FlashCard({ front, back, onFlip, isFlipped }) {
  return (
    <Card className="w-full max-w-sm mx-auto my-4">
      <CardContent className="text-center">
        <div className="text-lg font-semibold">{isFlipped ? back : front}</div>
      </CardContent>
      <CardFooter>
        <Button onClick={onFlip}>Flip</Button>
      </CardFooter>
    </Card>
  );
}

function FlashCardForm({ onSubmit }) {
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');
  const [lang, setLang] = useState(languages[0]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if(front && back) {
      onSubmit({ front, back, lang });
      setFront('');
      setBack('');
    }
  };

  return (
    <Card className="max-w-sm mx-auto my-4">
      <CardHeader>
        <CardTitle>Create Flashcard</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <Input 
            type="text" 
            value={front} 
            onChange={e => setFront(e.target.value)} 
            placeholder="Word in English"
            className="mb-2"
          />
          <Input 
            type="text" 
            value={back} 
            onChange={e => setBack(e.target.value)} 
            placeholder="Translation"
            className="mb-2"
          />
          <Select value={lang} onChange={e => setLang(e.target.value)}>
            {languages.map(language => (
              <Option key={language} value={language}>{language}</Option>
            ))}
          </Select>
          <Button type="submit" className="mt-4">Add Card</Button>
        </form>
      </CardContent>
    </Card>
  );
}

function AudioPronunciation({ text, lang }) {
  const [isPlaying, setIsPlaying] = useState(false);

  const playAudio = () => {
    // Simplified: Real implementation would use Web Speech API or similar
    setIsPlaying(true);
    setTimeout(() => setIsPlaying(false), 2000);
  };

  return (
    <Button onClick={playAudio} disabled={isPlaying}>
      {isPlaying ? 'Playing...' : 'Pronounce'}
    </Button>
  );
}

export default function App() {
  const [cards, setCards] = useState([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showCorrect, setShowCorrect] = useState(false);

  useEffect(() => {
    if (cards.length > 0) {
      setCurrentCardIndex(0);
    }
  }, [cards]);

  const handleCardCreation = (newCard) => {
    setCards([...cards, { ...newCard, lastReviewed: Date.now(), interval: 1 }]);
  };

  const flipCard = () => setIsFlipped(!isFlipped);

  const nextCard = (correct) => {
    if (correct) {
      // Simple spaced repetition implementation
      setCards(prevCards => 
        prevCards.map((card, idx) => 
          idx === currentCardIndex ? {...card, interval: card.interval * 2, lastReviewed: Date.now()} : card
        )
      );
    }
    setCurrentCardIndex((currentCardIndex + 1) % cards.length);
    setIsFlipped(false);
    setShowCorrect(false);
  };

  return (
    <div className="p-4 sm:p-8">
      <h1 className="text-2xl font-bold mb-4">Language Flashcards</h1>
      <FlashCardForm onSubmit={handleCardCreation} />
      {cards.length > 0 && (
        <div>
          <FlashCard 
            front={cards[currentCardIndex].front} 
            back={cards[currentCardIndex].back} 
            onFlip={flipCard}
            isFlipped={isFlipped}
          />
          {isFlipped && (
            <>
              <AudioPronunciation text={cards[currentCardIndex].back} lang={cards[currentCardIndex].lang} />
              <div className="mt-4 flex justify-center">
                <Button onClick={() => nextCard(true)} className="mr-2 bg-green-500">Correct</Button>
                <Button onClick={() => nextCard(false)} className="bg-red-500">Incorrect</Button>
              </div>
            </>
          )}
        </div>
      )}
      <div className="mt-4 text-sm">Progress: {currentCardIndex + 1}/{cards.length}</div>
    </div>
  );
}