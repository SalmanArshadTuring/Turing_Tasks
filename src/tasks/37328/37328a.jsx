import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";

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

const Spaceship = ({ position, onFire }) => (
  <div className="absolute w-10 h-10 bg-slate-900 rounded-full" style={{ left: position.x, top: position.y }} onClick={onFire}>
    <div className="w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-b-8 border-b-slate-500 absolute top-0 left-3"></div>
  </div>
);

const Asteroid = ({ size, position, onHit }) => {
  const asteroidClass = `absolute rounded-full ${size === 'large' ? 'w-16 h-16' : size === 'medium' ? 'w-12 h-12' : 'w-8 h-8'} bg-stone-600`;
  return <div className={asteroidClass} style={{ left: position.x, top: position.y }} onClick={() => onHit(size)} />;
};

const PowerUp = ({ type, position }) => (
  <div className={`absolute w-6 h-6 ${type === 'shield' ? 'bg-blue-500' : 'bg-green-500'} rounded-full`} style={{ left: position.x, top: position.y }}></div>
);

export default function App() {
  const [gameState, setGameState] = useState({ playing: false, score: 0, lives: 3, level: 1 });
  const [spaceshipPos, setSpaceshipPos] = useState({ x: 50, y: 50 });
  const [projectiles, setProjectiles] = useState([]);
  const [asteroids, setAsteroids] = useState([]);
  const [powerUps, setPowerUps] = useState([]);
  const [boss, setBoss] = useState(null);

  const moveSpaceship = (e) => {
    const rect = e.target.getBoundingClientRect();
    setSpaceshipPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const fire = () => {
    setProjectiles(prev => [...prev, { x: spaceshipPos.x + 5, y: spaceshipPos.y }]);
  };

  useInterval(() => {
    if (gameState.playing) {
      // Move projectiles
      setProjectiles(prev => prev.map(p => ({ ...p, y: p.y - 10 })).filter(p => p.y > 0));
      
      // Generate asteroids
      if (Math.random() < 0.02 * gameState.level) {
        setAsteroids(prev => [...prev, { x: Math.random() * 100, y: 0, size: 'large' }]);
      }

      // Move asteroids
      setAsteroids(prev => prev.map(a => ({ ...a, y: a.y + 5 })).filter(a => a.y < 100));

      // Check for collisions
      setAsteroids(prev => prev.filter(a => !projectiles.some(p => Math.hypot(p.x - a.x, p.y - a.y) < 10)));

      // Score, lives logic, etc., would go here but are omitted for brevity
    }
  }, 100);

  const startGame = () => setGameState({ ...gameState, playing: true });

  if (!gameState.playing) {
    return (
      <Card className="sm:max-w-lg mx-auto mt-10">
        <CardHeader>
          <CardTitle>Space Shooter</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Ready to start?</p>
        </CardContent>
        <CardFooter>
          <Button onClick={startGame}>Start Game</Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <div className="relative h-[500px] bg-black overflow-hidden" onMouseMove={moveSpaceship} onClick={fire}>
      <Spaceship position={spaceshipPos} onFire={fire} />
      {asteroids.map((a, idx) => <Asteroid key={idx} {...a} onHit={(size) => {
        setAsteroids(prev => prev.filter((_, i) => i !== idx));
        // Here you would handle breaking asteroids into smaller pieces, scoring, etc.
      }} />)}
      {projectiles.map((p, idx) => <div key={idx} className="absolute w-2 h-2 bg-white rounded-full" style={{ left: p.x, top: p.y }} />)}
      <div className="absolute top-2 left-2 text-white">Score: {gameState.score} | Lives: {gameState.lives}</div>
    </div>
  );
}