import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardFooter 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check, X } from 'lucide-react';

const difficultyLevels = {
  easy: 5,  // word length
  medium: 7,
  hard: 9
};

function WordListManager({ words, setWords }) {
  const [newWord, setNewWord] = useState('');

  const addWord = () => {
    if (newWord && !words.includes(newWord)) {
      setWords([...words, newWord]);
      setNewWord('');
    }
  };

  const deleteWord = (word) => {
    setWords(words.filter(w => w !== word));
  };

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>Manage Words</CardTitle>
      </CardHeader>
      <CardContent>
        <Input 
          value={newWord} 
          onChange={(e) => setNewWord(e.target.value)} 
          placeholder="Enter a new word"
        />
        <Button onClick={addWord} className="mt-2">Add Word</Button>
        <ul className="mt-4 space-y-2">
          {words.map(word => (
            <li key={word} className="flex justify-between items-center">
              {word}
              <Button variant="destructive" size="icon" onClick={() => deleteWord(word)}>
                <X />
              </Button>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

function SpellingBeeSession({ words, difficulty, timeLimit, wordsPerSession, onEnd }) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [results, setResults] = useState([]);
  const [timeLeft, setTimeLeft] = useState(timeLimit * 60);

  useEffect(() => {
    const timer = timeLeft > 0 && setInterval(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  useEffect(() => {
    if (timeLeft === 0 || currentWordIndex >= wordsPerSession) {
      onEnd(results);
    }
  }, [timeLeft, currentWordIndex, wordsPerSession, results, onEnd]);

  const checkSpelling = () => {
    const isCorrect = userInput === words[currentWordIndex];
    setResults([...results, { word: words[currentWordIndex], correct: isCorrect }]);
    setUserInput('');
    if (currentWordIndex < wordsPerSession - 1) {
      setCurrentWordIndex(currentWordIndex + 1);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Spelling Bee</CardTitle>
      </CardHeader>
      <CardContent className="text-center">
        <div>Time Left: {Math.floor(timeLeft / 60)}:{('0' + (timeLeft % 60)).slice(-2)}</div>
        <div className="text-xl my-4">{words[currentWordIndex]}</div>
        <Input 
          value={userInput} 
          onChange={(e) => setUserInput(e.target.value)} 
          placeholder="Type the word here"
          className="mb-4"
        />
        <Button onClick={checkSpelling}>Submit</Button>
      </CardContent>
    </Card>
  );
}

function SessionSummary({ results, onRestart }) {
  const correctCount = results.filter(r => r.correct).length;
  const accuracy = (correctCount / results.length * 100) || 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Session Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Correct: {correctCount}</p>
        <p>Incorrect: {results.length - correctCount}</p>
        <p>Accuracy: {accuracy.toFixed(2)}%</p>
        <Button onClick={onRestart} className="mt-4">Start New Session</Button>
      </CardContent>
    </Card>
  );
}

export default function App() {
  const [words, setWords] = useState(() => JSON.parse(localStorage.getItem('spellingBeeWords')) || []);
  const [difficulty, setDifficulty] = useState('medium');
  const [timeLimit, setTimeLimit] = useState(3);
  const [wordsPerSession, setWordsPerSession] = useState(10);
  const [sessionActive, setSessionActive] = useState(false);
  const [sessionResults, setSessionResults] = useState([]);

  useEffect(() => {
    localStorage.setItem('spellingBeeWords', JSON.stringify(words));
  }, [words]);

  const startSession = () => {
    const filteredWords = words.filter(word => word.length <= difficultyLevels[difficulty]);
    setSessionResults([]);
    setSessionActive(true);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-lg">
      <h1 className="text-2xl font-bold mb-4 text-center">Spelling Bee</h1>
      {!sessionActive ? (
        <>
          <WordListManager words={words} setWords={setWords} />
          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <select 
                value={difficulty} 
                onChange={(e) => setDifficulty(e.target.value)} 
                className="mb-2"
              >
                {Object.keys(difficultyLevels).map(level => <option key={level} value={level}>{level}</option>)}
              </select>
              <Input 
                type="number" 
                value={timeLimit} 
                onChange={(e) => setTimeLimit(Number(e.target.value))} 
                placeholder="Time limit (minutes)"
                className="mb-2"
              />
              <Input 
                type="number" 
                value={wordsPerSession} 
                onChange={(e) => setWordsPerSession(Number(e.target.value))} 
                placeholder="Words per session"
              />
            </CardContent>
            <CardFooter>
              <Button onClick={startSession}>Start Session</Button>
            </CardFooter>
          </Card>
        </>
      ) : (
        sessionResults.length ? 
        <SessionSummary results={sessionResults} onRestart={() => setSessionActive(false)} /> :
        <SpellingBeeSession 
          words={words.filter(word => word.length <= difficultyLevels[difficulty]).slice(0, wordsPerSession)} 
          difficulty={difficulty} 
          timeLimit={timeLimit} 
          wordsPerSession={wordsPerSession}
          onEnd={setSessionResults}
        />
      )}
    </div>
  );
}