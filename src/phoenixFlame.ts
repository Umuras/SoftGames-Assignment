import { Application, Sprite, Assets, Container, Ticker } from "pixi.js";
import { createPauseMenu } from "./pausemenu";
import { clearGame } from "./utils";

type FlameParticle = {
  sprite: Sprite;
  baseScaleX: number;
  baseScaleY: number;
  scaleDirection: number;
};

export async function startPhoenixFlame(app: Application) {
  clearGame(app);
  const container = new Container();

  const texture = await Assets.load("/fire.png");
  const campTexture = await Assets.load("/camp.png");

  const campSprite = new Sprite(campTexture);
  campSprite.width = app.screen.width;
  campSprite.height = app.screen.height;

  app.stage.addChildAt(campSprite, 0);
  app.stage.addChild(container);
  await createPauseMenu(app);

  const particles: FlameParticle[] = [];
  const MAX_PARTICLES = 10;

  const potX = app.screen.width / 2 + 50;
  const potY = app.screen.height / 2 + 250;

  for (let i = 0; i < MAX_PARTICLES; i++) {
    const sprite = new Sprite(texture);
    sprite.anchor.set(0.5);
    sprite.x = potX + (Math.random() - 0.5) * 60;
    sprite.y = potY + (Math.random() - 0.5) * 10;

    const baseScaleX = 0.5 + Math.random() * 0.1;
    const baseScaleY = 0.15 + Math.random() * 0.05;
    sprite.scale.set(baseScaleX, baseScaleY);

    container.addChild(sprite);

    particles.push({
      sprite,
      baseScaleX,
      baseScaleY,
      scaleDirection: Math.random() > 0.5 ? 1 : -1,
    });
  }

  Ticker.shared.add(() => {
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      p.sprite.scale.x = p.baseScaleX + Math.random() * 0.02 * p.scaleDirection;
      p.sprite.scale.y = p.baseScaleY + Math.random() * 0.02 * p.scaleDirection;
    }
  });
}
