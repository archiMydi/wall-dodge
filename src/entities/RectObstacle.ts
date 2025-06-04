import type { IObstacle } from "./IObstacle";
import { Ball } from "./Ball";

export class RectObstacle implements IObstacle {
  y: number;
  height: number;
  holeX: number;
  holeWidth: number;
  speed: number;
  color: string;
  canvasWidth: number;

  constructor(
    initialY: number,
    height: number,
    holeX: number,
    holeWidth: number,
    speed: number,
    color: string,
    canvasWidth: number
  ) {
    this.y = initialY;
    this.height = height;
    this.holeX = holeX;
    this.holeWidth = holeWidth;
    this.speed = speed;
    this.color = color;
    this.canvasWidth = canvasWidth;
  }

  update(deltaTime: number) {
    this.y += this.speed * deltaTime;
  }

  isOffScreen(canvasHeight: number): boolean {
    return this.y - this.height > canvasHeight;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.fillStyle = this.color;

    // Mur gauche
    ctx.fillRect(0, this.y, this.holeX, this.height);

    // Mur droit
    const rightX = this.holeX + this.holeWidth;
    if (rightX < this.canvasWidth) {
      ctx.fillRect(rightX, this.y, this.canvasWidth - rightX, this.height);
    }

    ctx.restore();
  }

  collidesWith(ball: Ball): boolean {
    function clamp(val: number, min: number, max: number): number {
      if (val < min) return min;
      if (val > max) return max;
      return val;
    }

    const ballTop = ball.y - ball.radius;
    const ballBottom = ball.y + ball.radius;
    const obsTop = this.y;
    const obsBottom = this.y + this.height;
    if (ballBottom < obsTop || ballTop > obsBottom) {
      return false;
    }

    const leftRect = { x: 0, y: this.y, w: this.holeX, h: this.height };
    const rightX = this.holeX + this.holeWidth;
    const rightRect = {
      x: rightX,
      y: this.y,
      w: this.canvasWidth - rightX,
      h: this.height,
    };

    const cx = ball.x;
    const cy = ball.y;
    const r = ball.radius;

    function circleVsRect(
      cx: number,
      cy: number,
      r: number,
      rx: number,
      ry: number,
      rw: number,
      rh: number
    ): boolean {
      const nearestX = clamp(cx, rx, rx + rw);
      const nearestY = clamp(cy, ry, ry + rh);
      const dx = cx - nearestX;
      const dy = cy - nearestY;
      return dx * dx + dy * dy <= r * r;
    }

    if (
      circleVsRect(cx, cy, r, leftRect.x, leftRect.y, leftRect.w, leftRect.h)
    ) {
      return true;
    }

    if (
      circleVsRect(
        cx,
        cy,
        r,
        rightRect.x,
        rightRect.y,
        rightRect.w,
        rightRect.h
      )
    ) {
      return true;
    }

    return false;
  }
}
