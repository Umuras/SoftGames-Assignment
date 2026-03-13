import { Application, Container, Sprite, Text } from "pixi.js";

export function clearGame(app: Application) {
  app.stage.removeChildren();
}
