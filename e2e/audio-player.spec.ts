import { expect, test } from '@playwright/test';

import { gotoHydrated } from './helpers';

// The audio pipeline is stubbed at the HTMLMediaElement level so playback is
// deterministic across engines: Firefox can't decode the AAC/m4a sources, real
// browsers block autoplay without a gesture, and CI must not depend on the R2
// audio bucket. Overriding `src` to store-without-fetching keeps the element off
// the network entirely, so it never fires `error` (which would trigger retries).
const stubMediaElement = (): void => {
  const proto = HTMLMediaElement.prototype;
  let source = '';
  let time = 0;

  Object.defineProperty(proto, 'src', {
    configurable: true,
    get: () => source,
    set: value => { source = String(value); },
  });
  Object.defineProperty(proto, 'duration', { configurable: true, get: () => 100 });
  Object.defineProperty(proto, 'currentTime', {
    configurable: true,
    get: () => time,
    set(this: HTMLMediaElement, value: number) {
      time = value;
      this.dispatchEvent(new Event('timeupdate'));
    },
  });
  // HAVE_CURRENT_DATA — so applyStartOffset seeks immediately instead of waiting on a
  // loadedmetadata event the stub never fires; this is what lets the ?t offset apply.
  Object.defineProperty(proto, 'readyState', { configurable: true, get: () => 2 });

  proto.load = function load(): void { /* no-op: the stub never loads a resource */ };
  proto.play = function play(this: HTMLMediaElement): Promise<void> {
    this.dispatchEvent(new Event('playing'));
    return Promise.resolve();
  };
  proto.pause = function pause(this: HTMLMediaElement): void {
    this.dispatchEvent(new Event('pause'));
  };
};

test.describe('Audio player', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(stubMediaElement);
  });

  test('a release permalink deep-links into the player, and the transport toggles', async ({ page }) => {
    await gotoHydrated(page, '/works/2504?t=30');

    const bar = page.locator('.player-bar');
    await expect(bar).toBeVisible();
    // The deep link resolved to the 2504 release (its single piece is titled "2504").
    await expect(bar.locator('.player-bar__title')).toHaveText('2504');

    // ...and the ?t=30 offset was applied — the transport is cued to 30s, not the start.
    await expect(bar.locator('.player-seek input')).toHaveValue('30');

    // Stubbed play() resolves to "playing", so the primary transport shows Pause...
    const pause = page.getByRole('button', { name: 'Pause', exact: true });
    await expect(pause).toBeVisible();

    // ...and toggling it pauses, flipping the control to Play.
    await pause.click();
    await expect(page.getByRole('button', { name: 'Play', exact: true })).toBeVisible();
  });
});
