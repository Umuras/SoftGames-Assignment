import { Application, Container, Sprite, Text, Assets } from "pixi.js";
import gsap from "gsap";
import { startAceofShadows } from "./aceOfShadows";

async function startApp() {
  const app = new Application();
  await app.init({
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: 0xfff8e0,
    autoDensity: true,
    resolution: window.devicePixelRatio || 1,
  });

  document.body.appendChild(app.canvas);

  await startAceofShadows(app);

  const fpsText = new Text({
    text: "FPS: 0",
    style: {
      fontFamily: "Arial",
      fontSize: 22,
      fill: 0x000000,
    },
  });
  fpsText.x = 10;
  fpsText.y = 10;
  app.stage.addChild(fpsText);
  app.ticker.add(() => {
    fpsText.text = `FPS: ${Math.round(app.ticker.FPS)}`;
  });
}

startApp();
