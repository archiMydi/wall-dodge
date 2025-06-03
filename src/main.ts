import "./style.css";
import { Ball } from "./entities/Ball";
import { InputHandler } from "./core/Input";
import { ObstacleManager } from "./managers/ObstacleManager";

const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d")!;
const width = canvas.width;
const height = canvas.height;

const startScreen = document.getElementById("startScreen")!;
const startButton = document.getElementById("startButton")!;
const gameOverScreen = document.getElementById("gameOverScreen")!;
const restartButton = document.getElementById("restartButton")!;
const timerElement = document.getElementById("timer")!;

// Ball, Input & Obstacles
let ball: Ball;
let input: InputHandler;
let obstacleManager: ObstacleManager;

// Timer
let lastTime = 0;
let gameOver = false;
let startTime: number = 0;

function initGame() {
  ball = new Ball(width / 2, height - 100, 20, 400, "red");
  input = new InputHandler();
  obstacleManager = new ObstacleManager(width, height);
  lastTime = 0;
  gameOver = false;
  startTime = performance.now();
  timerElement.style.display = "block";
  updateTimer(0);
}

function updateTimer(currentTime: number) {
  const elapsedTime = currentTime - startTime;
  const seconds = Math.floor(elapsedTime / 1000);
  const milliseconds = Math.floor(elapsedTime % 1000);
  timerElement.textContent = `${seconds}:${milliseconds
    .toString()
    .padStart(3, "0")}`;
}

function startGame() {
  startScreen.style.display = "none";
  canvas.style.display = "block";
  gameOverScreen.style.display = "none";
  initGame();
  requestAnimationFrame(gameLoop);
}

function gameLoop(timestamp: number) {
  if (!lastTime) lastTime = timestamp;
  const deltaTime = (timestamp - lastTime) / 1000;
  lastTime = timestamp;

  // → Mise à jour & rendu du jeu
  ctx.clearRect(0, 0, width, height);

  ball.update(deltaTime, input.keys, width, height);
  ball.draw(ctx);

  obstacleManager.update(deltaTime);
  obstacleManager.draw(ctx);

  // Met à jour le timer
  updateTimer(timestamp);

  // Vérification collision
  for (const obs of obstacleManager.obstacles) {
    if (obs.collidesWith(ball)) {
      gameOver = true;
      break;
    }
  }

  if (!gameOver) {
    requestAnimationFrame(gameLoop);
  } else {
    gameOverScreen.style.display = "flex";
  }
}

// Event listeners
startButton.addEventListener("click", startGame);
restartButton.addEventListener("click", startGame);
