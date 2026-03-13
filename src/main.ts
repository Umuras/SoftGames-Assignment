import { Application, Text } from "pixi.js";
import { startMainMenu } from "./mainMenu";

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
    fontSize: 33,
    fontWeight: "bold",
    fill: 0xffffff,
  });
  fpsText.x = 10;
  fpsText.y = 10;
  fpsText.zIndex = 1000;

  app.stage.sortableChildren = true;
  app.stage.addChild(fpsText);

  app.ticker.add(() => {
    fpsText.text = `FPS: ${Math.round(app.ticker.FPS)}`;
  });

  await startMainMenu(app);
}

startApp();
