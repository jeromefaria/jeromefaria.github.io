import { expect, test } from '@playwright/test';

import { gotoHydrated } from './helpers';

// eslint-disable-next-line local/no-comments -- non-obvious engine/infra constraint
// Firefox can't decode the AAC/m4a sources and autoplay needs a gesture, so the media element is stubbed.
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
  Object.defineProperty(proto, 'readyState', { configurable: true, get: () => 2 });

  // eslint-disable-next-line local/no-comments -- inline body keeps the stub non-empty for no-empty-function
  proto.load = function load(): void { /* no-op */ };
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
    await expect(bar.locator('.player-bar__title')).toHaveText('2504');

    await expect(bar.locator('.player-seek input')).toHaveValue('30');

    const pause = page.getByRole('button', { name: 'Pause', exact: true });
    await expect(pause).toBeVisible();

    await pause.click();
    await expect(page.getByRole('button', { name: 'Play', exact: true })).toBeVisible();
  });
});
