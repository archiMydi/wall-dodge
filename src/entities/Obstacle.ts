import { Ball } from "./Ball";

export class Obstacle {
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
    this.y = initialY; // Position verticale initiale (souvent < 0 pour apparaître hors du canvas)
    this.height = height; // Hauteur de l’obstacle (en px)
    this.holeX = holeX; // X du début du trou (en px)
    this.holeWidth = holeWidth; // Largeur du trou (en px)
    this.speed = speed; // Vitesse de descente en px/s
    this.color = color; // Couleur de l’obstacle
    this.canvasWidth = canvasWidth;
  }

  /**
   * Met à jour la position de l’obstacle en le faisant descendre.
   * deltaTime en secondes.
   */
  update(deltaTime: number) {
    this.y += this.speed * deltaTime;
  }

  /**
   * Retourne true si l’obstacle est complètement sorti du canvas (en bas).
   */
  isOffScreen(canvasHeight: number): boolean {
    return this.y - this.height > canvasHeight;
  }

  /**
   * Dessine l’obstacle : c’est un mur en deux parties (avant et après le trou)
   */
  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.fillStyle = this.color;

    // Partie gauche du mur (avant le trou)
    ctx.fillRect(0, this.y, this.holeX, this.height);

    // Partie droite du mur (après le trou)
    const rightX = this.holeX + this.holeWidth;
    if (rightX < this.canvasWidth) {
      ctx.fillRect(rightX, this.y, this.canvasWidth - rightX, this.height);
    }

    ctx.restore();
  }

  /**
   * Vérifie si la balle (cercle) entre en collision avec l'obstacle (deux rectangles).
   * On applique la formule standard "circle vs AABB" :
   * 1) Pour chaque rectangle (gauche et droite), on trouve le point le plus proche
   *    du centre de la balle sur ce rectangle.
   * 2) Si la distance entre ce point et le centre de la balle <= radius, alors collision.
   *
   * Le mur est composé de deux AABB :
   *  - LeftRect  = { x: 0,           y: this.y, w: this.holeX,            h: this.height }
   *  - RightRect = { x: holeX+holeWidth, y: this.y, w: canvasWidth-(holeX+holeWidth), h: this.height }
   */
  collidesWith(ball: Ball): boolean {
    // Fonction utilitaire : clamp une valeur entre min et max
    function clamp(value: number, min: number, max: number): number {
      if (value < min) return min;
      if (value > max) return max;
      return value;
    }

    // Si le cercle ne recouvre même pas la bande Y de l'obstacle, on peut sortir tôt :
    const ballTop = ball.y - ball.radius;
    const ballBottom = ball.y + ball.radius;
    const obsTop = this.y;
    const obsBottom = this.y + this.height;
    if (ballBottom < obsTop || ballTop > obsBottom) {
      // Pas de recouvrement vertical → pas de collision possible
      return false;
    }

    // Dimensions des deux rectangles du mur :
    // 1) Rectangle gauche : x=0 → x=this.holeX ; y=this.y → y=this.y+height
    const leftRect = {
      x: 0,
      y: this.y,
      w: this.holeX,
      h: this.height,
    };
    // 2) Rectangle droit : x=holeX+holeWidth → x=canvasWidth ; y=this.y → y=this.y+height
    const rightX = this.holeX + this.holeWidth;
    const rightRect = {
      x: rightX,
      y: this.y,
      w: this.canvasWidth - rightX,
      h: this.height,
    };

    // Centre de la balle
    const cx = ball.x;
    const cy = ball.y;
    const r = ball.radius;

    // Test de collision cercle-AABB pour un seul rectangle
    function circleVsRect(
      cx: number,
      cy: number,
      r: number,
      rx: number,
      ry: number,
      rw: number,
      rh: number
    ): boolean {
      // Trouver le point le plus proche sur le rectangle
      const nearestX = clamp(cx, rx, rx + rw);
      const nearestY = clamp(cy, ry, ry + rh);
      const dx = cx - nearestX;
      const dy = cy - nearestY;
      return dx * dx + dy * dy <= r * r;
    }

    // Si collision avec le rectangle gauche, on retourne true
    if (
      circleVsRect(cx, cy, r, leftRect.x, leftRect.y, leftRect.w, leftRect.h)
    ) {
      return true;
    }

    // Si collision avec le rectangle droit, on retourne true
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

    // Sinon, aucun pixel de la balle ne touche les parties pleines → pas de collision
    return false;
  }
}
