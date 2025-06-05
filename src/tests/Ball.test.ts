// src/entities/Ball.test.ts
import { Ball } from "../entities/Ball";

describe("Ball", () => {
  const canvasWidth = 500;
  const canvasHeight = 400;

  it("should initialize with given properties", () => {
    const ball = new Ball(100, 120, 10, 200, "blue");
    expect(ball.x).toBe(100);
    expect(ball.y).toBe(120);
    expect(ball.radius).toBe(10);
    expect(ball.speed).toBe(200);
    expect(ball.color).toBe("blue");
    expect(ball.vx).toBe(0);
    expect(ball.vy).toBe(0);
  });

  it("should move right when ArrowRight key is pressed", () => {
    const ball = new Ball(50, 50, 10, 100, "red");
    const keys: Record<string, boolean> = { ArrowRight: true };
    ball.update(1, keys, canvasWidth, canvasHeight);
    // vx = 1, vy = 0 => x moves de 100px en 1s
    expect(ball.x).toBeCloseTo(50 + 100, 5);
    expect(ball.y).toBe(50);
  });

  it("should move diagonally normalized when ArrowRight + ArrowUp", () => {
    const ball = new Ball(200, 200, 10, 100, "green");
    const keys: Record<string, boolean> = { ArrowRight: true, ArrowUp: true };
    ball.update(1, keys, canvasWidth, canvasHeight);
    // vx=vy= (√2/2) => déplacement ≈ 70.7107 px sur x et y
    const diag = (Math.SQRT2 / 2) * 100;
    expect(ball.x).toBeCloseTo(200 + diag, 2);
    expect(ball.y).toBeCloseTo(200 - diag, 2);
  });

  it("should not exit canvas bounds on the left", () => {
    const ball = new Ball(5, 100, 10, 300, "red");
    const keys: Record<string, boolean> = { ArrowLeft: true };
    ball.update(1, keys, canvasWidth, canvasHeight);
    // x - radius goes négatif => on replace x = radius
    expect(ball.x).toBe(10);
  });

  it("should not exit canvas bounds on the right", () => {
    const ball = new Ball(495, 100, 10, 300, "red");
    const keys: Record<string, boolean> = { ArrowRight: true };
    ball.update(1, keys, canvasWidth, canvasHeight);
    expect(ball.x).toBe(canvasWidth - 10);
  });

  it("should not exit canvas bounds on the top/bottom", () => {
    const ball = new Ball(100, 5, 10, 300, "red");
    ball.update(1, { ArrowUp: true }, canvasWidth, canvasHeight);
    expect(ball.y).toBe(10);

    const ball2 = new Ball(100, 395, 10, 300, "red");
    ball2.update(1, { ArrowDown: true }, canvasWidth, canvasHeight);
    expect(ball2.y).toBe(canvasHeight - 10);
  });
});
