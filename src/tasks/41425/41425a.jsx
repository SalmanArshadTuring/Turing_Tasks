import React, { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const WINNING_COMBINATIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const Cell = ({ value, onClick }) => (
  <button
    className="w-20 h-20 border border-gray-300 flex items-center justify-center text-4xl font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ease-in-out hover:bg-gray-100"
    onClick={onClick}
  >
    {value}
  </button>
);

const Board = ({ squares, onClick }) => (
  <div className="grid grid-cols-3 gap-2">
    {squares.map((square, i) => (
      <Cell key={i} value={square} onClick={() => onClick(i)} />
    ))}
  </div>
);

const GameStatus = ({ winner, isXNext, isDraw }) => {
  let status;
  if (winner) {
    status = `Winner: ${winner}`;
  } else if (isDraw) {
    status = "Game ended in a draw!";
  } else {
    status = `Next player: ${isXNext ? "X" : "O"}`;
  }
  return <div className="text-xl font-semibold mb-4">{status}</div>;
};

export default function App() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [stepNumber, setStepNumber] = useState(0);
  const [isXNext, setIsXNext] = useState(true);

  const current = history[stepNumber];
  const winner = calculateWinner(current);
  const isDraw = current.every((square) => square !== null) && !winner;

  const handleClick = useCallback(
    (i) => {
      const newHistory = history.slice(0, stepNumber + 1);
      const currentSquares = newHistory[newHistory.length - 1].slice();

      if (calculateWinner(currentSquares) || currentSquares[i]) {
        return;
      }

      currentSquares[i] = isXNext ? "X" : "O";
      setHistory(newHistory.concat([currentSquares]));
      setStepNumber(newHistory.length);
      setIsXNext(!isXNext);
    },
    [history, stepNumber, isXNext]
  );

  const resetGame = useCallback(() => {
    setHistory([Array(9).fill(null)]);
    setStepNumber(0);
    setIsXNext(true);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Tic Tac Toe</CardTitle>
        </CardHeader>
        <CardContent>
          <GameStatus winner={winner} isXNext={isXNext} isDraw={isDraw} />
          <Board squares={current} onClick={handleClick} />
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button onClick={resetGame} className="mt-4">
            Restart Game
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

function calculateWinner(squares) {
  for (let i = 0; i < WINNING_COMBINATIONS.length; i++) {
    const [a, b, c] = WINNING_COMBINATIONS[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}