import { onBeforeUnmount, onMounted } from 'vue';

interface PageLifecycleHandlers {
  onResume?: () => void;
  onHidden?: () => void;
}

export const usePageLifecycle = (handlers: PageLifecycleHandlers): void => {
  const handleVisibility = (): void => {
    if (document.visibilityState === 'visible') handlers.onResume?.();
    else handlers.onHidden?.();
  };

  // eslint-disable-next-line local/no-comments -- genuine gotcha
  // A bfcache restore fires pageshow(persisted) but not visibilitychange, while a tab switch fires only visibilitychange — both are needed; onResume must be idempotent since a restore can fire both.
  const handlePageShow = (event: PageTransitionEvent): void => {
    if (event.persisted) handlers.onResume?.();
  };

  const handlePageHide = (): void => handlers.onHidden?.();

  onMounted(() => {
    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('pageshow', handlePageShow);
    window.addEventListener('pagehide', handlePageHide);
  });

  onBeforeUnmount(() => {
    document.removeEventListener('visibilitychange', handleVisibility);
    window.removeEventListener('pageshow', handlePageShow);
    window.removeEventListener('pagehide', handlePageHide);
  });
};
