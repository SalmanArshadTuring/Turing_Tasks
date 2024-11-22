import React, { useEffect, useRef, useState } from 'react';
import { Button } from "@/components/ui/button";

function useInterval(callback, delay) {
  const savedCallback = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

const Ball = ({ x, y, radius }) => (
  <div 
    style={{
      position: 'absolute',
      left: `${x - radius}px`,
      top: `${y - radius}px`,
      width: `${radius * 2}px`,
      height: `${radius * 2}px`,
      borderRadius: '50%',
      backgroundColor: 'blue'
    }}
  />
);

const Paddle = ({ x, width, height }) => (
  <div 
    style={{
      position: 'absolute',
      left: `${x}px`,
      bottom: '20px',
      width: `${width}px`,
      height: `${height}px`,
      backgroundColor: 'red'
    }}
  />
);

const Brick = ({ x, y, width, height, broken }) => (
  <div 
    style={{
      position: 'absolute',
      left: `${x}px`,
      top: `${y}px`,
      width: `${width}px`,
      height: `${height}px`,
      backgroundColor: broken ? 'transparent' : 'green',
      border: '1px solid black'
    }}
  />
);

export default function App() {
  const canvasRef = useRef(null);
  const [ballPosition, setBallPosition] = useState({ x: 300, y: 300 });
  const [ballVelocity, setBallVelocity] = useState({ x: 2, y: -2 });
  const [paddleX, setPaddleX] = useState(250);
  const [bricks, setBricks] = useState([]);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft" && paddleX > 0) setPaddleX(paddleX - 10);
      if (e.key === "ArrowRight" && paddleX < 600 - 100) setPaddleX(paddleX + 10);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [paddleX]);

  useEffect(() => {
    const rows = 5, cols = 8;
    const newBricks = Array.from({ length: rows }, (_, row) =>
      Array.from({ length: cols }, (_, col) => ({
        x: 70 * col,
        y: 30 * row,
        width: 60,
        height: 20,
        broken: false
      }))
    );
    setBricks(newBricks.flat());
  }, []);

  useInterval(() => {
    setBallPosition(prev => ({
      x: prev.x + ballVelocity.x,
      y: prev.y + ballVelocity.y
    }));

    // Ball collision with walls
    if (ballPosition.x <= 8 || ballPosition.x >= 592) setBallVelocity({...ballVelocity, x: -ballVelocity.x});
    if (ballPosition.y <= 8) setBallVelocity({...ballVelocity, y: -ballVelocity.y});

    // Ball and paddle collision
    if (ballPosition.y >= 560 && ballPosition.y < 570 && ballPosition.x > paddleX && ballPosition.x < paddleX + 100) {
      setBallVelocity({...ballVelocity, y: -ballVelocity.y});
    }

    // Ball and bricks collision
    setBricks(prevBricks => prevBricks.map(brick => {
      if (!brick.broken && 
          ballPosition.y - 8 < brick.y + brick.height && 
          ballPosition.y + 8 > brick.y && 
          ballPosition.x + 8 > brick.x && 
          ballPosition.x - 8 < brick.x + brick.width) {
        setBallVelocity({...ballVelocity, y: -ballVelocity.y});
        setScore(score + 10);
        return {...brick, broken: true};
      }
      return brick;
    }));

    // Game over check (simplified)
    if (ballPosition.y > 600) {
      alert('Game Over! Your score: ' + score);
      setBallPosition({ x: 300, y: 300 });
      setBallVelocity({ x: 2, y: -2 });
    }
  }, 10);

  return (
    <div className="flex flex-col items-center p-4 sm:p-8">
      <div 
        ref={canvasRef} 
        style={{ 
          width: '600px', 
          height: '600px', 
          border: '2px solid black', 
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Ball x={ballPosition.x} y={ballPosition.y} radius={8} />
        <Paddle x={paddleX} width={100} height={10} />
        {bricks.map((brick, idx) => (
          <Brick key={idx} {...brick} />
        ))}
      </div>
      <div className="mt-4 text-lg">Score: {score}</div>
      <Button onClick={() => setScore(0)} className="mt-4">Restart</Button>
    </div>
  );
}