import { Application, Text } from "pixi.js";

async function startApp() {
  const app = new Application({
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: 0xa47c66,
    autoDensity: true,
    resolution: window.devicePixelRatio || 1,
  });

  document.body.appendChild(app.view as HTMLCanvasElement);

  const fpsText = new Text("FPS: 0", {
    fontFamily: "Arial",
    fontSize: 22,
    fill: 0x000000,
  });
  fpsText.x = 10;
  fpsText.y = 10;
  app.stage.addChild(fpsText);

  app.ticker.add(() => {
    fpsText.text = `FPS: ${Math.round(app.ticker.FPS)}`;
  });
}

startApp();
