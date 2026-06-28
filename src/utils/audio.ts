import { useGameStore } from "../stores/useGameStore";

import aboutAudioUrl from "../assets/audio/music/about.wav";
import slowAudioUrl from "../assets/audio/music/slow.wav";
import fastAudioUrl from "../assets/audio/music/fast.wav";
import hitAudioUrl from "../assets/audio/sfx/hit.wav";
import lineAudioUrl from "../assets/audio/sfx/line.wav";
import loseAudioUrl from "../assets/audio/sfx/lose.wav";

const TRACKS = {
  about: aboutAudioUrl,
  slow: slowAudioUrl,
  fast: fastAudioUrl,
};

const SFX = {
  hit: hitAudioUrl,
  line: lineAudioUrl,
  lose: loseAudioUrl,
};

type Track = keyof typeof TRACKS;
type SFX = keyof typeof SFX;

const instances: Partial<Record<Track, HTMLAudioElement>> = {};

let activeTrack: Track | null = null;

const getTrack = (track: Track): HTMLAudioElement => {
  if (!instances[track]) {
    instances[track] = new Audio(TRACKS[track]);
    instances[track]!.loop = true;
  }

  return instances[track]!;
};

export const playTrack = (track: Track) => {
  const { scene, soundMode } = useGameStore.getState();

  if (soundMode === 0) return;
  if (soundMode === 1 && scene === "menu") return;

  activeTrack = track;
  getTrack(track).play();
};

export const stopTrack = (track: Track) => {
  const a = getTrack(track);

  a.pause();
  a.currentTime = 0;
};

export const switchTrack = (to: Track) => {
  if (!activeTrack || activeTrack === to) return;

  const from = getTrack(activeTrack);
  const next = getTrack(to);

  from.pause();
  from.currentTime = 0;
  next.play();

  activeTrack = to;
};

export const playSound = (sound: SFX) => {
  new Audio(SFX[sound]).play();
};

export const pauseAllTracks = () => {
  (Object.keys(instances) as Track[]).forEach((track) =>
    getTrack(track).pause(),
  );
};

export const resumeAllTracks = () => {
  if (!activeTrack) return;

  getTrack(activeTrack).play();
};

export const stopAllTracks = () => {
  (Object.keys(instances) as Track[]).forEach(stopTrack);
};
