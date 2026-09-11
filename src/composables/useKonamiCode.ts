import { audioPlayerEnabled } from '@/composables/useFeatureFlags';
import { usePlayer } from '@/composables/usePlayer';
import { useWindowKeydown } from '@/composables/useWindowKeydown';
import { getReleaseAudio } from '@/data/audio';
import { pickRandomTrack, type TrackRef } from '@/utils/randomTrack';
import { buildReleaseContext, findRelease } from '@/utils/releasePermalink';

const SEQUENCE = ['arrowup', 'arrowup', 'arrowdown', 'arrowdown', 'arrowleft', 'arrowright', 'arrowleft', 'arrowright', 'b', 'a'];

export const useKonamiCode = (): void => {
  const player = usePlayer();
  let progress = 0;
  let last: TrackRef | undefined;

  const surprise = (): void => {
    if (!audioPlayerEnabled.value) return;

    const pick = pickRandomTrack(last);
    if (!pick) return;

    const release = findRelease(pick.releaseId);
    if (!release) return;

    last = pick;
    void player.play(getReleaseAudio(pick.releaseId), pick.trackIndex, buildReleaseContext(release));
    player.enterImmersive();
  };

  const onKeydown = (event: KeyboardEvent): void => {
    const key = event.key.toLowerCase();

    if (key === SEQUENCE[progress]) {
      progress += 1;
      if (progress === SEQUENCE.length) {
        progress = 0;
        surprise();
      }
      return;
    }

    progress = key === SEQUENCE[0] ? 1 : 0;
  };

  useWindowKeydown(onKeydown);
};
