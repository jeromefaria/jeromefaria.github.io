import { audioPlayerEnabled } from '@/composables/useFeatureFlags';
import { usePlayer } from '@/composables/usePlayer';
import { useWindowKeydown } from '@/composables/useWindowKeydown';
import { getReleaseAudio } from '@/data/audio';
import { pickRandomTrack, type TrackRef } from '@/utils/randomTrack';
import { buildReleaseContext, findRelease } from '@/utils/releasePermalink';

const SEQUENCE = ['arrowup', 'arrowup', 'arrowdown', 'arrowdown', 'arrowleft', 'arrowright', 'arrowleft', 'arrowright', 'b', 'a'];

const stripVariationSelectors = (value: string): string => value.replace(/[\uFE0E\uFE0F]/g, '');

const KONAMI_EMOJI = stripVariationSelectors('⬆️⬆️⬇️⬇️⬅️➡️⬅️➡️🅱️🅰️');

export const isKonamiEmojiSequence = (value: string): boolean =>
  stripVariationSelectors(value).trim() === KONAMI_EMOJI;

let lastPick: TrackRef | undefined;

export const triggerKonamiSurprise = (): void => {
  if (!audioPlayerEnabled.value) return;

  const pick = pickRandomTrack(lastPick);
  if (!pick) return;

  const release = findRelease(pick.releaseId);
  if (!release) return;

  lastPick = pick;
  const player = usePlayer();
  void player.play(getReleaseAudio(pick.releaseId), pick.trackIndex, buildReleaseContext(release));
  player.enterImmersive();
};

export const useKonamiCode = (): void => {
  let progress = 0;

  const onKeydown = (event: KeyboardEvent): void => {
    const key = event.key.toLowerCase();

    if (key === SEQUENCE[progress]) {
      progress += 1;
      if (progress === SEQUENCE.length) {
        progress = 0;
        triggerKonamiSurprise();
      }
      return;
    }

    progress = key === SEQUENCE[0] ? 1 : 0;
  };

  useWindowKeydown(onKeydown);
};
