import React, { useState, useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const MAZE_WIDTH = 10;
const MAZE_HEIGHT = 10;

const DIRECTIONS = {
  ArrowUp: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 },
  w: { x: 0, y: -1 },
  s: { x: 0, y: 1 },
  a: { x: -1, y: 0 },
  d: { x: 1, y: 0 },
};

const generateMaze = () => {
  // Simple maze generation for demo purposes
  const maze = Array(MAZE_HEIGHT)
    .fill(null)
    .map(() => Array(MAZE_WIDTH).fill(0));

  // Add some walls
  for (let i = 0; i < MAZE_HEIGHT; i++) {
    for (let j = 0; j < MAZE_WIDTH; j++) {
      if (Math.random() < 0.2) {
        maze[i][j] = 1;
      }
    }
  }
  maze[0][0] = 0; // Start
  maze[MAZE_HEIGHT - 1][MAZE_WIDTH - 1] = 0; // Goal
  return maze;
};

export default function App() {
  const [maze, setMaze] = useState(generateMaze());
  const [playerPos, setPlayerPos] = useState({ x: 0, y: 0 });
  const [coins, setCoins] = useState([]);
  const [collectedCoins, setCollectedCoins] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const timerRef = useRef(null);

  useEffect(() => {
    // Generate coins
    const newCoins = [];
    for (let i = 0; i < 5; i++) {
      let x = Math.floor(Math.random() * MAZE_WIDTH);
      let y = Math.floor(Math.random() * MAZE_HEIGHT);
      if (maze[y][x] === 0 && !(x === 0 && y === 0)) {
        newCoins.push({ x, y });
      }
    }
    setCoins(newCoins);
  }, [maze]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      const direction = DIRECTIONS[e.key];
      if (direction) {
        movePlayer(direction);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, []);

  useEffect(() => {
    if (timeLeft <= 0) {
      alert("Time's up! You lost.");
      resetGame();
    }
  }, [timeLeft]);

  const movePlayer = ({ x, y }) => {
    const newX = playerPos.x + x;
    const newY = playerPos.y + y;
    if (
      newX >= 0 &&
      newX < MAZE_WIDTH &&
      newY >= 0 &&
      newY < MAZE_HEIGHT &&
      maze[newY][newX] === 0
    ) {
      setPlayerPos({ x: newX, y: newY });
      collectCoin(newX, newY);
      checkWin(newX, newY);
    }
  };

  const collectCoin = (x, y) => {
    const coinIndex = coins.findIndex((coin) => coin.x === x && coin.y === y);
    if (coinIndex !== -1) {
      setCoins(coins.filter((_, idx) => idx !== coinIndex));
      setCollectedCoins(collectedCoins + 1);
    }
  };

  const checkWin = (x, y) => {
    if (x === MAZE_WIDTH - 1 && y === MAZE_HEIGHT - 1) {
      alert(`You win! Coins collected: ${collectedCoins}`);
      resetGame();
    }
  };

  const resetGame = () => {
    setMaze(generateMaze());
    setPlayerPos({ x: 0, y: 0 });
    setCollectedCoins(0);
    setTimeLeft(60);
  };

  return (
    <div className="flex flex-col items-center p-4 sm:p-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Maze Game</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-10 gap-1">
            {maze.map((row, y) =>
              row.map((cell, x) => {
                let bgColor = "bg-white";
                if (cell === 1) bgColor = "bg-gray-800";
                if (playerPos.x === x && playerPos.y === y)
                  bgColor = "bg-blue-500";
                if (x === MAZE_WIDTH - 1 && y === MAZE_HEIGHT - 1)
                  bgColor = "bg-green-500";
                if (coins.some((coin) => coin.x === x && coin.y === y))
                  bgColor = "bg-yellow-300";
                return (
                  <div
                    key={`${x}-${y}`}
                    className={`h-6 w-6 ${bgColor} border border-gray-300`}
                  ></div>
                );
              })
            )}
          </div>
          <div className="mt-4 text-center">
            <p>Time Left: {timeLeft}s</p>
            <p>Coins Collected: {collectedCoins}</p>
          </div>
        </CardContent>
      </Card>
      <button
        onClick={resetGame}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
      >
        Restart Game
      </button>
    </div>
  );
}
