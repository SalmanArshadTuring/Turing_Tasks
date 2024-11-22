import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;

const Ship = ({ x, y }) => (
  <div
    className="absolute w-10 h-10 bg-blue-500"
    style={{ left: x, top: y, clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)" }}
  />
);

const Bullet = ({ x, y }) => (
  <div
    className="absolute w-2 h-2 bg-yellow-500 rounded-full"
    style={{ left: x, top: y }}
  />
);

const Asteroid = ({ x, y, size }) => (
  <div
    className="absolute bg-gray-700 rounded-full"
    style={{ left: x, top: y, width: size, height: size }}
  />
);

export default function App() {
  const [gameState, setGameState] = useState("start");
  const [ship, setShip] = useState({ x: GAME_WIDTH / 2, y: GAME_HEIGHT - 50 });
  const [bullets, setBullets] = useState([]);
  const [asteroids, setAsteroids] = useState([]);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);

  const moveShip = useCallback((direction) => {
    setShip((prev) => ({
      x: Math.max(0, Math.min(GAME_WIDTH - 40, prev.x + direction * 10)),
      y: prev.y,
    }));
  }, []);

  const shoot = useCallback(() => {
    setBullets((prev) => [
      ...prev,
      { x: ship.x + 20, y: ship.y, id: Date.now() },
    ]);
  }, [ship.x, ship.y]);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "ArrowLeft") moveShip(-1);
      if (e.key === "ArrowRight") moveShip(1);
      if (e.key === " ") shoot();
    },
    [moveShip, shoot]
  );

  useEffect(() => {
    if (gameState === "playing") {
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [gameState, handleKeyDown]);

  useEffect(() => {
    if (gameState === "playing") {
      const gameLoop = setInterval(() => {
        // Move bullets
        setBullets((prev) =>
          prev.filter((bullet) => bullet.y > 0).map((bullet) => ({
            ...bullet,
            y: bullet.y - 5,
          }))
        );

        // Move asteroids
        setAsteroids((prev) =>
          prev
            .map((asteroid) => ({
              ...asteroid,
              y: asteroid.y + asteroid.speed,
            }))
            .filter((asteroid) => asteroid.y < GAME_HEIGHT)
        );

        // Spawn new asteroids
        if (Math.random() < 0.02) {
          setAsteroids((prev) => [
            ...prev,
            {
              x: Math.random() * (GAME_WIDTH - 50),
              y: -50,
              size: Math.random() * 30 + 20,
              speed: Math.random() * 2 + 1,
              id: Date.now(),
            },
          ]);
        }

        // Check collisions
        setBullets((prevBullets) =>
          prevBullets.filter((bullet) => {
            const hitAsteroid = asteroids.find(
              (asteroid) =>
                Math.abs(bullet.x - asteroid.x) < asteroid.size / 2 &&
                Math.abs(bullet.y - asteroid.y) < asteroid.size / 2
            );
            if (hitAsteroid) {
              setAsteroids((prev) =>
                prev.filter((a) => a.id !== hitAsteroid.id)
              );
              setScore((prev) => prev + 10);
              return false;
            }
            return true;
          })
        );

        // Check ship collision
        const shipCollision = asteroids.some(
          (asteroid) =>
            Math.abs(ship.x + 20 - asteroid.x) < asteroid.size / 2 &&
            Math.abs(ship.y + 20 - asteroid.y) < asteroid.size / 2
        );

        if (shipCollision) {
          setLives((prev) => prev - 1);
          if (lives <= 1) {
            setGameState("gameover");
          }
        }
      }, 1000 / 60);

      return () => clearInterval(gameLoop);
    }
  }, [gameState, ship.x, ship.y, lives, asteroids]);

  const startGame = () => {
    setGameState("playing");
    setShip({ x: GAME_WIDTH / 2, y: GAME_HEIGHT - 50 });
    setBullets([]);
    setAsteroids([]);
    setScore(0);
    setLives(3);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <Card className="w-[850px]">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Space Shooter
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className="relative bg-black"
            style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}
          >
            {gameState === "start" && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Button onClick={startGame}>Start Game</Button>
              </div>
            )}
            {gameState === "playing" && (
              <>
                <Ship x={ship.x} y={ship.y} />
                {bullets.map((bullet) => (
                  <Bullet key={bullet.id} x={bullet.x} y={bullet.y} />
                ))}
                {asteroids.map((asteroid) => (
                  <Asteroid
                    key={asteroid.id}
                    x={asteroid.x}
                    y={asteroid.y}
                    size={asteroid.size}
                  />
                ))}
                <div className="absolute top-2 left-2 text-white">
                  Score: {score}
                </div>
                <div className="absolute top-2 right-2 text-white">
                  Lives: {lives}
                </div>
              </>
            )}
            {gameState === "gameover" && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                <h2 className="text-3xl mb-4">Game Over</h2>
                <p className="mb-4">Final Score: {score}</p>
                <Button onClick={startGame}>Play Again</Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}