import { onMounted, onUnmounted } from 'vue';

export const useWindowKeydown = (handler: (event: KeyboardEvent) => void): void => {
  onMounted(() => window.addEventListener('keydown', handler));
  onUnmounted(() => window.removeEventListener('keydown', handler));
};
