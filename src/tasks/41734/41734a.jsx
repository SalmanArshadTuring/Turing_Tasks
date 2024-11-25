import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
} from "@/components/ui/toast";

// Mock API for demonstration
const mockApi = {
  polls: [
    {
      id: 1,
      question: "What's your favorite color?",
      options: [
        { text: "Red", votes: 5 },
        { text: "Blue", votes: 10 },
        { text: "Green", votes: 3 },
      ],
    },
  ],
  vote: (pollId, optionIndex) =>
    new Promise((resolve) =>
      setTimeout(() => resolve({ success: true }), 500)
    ),
  createPoll: (question, options) =>
    new Promise((resolve) =>
      setTimeout(
        () =>
          resolve({
            id: Date.now(),
            question,
            options: options.map((text) => ({ text, votes: 0 })),
          }),
        500
      )
    ),
};

function Poll({ poll, onVote }) {
  const [selected, setSelected] = useState(null);

  const handleVote = async () => {
    if (selected !== null) {
      const result = await mockApi.vote(poll.id, selected);
      if (result.success) {
        onVote(poll.id, selected);
      }
    }
  };

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>{poll.question}</CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={selected}
          onValueChange={setSelected}
          className="flex flex-col space-y-2"
        >
          {poll.options.map((option, index) => (
            <RadioGroupItem key={index} value={index} id={`option-${index}`}>
              {option.text} ({option.votes})
            </RadioGroupItem>
          ))}
        </RadioGroup>
        <Button onClick={handleVote} className="mt-4">
          Vote
        </Button>
        <p className="mt-2 text-sm">
          Total Votes:{" "}
          {poll.options.reduce((acc, curr) => acc + curr.votes, 0)}
        </p>
      </CardContent>
    </Card>
  );
}

function NewPollForm({ onSubmit, addToast }) {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (question && options.some((option) => option.trim() !== "")) {
      const newPoll = await mockApi.createPoll(
        question,
        options.filter((o) => o.trim())
      );
      onSubmit(newPoll);
      setQuestion("");
      setOptions(["", "", "", ""]);
      addToast("Poll created successfully!", "Your poll is ready.");
    } else {
      addToast("Error", "Please fill in the question and at least one option.");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Poll</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="question">Question</Label>
            <Input
              id="question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              required
            />
            {options.map((option, index) => (
              <div key={index}>
                <Label htmlFor={`option${index}`}>Option {index + 1}</Label>
                <Input
                  id={`option${index}`}
                  value={option}
                  onChange={(e) => {
                    const newOptions = [...options];
                    newOptions[index] = e.target.value;
                    setOptions(newOptions);
                  }}
                />
              </div>
            ))}
          </div>
          <Button type="submit" className="mt-4">
            Create Poll
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export default function App() {
  const [polls, setPolls] = useState(mockApi.polls);
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    // Real-time updates could be added here
  }, []);

  const addToast = (title, description) => {
    setToasts((prev) => [...prev, { title, description }]);
  };

  const handleNewPoll = (newPoll) => {
    setPolls((prevPolls) => [...prevPolls, newPoll]);
  };

  const handleVote = (pollId, optionIndex) => {
    setPolls(
      polls.map((poll) =>
        poll.id === pollId
          ? {
              ...poll,
              options: poll.options.map((opt, idx) => ({
                ...opt,
                votes: idx === optionIndex ? opt.votes + 1 : opt.votes,
              })),
            }
          : poll
      )
    );
  };

  return (
    <ToastProvider>
      <div className="container mx-auto p-4 sm:p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">Polling App</h1>
        <NewPollForm onSubmit={handleNewPoll} addToast={addToast} />
        {polls.map((poll) => (
          <Poll key={poll.id} poll={poll} onVote={handleVote} />
        ))}
      </div>
      {toasts.map((toast, index) => (
        <Toast key={index}>
          <ToastTitle>{toast.title}</ToastTitle>
          <ToastDescription>{toast.description}</ToastDescription>
        </Toast>
      ))}
      <ToastViewport />
    </ToastProvider>
  );
}
