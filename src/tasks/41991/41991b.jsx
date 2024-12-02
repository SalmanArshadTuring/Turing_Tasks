import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const difficultyLevels = {
  easy: { minLength: 3, maxLength: 5 },
  medium: { minLength: 6, maxLength: 8 },
  hard: { minLength: 9, maxLength: 100 },
};

const WordList = ({ words, onDelete, onEdit }) => (
  <ul className="space-y-2">
    {words.map((word, index) => (
      <li key={index} className="flex items-center justify-between">
        <span>{word}</span>
        <div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(index)}
            className="mr-2"
          >
            Edit
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDelete(index)}
          >
            Delete
          </Button>
        </div>
      </li>
    ))}
  </ul>
);

const WordEditor = ({ words, setWords }) => {
  const [newWord, setNewWord] = useState("");

  const addWord = () => {
    if (newWord.trim() && !words.includes(newWord.trim())) {
      setWords([...words, newWord.trim()]);
      setNewWord("");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex space-x-2">
        <Input
          value={newWord}
          onChange={(e) => setNewWord(e.target.value)}
          placeholder="Enter a new word"
        />
        <Button onClick={addWord}>Add Word</Button>
      </div>
      <WordList
        words={words}
        onDelete={(index) => setWords(words.filter((_, i) => i !== index))}
        onEdit={(index) => {
          const editedWord = prompt("Edit word:", words[index]);
          if (editedWord && editedWord.trim() !== words[index]) {
            const newWords = [...words];
            newWords[index] = editedWord.trim();
            setWords(newWords);
          }
        }}
      />
    </div>
  );
};

const SpellingSession = ({ words, settings, onComplete }) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [results, setResults] = useState([]);
  const [timeLeft, setTimeLeft] = useState(settings.timeLimit);

  useEffect(() => {
    if (timeLeft > 0 && currentWordIndex < settings.wordsPerSession) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 || currentWordIndex >= settings.wordsPerSession) {
      onComplete(results);
    }
  }, [timeLeft, currentWordIndex, settings.wordsPerSession, results, onComplete]);

  const checkWord = () => {
    const isCorrect = userInput.toLowerCase() === words[currentWordIndex].toLowerCase();
    setResults([...results, { word: words[currentWordIndex], correct: isCorrect }]);
    setUserInput("");
    setCurrentWordIndex(currentWordIndex + 1);
  };

  if (currentWordIndex >= settings.wordsPerSession || timeLeft === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Spell this word:</h2>
      <p className="text-4xl font-bold">{words[currentWordIndex]}</p>
      <div className="flex space-x-2">
        <Input
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Type your answer"
        />
        <Button onClick={checkWord}>Submit</Button>
      </div>
      <p>Time left: {timeLeft} seconds</p>
      <p>
        Word {currentWordIndex + 1} of {settings.wordsPerSession}
      </p>
    </div>
  );
};

const ResultsSummary = ({ results }) => {
  const totalWords = results.length;
  const correctWords = results.filter((r) => r.correct).length;
  const accuracy = totalWords > 0 ? (correctWords / totalWords) * 100 : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Session Results</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Total words attempted: {totalWords}</p>
        <p>Correct words: {correctWords}</p>
        <p>Accuracy: {accuracy.toFixed(2)}%</p>
        <h3 className="mt-4 font-bold">Word by word results:</h3>
        <ul>
          {results.map((result, index) => (
            <li key={index} className={result.correct ? "text-green-600" : "text-red-600"}>
              {result.word}: {result.correct ? "Correct" : "Incorrect"}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

const SettingsEditor = ({ settings, setSettings }) => (
  <div className="space-y-4">
    <div className="flex items-center space-x-2">
      <Label htmlFor="timeLimit">Time Limit (seconds):</Label>
      <Input
        id="timeLimit"
        type="number"
        value={settings.timeLimit}
        onChange={(e) => setSettings({ ...settings, timeLimit: parseInt(e.target.value) })}
        className="w-20"
      />
    </div>
    <div className="flex items-center space-x-2">
      <Label htmlFor="wordsPerSession">Words per Session:</Label>
      <Input
        id="wordsPerSession"
        type="number"
        value={settings.wordsPerSession}
        onChange={(e) => setSettings({ ...settings, wordsPerSession: parseInt(e.target.value) })}
        className="w-20"
      />
    </div>
    <div className="flex items-center space-x-2">
      <Label htmlFor="difficulty">Difficulty:</Label>
      <Select
        value={settings.difficulty}
        onValueChange={(value) => setSettings({ ...settings, difficulty: value })}
      >
        <SelectTrigger id="difficulty">
          <SelectValue placeholder="Select difficulty" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="easy">Easy</SelectItem>
          <SelectItem value="medium">Medium</SelectItem>
          <SelectItem value="hard">Hard</SelectItem>
        </SelectContent>
      </Select>
    </div>
  </div>
);

export default function App() {
  const [words, setWords] = useState([]);
  const [settings, setSettings] = useState({
    timeLimit: 60,
    wordsPerSession: 5,
    difficulty: "medium",
  });
  const [sessionActive, setSessionActive] = useState(false);
  const [sessionResults, setSessionResults] = useState(null);

  useEffect(() => {
    const savedWords = localStorage.getItem("spellingBeeWords");
    if (savedWords) {
      setWords(JSON.parse(savedWords));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("spellingBeeWords", JSON.stringify(words));
  }, [words]);

  const filteredWords = words.filter(
    (word) =>
      word.length >= difficultyLevels[settings.difficulty].minLength &&
      word.length <= difficultyLevels[settings.difficulty].maxLength
  );

  const startSession = () => {
    setSessionActive(true);
    setSessionResults(null);
  };

  const endSession = (results) => {
    setSessionActive(false);
    setSessionResults(results);
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">Customizable Spelling Bee App</h1>
      <Tabs defaultValue="wordlist">
        <TabsList className="mb-4">
          <TabsTrigger value="wordlist">Word List</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="session">Spelling Session</TabsTrigger>
        </TabsList>
        <TabsContent value="wordlist">
          <Card>
            <CardHeader>
              <CardTitle>Word List Editor</CardTitle>
            </CardHeader>
            <CardContent>
              <WordEditor words={words} setWords={setWords} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Session Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <SettingsEditor settings={settings} setSettings={setSettings} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="session">
          <Card>
            <CardHeader>
              <CardTitle>Spelling Session</CardTitle>
            </CardHeader>
            <CardContent>
              {!sessionActive && !sessionResults && (
                <div className="space-y-4">
                  <p>
                    Words available for this session: {filteredWords.length}
                  </p>
                  <Button onClick={startSession} disabled={filteredWords.length === 0}>
                    Start Session
                  </Button>
                </div>
              )}
              {sessionActive && (
                <SpellingSession
                  words={filteredWords}
                  settings={settings}
                  onComplete={endSession}
                />
              )}
              {sessionResults && <ResultsSummary results={sessionResults} />}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}