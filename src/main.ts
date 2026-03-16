import { Application, Text, Container } from "pixi.js";
import { startMainMenu } from "./mainMenu";
import { toggleMusic, isMusicPlaying } from "./musicManager";

async function startApp() {
  const app = new Application({
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: 0xa47c66,
    autoDensity: true,
    resolution: window.devicePixelRatio || 1,
  });

  document.body.appendChild(app.view as HTMLCanvasElement);

  app.stage.sortableChildren = true;

  const uiContainer = new Container();
  uiContainer.zIndex = 9999;
  app.stage.addChild(uiContainer);

  const fpsText = new Text("FPS: 0", {
    fontFamily: "Arial",
    fontSize: 33,
    fontWeight: "bold",
    fill: 0xffffff,
  });

  fpsText.x = 10;
  fpsText.y = 10;

  uiContainer.addChild(fpsText);

  app.ticker.add(() => {
    fpsText.text = `FPS: ${Math.round(app.ticker.FPS)}`;
  });

  let musicPlaying = isMusicPlaying();

  const musicBtn = new Text(musicPlaying ? "Music: On" : "Music: Off", {
    fontFamily: "Arial",
    fontSize: 28,
    fill: 0xffff00,
  });

  musicBtn.anchor.set(1, 0);
  musicBtn.x = window.innerWidth - 20;
  musicBtn.y = 20;

  musicBtn.eventMode = "static";
  musicBtn.cursor = "pointer";

  musicBtn.on("pointerdown", () => {
    musicPlaying = toggleMusic();
    musicBtn.text = musicPlaying ? "Music: On" : "Music: Off";
  });

  uiContainer.addChild(musicBtn);

  window.addEventListener("resize", () => {
    app.renderer.resize(window.innerWidth, window.innerHeight);
    musicBtn.x = window.innerWidth - 20;
  });

  await startMainMenu(app);
}

startApp();
