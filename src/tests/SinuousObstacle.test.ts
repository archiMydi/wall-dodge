import { SinuousObstacle } from "../entities/SinuousObstacle";
import { Ball } from "../entities/Ball";

describe("SinuousObstacle (collision)", () => {
  const canvasWidth = 400;
  const initialY = 100;
  const height = 200;
  const pathWidth = 100;
  const segmentCount = 2;
  const maxOffsetX = 0; // pour rendre centerXs prévisible (milieu exact)
  const speed = 0;
  const color = "black";

  it("should not detect collision when ball is outside vertical range", () => {
    const sinuous = new SinuousObstacle(
      initialY,
      height,
      pathWidth,
      segmentCount,
      maxOffsetX,
      speed,
      color,
      canvasWidth
    );
    const ballAbove = new Ball(canvasWidth / 2, initialY - 50, 10, 0, "red");
    expect(sinuous.collidesWith(ballAbove)).toBe(false);

    const ballBelow = new Ball(
      canvasWidth / 2,
      initialY + height + 50,
      10,
      0,
      "blue"
    );
    expect(sinuous.collidesWith(ballBelow)).toBe(false);
  });

  it("should detect no collision when ball travels through center of tunnel", () => {
    // Comme maxOffsetX=0, le centre de chaque segment sera exactement au milieu du canvas
    const sinuous = new SinuousObstacle(
      initialY,
      height,
      pathWidth,
      segmentCount,
      maxOffsetX,
      speed,
      color,
      canvasWidth
    );
    // place le ball exactement dans le tunnel (x = canvasWidth/2)
    const ballInTunnel = new Ball(
      canvasWidth / 2,
      initialY + height / 2,
      10,
      0,
      "green"
    );
    expect(sinuous.collidesWith(ballInTunnel)).toBe(false);
  });

  it("should detect collision when ball touches edge du tunnel", () => {
    const sinuous = new SinuousObstacle(
      initialY,
      height,
      pathWidth,
      segmentCount,
      maxOffsetX,
      speed,
      color,
      canvasWidth
    );
    // Le tunnel central est à x=canvasWidth/2, largeur=100 => bord gauche à x=150, bord droit à x=250
    // Place un ball à x=145 (un peu à gauche du bord gauche)
    const ballLeft = new Ball(
      canvasWidth / 2 - pathWidth / 2 - 5,
      initialY + height / 2,
      10,
      0,
      "yellow"
    );
    expect(sinuous.collidesWith(ballLeft)).toBe(true);
    // Place un ball à x = bord droit + 5 px
    const ballRight = new Ball(
      canvasWidth / 2 + pathWidth / 2 + 5,
      initialY + height / 2,
      10,
      0,
      "pink"
    );
    expect(sinuous.collidesWith(ballRight)).toBe(true);
  });
});
