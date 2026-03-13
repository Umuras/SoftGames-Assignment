import {
  Application,
  Container,
  Sprite,
  Text,
  Graphics,
  Assets,
} from "pixi.js";
import axios from "axios";
import { gsap } from "gsap";
import { clearGame } from "./utils";
import { createPauseMenu } from "./pauseMenu";

export async function startMagicWords(app: Application) {
  clearGame(app);

  const dialogContainer = new Container();
  dialogContainer.pivot.x = 0.5;
  dialogContainer.x = app.screen.width / 2;
  dialogContainer.y = app.screen.height / 2;
  app.stage.addChild(dialogContainer);
  await createPauseMenu(app);

  const bgTexture = await Assets.load("/magicwordbg.png");
  const bgSprite = new Sprite(bgTexture);

  bgSprite.width = app.screen.width;
  bgSprite.height = app.screen.height;
  app.stage.addChildAt(bgSprite, 0);

  const infoText = new Text("Press SPACE to start the conversation", {
    fontSize: 20,
    fill: 0xffffff,
  });
  infoText.anchor.set(0.5);
  infoText.x = app.screen.width / 2;
  infoText.y = app.screen.height - 70;
  app.stage.addChild(infoText);

  try {
    const response = await axios.get(
      "https://private-624120-softgamesassignment.apiary-mock.com/v2/magicwords",
    );
    const data = response.data;
    const dialogues = data.dialogue;
    const avatars = data.avatars;
    const emojies = data.emojies;

    const spacingX = 12;
    let currentIndex = -1;
    let confettiPlayed = false;

    function createLine(line: any) {
      const lineContainer = new Container();
      const speaker = avatars.find((a: any) => a.name === line.name);

      let avatarSprite: Sprite | null = null;
      let position = "left";

      if (speaker) {
        avatarSprite = Sprite.from(speaker.url);
        avatarSprite.scale.set(0.45);
        avatarSprite.anchor.set(0, 0);
        position = speaker.position || "left";
      }

      const nameText = new Text(line.name, {
        fontSize: 24,
        fill: 0xffd54f,
        fontWeight: "bold",
      });

      const textContainer = new Container();
      let cursorX = 0;
      const parts = line.text.split(/({[^}]+})/g);

      for (const part of parts) {
        if (part.startsWith("{") && part.endsWith("}")) {
          const emojiName = part.slice(1, -1).toLowerCase();
          const emojiData = emojies.find(
            (e: any) => e.name.toLowerCase() === emojiName,
          );
          if (emojiData) {
            const emoji = Sprite.from(emojiData.url);
            emoji.scale.set(0.18);
            emoji.x = cursorX;
            textContainer.addChild(emoji);
            cursorX += emoji.width + 6;
            continue;
          }
        }
        const text = new Text(part, {
          fontSize: 22,
          fill: 0x000000,
        });
        text.x = cursorX;
        textContainer.addChild(text);
        cursorX += text.width;
      }

      const totalHeight = Math.max(
        avatarSprite ? avatarSprite.height : 0,
        nameText.height,
        textContainer.height,
      );

      if (position === "left") {
        let x = -350;
        if (avatarSprite) {
          avatarSprite.x = x;
          lineContainer.addChild(avatarSprite);
          x += avatarSprite.width + spacingX;
        }
        nameText.x = x;
        lineContainer.addChild(nameText);
        x += nameText.width + spacingX;
        textContainer.x = x;
        lineContainer.addChild(textContainer);
      } else if (position === "right") {
        let x = -350;
        textContainer.x = x;
        lineContainer.addChild(textContainer);
        x += textContainer.width + spacingX;
        nameText.x = x;
        lineContainer.addChild(nameText);
        x += nameText.width + spacingX;
        if (avatarSprite) {
          avatarSprite.x = x;
          lineContainer.addChild(avatarSprite);
        }
      }

      if (avatarSprite)
        avatarSprite.y = totalHeight / 2 - avatarSprite.height / 2;
      nameText.y = totalHeight / 2 - nameText.height / 2;
      textContainer.y = totalHeight / 2 - textContainer.height / 2;

      return lineContainer;
    }

    function launchConfetti() {
      for (let i = 0; i < 50; i++) {
        const confetti = new Graphics();
        confetti.beginFill(Math.random() * 0xffffff);
        confetti.drawRect(0, 0, 8, 8);
        confetti.endFill();
        confetti.x = app.screen.width / 2;
        confetti.y = app.screen.height / 2;
        app.stage.addChild(confetti);

        gsap.to(confetti, {
          x: confetti.x + (Math.random() - 0.5) * 600,
          y: confetti.y + Math.random() * 400,
          rotation: Math.random() * 10,
          alpha: 0,
          duration: 2,
          ease: "power2.out",
          onComplete: () => confetti.destroy(),
        });
      }
    }

    function showNextDialogue() {
      currentIndex++;
      if (currentIndex >= dialogues.length) {
        infoText.text = "";
        if (!confettiPlayed) {
          confettiPlayed = true;
          gsap.from(dialogContainer.scale, {
            x: 0.8,
            y: 0.8,
            duration: 0.4,
            ease: "back.out",
          });
          launchConfetti();
        }
        return;
      }

      const line = createLine(dialogues[currentIndex]);
      dialogContainer.addChild(line);

      line.y = dialogContainer.height + 20;

      gsap.from(line, {
        y: line.y - 40,
        alpha: 0,
        duration: 0.6,
        ease: "power2.out",
      });

      const targetY = Math.min(
        app.screen.height / 2 - dialogContainer.height / 2,
        50,
      );
      gsap.to(dialogContainer, {
        y: targetY,
        duration: 0.5,
        ease: "power2.out",
      });
    }

    window.addEventListener("keydown", (e) => {
      if (e.code === "Space") {
        if (currentIndex === -1) infoText.text = "Press SPACE to continue";
        showNextDialogue();
      }
    });
  } catch (err) {
    console.error("Magic Words API error", err);
  }
}
