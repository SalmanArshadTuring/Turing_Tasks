import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

// Mock API for demonstration purposes
const mockAPI = {
  getPolls: () => [
    { id: 1, question: "Favorite color?", options: [
      { id: 1, text: "Red", votes: 5 },
      { id: 2, text: "Blue", votes: 3 },
      { id: 3, text: "Green", votes: 2 },
    ]},
    { id: 2, question: "Best programming language?", options: [
      { id: 1, text: "JavaScript", votes: 10 },
      { id: 2, text: "Python", votes: 8 },
      { id: 3, text: "Java", votes: 6 },
      { id: 4, text: "C++", votes: 4 },
    ]},
  ],
  vote: (pollId, optionId) => {
    console.log(`Voted for option ${optionId} in poll ${pollId}`);
    return true;
  },
  createPoll: (question, options) => {
    console.log(`Created new poll: ${question}`);
    return { id: Math.random(), question, options: options.map((text, index) => ({ id: index + 1, text, votes: 0 })) };
  },
};

function PollList({ polls, onVote }) {
  return (
    <div className="space-y-4">
      {polls.map((poll) => (
        <Poll key={poll.id} poll={poll} onVote={onVote} />
      ))}
    </div>
  );
}

function Poll({ poll, onVote }) {
  const [selectedOption, setSelectedOption] = useState(null);
  const totalVotes = poll.options.reduce((sum, option) => sum + option.votes, 0);

  const handleVote = () => {
    if (selectedOption) {
      onVote(poll.id, selectedOption);
      setSelectedOption(null);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{poll.question}</CardTitle>
        <CardDescription>Total votes: {totalVotes}</CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup onValueChange={setSelectedOption} value={selectedOption}>
          {poll.options.map((option) => (
            <div key={option.id} className="flex items-center space-x-2">
              <RadioGroupItem value={option.id} id={`option-${option.id}`} />
              <Label htmlFor={`option-${option.id}`}>
                {option.text} ({option.votes} votes)
              </Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
      <CardFooter>
        <Button onClick={handleVote} disabled={!selectedOption}>Vote</Button>
      </CardFooter>
    </Card>
  );
}

function CreatePollForm({ onCreatePoll }) {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validOptions = options.filter((option) => option.trim() !== "");
    if (question.trim() && validOptions.length >= 2) {
      onCreatePoll(question, validOptions);
      setQuestion("");
      setOptions(["", "", "", ""]);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Create New Poll</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="question">Question</Label>
            <Input
              id="question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Enter your question"
            />
          </div>
          {options.map((option, index) => (
            <div key={index}>
              <Label htmlFor={`option-${index}`}>Option {index + 1}</Label>
              <Input
                id={`option-${index}`}
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                placeholder={`Enter option ${index + 1}`}
              />
            </div>
          ))}
          <Button type="submit">Create Poll</Button>
        </form>
      </CardContent>
    </Card>
  );
}

export default function App() {
  const [polls, setPolls] = useState([]);

  useEffect(() => {
    setPolls(mockAPI.getPolls());
  }, []);

  const handleVote = (pollId, optionId) => {
    if (mockAPI.vote(pollId, optionId)) {
      setPolls((prevPolls) =>
        prevPolls.map((poll) =>
          poll.id === pollId
            ? {
                ...poll,
                options: poll.options.map((option) =>
                  option.id === optionId
                    ? { ...option, votes: option.votes + 1 }
                    : option
                ),
              }
            : poll
        )
      );
    }
  };

  const handleCreatePoll = (question, options) => {
    const newPoll = mockAPI.createPoll(question, options);
    setPolls((prevPolls) => [...prevPolls, newPoll]);
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">Real-time Polling App</h1>
      <div className="space-y-8">
        <CreatePollForm onCreatePoll={handleCreatePoll} />
        <PollList polls={polls} onVote={handleVote} />
      </div>
    </div>
  );
}