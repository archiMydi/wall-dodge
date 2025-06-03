import { Obstacle } from "../entities/Obstacle";

export class ObstacleManager {
  obstacles: Obstacle[] = [];
  spawnTimer: number = 0;
  spawnInterval: number = 1.5; // En secondes
  canvasWidth: number;
  canvasHeight: number;
  obstacleSpeed: number = 150;
  obstacleColor: string = "black";

  constructor(canvasWidth: number, canvasHeight: number) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
  }

  update(deltaTime: number) {
    this.spawnTimer += deltaTime;

    if (this.spawnTimer >= this.spawnInterval) {
      this.spawnTimer = 0;

      // Génère un nouvel obstacle
      const height = 30;
      const holeWidth = 150;
      const holeX = Math.random() * (this.canvasWidth - holeWidth);
      const obstacle = new Obstacle(
        -height,
        height,
        holeX,
        holeWidth,
        this.obstacleSpeed,
        this.obstacleColor,
        this.canvasWidth
      );
      this.obstacles.push(obstacle);
    }

    this.obstacles.forEach((obs) => obs.update(deltaTime));
    this.obstacles = this.obstacles.filter(
      (obs) => !obs.isOffScreen(this.canvasHeight)
    );
  }

  draw(ctx: CanvasRenderingContext2D) {
    this.obstacles.forEach((obs) => obs.draw(ctx));
  }
}
