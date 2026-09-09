import { audioManifest } from '@/data/audioManifest';

export interface TrackRef {
  releaseId: string;
  trackIndex: number;
}

const playablePool = (): TrackRef[] => {
  const pool: TrackRef[] = [];

  for (const [releaseId, tracks] of Object.entries(audioManifest)) {
    tracks.forEach((_track, trackIndex) => pool.push({ releaseId, trackIndex }));
  }

  return pool;
};

const isSame = (a: TrackRef, b: TrackRef): boolean => a.releaseId === b.releaseId && a.trackIndex === b.trackIndex;

export const pickRandomTrack = (exclude?: TrackRef): TrackRef | null => {
  const pool = playablePool();
  if (pool.length === 0) return null;

  const candidates = exclude && pool.length > 1 ? pool.filter(ref => !isSame(ref, exclude)) : pool;

  return candidates[Math.floor(Math.random() * candidates.length)] ?? null;
};
