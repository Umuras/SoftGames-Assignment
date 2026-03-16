import { Application } from "pixi.js";

export function clearGame(app: Application) {
  const keepUI = app.stage.children.filter(
    (child: any) => child.zIndex >= 9999,
  );

  app.stage.removeChildren();

  keepUI.forEach((ui) => {
    app.stage.addChild(ui);
  });
}
