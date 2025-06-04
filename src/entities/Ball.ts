export class Ball {
  x: number;
  y: number;
  radius: number;
  speed: number;
  color: string;
  vx: number;
  vy: number;

  constructor(
    x: number,
    y: number,
    radius: number,
    speed: number,
    color: string
  ) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.speed = speed; // base speed in px/s
    this.color = color;
    this.vx = 0;
    this.vy = 0;
  }

  /**
   * Updates the ball's direction based on pressed keys.
   * keys is an object where the keys are the names of the keys (e.g., "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown")
   * and the values are true/false depending on whether they are pressed or not.
   */
  handleInput(keys: Record<string, boolean>) {
    this.vx = 0;
    this.vy = 0;

    if (keys["ArrowLeft"] || keys["q"] || keys["Q"]) {
      this.vx = -1;
    } else if (keys["ArrowRight"] || keys["d"] || keys["D"]) {
      this.vx = 1;
    }

    if (keys["ArrowUp"] || keys["z"] || keys["Z"]) {
      this.vy = -1;
    } else if (keys["ArrowDown"] || keys["s"] || keys["S"]) {
      this.vy = 1;
    }

    // Normalisation du mouvement diagonal
    if (this.vx !== 0 && this.vy !== 0) {
      const diag = Math.sqrt(2) / 2;
      this.vx *= diag;
      this.vy *= diag;
    }
  }

  /**
   * Updates the ball's position.
   * deltaTime in seconds (e.g., time elapsed between two frames).
   * keys is used to recalculate the direction on each frame.
   * canvasWidth and canvasHeight prevent the ball from leaving the canvas boundaries.
   */
  update(
    deltaTime: number,
    keys: Record<string, boolean>,
    canvasWidth: number,
    canvasHeight: number
  ) {
    this.handleInput(keys);

    // Calculate movement
    this.x += this.vx * this.speed * deltaTime;
    this.y += this.vy * this.speed * deltaTime;

    // Ensure the ball stays within the canvas
    if (this.x - this.radius < 0) {
      this.x = this.radius;
    } else if (this.x + this.radius > canvasWidth) {
      this.x = canvasWidth - this.radius;
    }
    if (this.y - this.radius < 0) {
      this.y = this.radius;
    } else if (this.y + this.radius > canvasHeight) {
      this.y = canvasHeight - this.radius;
    }
  }

  /**
   * Draws the ball on the canvas's 2D context.
   */
  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}
