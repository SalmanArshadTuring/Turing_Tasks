import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const Board = () => {
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);

  const handleClick = (i) => {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    setSquares(nextSquares);
    setXIsNext(!xIsNext);
  };

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = `Winner: ${winner}`;
  } else if (squares.every(Boolean)) {
    status = "It's a Draw!";
  } else {
    status = `Next player: ${xIsNext ? 'X' : 'O'}`;
  }

  const restartGame = () => {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-slate-100">
      <Card className="mb-4">
        <CardHeader>
          <h2 className="text-lg font-semibold">Tic Tac Toe</h2>
        </CardHeader>
        <CardContent>
          <div className="text-center mb-4">{status}</div>
          <div className="grid grid-cols-3 gap-2">
            {squares.map((square, i) => (
              <Square key={i} value={square} onSquareClick={() => handleClick(i)} />
            ))}
          </div>
        </CardContent>
      </Card>
      <Button onClick={restartGame}>Restart Game</Button>
    </div>
  );
};

function Square({ value, onSquareClick }) {
  return (
    <button 
      className="w-20 h-20 sm:w-24 sm:h-24 bg-white border border-gray-300 flex items-center justify-center text-4xl font-bold hover:bg-gray-100 transition-colors"
      onClick={onSquareClick}
    >
      {value}
    </button>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

export default function App() {
  return <Board />;
}