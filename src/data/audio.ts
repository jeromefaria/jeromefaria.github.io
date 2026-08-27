import type { AudioTrack } from '@/types/audio';

import { audioManifest } from './audioManifest';

const AUDIO_BASE_URL = (import.meta.env.VITE_AUDIO_BASE_URL ?? '').replace(/\/$/, '');

export const audioUrl = (key: string): string => `${AUDIO_BASE_URL}/${key}`;

export const getReleaseAudio = (releaseId: string): AudioTrack[] => audioManifest[releaseId] ?? [];

export const hasPlayableAudio = (releaseId: string): boolean => getReleaseAudio(releaseId).length > 0;
