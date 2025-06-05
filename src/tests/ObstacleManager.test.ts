import { ObstacleManager } from "../managers/ObstacleManager";
import { RectObstacle } from "../entities/RectObstacle";
import { SinuousObstacle } from "../entities/SinuousObstacle";

describe("ObstacleManager", () => {
  const canvasWidth = 500;
  const canvasHeight = 300;
  let manager: ObstacleManager;

  beforeEach(() => {
    manager = new ObstacleManager(canvasWidth, canvasHeight);
    // On place l’intervalle de spawn à 0 pour forcer une génération immédiate
    manager.spawnInterval = 0;
    // On fixe la baseSpeed pour des tests prévisibles
    manager.baseSpeed = 100;
  });

  it("should spawn a RectObstacle or SinuousObstacle when spawnTimer dépasse spawnInterval", () => {
    // Au départ, pas d’obstacles
    expect(manager.obstacles.length).toBe(0);

    // Simule un update suffisant pour générer un obstacle
    manager.update(1);
    expect(manager.obstacles.length).toBe(1);
    // Vérifie que le type est bien l’un des deux
    const obs = manager.obstacles[0];
    expect(obs instanceof RectObstacle || obs instanceof SinuousObstacle).toBe(
      true
    );
  });

  it("should remove obstacles off-screen", () => {
    // Crée un obstacle factice hors écran
    const offScreen = new RectObstacle(
      canvasHeight + 100,
      20,
      0,
      50,
      0,
      "black",
      canvasWidth
    );
    manager.obstacles.push(offScreen);
    // update sans spawn (spawnInterval trop grand)
    manager.spawnInterval = 999;
    manager.update(0.1);
    // L’obstacle hors écran doit avoir été filtré
    expect(manager.obstacles.length).toBe(0);
  });

  it("should update position of existing obstacles", () => {
    const rect = new RectObstacle(-20, 20, 100, 50, 50, "black", canvasWidth);
    manager.obstacles.push(rect);
    // Position initiale y = -20
    manager.update(1); // deltaTime = 1 seconde, speed = 50 → y devient 30
    expect(rect.y).toBeCloseTo(-20 + 50 * 1, 5);
  });
});
