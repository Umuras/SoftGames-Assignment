import {
  Application,
  Container,
  Sprite,
  Text,
  Texture,
  Ticker,
  Assets,
} from "pixi.js";
import gsap from "gsap";
import { startAceofShadows } from "./aceOfShadows";
import { startMagicWords } from "./magicWords";
import { startPhoenixFlame } from "./phoenixFlame";
import { clearGame } from "./utils";

type Particle = {
  sprite: Sprite;
  vx: number;
  vy: number;
  alphaSpeed: number;
};

type Leaf = {
  sprite: Sprite;
  vx: number;
  vy: number;
  rotationSpeed: number;
};

export async function startMainMenu(app: Application) {
  clearGame(app);

  const menuContainer = new Container();
  app.stage.addChild(menuContainer);

  const bgTexture = await Assets.load("/background.png");
  const background = new Sprite(bgTexture);

  background.width = app.screen.width;
  background.height = app.screen.height;

  menuContainer.addChild(background);

  const bgContainer = new Container();
  menuContainer.addChild(bgContainer);

  const fireParticles: Particle[] = [];

  for (let i = 0; i < 20; i++) {
    const fire = new Sprite(Texture.WHITE);

    fire.tint = 0xffaa33;
    fire.width = fire.height = 3 + Math.random() * 5;

    fire.x = Math.random() * app.screen.width;
    fire.y = Math.random() * app.screen.height * 0.6;

    fire.alpha = 0.2 + Math.random() * 0.5;

    bgContainer.addChild(fire);

    fireParticles.push({
      sprite: fire,
      vx: (Math.random() - 0.5) * 0.2,
      vy: (Math.random() - 0.5) * 0.2,
      alphaSpeed: 0.002 + Math.random() * 0.003,
    });
  }

  const leaves: Leaf[] = [];

  for (let i = 0; i < 15; i++) {
    const leaf = new Sprite(Texture.WHITE);

    leaf.tint = 0x88cc44;

    leaf.width = 10 + Math.random() * 15;
    leaf.height = 5 + Math.random() * 8;

    leaf.anchor.set(0.5);

    leaf.x = Math.random() * app.screen.width;
    leaf.y = Math.random() * app.screen.height * 0.7;

    leaf.rotation = Math.random() * Math.PI * 2;

    bgContainer.addChild(leaf);

    leaves.push({
      sprite: leaf,
      vx: (Math.random() - 0.3) * 0.5,
      vy: 0.2 + Math.random() * 0.5,
      rotationSpeed: (Math.random() - 0.5) * 0.02,
    });
  }

  Ticker.shared.add(() => {
    fireParticles.forEach((p) => {
      p.sprite.x += p.vx;
      p.sprite.y += p.vy;

      p.sprite.alpha += p.alphaSpeed * (Math.random() > 0.5 ? 1 : -1);

      if (p.sprite.alpha < 0.1) p.sprite.alpha = 0.1;
      if (p.sprite.alpha > 0.7) p.sprite.alpha = 0.7;
    });

    leaves.forEach((l) => {
      l.sprite.x += l.vx;
      l.sprite.y += l.vy;

      l.sprite.rotation += l.rotationSpeed;

      if (l.sprite.y > app.screen.height + 10) l.sprite.y = -10;

      if (l.sprite.x > app.screen.width + 10) l.sprite.x = -10;

      if (l.sprite.x < -10) l.sprite.x = app.screen.width + 10;
    });
  });

  const buttonTexture = await Assets.load("/Button1.png");

  const buttonLabels = [
    { label: "Ace of Shadows", action: () => startAceofShadows(app) },
    { label: "Magic Words", action: () => startMagicWords(app) },
    { label: "Phoenix Flame", action: () => startPhoenixFlame(app) },
  ];

  const startY = app.screen.height / 2 - buttonLabels.length * 70;

  buttonLabels.forEach((btn, i) => {
    const buttonContainer = new Container();

    const buttonSprite = new Sprite(buttonTexture);
    buttonSprite.anchor.set(0.5);

    const text = new Text(btn.label, {
      fontFamily: "Arial",
      fontSize: 40,
      fill: 0xffffff,
    });

    text.anchor.set(0.5);

    buttonContainer.addChild(buttonSprite);
    buttonContainer.addChild(text);

    buttonContainer.x = app.screen.width / 2;
    buttonContainer.y = startY + i * 140;

    buttonContainer.eventMode = "static";
    buttonContainer.cursor = "pointer";

    buttonContainer.on("pointerdown", () => {
      menuContainer.visible = false;
      btn.action();
    });

    buttonContainer.on("pointerover", () => {
      gsap.to(buttonContainer.scale, {
        x: 1.1,
        y: 1.1,
        duration: 0.2,
      });
    });

    buttonContainer.on("pointerout", () => {
      gsap.to(buttonContainer.scale, {
        x: 1,
        y: 1,
        duration: 0.2,
      });
    });

    menuContainer.addChild(buttonContainer);
  });

  window.addEventListener("resize", () => {
    background.width = app.screen.width;
    background.height = app.screen.height;
  });
}
