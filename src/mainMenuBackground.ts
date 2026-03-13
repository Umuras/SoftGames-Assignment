import {
  Application,
  Container,
  Graphics,
  Ticker,
  Sprite,
  Texture,
} from "pixi.js";

type Particle = {
  sprite: Sprite;
  vx: number;
  vy: number;
  alphaSpeed: number;
};

export function createMenuBackground(app: Application): Container {
  const bgContainer = new Container();
  app.stage.addChild(bgContainer);

  const bg = new Graphics();
  const gradient = bg
    .beginTextureFill({
      texture: Texture.WHITE,
      color: 0x000000,
    })
    .drawRect(0, 0, app.screen.width, app.screen.height)
    .endFill();

  bgContainer.addChild(bg);

  const gradientOverlay = new Graphics();
  const gradientHeight = app.screen.height;
  for (let i = 0; i < gradientHeight; i++) {
    const color =
      0x4a2c1c + Math.floor((0x7c5a3c - 0x4a2c1c) * (i / gradientHeight));
    gradientOverlay.beginFill(color, 1 - i / gradientHeight);
    gradientOverlay.drawRect(0, i, app.screen.width, 1);
    gradientOverlay.endFill();
  }
  bgContainer.addChild(gradientOverlay);

  const particles: Particle[] = [];
  const MAX_PARTICLES = 30;
  for (let i = 0; i < MAX_PARTICLES; i++) {
    const particle = new Sprite(Texture.WHITE);
    particle.tint = 0xffaa33;
    particle.width = particle.height = 4 + Math.random() * 4;
    particle.x = Math.random() * app.screen.width;
    particle.y = Math.random() * app.screen.height * 0.6;
    particle.alpha = 0.2 + Math.random() * 0.5;

    bgContainer.addChild(particle);

    particles.push({
      sprite: particle,
      vx: (Math.random() - 0.5) * 0.2,
      vy: (Math.random() - 0.5) * 0.2,
      alphaSpeed: 0.002 + Math.random() * 0.003,
    });
  }

  Ticker.shared.add(() => {
    particles.forEach((p) => {
      p.sprite.x += p.vx;
      p.sprite.y += p.vy;

      p.sprite.alpha += p.alphaSpeed * (Math.random() > 0.5 ? 1 : -1);
      if (p.sprite.alpha < 0.1) p.sprite.alpha = 0.1;
      if (p.sprite.alpha > 0.7) p.sprite.alpha = 0.7;
    });
  });

  window.addEventListener("resize", () => {
    bg.clear();
    bg.beginTextureFill({ texture: Texture.WHITE })
      .drawRect(0, 0, app.screen.width, app.screen.height)
      .endFill();
    gradientOverlay.clear();
    for (let i = 0; i < app.screen.height; i++) {
      const color =
        0x4a2c1c + Math.floor((0x7c5a3c - 0x4a2c1c) * (i / app.screen.height));
      gradientOverlay.beginFill(color, 1 - i / app.screen.height);
      gradientOverlay.drawRect(0, i, app.screen.width, 1);
      gradientOverlay.endFill();
    }

    particles.forEach((p) => {
      p.sprite.x = Math.random() * app.screen.width;
      p.sprite.y = Math.random() * app.screen.height * 0.6;
    });
  });

  return bgContainer;
}
