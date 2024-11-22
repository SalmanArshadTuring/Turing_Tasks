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

const Ball = ({ x, y, size, color }) => (
  <div
    className="absolute rounded-full"
    style={{
      left: x,
      top: y,
      width: size,
      height: size,
      backgroundColor: color,
    }}
  />
);

const SilverBall = ({ x, y, size }) => (
  <div
    className="absolute bg-gray-400 rounded-full"
    style={{
      left: x,
      top: y,
      width: size,
      height: size,
    }}
  />
);

export default function App() {
  const [gameState, setGameState] = useState("start");
  const [ship, setShip] = useState({ x: GAME_WIDTH / 2, y: GAME_HEIGHT - 50 });
  const [balls, setBalls] = useState([]);
  const [silverBalls, setSilverBalls] = useState([]);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);

  const moveShip = useCallback((directionX, directionY) => {
    setShip((prev) => ({
      x: Math.max(0, Math.min(GAME_WIDTH - 40, prev.x + directionX * 10)),
      y: Math.max(0, Math.min(GAME_HEIGHT - 40, prev.y + directionY * 10)),
    }));
  }, []);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "ArrowLeft") moveShip(-1, 0);
      if (e.key === "ArrowRight") moveShip(1, 0);
      if (e.key === "ArrowUp") moveShip(0, -1);
      if (e.key === "ArrowDown") moveShip(0, 1);
    },
    [moveShip]
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
        // Spawn new balls
        if (Math.random() < 0.05) {
          setBalls((prev) => [
            ...prev,
            {
              x: Math.random() * (GAME_WIDTH - 20),
              y: -20,
              size: Math.random() * 15 + 10,
              color: Math.random() > 0.5 ? "pink" : "blue",
              speed: Math.random() * 2 + 1,
              id: Date.now(),
            },
          ]);
        }

        // Spawn new silver balls
        if (Math.random() < 0.02) {
          setSilverBalls((prev) => [
            ...prev,
            {
              x: Math.random() * (GAME_WIDTH - 50),
              y: -50,
              size: Math.random() * 50 + 40,
              speed: Math.random() * 1.5 + 0.5,
              id: Date.now(),
            },
          ]);
        }

        // Move balls
        setBalls((prev) =>
          prev
            .map((ball) => ({
              ...ball,
              y: ball.y + ball.speed,
            }))
            .filter((ball) => ball.y < GAME_HEIGHT) // Remove balls outside screen
        );

        // Move silver balls
        setSilverBalls((prev) =>
          prev
            .map((silverBall) => ({
              ...silverBall,
              y: silverBall.y + silverBall.speed,
            }))
            .filter((silverBall) => silverBall.y < GAME_HEIGHT) // Remove silver balls outside screen
        );

        // Check collision with colored balls
        setBalls((prevBalls) =>
          prevBalls.filter((ball) => {
            const collision =
              Math.abs(ship.x + 20 - ball.x) < ball.size / 2 &&
              Math.abs(ship.y + 20 - ball.y) < ball.size / 2;

            if (collision) {
              console.log("Colored Ball Collision: +20 score");
              setScore((prev) => {
                const newScore = prev + 20;
                console.log("Updated Score:", newScore);
                return newScore;
              });
            }

            return !collision;
          })
        );

        // Check collision with silver balls
        setSilverBalls((prevSilverBalls) =>
          prevSilverBalls.filter((silverBall) => {
            const collision =
              Math.abs(ship.x + 20 - silverBall.x) < silverBall.size / 2 &&
              Math.abs(ship.y + 20 - silverBall.y) < silverBall.size / 2;

            if (collision) {
              console.log("Silver Ball Collision: -1 life");
              setLives((prev) => {
                const newLives = prev - 1;
                console.log("Updated Lives:", newLives);
                if (newLives <= 0) {
                  setGameState("gameover");
                }
                return newLives;
              });
            }

            return !collision;
          })
        );
      }, 1000 / 60);

      return () => clearInterval(gameLoop);
    }
  }, [gameState, ship]);

  const startGame = () => {
    setGameState("playing");
    setShip({ x: GAME_WIDTH / 2, y: GAME_HEIGHT - 50 });
    setBalls([]);
    setSilverBalls([]);
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
                {balls.map((ball) => (
                  <Ball
                    key={ball.id}
                    x={ball.x}
                    y={ball.y}
                    size={ball.size}
                    color={ball.color}
                  />
                ))}
                {silverBalls.map((silverBall) => (
                  <SilverBall
                    key={silverBall.id}
                    x={silverBall.x}
                    y={silverBall.y}
                    size={silverBall.size}
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
