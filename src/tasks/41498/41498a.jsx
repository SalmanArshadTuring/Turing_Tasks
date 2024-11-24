import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";

const quizData = [
  {
    question: "What is the capital of France?",
    options: ["London", "Berlin", "Paris", "Madrid"],
    correctAnswer: "Paris",
    explanation: "Paris is the capital and most populous city of France."
  },
  {
    question: "Which planet is known as the Red Planet?",
    options: ["Venus", "Mars", "Jupiter", "Saturn"],
    correctAnswer: "Mars",
    explanation: "Mars is often called the Red Planet due to its reddish appearance."
  },
  {
    question: "Who painted the Mona Lisa?",
    options: ["Vincent van Gogh", "Leonardo da Vinci", "Pablo Picasso", "Michelangelo"],
    correctAnswer: "Leonardo da Vinci",
    explanation: "The Mona Lisa was painted by Italian Renaissance artist Leonardo da Vinci."
  }
];

const QuizQuestion = ({ question, options, onAnswer }) => {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-xl">{question}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-2">
          {options.map((option, index) => (
            <Button
              key={index}
              onClick={() => onAnswer(option)}
              variant="outline"
              className="text-left"
            >
              {option}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const QuizFeedback = ({ isCorrect, explanation, onNext }) => {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className={isCorrect ? "text-green-600" : "text-red-600"}>
          {isCorrect ? "Correct!" : "Incorrect"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>{explanation}</CardDescription>
      </CardContent>
      <CardFooter>
        <Button onClick={onNext}>Next Question</Button>
      </CardFooter>
    </Card>
  );
};

const QuizResults = ({ score, totalQuestions, onRestart }) => {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Quiz Completed!</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>
          Your score: {score} out of {totalQuestions}
        </CardDescription>
        <Progress value={(score / totalQuestions) * 100} className="mt-4" />
      </CardContent>
      <CardFooter>
        <Button onClick={onRestart}>Restart Quiz</Button>
      </CardFooter>
    </Card>
  );
};

export default function App() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizHistory, setQuizHistory] = useState([]);

  useEffect(() => {
    const savedHistory = localStorage.getItem("quizHistory");
    if (savedHistory) {
      setQuizHistory(JSON.parse(savedHistory));
    }
  }, []);

  const handleAnswer = (selectedAnswer) => {
    const currentQuestion = quizData[currentQuestionIndex];
    const correct = selectedAnswer === currentQuestion.correctAnswer;
    setIsCorrect(correct);
    setShowFeedback(true);
    if (correct) {
      setScore(score + 1);
    }
  };

  const handleNextQuestion = () => {
    setShowFeedback(false);
    if (currentQuestionIndex < quizData.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setQuizCompleted(true);
      const newHistory = [...quizHistory, { date: new Date(), score, total: quizData.length }];
      setQuizHistory(newHistory);
      localStorage.setItem("quizHistory", JSON.stringify(newHistory));
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setShowFeedback(false);
    setQuizCompleted(false);
  };

  const currentQuestion = quizData[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-8">Educational Quiz App</h1>
      <AnimatePresence mode="wait">
        {!quizCompleted && !showFeedback && (
          <motion.div
            key="question"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <QuizQuestion
              question={currentQuestion.question}
              options={currentQuestion.options}
              onAnswer={handleAnswer}
            />
          </motion.div>
        )}
        {showFeedback && (
          <motion.div
            key="feedback"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <QuizFeedback
              isCorrect={isCorrect}
              explanation={currentQuestion.explanation}
              onNext={handleNextQuestion}
            />
          </motion.div>
        )}
        {quizCompleted && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <QuizResults
              score={score}
              totalQuestions={quizData.length}
              onRestart={handleRestart}
            />
          </motion.div>
        )}
      </AnimatePresence>
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">Quiz History</h2>
        <ul className="space-y-2">
          {quizHistory.map((entry, index) => (
            <li key={index} className="text-sm">
              {new Date(entry.date).toLocaleString()}: {entry.score}/{entry.total}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}