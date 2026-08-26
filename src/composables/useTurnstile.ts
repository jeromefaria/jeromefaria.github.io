import type { Ref } from 'vue';
import { onBeforeUnmount, onMounted } from 'vue';

import { TURNSTILE } from '@/utils/constants';

interface TurnstileRenderOptions {
  sitekey: string;
  execution: 'render' | 'execute';
  callback: (token: string) => void;
  'error-callback': () => void;
  'expired-callback': () => void;
}

interface TurnstileApi {
  render: (container: HTMLElement, options: TurnstileRenderOptions) => string;
  execute: (widgetId: string) => void;
  reset: (widgetId: string) => void;
  remove: (widgetId: string) => void;
}

declare global {
  interface Window {
    turnstile?: TurnstileApi;
    onloadTurnstileCallback?: () => void;
  }
}

const loadTurnstile = (): Promise<TurnstileApi> =>
  new Promise((resolve, reject) => {
    if (window.turnstile) {
      resolve(window.turnstile);
      return;
    }

    window.onloadTurnstileCallback = () =>
      window.turnstile ? resolve(window.turnstile) : reject(new Error('Turnstile loaded without an API'));

    if (document.querySelector(`script[src="${TURNSTILE.SCRIPT_URL}"]`)) return;

    const script = document.createElement('script');
    script.src = TURNSTILE.SCRIPT_URL;
    script.async = true;
    script.defer = true;
    script.onerror = () => reject(new Error('Failed to load Turnstile'));
    document.head.appendChild(script);
  });

interface UseTurnstileReturn {
  execute: () => Promise<string>;
}

export const useTurnstile = (siteKey: string, container: Ref<HTMLElement | null>): UseTurnstileReturn => {
  let api: TurnstileApi | null = null;
  let widgetId: string | null = null;
  let resolveToken: ((token: string) => void) | null = null;
  let rejectToken: ((error: Error) => void) | null = null;

  onMounted(async () => {
    const loaded = await loadTurnstile().catch(() => null);
    if (!loaded || !container.value) return;

    api = loaded;
    widgetId = api.render(container.value, {
      sitekey: siteKey,
      execution: 'execute',
      'callback': token => resolveToken?.(token),
      'error-callback': () => rejectToken?.(new Error('Turnstile verification failed')),
      'expired-callback': () => rejectToken?.(new Error('Turnstile token expired')),
    });
  });

  onBeforeUnmount(() => {
    if (api && widgetId !== null) {
      api.remove(widgetId);
    }
  });

  const execute = (): Promise<string> =>
    new Promise((resolve, reject) => {
      if (!api || widgetId === null) {
        reject(new Error('Turnstile is not ready'));
        return;
      }

      resolveToken = resolve;
      rejectToken = reject;
      api.reset(widgetId);
      api.execute(widgetId);
    });

  return { execute };
};
