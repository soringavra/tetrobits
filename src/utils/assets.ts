import dropSfxUrl from "../assets/audio/sfx/drop.wav";
import lineSlowSfxUrl from "../assets/audio/sfx/line_slow.wav";
import lineFastSfxUrl from "../assets/audio/sfx/line_fast.wav";
import loseSfxUrl from "../assets/audio/sfx/lose.wav";
import notificationSfxUrl from "../assets/audio/sfx/notification.wav";
import pauseSfxUrl from "../assets/audio/sfx/pause.wav";
import resumeSfxUrl from "../assets/audio/sfx/resume.wav";
import classicTrackUrl from "../assets/audio/music/classic.ogg";
import frenzyTrackUrl from "../assets/audio/music/frenzy.ogg";

import smbnesFontUrl from "../assets/fonts/SMBNES.ttf";

import cellsImageUrl from "../assets/sprites/cells.png";
import tetrobitsImageUrl from "../assets/sprites/tetrobits.png";

export const SFX = {
  drop: dropSfxUrl,
  notification: notificationSfxUrl,
  lineSlow: lineSlowSfxUrl,
  lineFast: lineFastSfxUrl,
  lose: loseSfxUrl,
  pause: pauseSfxUrl,
  resume: resumeSfxUrl,
} as const;

export const TRACKS = {
  classic: classicTrackUrl,
  frenzy: frenzyTrackUrl,
} as const;

export const FONTS = {
  smbnes: { family: "SMBNES", url: smbnesFontUrl },
} as const;

export const SPRITES = {
  cells: cellsImageUrl,
  tetrobits: tetrobitsImageUrl,
} as const;

export const ASSETS = {
  audio: [...Object.values(SFX), ...Object.values(TRACKS)],
  fonts: Object.values(FONTS),
  sprites: Object.values(SPRITES),
};

export const audioCache = new Map<string, HTMLAudioElement>();
export const spriteCache = new Map<string, HTMLImageElement>();

export const preloadAudio = (src: string): Promise<void> => {
  const audio = new Audio(src);

  audioCache.set(src, audio);

  return new Promise((resolve, reject) => {
    audio.addEventListener("canplaythrough", () => resolve(), { once: true });
    audio.addEventListener("error", (e) => reject(e), { once: true });
  });
};

export const preloadFont = (
  family: string,
  url: string,
  descriptors?: FontFaceDescriptors,
) =>
  new FontFace(family, `url(${url})`, descriptors).load().then((face) => {
    document.fonts.add(face);
  });

export const preloadSprite = (src: string) => {
  const img = new Image();

  img.src = src;
  spriteCache.set(src, img);

  return img.decode();
};

export const getSprite = (src: string) => {
  const cached = spriteCache.get(src);

  if (!cached) throw new Error(`Sprite not preloaded: ${src}`);

  return cached;
};
