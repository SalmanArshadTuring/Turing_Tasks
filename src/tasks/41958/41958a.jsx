import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const challenges = [
  {
    id: '1',
    title: 'Sum of Two Numbers',
    description: 'Write a function that returns the sum of two numbers.',
    testCases: [
      { input: '1,2', output: '3' },
      { input: '-1,1', output: '0' }
    ],
    solutionTemplate: `function sum(a, b) {
  // Your code here
  return a + b;
}`
  },
  // Add more challenges here
];

function ChallengeCard({ challenge, currentSolution, setCurrentSolution, validateSolution }) {
  return (
    <Card className="sm:max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>{challenge.title}</CardTitle>
        <CardDescription>{challenge.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Textarea 
          value={currentSolution}
          onChange={(e) => setCurrentSolution(e.target.value)}
          placeholder="Write your solution here..."
          className="h-48"
        />
      </CardContent>
      <CardFooter>
        <Button onClick={validateSolution}>Submit</Button>
      </CardFooter>
    </Card>
  );
}

function Feedback({ feedback }) {
  return (
    <div className={`mt-4 p-4 border ${feedback.correct ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'} rounded-md`}>
      <p>{feedback.correct ? 'Correct!' : 'Incorrect!'}</p>
      {feedback.message && <p>{feedback.message}</p>}
    </div>
  );
}

export default function App() {
  const [activeChallenge, setActiveChallenge] = useState(challenges[0].id);
  const [currentSolution, setCurrentSolution] = useState(challenges[0].solutionTemplate);
  const [feedback, setFeedback] = useState({ correct: null, message: '' });

  const validateSolution = useCallback(() => {
    const challenge = challenges.find(ch => ch.id === activeChallenge);
    let correct = true;
    let message = '';
    
    challenge.testCases.forEach(test => {
      const func = new Function('a', 'b', currentSolution.replace('return a + b;', `return sum(${test.input});`));
      const result = func(...test.input.split(','));
      if (result.toString() !== test.output) {
        correct = false;
        message += `Failed for input ${test.input}. Expected ${test.output}, but got ${result}. `;
      }
    });

    setFeedback({ correct, message: correct ? 'All test cases passed!' : message.trim() });
  }, [activeChallenge, currentSolution]);

  return (
    <div className="min-h-screen bg-background p-4 sm:p-8">
      <Tabs defaultValue={activeChallenge} className="w-full sm:max-w-lg mx-auto">
        <TabsList>
          {challenges.map(challenge => (
            <TabsTrigger 
              key={challenge.id} 
              value={challenge.id}
              onClick={() => {
                setActiveChallenge(challenge.id);
                setCurrentSolution(challenge.solutionTemplate);
                setFeedback({ correct: null, message: '' });
              }}
            >
              {challenge.title}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value={activeChallenge}>
          <ChallengeCard 
            challenge={challenges.find(ch => ch.id === activeChallenge)} 
            currentSolution={currentSolution}
            setCurrentSolution={setCurrentSolution}
            validateSolution={validateSolution}
          />
          {feedback.correct !== null && <Feedback feedback={feedback} />}
        </TabsContent>
      </Tabs>
    </div>
  );
}