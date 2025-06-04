import type { IObstacle } from "../entities/IObstacle";
import { RectObstacle } from "../entities/RectObstacle";
import { SinuousObstacle } from "../entities/SinuousObstacle";

export class ObstacleManager {
  obstacles: IObstacle[] = [];
  spawnTimer: number = 0;
  spawnInterval: number = 1.5;
  canvasWidth: number;
  canvasHeight: number;
  baseSpeed: number = 600;
  baseColor: string = "black";

  constructor(canvasWidth: number, canvasHeight: number) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
  }

  update(deltaTime: number) {
    this.spawnTimer += deltaTime;
    if (this.spawnTimer >= this.spawnInterval) {
      this.spawnTimer = 0;

      // 50% de chance de générer un RectObstacle ou un SinuousObstacle
      if (Math.random() < 0.5) {
        // Création d'un obstacle rectangulaire
        const height = 30;
        const holeWidth = 120;
        const holeX = Math.random() * (this.canvasWidth - holeWidth);
        const obs = new RectObstacle(
          -height,
          height,
          holeX,
          holeWidth,
          this.baseSpeed,
          this.baseColor,
          this.canvasWidth
        );
        this.obstacles.push(obs);
      } else {
        // Création d'un obstacle sinueux
        const height = 300;
        const pathWidth = 250;
        const segmentCount = 3;
        const maxOffsetX = 200;
        const sinuousObs = new SinuousObstacle(
          -height,
          height,
          pathWidth,
          segmentCount,
          maxOffsetX,
          this.baseSpeed,
          this.baseColor,
          this.canvasWidth
        );
        this.obstacles.push(sinuousObs);
      }
    }

    // Mise à jour & suppression des obstacles hors écran
    this.obstacles.forEach((o) => o.update(deltaTime));
    this.obstacles = this.obstacles.filter(
      (o) => !o.isOffScreen(this.canvasHeight)
    );
  }

  draw(ctx: CanvasRenderingContext2D) {
    this.obstacles.forEach((o) => o.draw(ctx));
  }
}
