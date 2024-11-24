import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const questions = [
  {
    question: "What is the capital of France?",
    answers: [
      { text: "Berlin", correct: false },
      { text: "Madrid", correct: false },
      { text: "Paris", correct: true },
      { text: "Lisbon", correct: false }
    ],
    explanation: "Paris is the capital city of France, known for its cafe culture, major museums, and the Eiffel Tower."
  },
  // Add more questions here...
];

function Quiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [score, setScore] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);

  useEffect(() => {
    const savedResults = localStorage.getItem('quizResults');
    if (savedResults) {
      const { score, answers } = JSON.parse(savedResults);
      setScore(score);
      setUserAnswers(answers);
    }
  }, []);

  const handleAnswerOptionClick = (isCorrect) => {
    const newScore = isCorrect ? score + 1 : score;
    setScore(newScore);
    
    const updatedAnswers = [...userAnswers, { questionIndex: currentQuestion, isCorrect }];
    setUserAnswers(updatedAnswers);
    localStorage.setItem('quizResults', JSON.stringify({ score: newScore, answers: updatedAnswers }));

    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
    } else {
      setShowScore(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setShowScore(false);
    setScore(0);
    setUserAnswers([]);
    localStorage.removeItem('quizResults');
  };

  if (showScore) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>You scored {score} out of {questions.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Review your answers or start over!
            </CardDescription>
          </CardContent>
          <CardFooter>
            <Button onClick={resetQuiz}>Start Over</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Question {currentQuestion + 1}</CardTitle>
          <CardDescription>{questions[currentQuestion].question}</CardDescription>
        </CardHeader>
        <CardContent>
          {questions[currentQuestion].answers.map((answer, index) => (
            <Button 
              key={index} 
              variant="outline"
              className="mb-2 w-full"
              onClick={() => handleAnswerOptionClick(answer.correct)}
            >
              {answer.text}
            </Button>
          ))}
        </CardContent>
        <CardFooter>
          <p className="text-sm text-muted-foreground">
            {userAnswers[currentQuestion]?.isCorrect ? 'Correct!' : 'Incorrect'}
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

export default function App() {
  return (
    <div className="sm:p-8">
      <Quiz />
    </div>
  );
}