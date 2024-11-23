import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const GRID_SIZE = 10;
const CELL_SIZE = 40;

const PLAYER = "🧑";
const WALL = "🧱";
const GOAL = "🏁";
const KEY = "🔑";
const COIN = "💰";
const ENEMY = "👾";

const LEVELS = [
  {
    grid: [
      "🧱🧱🧱🧱🧱🧱🧱🧱🧱🧱",
      "🧑  🔑    🧱  🧱",
      "🧱🧱🧱  🧱🧱  🧱  🧱",
      "🧱    🧱      🧱",
      "🧱  🧱🧱  🧱🧱    🧱",
      "🧱    🧱    🧱  🧱",
      "🧱  🧱🧱  🧱🧱    🧱",
      "🧱💰   🧱      🧱",
      "🧱🧱🧱  🧱🧱🧱  🧱  🧱",
      "🧱          👾 🏁",
    ],
    timeLimit: 60,
  },
  // Add more levels here
];

const directions = {
  ArrowUp: [-1, 0],
  ArrowDown: [1, 0],
  ArrowLeft: [0, -1],
  ArrowRight: [0, 1],
  w: [-1, 0],
  s: [1, 0],
  a: [0, -1],
  d: [0, 1],
};

function Cell({ content }) {
  return (
    <div
      className="flex items-center justify-center border border-gray-300"
      style={{ width: CELL_SIZE, height: CELL_SIZE }}
    >
      {content}
    </div>
  );
}

export default function App() {
  const [level, setLevel] = useState(0);
  const [grid, setGrid] = useState(LEVELS[level].grid.map((row) => row.split("")));
  const [playerPos, setPlayerPos] = useState([1, 0]);
  const [hasKey, setHasKey] = useState(false);
  const [coins, setCoins] = useState(0);
  const [timeLeft, setTimeLeft] = useState(LEVELS[level].timeLimit);
  const [gameStatus, setGameStatus] = useState("playing");

  const movePlayer = useCallback(
    (direction) => {
      if (gameStatus !== "playing") return;

      const [dy, dx] = directions[direction] || [0, 0];
      const newY = playerPos[0] + dy;
      const newX = playerPos[1] + dx;

      if (
        newY >= 0 &&
        newY < GRID_SIZE &&
        newX >= 0 &&
        newX < GRID_SIZE &&
        grid[newY][newX] !== WALL
      ) {
        const newGrid = grid.map((row) => [...row]);
        newGrid[playerPos[0]][playerPos[1]] = " ";

        if (grid[newY][newX] === GOAL && hasKey) {
          setGameStatus("won");
        } else if (grid[newY][newX] === ENEMY) {
          setGameStatus("lost");
        } else {
          if (grid[newY][newX] === KEY) setHasKey(true);
          if (grid[newY][newX] === COIN) setCoins((c) => c + 1);
          newGrid[newY][newX] = PLAYER;
          setGrid(newGrid);
          setPlayerPos([newY, newX]);
        }
      }
    },
    [grid, playerPos, hasKey, gameStatus]
  );

  useEffect(() => {
    const handleKeyDown = (e) => movePlayer(e.key);
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [movePlayer]);

  useEffect(() => {
    if (gameStatus === "playing" && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setGameStatus("lost");
    }
  }, [timeLeft, gameStatus]);

  const resetGame = () => {
    setGrid(LEVELS[level].grid.map((row) => row.split("")));
    setPlayerPos([1, 0]);
    setHasKey(false);
    setCoins(0);
    setTimeLeft(LEVELS[level].timeLimit);
    setGameStatus("playing");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Maze Game</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)` }}>
            {grid.map((row, y) =>
              row.map((cell, x) => <Cell key={`${y}-${x}`} content={cell} />)
            )}
          </div>
          <div className="mt-4 text-center">
            <p>Time Left: {timeLeft}s</p>
            <p>Coins: {coins}</p>
            <p>Key: {hasKey ? "🔑" : "❌"}</p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          {gameStatus === "playing" ? (
            <div className="grid grid-cols-3 gap-2">
              <Button onClick={() => movePlayer("ArrowUp")}>↑</Button>
              <Button onClick={() => movePlayer("ArrowLeft")}>←</Button>
              <Button onClick={() => movePlayer("ArrowRight")}>→</Button>
              <Button onClick={() => movePlayer("ArrowDown")}>↓</Button>
            </div>
          ) : (
            <Button onClick={resetGame}>
              {gameStatus === "won" ? "You Won! Play Again" : "Game Over. Try Again"}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}