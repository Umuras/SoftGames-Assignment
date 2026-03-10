import { Application, Container, Sprite, Text, Assets } from "pixi.js";
import gsap from "gsap";

export async function startAceofShadows(app: Application) {
  document.body.appendChild(app.canvas);

  const cardTexture = await Assets.load("/card.png");

  const aceContainer = new Container();
  app.stage.addChild(aceContainer);

  const stacks: Container[] = [];
  const margin = 150;

  function updateStackPositions() {
    const centerX = app.screen.width / 2;
    const centerY = app.screen.height / 2;

    const positions = [
      { x: centerX, y: centerY },
      { x: centerX, y: margin },
      { x: app.screen.width - margin, y: centerY },
      { x: centerX, y: app.screen.height - margin },
      { x: margin, y: centerY },
    ];

    stacks.forEach((stack, i) => {
      stack.x = positions[i].x;
      stack.y = positions[i].y;
    });
  }

  for (let i = 0; i < 5; i++) {
    const newStack = new Container();
    aceContainer.addChild(newStack);
    stacks.push(newStack);

    const label = new Text({
      text: `Stack ${i}`,
      style: {
        fontFamily: "Arial",
        fontSize: 16,
        fill: 0x000000,
      },
    });

    label.anchor.set(0.5);
    label.y = -40;
    newStack.addChild(label);
  }

  updateStackPositions();

  for (let i = 0; i < 144; i++) {
    const card = Sprite.from(cardTexture);
    card.anchor.set(0.5);
    card.scale.set(0.2);
    card.y = i * 0.5;
    stacks[0].addChild(card);
  }

  function moveCard(
    card: Sprite,
    fromStack: Container,
    targetStack: Container,
  ) {
    const start = card.getGlobalPosition();

    fromStack.removeChild(card);
    aceContainer.addChild(card);

    card.x = start.x;
    card.y = start.y;

    const target = targetStack.getGlobalPosition();
    const targetY = target.y + targetStack.children.length * 0.5;

    gsap.to(card, {
      x: target.x,
      y: targetY,
      rotation: (Math.random() * 6 - 3) * (Math.PI / 180), // ±3°
      duration: 2,
      ease: "power2.inOut",
      onComplete: () => {
        card.x = 0;
        card.y = targetStack.children.length * 0.5;
        card.rotation = 0;
        targetStack.addChild(card);

        moveTopCard();
      },
    });
  }

  let currentTarget = 1;

  function moveTopCard() {
    if (stacks[0].children.length === 0) return;

    const card = stacks[0].getChildAt(stacks[0].children.length - 1) as Sprite;
    const targetStack = stacks[currentTarget];

    moveCard(card, stacks[0], targetStack);

    currentTarget++;
    if (currentTarget > 4) currentTarget = 1;
  }

  moveTopCard();

  // Resize olayında stack pozisyonlarını güncelle
  window.addEventListener("resize", () => {
    app.renderer.resize(window.innerWidth, window.innerHeight);
    updateStackPositions();
  });
}
