// Importation de l'interface IObstacle pour garantir que RandomTunnel respecte le contrat des obstacles
import type { IObstacle } from "./IObstacle";
// Importation de la classe Ball pour vérifier les collisions avec la balle
import { Ball } from "./Ball";

// Classe représentant un tunnel aléatoire avec un trou permettant à la balle de passer
export class RandomTunnel implements IObstacle {
  width: number;
  height: number;
  pathWidth: number;
  segmentCount: number;
  maxOffsetX: number;

  points: { x: number; y: number }[] = [];
  speed: number = 100; // pixels/sec
  public y: number = 0;

  constructor(
    width: number,
    height: number,
    pathWidth: number,
    segmentCount: number,
    maxOffsetX: number
  ) {
    this.width = width;
    this.height = height;
    this.pathWidth = pathWidth;
    this.segmentCount = segmentCount;
    this.maxOffsetX = maxOffsetX;

    this.generatePoints();
  }

  // Génère les points de la ligne centrale aléatoire
  generatePoints(): void {
    this.points = [];
    const stepY = this.height / (this.segmentCount - 1);

    for (let i = 0; i < this.segmentCount; i++) {
      const y = i * stepY;
      const offsetX = (Math.random() * 2 - 1) * this.maxOffsetX;
      const x = this.width / 2 + offsetX;
      this.points.push({ x, y });
    }
  }

  // Met à jour la position verticale du tunnel
  update(deltaTime: number): void {
    const dy = this.speed * (deltaTime / 1000); // deltaTime en ms
    this.points.forEach((point) => {
      point.y += dy;
    });
    this.y += dy;
  }

  // Vérifie si le tunnel est sorti de l'écran (en bas)
  isOffScreen(canvasHeight: number): boolean {
    return this.points[0].y > canvasHeight;
  }

  // Dessine le tunnel sur le canvas
  draw(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, this.width, this.height);

    ctx.beginPath();
    ctx.moveTo(this.points[0].x, this.points[0].y);
    for (let i = 1; i < this.points.length; i++) {
      ctx.lineTo(this.points[i].x, this.points[i].y);
    }

    ctx.lineWidth = this.pathWidth;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#FFFFFF";
    ctx.stroke();

    ctx.restore();
  }

  collidesWith(ball: Ball): boolean {
    const cx = ball.x;
    const cy = ball.y;
    const r = ball.radius;

    for (let i = 0; i < this.points.length - 1; i++) {
      const p1 = this.points[i];
      const p2 = this.points[i + 1];

      const minY = Math.min(p1.y, p2.y) - r;
      const maxY = Math.max(p1.y, p2.y) + r;
      if (cy < minY || cy > maxY) continue;

      const t = (cy - p1.y) / (p2.y - p1.y);
      const tunnelCenterX = p1.x + t * (p2.x - p1.x);

      const tunnelLeft = tunnelCenterX - this.pathWidth / 2;
      const tunnelRight = tunnelCenterX + this.pathWidth / 2;

      if (cx < tunnelLeft || cx > tunnelRight) {
        // Collision détectée
        return true;
      }
    }

    return false;
  }
}
