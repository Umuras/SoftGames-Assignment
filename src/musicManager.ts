let music: HTMLAudioElement | null = null;
let playing = false;

export function getMusic() {
  if (!music) {
    music = new Audio("/public/music.wav");
    music.loop = true;
  }
  return music;
}

export function toggleMusic() {
  const music = getMusic();

  if (playing) {
    music.pause();
  } else {
    music.play();
  }

  playing = !playing;
  return playing;
}

export function isMusicPlaying() {
  return playing;
}
