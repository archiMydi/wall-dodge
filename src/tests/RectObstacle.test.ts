import { RectObstacle } from "../entities/RectObstacle";
import { Ball } from "../entities/Ball";

describe("RectObstacle", () => {
  const canvasWidth = 300;
  const height = 50;
  const holeWidth = 100;
  const holeX = 100;
  const speed = 100;
  const color = "black";

  it("should not detect collision when ball is far from obstacle", () => {
    const rect = new RectObstacle(
      -height,
      height,
      holeX,
      holeWidth,
      speed,
      color,
      canvasWidth
    );
    const ball = new Ball(50, -100, 10, 0, "red");
    // l’obstacle est bien au-dessus du ball ; pas de collision
    expect(rect.collidesWith(ball)).toBe(false);
  });

  it("should detect collision when ball touches left wall area", () => {
    const rect = new RectObstacle(
      100,
      height,
      holeX,
      holeWidth,
      speed,
      color,
      canvasWidth
    );
    // place le ball dans la portion mur gauche : x < holeX
    const ball = new Ball(50, 120, 10, 0, "blue");
    // ballY = 120, obstacleY = 100 → collision vertical possible
    expect(rect.collidesWith(ball)).toBe(true);
  });

  it("should not detect collision when ball goes through the hole", () => {
    const rect = new RectObstacle(
      200,
      height,
      holeX,
      holeWidth,
      speed,
      color,
      canvasWidth
    );
    // centre du trou entre 100 et 200 (x), place un ball dans le trou :
    const ball = new Ball(150, 225, 10, 0, "green");
    expect(rect.collidesWith(ball)).toBe(false);
  });

  it("should detect collision when ball touches right wall area", () => {
    const rect = new RectObstacle(
      300,
      height,
      holeX,
      holeWidth,
      speed,
      color,
      canvasWidth
    );
    const ball = new Ball(250, 320, 10, 0, "yellow");
    expect(rect.collidesWith(ball)).toBe(true);
  });
});
