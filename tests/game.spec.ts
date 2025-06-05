import { test, expect } from "@playwright/test";

test.describe("Wall Dodge E2E", () => {
  test.beforeEach(async ({ page }) => {
    // 1. On va sur la page d’accueil
    await page.goto("/");
    // 2. On s’assure que l’écran de jeu n’est pas visible avant de cliquer sur "Jouer"
    await expect(page.locator("#gameCanvas")).toHaveCSS("display", "none");
    await expect(page.locator("#startScreen")).toBeVisible();
  });

  test("Lancer le jeu affiche le canvas et le timer", async ({ page }) => {
    // Clique sur le bouton "Jouer"
    await page.click("#startButton");

    // Le canvas doit maintenant être affiché
    await expect(page.locator("#gameCanvas")).toHaveCSS("display", "block");
    // L’écran de début doit disparaître
    await expect(page.locator("#startScreen")).toHaveCSS("display", "none");
    // Le timer doit être visible sur la page
    await expect(page.locator("#timer")).toBeVisible();
    // Le timer doit débuter à "0:000" ou proche (on attend au moins qu’il contienne "0:")
    const timerText = await page.locator("#timer").textContent();
    expect(timerText?.startsWith("0:")).toBeTruthy();
  });

  test("Le ball se déplace avec les flèches et reste dans le canvas", async ({
    page,
  }) => {
    await page.click("#startButton");

    // Récupère la position initiale du ball dans le canvas
    // Comme on ne peut pas lire directement le canvas, on va injecter un script qui renvoie les coordonnées.
    const initialPos = await page.evaluate(() => {
      // @ts-ignore
      const ball = (window as any).ball as any;
      return { x: ball.x, y: ball.y };
    });
    expect(typeof initialPos.x).toBe("number");
    expect(typeof initialPos.y).toBe("number");

    // Simule une flèche droite maintenue 500ms
    await page.keyboard.down("ArrowRight");
    await page.waitForTimeout(500);
    await page.keyboard.up("ArrowRight");

    // Récupère la nouvelle position
    const newPos = await page.evaluate(() => {
      // @ts-ignore
      const ball = (window as any).ball as any;
      return { x: ball.x, y: ball.y };
    });
    expect(newPos.x).toBeGreaterThan(initialPos.x);

    // Simule flèche gauche pour revenir
    await page.keyboard.down("ArrowLeft");
    await page.waitForTimeout(500);
    await page.keyboard.up("ArrowLeft");

    // Le ball ne doit pas sortir du canvas (0 < x < canvasWidth)
    const finalPos = await page.evaluate(() => {
      // @ts-ignore
      const ball = (window as any).ball as any;
      const canvas: HTMLCanvasElement = document.getElementById(
        "gameCanvas"
      ) as any;
      return { x: ball.x, y: ball.y, canvasW: canvas.width };
    });
    expect(finalPos.x).toBeGreaterThanOrEqual((window as any).ball.radius);
    expect(finalPos.x).toBeLessThanOrEqual(
      finalPos.canvasW - (window as any).ball.radius
    );
  });

  test("Collision avec un obstacle déclenche Game Over", async ({ page }) => {
    await page.click("#startButton");

    // On force un obstacle à se placer juste devant le joueur en injectant directement dans obstacleManager
    await page.evaluate(() => {
      // @ts-ignore
      const obsMgr = (window as any).obstacleManager as any;
      const Ball = (window as any).Ball as any;
      const ball = (window as any).ball as any;
      // Crée un RectObstacle statique dont la zone sans trou est centrée sur le ball
      const holeWidth = 0;
      const holeX = ball.x - ball.radius;
      const canvasW = (window as any).canvas.width;
      const obs = new (window as any).RectObstacle(
        ball.y - ball.radius,
        ball.radius * 2,
        holeX,
        holeWidth,
        0,
        "black",
        canvasW
      );
      obsMgr.obstacles.push(obs);
    });

    // Attend un frame pour que la collision se fasse
    await page.waitForTimeout(50);

    // Le canvas reste affiché, mais l’écran Game Over doit s’afficher
    await expect(page.locator("#gameOverScreen")).toHaveCSS("display", "flex");
  });

  // Helper pour jouer jusqu'au Game Over naturellement
  async function playUntilGameOver(page: any) {
    await page.click("#startButton");
    // Attend que plusieurs obstacles apparaissent (ex: 3 secondes)
    await page.waitForTimeout(3000);
    // Simule quelques esquives (gauche/droite)
    await page.keyboard.down("ArrowLeft");
    await page.waitForTimeout(400);
    await page.keyboard.up("ArrowLeft");
    await page.keyboard.down("ArrowRight");
    await page.waitForTimeout(400);
    await page.keyboard.up("ArrowRight");
    // Laisse le joueur mourir naturellement (on attend que le Game Over apparaisse)
    await page.waitForSelector("#gameOverScreen", {
      state: "visible",
      timeout: 10000,
    });
  }

  test("Parcours complet : jouer, esquiver, perdre, voir l’écran de fin, puis recommencer", async ({
    page,
  }) => {
    await playUntilGameOver(page);
    // Vérifie que l’écran de fin est affiché
    await expect(page.locator("#gameOverScreen")).toHaveCSS("display", "flex");
    // Clique sur "Rejouer"
    await page.click("#restartButton");
    // Vérifie que le jeu redémarre (canvas visible, écran de fin caché)
    await expect(page.locator("#gameCanvas")).toHaveCSS("display", "block");
    await expect(page.locator("#gameOverScreen")).toHaveCSS("display", "none");
  });

  test("Parcours complet bis : redémarrage avec touche 'r'", async ({
    page,
  }) => {
    await playUntilGameOver(page);
    await expect(page.locator("#gameOverScreen")).toHaveCSS("display", "flex");
    // Redémarre avec la touche 'r'
    await page.keyboard.press("r");
    await expect(page.locator("#gameCanvas")).toHaveCSS("display", "block");
    await expect(page.locator("#gameOverScreen")).toHaveCSS("display", "none");
  });
});
