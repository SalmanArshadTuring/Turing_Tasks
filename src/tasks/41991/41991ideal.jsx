import React, { useState, useEffect, useRef } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function App() {
  const [wordList, setWordList] = useState([]);
  const [sessionSettings, setSessionSettings] = useState({
    timeLimit: 0,
    difficulty: 'easy',
    numberOfWords: 10,
  });
  const [currentSession, setCurrentSession] = useState(null);
  const [sessionResults, setSessionResults] = useState(null);

  useEffect(() => {
    const savedWordList = JSON.parse(localStorage.getItem('wordList'));
    if (savedWordList) {
      setWordList(savedWordList);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('wordList', JSON.stringify(wordList));
  }, [wordList]);

  const startSession = (settings) => {
    setSessionSettings(settings);
    setCurrentSession({ startTime: Date.now() });
  };

  const endSession = (results) => {
    setSessionResults({ results, startTime: currentSession.startTime });
    setCurrentSession(null);
  };

  const restart = () => {
    setSessionResults(null);
  };

  return (
    <div className="container mx-auto p-4">
      {!currentSession && !sessionResults && (
        <>
          <WordListManager wordList={wordList} setWordList={setWordList} />
          <SessionSettings
            sessionSettings={sessionSettings}
            setSessionSettings={setSessionSettings}
            startSession={startSession}
          />
        </>
      )}
      {currentSession && (
        <SpellingSession
          wordList={wordList}
          sessionSettings={sessionSettings}
          endSession={endSession}
        />
      )}
      {sessionResults && (
        <ResultsSummary
          results={sessionResults.results}
          startTime={sessionResults.startTime}
          restart={restart}
        />
      )}
    </div>
  );
}

function WordListManager({ wordList, setWordList }) {
  const [newWord, setNewWord] = useState('');
  const [editingWord, setEditingWord] = useState(null);

  const addWord = () => {
    if (newWord.trim() !== '') {
      setWordList([
        ...wordList,
        { word: newWord.trim(), difficulty: 'easy' },
      ]);
      setNewWord('');
    }
  };

  const deleteWord = (index) => {
    const updatedList = [...wordList];
    updatedList.splice(index, 1);
    setWordList(updatedList);
  };

  const editWord = (index) => {
    setEditingWord({ index, word: wordList[index].word });
  };

  const saveEditedWord = () => {
    const updatedList = [...wordList];
    updatedList[editingWord.index].word = editingWord.word;
    setWordList(updatedList);
    setEditingWord(null);
  };

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>Manage Word List</CardTitle>
        <CardDescription>Add, edit, or delete words</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center mb-2">
          <input
            type="text"
            value={newWord}
            onChange={(e) => setNewWord(e.target.value)}
            className="border p-2 mr-2 flex-1"
            placeholder="Add new word"
          />
          <button
            onClick={addWord}
            className="bg-blue-500 text-white px-4 py-2"
          >
            Add
          </button>
        </div>
        <ul>
          {wordList.map((item, index) => (
            <li key={index} className="flex items-center mb-1">
              {editingWord && editingWord.index === index ? (
                <>
                  <input
                    type="text"
                    value={editingWord.word}
                    onChange={(e) =>
                      setEditingWord({ ...editingWord, word: e.target.value })
                    }
                    className="border p-1 mr-2 flex-1"
                  />
                  <button
                    onClick={saveEditedWord}
                    className="bg-green-500 text-white px-2 py-1 mr-2"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingWord(null)}
                    className="bg-gray-500 text-white px-2 py-1"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <span className="flex-1">{item.word}</span>
                  <button
                    onClick={() => editWord(index)}
                    className="bg-yellow-500 text-white px-2 py-1 mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteWord(index)}
                    className="bg-red-500 text-white px-2 py-1"
                  >
                    Delete
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

function SessionSettings({ sessionSettings, setSessionSettings, startSession }) {
  const [settings, setSettings] = useState(sessionSettings);

  const updateSetting = (key, value) => {
    setSettings({ ...settings, [key]: value });
  };

  const applySettings = () => {
    setSessionSettings(settings);
    startSession(settings);
  };

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>Session Settings</CardTitle>
        <CardDescription>Customize your session</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-2">
          <label className="block mb-1">
            Time Limit (seconds, 0 for no limit)
          </label>
          <input
            type="number"
            value={settings.timeLimit}
            onChange={(e) =>
              updateSetting('timeLimit', parseInt(e.target.value))
            }
            className="border p-2 w-full"
          />
        </div>
        <div className="mb-2">
          <label className="block mb-1">Difficulty Level</label>
          <select
            value={settings.difficulty}
            onChange={(e) => updateSetting('difficulty', e.target.value)}
            className="border p-2 w-full"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
        <div className="mb-2">
          <label className="block mb-1">Number of Words</label>
          <input
            type="number"
            value={settings.numberOfWords}
            onChange={(e) =>
              updateSetting('numberOfWords', parseInt(e.target.value))
            }
            className="border p-2 w-full"
          />
        </div>
      </CardContent>
      <CardFooter>
        <button
          onClick={applySettings}
          className="bg-blue-500 text-white px-4 py-2"
        >
          Start Session
        </button>
      </CardFooter>
    </Card>
  );
}

function SpellingSession({ wordList, sessionSettings, endSession }) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [results, setResults] = useState([]);
  const resultsRef = useRef(results);
  const [startTime] = useState(Date.now());
  const [timeRemaining, setTimeRemaining] = useState(sessionSettings.timeLimit);
  const [sessionWords, setSessionWords] = useState([]);

  useEffect(() => {
    resultsRef.current = results;
  }, [results]);

  useEffect(() => {
    let filteredWords = wordList.filter(
      (word) => word.difficulty === sessionSettings.difficulty
    );
    filteredWords = filteredWords.sort(() => Math.random() - 0.5);
    filteredWords = filteredWords.slice(0, sessionSettings.numberOfWords);
    setSessionWords(filteredWords);

    if (sessionSettings.timeLimit > 0) {
      const timer = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        const remaining = sessionSettings.timeLimit - elapsed;
        setTimeRemaining(remaining);
        if (remaining <= 0) {
          clearInterval(timer);
          endSession(resultsRef.current);
        }
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [startTime]);

  const submitAnswer = () => {
    const correct =
      userInput.trim().toLowerCase() ===
      sessionWords[currentWordIndex].word.toLowerCase();
    const newResults = [
      ...results,
      { word: sessionWords[currentWordIndex].word, correct },
    ];
    setResults(newResults);
    setUserInput('');
    if (currentWordIndex + 1 < sessionWords.length) {
      setCurrentWordIndex(currentWordIndex + 1);
    } else {
      endSession(newResults);
    }
  };

  const scrambleWord = (word) => {
    return word
      .split('')
      .sort(() => Math.random() - 0.5)
      .join('');
  };

  const currentWord = sessionWords[currentWordIndex]
    ? sessionWords[currentWordIndex].word
    : '';

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>Spelling Session</CardTitle>
        {sessionSettings.timeLimit > 0 && (
          <CardDescription>Time Remaining: {timeRemaining}s</CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <div className="mb-2">
          <p className="mb-4">Unscramble and spell the following word:</p>
          <p className="text-2xl mb-4">{scrambleWord(currentWord)}</p>
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            className="border p-2 w-full"
            placeholder="Type the spelling here"
          />
        </div>
      </CardContent>
      <CardFooter>
        <button
          onClick={submitAnswer}
          className="bg-green-500 text-white px-4 py-2"
        >
          Submit
        </button>
      </CardFooter>
    </Card>
  );
}

function ResultsSummary({ results, startTime, restart }) {
  const totalWords = results.length;
  const correctWords = results.filter((result) => result.correct).length;
  const accuracy =
    totalWords > 0
      ? ((correctWords / totalWords) * 100).toFixed(2)
      : '0.00';
  const timeTaken = (Date.now() - startTime) / 1000;

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>Session Results</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Total Words Attempted: {totalWords}</p>
        <p>Correct Words: {correctWords}</p>
        <p>Accuracy: {accuracy}%</p>
        <p>Time Taken: {timeTaken.toFixed(2)} seconds</p>
      </CardContent>
      <CardFooter>
        <button
          onClick={restart}
          className="bg-blue-500 text-white px-4 py-2"
        >
          Restart
        </button>
      </CardFooter>
    </Card>
  );
}
