import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const initialFlashcards = [
  { id: 1, front: "Hello", back: "Bonjour", lastReviewed: null, interval: 1 },
  { id: 2, front: "Goodbye", back: "Au revoir", lastReviewed: null, interval: 1 },
];

function FlashcardCreator({ onAddCard }) {
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (front && back) {
      onAddCard({ front, back, lastReviewed: null, interval: 1 });
      setFront("");
      setBack("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        placeholder="Front of card"
        value={front}
        onChange={(e) => setFront(e.target.value)}
      />
      <Input
        placeholder="Back of card"
        value={back}
        onChange={(e) => setBack(e.target.value)}
      />
      <Button type="submit">Add Flashcard</Button>
    </form>
  );
}

function FlashcardReview({ flashcards, onUpdateCard }) {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [completed, setCompleted] = useState(false);

  const currentCard = flashcards[currentCardIndex];

  const handleNext = (correct) => {
    const updatedCard = {
      ...currentCard,
      lastReviewed: new Date(),
      interval: correct ? currentCard.interval * 2 : 1,
    };
    onUpdateCard(updatedCard);

    if (currentCardIndex < flashcards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setShowAnswer(false);
    } else {
      setCompleted(true);
    }
  };

  if (completed) {
    return <div className="text-center">Review completed!</div>;
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{showAnswer ? currentCard.back : currentCard.front}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!showAnswer && (
          <Button onClick={() => setShowAnswer(true)}>Show Answer</Button>
        )}
        {showAnswer && (
          <div className="space-x-2">
            <Button onClick={() => handleNext(false)}>Incorrect</Button>
            <Button onClick={() => handleNext(true)}>Correct</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function ProgressTracker({ flashcards }) {
  const totalCards = flashcards.length;
  const reviewedCards = flashcards.filter((card) => card.lastReviewed).length;
  const progressPercentage = (reviewedCards / totalCards) * 100;

  return (
    <div className="space-y-2">
      <Progress value={progressPercentage} />
      <p className="text-sm text-gray-600">
        {reviewedCards} / {totalCards} cards reviewed
      </p>
    </div>
  );
}

export default function App() {
  const [flashcards, setFlashcards] = useState(initialFlashcards);

  useEffect(() => {
    const storedFlashcards = localStorage.getItem("flashcards");
    if (storedFlashcards) {
      setFlashcards(JSON.parse(storedFlashcards));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("flashcards", JSON.stringify(flashcards));
  }, [flashcards]);

  const addFlashcard = (newCard) => {
    setFlashcards([...flashcards, { ...newCard, id: Date.now() }]);
  };

  const updateFlashcard = (updatedCard) => {
    setFlashcards(
      flashcards.map((card) => (card.id === updatedCard.id ? updatedCard : card))
    );
  };

  const dueFlashcards = flashcards.filter(
    (card) =>
      !card.lastReviewed ||
      new Date() - new Date(card.lastReviewed) >= card.interval * 24 * 60 * 60 * 1000
  );

  return (
    <div className="container mx-auto p-4 sm:p-6 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">Language Learning Flashcards</h1>
      <Tabs defaultValue="review" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="review">Review</TabsTrigger>
          <TabsTrigger value="create">Create</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
        </TabsList>
        <TabsContent value="review">
          {dueFlashcards.length > 0 ? (
            <FlashcardReview flashcards={dueFlashcards} onUpdateCard={updateFlashcard} />
          ) : (
            <div className="text-center">No cards due for review!</div>
          )}
        </TabsContent>
        <TabsContent value="create">
          <FlashcardCreator onAddCard={addFlashcard} />
        </TabsContent>
        <TabsContent value="progress">
          <ProgressTracker flashcards={flashcards} />
        </TabsContent>
      </Tabs>
    </div>
  );
}