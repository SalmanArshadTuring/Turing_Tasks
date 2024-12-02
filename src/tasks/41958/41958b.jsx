import React, { useState, useCallback } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const codingChallenges = [
  {
    id: 1,
    title: "Reverse a String",
    description: "Write a function that reverses a string.",
    problem: "function reverseString(str) {\n  // Your code here\n}",
    solution: "function reverseString(str) {\n  return str.split('').reverse().join('');\n}",
    test: "(reverseString('hello') === 'olleh')",
    explanation: "This solution splits the string into an array of characters, reverses the array, and joins it back into a string."
  },
  {
    id: 2,
    title: "Find the Largest Number",
    description: "Write a function that returns the largest number in an array.",
    problem: "function findLargest(arr) {\n  // Your code here\n}",
    solution: "function findLargest(arr) {\n  return Math.max(...arr);\n}",
    test: "(findLargest([1, 5, 2, 9, 3]) === 9)",
    explanation: "This solution uses the spread operator with Math.max() to find the largest number in the array."
  }
];

function CodeEditor({ value, onChange }) {
  return (
    <Textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="font-mono text-sm h-48 resize-none"
      placeholder="Write your code here..."
    />
  );
}

function ChallengeSelector({ challenges, currentChallenge, onSelect }) {
  return (
    <Select value={currentChallenge.id.toString()} onValueChange={(value) => onSelect(parseInt(value))}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select a challenge" />
      </SelectTrigger>
      <SelectContent>
        {challenges.map((challenge) => (
          <SelectItem key={challenge.id} value={challenge.id.toString()}>
            {challenge.title}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function FeedbackAlert({ isCorrect, explanation }) {
  return (
    <Alert variant={isCorrect ? "default" : "destructive"}>
      <AlertTitle>{isCorrect ? "Correct!" : "Incorrect"}</AlertTitle>
      <AlertDescription>{explanation}</AlertDescription>
    </Alert>
  );
}

export default function App() {
  const [currentChallenge, setCurrentChallenge] = useState(codingChallenges[0]);
  const [userCode, setUserCode] = useState(currentChallenge.problem);
  const [feedback, setFeedback] = useState(null);

  const handleChallengeChange = useCallback((challengeId) => {
    const newChallenge = codingChallenges.find((c) => c.id === challengeId);
    setCurrentChallenge(newChallenge);
    setUserCode(newChallenge.problem);
    setFeedback(null);
  }, []);

  const handleSubmit = useCallback(() => {
    try {
      // eslint-disable-next-line no-new-func
      const result = new Function(`return ${userCode}`)();
      const isCorrect = eval(currentChallenge.test);
      setFeedback({
        isCorrect,
        explanation: isCorrect ? currentChallenge.explanation : "Your solution is incorrect. Please try again."
      });
    } catch (error) {
      setFeedback({
        isCorrect: false,
        explanation: `Error: ${error.message}`
      });
    }
  }, [currentChallenge, userCode]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Coding Challenge</CardTitle>
          <CardDescription>Test your coding skills with these challenges!</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ChallengeSelector
            challenges={codingChallenges}
            currentChallenge={currentChallenge}
            onSelect={handleChallengeChange}
          />
          <div>
            <h3 className="text-lg font-semibold mb-2">{currentChallenge.title}</h3>
            <p className="text-sm text-gray-600 mb-4">{currentChallenge.description}</p>
            <CodeEditor value={userCode} onChange={setUserCode} />
          </div>
          {feedback && <FeedbackAlert isCorrect={feedback.isCorrect} explanation={feedback.explanation} />}
        </CardContent>
        <CardFooter>
          <Button onClick={handleSubmit} className="w-full">
            Submit Solution
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}