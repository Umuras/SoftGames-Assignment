import { Container, Sprite, Text, Assets } from "pixi.js";
import gsap from "gsap";
import { startAceofShadows } from "./aceOfShadows";
import { startMagicWords } from "./magicWords";
import { startPhoenixFlame } from "./phoenixFlame";
import { startMainMenu } from "./mainMenu";

export async function createPauseMenu(app: any) {
  app.stage.sortableChildren = true;

  const bgTexture = await Assets.load("/background.png");
  const buttonTexture = await Assets.load("/Button2.png");
  const pauseTexture = await Assets.load("/pause.png");

  let gamePaused = false;

  const pauseContainer = new Container();
  pauseContainer.visible = false;
  pauseContainer.zIndex = 1000;

  app.stage.addChild(pauseContainer);

  const bg = new Sprite(bgTexture);
  bg.width = app.screen.width;
  bg.height = app.screen.height;
  bg.alpha = 0.85;
  bg.eventMode = "none";
  pauseContainer.addChild(bg);

  const title = new Text("PAUSED", {
    fontFamily: "Arial",
    fontSize: 50,
    fill: 0xffffff,
  });

  title.anchor.set(0.5);
  title.x = app.screen.width / 2;
  title.y = 120;

  pauseContainer.addChild(title);

  const buttonLabels = [
    { label: "Ace of Shadows", action: () => startAceofShadows(app) },
    { label: "Magic Words", action: () => startMagicWords(app) },
    { label: "Phoenix Flame", action: () => startPhoenixFlame(app) },
    { label: "Main Menu", action: () => startMainMenu(app) },
  ];

  const startY = app.screen.height / 2 - buttonLabels.length * 70;

  buttonLabels.forEach((btn, i) => {
    const container = new Container();

    const sprite = new Sprite(buttonTexture);
    sprite.anchor.set(0.5);

    const text = new Text(btn.label, {
      fontFamily: "Arial",
      fontSize: 34,
      fill: 0xffffff,
    });

    text.anchor.set(0.5);

    container.addChild(sprite);
    container.addChild(text);

    container.x = app.screen.width / 2;
    container.y = startY + i * 140;

    container.eventMode = "static";
    container.cursor = "pointer";

    container.on("pointerdown", () => {
      pauseContainer.visible = false;
      gamePaused = false;

      btn.action();
    });

    container.on("pointerover", () =>
      gsap.to(container.scale, { x: 1.1, y: 1.1, duration: 0.2 }),
    );

    container.on("pointerout", () =>
      gsap.to(container.scale, { x: 1, y: 1, duration: 0.2 }),
    );

    pauseContainer.addChild(container);
  });

  const pauseBtn = new Sprite(pauseTexture);

  pauseBtn.width = 50;
  pauseBtn.height = 50;

  pauseBtn.anchor.set(1, 0);

  pauseBtn.x = app.screen.width / 2;
  pauseBtn.y = 20;

  pauseBtn.eventMode = "static";
  pauseBtn.cursor = "pointer";
  pauseBtn.zIndex = 1001;

  app.stage.addChild(pauseBtn);

  pauseBtn.on("pointerdown", () => {
    pauseContainer.visible = !pauseContainer.visible;

    gamePaused = pauseContainer.visible;
  });

  window.addEventListener("resize", () => {
    bg.width = app.screen.width;
    bg.height = app.screen.height;

    title.x = app.screen.width / 2;

    pauseBtn.x = app.screen.width / 2;
  });

  return {
    pauseContainer,
    isPaused: () => gamePaused,
  };
}
