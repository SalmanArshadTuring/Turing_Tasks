import React, { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";

const Maze = ({ size = 10, onWin }) => {
  const [maze, setMaze] = useState([]);
  const [playerPos, setPlayerPos] = useState({ x: 0, y: 0 });
  const [collectibles, setCollectibles] = useState([]);
  const [keysCollected, setKeysCollected] = useState(0);
  const [time, setTime] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);

  const createMaze = useCallback(() => {
    let newMaze = Array(size).fill().map(() => Array(size).fill(0));
    let newCollectibles = [];
    // Simple maze generation with walls
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        if (Math.random() < 0.3) newMaze[i][j] = 1; // 1 represents a wall
      }
    }
    newMaze[0][0] = 0; // Start
    newMaze[size-1][size-1] = 2; // Goal

    // Place collectibles
    for (let k = 0; k < 3; k++) {
      let x, y;
      do {
        x = Math.floor(Math.random() * size);
        y = Math.floor(Math.random() * size);
      } while (newMaze[x][y] !== 0);
      newCollectibles.push({ x, y });
      newMaze[x][y] = 3; // 3 represents a collectible
    }

    setMaze(newMaze);
    setCollectibles(newCollectibles);
  }, [size]);

  useEffect(() => {
    createMaze();
    const interval = setInterval(() => {
      if (!isGameOver) setTime(prevTime => prevTime + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [createMaze, isGameOver]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (isGameOver) return;
      let newPos = { ...playerPos };
      switch(event.key) {
        case 'ArrowUp': case 'w': if (playerPos.y > 0 && maze[playerPos.y-1][playerPos.x] !== 1) newPos.y -= 1; break;
        case 'ArrowDown': case 's': if (playerPos.y < size-1 && maze[playerPos.y+1][playerPos.x] !== 1) newPos.y += 1; break;
        case 'ArrowLeft': case 'a': if (playerPos.x > 0 && maze[playerPos.y][playerPos.x-1] !== 1) newPos.x -= 1; break;
        case 'ArrowRight': case 'd': if (playerPos.x < size-1 && maze[playerPos.y][playerPos.x+1] !== 1) newPos.x += 1; break;
        default: return;
      }
      if (maze[newPos.y][newPos.x] === 2) {
        onWin();
        setIsGameOver(true);
      } else if (maze[newPos.y][newPos.x] === 3) {
        setKeysCollected(keysCollected + 1);
        let updatedCollectibles = collectibles.filter(c => c.x !== newPos.x || c.y !== newPos.y);
        setCollectibles(updatedCollectibles);
      }
      setPlayerPos(newPos);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [playerPos, maze, isGameOver, onWin, keysCollected, collectibles, size]);

  return (
    <div className="grid grid-cols-10 gap-1 p-2">
      {maze.map((row, y) => row.map((cell, x) => (
        <div key={`${x}-${y}`} className={`w-6 h-6 ${[
          'bg-slate-200', // empty
          'bg-slate-800', // wall
          'bg-green-500', // goal
          'bg-yellow-400', // collectible
        ][cell] || 'bg-blue-500'} flex items-center justify-center`}>
          {(playerPos.x === x && playerPos.y === y) && <div className="w-3 h-3 bg-red-500 rounded-full"></div>}
        </div>
      )))}
    </div>
  );
};

export default function App() {
  const [level, setLevel] = useState(1);
  const [isWon, setIsWon] = useState(false);

  const handleWin = () => {
    setIsWon(true);
    setTimeout(() => {
      setLevel(prevLevel => prevLevel + 1);
      setIsWon(false);
    }, 2000);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-100 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Maze Runner</CardTitle>
        </CardHeader>
        <CardContent>
          {isWon ? (
            <div className="text-center">
              <h2 className="text-xl font-bold">You Win!</h2>
              <p>Preparing next level...</p>
            </div>
          ) : (
            <>
              <Maze size={8 + level} onWin={handleWin} />
              <div className="mt-4 text-center">
                <p>Level: {level}</p>
                <p>Time: {Math.floor(performance.now() / 1000)}s</p>
              </div>
            </>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={() => setLevel(1)}>Restart</Button>
        </CardFooter>
      </Card>
    </div>
  );
}