import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const CANVAS_WIDTH = 480;
const CANVAS_HEIGHT = 320;
const PADDLE_WIDTH = 100;
const PADDLE_HEIGHT = 10;
const BALL_RADIUS = 8;
const BRICK_ROWS = 5;
const BRICK_COLS = 8;
const BRICK_WIDTH = CANVAS_WIDTH / BRICK_COLS;
const BRICK_HEIGHT = 20;

export default function App() {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animationFrameId;

    let paddle = {
      x: CANVAS_WIDTH / 2 - PADDLE_WIDTH / 2,
      y: CANVAS_HEIGHT - PADDLE_HEIGHT - 10,
      width: PADDLE_WIDTH,
      height: PADDLE_HEIGHT,
      dx: 5,
    };

    let ball = {
      x: CANVAS_WIDTH / 2,
      y: paddle.y - BALL_RADIUS,
      radius: BALL_RADIUS,
      speed: 4,
      dx: 3,
      dy: -3,
    };

    let bricks = [];
    for (let i = 0; i < BRICK_ROWS; i++) {
      bricks[i] = [];
      for (let j = 0; j < BRICK_COLS; j++) {
        bricks[i][j] = { x: j * BRICK_WIDTH, y: i * BRICK_HEIGHT, status: 1 };
      }
    }

    function drawBall() {
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
      ctx.fillStyle = "#0284c7";
      ctx.fill();
      ctx.closePath();
    }

    function drawPaddle() {
      ctx.beginPath();
      ctx.rect(paddle.x, paddle.y, paddle.width, paddle.height);
      ctx.fillStyle = "#0f172a";
      ctx.fill();
      ctx.closePath();
    }

    function drawBricks() {
      for (let i = 0; i < BRICK_ROWS; i++) {
        for (let j = 0; j < BRICK_COLS; j++) {
          if (bricks[i][j].status === 1) {
            const brickX = bricks[i][j].x;
            const brickY = bricks[i][j].y;
            ctx.beginPath();
            ctx.rect(brickX, brickY, BRICK_WIDTH, BRICK_HEIGHT);
            ctx.fillStyle = "#ef4444";
            ctx.fill();
            ctx.closePath();
          }
        }
      }
    }

    function collisionDetection() {
      for (let i = 0; i < BRICK_ROWS; i++) {
        for (let j = 0; j < BRICK_COLS; j++) {
          let b = bricks[i][j];
          if (b.status === 1) {
            if (
              ball.x > b.x &&
              ball.x < b.x + BRICK_WIDTH &&
              ball.y > b.y &&
              ball.y < b.y + BRICK_HEIGHT
            ) {
              ball.dy = -ball.dy;
              b.status = 0;
              setScore((prevScore) => prevScore + 1);
              if (score + 1 === BRICK_ROWS * BRICK_COLS) {
                setGameWon(true);
              }
            }
          }
        }
      }
    }

    function movePaddle() {
      if (rightPressed && paddle.x < CANVAS_WIDTH - paddle.width) {
        paddle.x += paddle.dx;
      } else if (leftPressed && paddle.x > 0) {
        paddle.x -= paddle.dx;
      }
    }

    function moveBall() {
      ball.x += ball.dx;
      ball.y += ball.dy;

      if (ball.x + ball.radius > CANVAS_WIDTH || ball.x - ball.radius < 0) {
        ball.dx = -ball.dx;
      }
      if (ball.y - ball.radius < 0) {
        ball.dy = -ball.dy;
      } else if (ball.y + ball.radius > CANVAS_HEIGHT) {
        if (ball.x > paddle.x && ball.x < paddle.x + paddle.width) {
          ball.dy = -ball.dy;
        } else {
          setLives((prevLives) => prevLives - 1);
          if (lives - 1 === 0) {
            setGameOver(true);
          } else {
            ball.x = CANVAS_WIDTH / 2;
            ball.y = paddle.y - ball.radius;
            ball.dx = 3;
            ball.dy = -3;
            paddle.x = CANVAS_WIDTH / 2 - PADDLE_WIDTH / 2;
          }
        }
      }
    }

    function draw() {
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      drawBricks();
      drawBall();
      drawPaddle();
      collisionDetection();
      movePaddle();
      moveBall();

      if (!gameOver && !gameWon) {
        animationFrameId = requestAnimationFrame(draw);
      }
    }

    let rightPressed = false;
    let leftPressed = false;

    function keyDownHandler(e) {
      if (e.key === "Right" || e.key === "ArrowRight") {
        rightPressed = true;
      } else if (e.key === "Left" || e.key === "ArrowLeft") {
        leftPressed = true;
      }
    }

    function keyUpHandler(e) {
      if (e.key === "Right" || e.key === "ArrowRight") {
        rightPressed = false;
      } else if (e.key === "Left" || e.key === "ArrowLeft") {
        leftPressed = false;
      }
    }

    document.addEventListener("keydown", keyDownHandler, false);
    document.addEventListener("keyup", keyUpHandler, false);

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      document.removeEventListener("keydown", keyDownHandler);
      document.removeEventListener("keyup", keyUpHandler);
    };
  }, [gameOver, gameWon, lives, score]);

  const restartGame = () => {
    setScore(0);
    setLives(3);
    setGameOver(false);
    setGameWon(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md p-6 m-4 bg-white shadow-xl rounded-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Brick Breaker
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <canvas
              ref={canvasRef}
              width={CANVAS_WIDTH}
              height={CANVAS_HEIGHT}
              className="border border-gray-300 rounded-lg"
            />
            {(gameOver || gameWon) && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
                <div className="text-white text-center">
                  <h2 className="text-3xl font-bold mb-4">
                    {gameWon ? "You Won!" : "Game Over"}
                  </h2>
                  <Button onClick={restartGame}>Play Again</Button>
                </div>
              </div>
            )}
          </div>
          <div className="mt-4 flex justify-between text-lg font-semibold">
            <span>Score: {score}</span>
            <span>Lives: {lives}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}