import { useSettingsStore } from "../stores/useSettingsStore";
import { audioCache } from "./assets";

const getAudio = (src: string) => {
  const cached = audioCache.get(src);

  if (!cached) throw new Error(`Audio not preloaded: ${src}`);

  return cached;
};

let currentTrack: HTMLAudioElement | null = null;

export const playTrack = (src: string) => {
  if (currentTrack) {
    currentTrack.pause();
    currentTrack.currentTime = 0;
  }

  const audio = getAudio(src);

  audio.loop = true;
  audio.currentTime = 0;
  currentTrack = audio;

  if (useSettingsStore.getState().music) {
    audio.play().catch((err) => {
      console.warn("Audio playback failed:", err.name, err.message);
    });
  }
};

export const pauseTrack = () => currentTrack?.pause();

export const resumeTrack = () => {
  if (currentTrack && useSettingsStore.getState().music) currentTrack.play();
};

export const stopTrack = () => {
  currentTrack?.pause();

  if (currentTrack) currentTrack.currentTime = 0;

  currentTrack = null;
};

export const playSfx = (src: string) => {
  const audio = getAudio(src);
  const instance = audio.cloneNode() as HTMLAudioElement;

  if (useSettingsStore.getState().sfx)
    instance.play().catch((err) => {
      console.warn("Audio playback failed:", err.name, err.message);
    });
};
