import React, { useRef, useEffect, useState } from "react";

export default function App() {
  const canvasRef = useRef(null);
  const requestRef = useRef();

  // State variables
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameOver, setGameOver] = useState(false);
  const [win, setWin] = useState(false);

  // Game variables stored in refs
  const paddleX = useRef(0);
  const x = useRef(0);
  const y = useRef(0);
  const dx = useRef(2);
  const dy = useRef(-2);
  const rightPressed = useRef(false);
  const leftPressed = useRef(false);
  const bricks = useRef([]);
  const scoreRef = useRef(0);
  const livesRef = useRef(3);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Set canvas dimensions
    const canvasWidth = 480;
    const canvasHeight = 320;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    // Paddle variables
    const paddleHeight = 10;
    const paddleWidth = 100;
    paddleX.current = (canvas.width - paddleWidth) / 2;

    // Ball variables
    const ballRadius = 8;
    x.current = canvas.width / 2;
    y.current = canvas.height - 30;

    // Brick variables
    const brickRowCount = 5;
    const brickColumnCount = 8;
    const brickWidth = 50;
    const brickHeight = 20;
    const brickPadding = 10;

    // Calculate total bricks width and adjust offset to center them
    const totalBricksWidth =
      brickColumnCount * brickWidth + (brickColumnCount - 1) * brickPadding;
    const brickOffsetLeft = (canvas.width - totalBricksWidth) / 2;
    const brickOffsetTop = 30;

    const totalBricks = brickRowCount * brickColumnCount;

    // Initialize bricks
    for (let c = 0; c < brickColumnCount; c++) {
      bricks.current[c] = [];
      for (let r = 0; r < brickRowCount; r++) {
        bricks.current[c][r] = { x: 0, y: 0, status: 1 };
      }
    }

    // Event listeners
    document.addEventListener("keydown", keyDownHandler);
    document.addEventListener("keyup", keyUpHandler);

    function keyDownHandler(e) {
      if (e.key === "Right" || e.key === "ArrowRight") {
        rightPressed.current = true;
      } else if (e.key === "Left" || e.key === "ArrowLeft") {
        leftPressed.current = true;
      }
    }

    function keyUpHandler(e) {
      if (e.key === "Right" || e.key === "ArrowRight") {
        rightPressed.current = false;
      } else if (e.key === "Left" || e.key === "ArrowLeft") {
        leftPressed.current = false;
      }
    }

    function collisionDetection() {
      for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
          let b = bricks.current[c][r];
          if (b.status === 1) {
            if (
              x.current > b.x &&
              x.current < b.x + brickWidth &&
              y.current > b.y &&
              y.current < b.y + brickHeight
            ) {
              dy.current = -dy.current;
              b.status = 0;
              scoreRef.current += 1;
              if (scoreRef.current === totalBricks) {
                setWin(true);
                setGameOver(true);
              }
            }
          }
        }
      }
    }

    function drawBall() {
      ctx.beginPath();
      ctx.arc(x.current, y.current, ballRadius, 0, Math.PI * 2);
      ctx.fillStyle = "#0095DD";
      ctx.fill();
      ctx.closePath();
    }

    function drawPaddle() {
      ctx.beginPath();
      ctx.rect(
        paddleX.current,
        canvas.height - paddleHeight,
        paddleWidth,
        paddleHeight
      );
      ctx.fillStyle = "#0095DD";
      ctx.fill();
      ctx.closePath();
    }

    function drawBricks() {
      for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
          if (bricks.current[c][r].status === 1) {
            let brickX =
              c * (brickWidth + brickPadding) + brickOffsetLeft;
            let brickY =
              r * (brickHeight + brickPadding) + brickOffsetTop;
            bricks.current[c][r].x = brickX;
            bricks.current[c][r].y = brickY;
            ctx.beginPath();
            ctx.rect(brickX, brickY, brickWidth, brickHeight);
            ctx.fillStyle = "#0095DD";
            ctx.fill();
            ctx.closePath();
          }
        }
      }
    }

    function drawScore() {
      ctx.font = "16px Arial";
      ctx.fillStyle = "#0095DD";
      ctx.fillText("Score: " + scoreRef.current, 8, 20);
    }

    function drawLives() {
      ctx.font = "16px Arial";
      ctx.fillStyle = "#0095DD";
      ctx.fillText("Lives: " + livesRef.current, canvas.width - 75, 20);
    }

    function draw() {
      if (gameOver) {
        cancelAnimationFrame(requestRef.current);
        return;
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawBricks();
      drawBall();
      drawPaddle();
      drawScore();
      drawLives();
      collisionDetection();

      if (
        x.current + dx.current > canvas.width - ballRadius ||
        x.current + dx.current < ballRadius
      ) {
        dx.current = -dx.current;
      }
      if (y.current + dy.current < ballRadius) {
        dy.current = -dy.current;
      } else if (y.current + dy.current > canvas.height - ballRadius) {
        if (
          x.current > paddleX.current &&
          x.current < paddleX.current + paddleWidth
        ) {
          dy.current = -dy.current;
        } else {
          livesRef.current -= 1;
          if (livesRef.current === 0) {
            setGameOver(true);
          } else {
            x.current = canvas.width / 2;
            y.current = canvas.height - 30;
            dx.current = 2;
            dy.current = -2;
            paddleX.current = (canvas.width - paddleWidth) / 2;
          }
        }
      }

      if (
        rightPressed.current &&
        paddleX.current < canvas.width - paddleWidth
      ) {
        paddleX.current += 7;
      } else if (leftPressed.current && paddleX.current > 0) {
        paddleX.current -= 7;
      }

      x.current += dx.current;
      y.current += dy.current;
      requestRef.current = requestAnimationFrame(draw);
    }

    draw();

    // Cleanup
    return () => {
      cancelAnimationFrame(requestRef.current);
      document.removeEventListener("keydown", keyDownHandler);
      document.removeEventListener("keyup", keyUpHandler);
    };
  }, []);

  // Update score and lives when gameOver changes
  useEffect(() => {
    if (gameOver) {
      setScore(scoreRef.current);
      setLives(livesRef.current);
    }
  }, [gameOver]);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      {gameOver ? (
        <div className="text-center">
          {win ? (
            <h1 className="text-2xl font-bold">You Win!</h1>
          ) : (
            <h1 className="text-2xl font-bold">Game Over</h1>
          )}
          <p className="mt-4">Score: {score}</p>
        </div>
      ) : (
        <canvas
          ref={canvasRef}
          className="border border-black"
          style={{ maxWidth: "100%", height: "auto" }}
        ></canvas>
      )}
    </div>
  );
}
