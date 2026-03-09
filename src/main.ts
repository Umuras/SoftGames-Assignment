import { Application, Text } from "pixi.js";

async function startApp() {
  const app = new Application();

  await app.init({
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: 0x000000,
    resolution: window.devicePixelRatio || 1,
    autoDensity: true,
    preference: "webgl",
  });

  document.body.appendChild(app.canvas);

  const text = new Text({
    text: "Hello, Pixi.js!",
    style: { fill: 0xffffff, fontSize: 36, fontFamily: "Arial" },
  });
  text.anchor.set(0.5);
  text.x = app.screen.width / 2;
  text.y = app.screen.height / 2;
  app.stage.addChild(text);
}

startApp();
