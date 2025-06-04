import { Ball } from "./Ball";

export interface IObstacle {
  update(deltaTime: number): void;
  draw(ctx: CanvasRenderingContext2D): void;
  isOffScreen(canvasHeight: number): boolean;
  collidesWith(ball: Ball): boolean;
}
