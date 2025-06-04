// src/entities/SinuousObstacle.ts
import type { IObstacle } from "./IObstacle";
import { Ball } from "./Ball";

export class SinuousObstacle implements IObstacle {
  y: number;
  height: number;
  pathWidth: number;
  segmentCount: number;
  maxOffsetX: number;
  speed: number;
  color: string;
  canvasWidth: number;
  private centerXs: number[];

  constructor(
    initialY: number,
    height: number,
    pathWidth: number,
    segmentCount: number,
    maxOffsetX: number,
    speed: number,
    color: string,
    canvasWidth: number
  ) {
    this.y = initialY;
    this.height = height;
    this.pathWidth = pathWidth;
    this.segmentCount = segmentCount;
    this.maxOffsetX = maxOffsetX;
    this.speed = speed;
    this.color = color;
    this.canvasWidth = canvasWidth;

    // Génération des centres aléatoires
    this.centerXs = [];
    const midX = canvasWidth / 2;
    for (let i = 0; i < this.segmentCount; i++) {
      const offset = (Math.random() * 2 - 1) * this.maxOffsetX;
      this.centerXs.push(midX + offset);
    }
  }

  update(deltaTime: number): void {
    this.y += this.speed * deltaTime;
  }

  isOffScreen(canvasHeight: number): boolean {
    return this.y - this.height > canvasHeight;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    ctx.fillStyle = this.color;

    const dy = this.height / (this.segmentCount - 1);

    //
    // ====== Mur GAUCHE LISSÉ ======
    //
    // Calculer les coordonnées exactes de chaque point (bord gauche du tunnel)
    const leftPoints: { x: number; y: number }[] = [];
    for (let i = 0; i < this.segmentCount; i++) {
      const py = this.y + i * dy;
      const cx = this.centerXs[i];
      leftPoints.push({ x: cx - this.pathWidth / 2, y: py });
    }

    // On commence le chemin par le coin supérieur gauche du canvas
    ctx.beginPath();
    ctx.moveTo(0, this.y);

    if (leftPoints.length === 1) {
      // Cas très particulier où segmentCount = 1 : on trace juste une ligne droite
      ctx.lineTo(leftPoints[0].x, leftPoints[0].y);
    } else {
      // 1) Aller au premier point de contrôle
      ctx.lineTo(leftPoints[0].x, leftPoints[0].y);

      // 2) Parcourir tous les points pour tracer des quadraticCurveTo
      for (let i = 1; i < leftPoints.length; i++) {
        // Point précédent
        const prev = leftPoints[i - 1];
        // Point actuel
        const curr = leftPoints[i];
        // Calcul du midpoint pour avoir une transition douce
        const mx = (prev.x + curr.x) / 2;
        const my = (prev.y + curr.y) / 2;
        // courbe quadratique de (prev.x, prev.y) à (mx, my),
        // avec (prev.x, prev.y) comme point de contrôle
        ctx.quadraticCurveTo(prev.x, prev.y, mx, my);
      }
      // 3) On doit “arrimer” la fin de la dernière section sur le dernier point exact
      const beforeLast = leftPoints[leftPoints.length - 2];
      const lastPt = leftPoints[leftPoints.length - 1];
      ctx.quadraticCurveTo(beforeLast.x, beforeLast.y, lastPt.x, lastPt.y);
    }

    // 4) Enfin, on rejoint le coin gauche inférieur pour fermer le polygone
    ctx.lineTo(0, this.y + this.height);
    ctx.closePath();
    ctx.fill();

    //
    // ====== Mur DROIT LISSÉ ======
    //
    // Idem pour le bord droit du tunnel
    const rightPoints: { x: number; y: number }[] = [];
    for (let i = 0; i < this.segmentCount; i++) {
      const py = this.y + i * dy;
      const cx = this.centerXs[i];
      rightPoints.push({ x: cx + this.pathWidth / 2, y: py });
    }

    ctx.beginPath();
    ctx.moveTo(this.canvasWidth, this.y);

    if (rightPoints.length === 1) {
      ctx.lineTo(rightPoints[0].x, rightPoints[0].y);
    } else {
      ctx.lineTo(rightPoints[0].x, rightPoints[0].y);
      for (let i = 1; i < rightPoints.length; i++) {
        const prev = rightPoints[i - 1];
        const curr = rightPoints[i];
        const mx = (prev.x + curr.x) / 2;
        const my = (prev.y + curr.y) / 2;
        ctx.quadraticCurveTo(prev.x, prev.y, mx, my);
      }
      const beforeLast = rightPoints[rightPoints.length - 2];
      const lastPt = rightPoints[rightPoints.length - 1];
      ctx.quadraticCurveTo(beforeLast.x, beforeLast.y, lastPt.x, lastPt.y);
    }

    ctx.lineTo(this.canvasWidth, this.y + this.height);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }

  collidesWith(ball: Ball): boolean {
    // Même détection linéaire qu'avant (sans tenir compte du lissage visuel).
    // À modifier pour tenir compte du lissage
    const ballTop = ball.y - ball.radius;
    const ballBottom = ball.y + ball.radius;
    const obsTop = this.y;
    const obsBottom = this.y + this.height;
    if (ballBottom < obsTop || ballTop > obsBottom) {
      return false;
    }

    const relativeY = ball.y - this.y;
    const tGlobal = relativeY / this.height;
    const totalSegments = this.segmentCount - 1;
    let idx = Math.floor(tGlobal * totalSegments);
    if (idx < 0) idx = 0;
    if (idx >= totalSegments) idx = totalSegments - 1;

    const segmentT = tGlobal * totalSegments - idx;
    const x1 = this.centerXs[idx];
    const x2 = this.centerXs[idx + 1];
    const tunnelCenterX = x1 + (x2 - x1) * segmentT;

    const leftX = tunnelCenterX - this.pathWidth / 2;
    const rightX = tunnelCenterX + this.pathWidth / 2;

    if (ball.x - ball.radius < leftX || ball.x + ball.radius > rightX) {
      return true;
    }
    return false;
  }
}
