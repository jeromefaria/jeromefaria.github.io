import { onBeforeUnmount, onMounted, type Ref } from 'vue';

const FOOTER_HEIGHT_PROPERTY = '--footer-height';

export const useFooterHeight = (element: Ref<HTMLElement | undefined>): void => {
  let observer: ResizeObserver | undefined;

  const publish = (target: HTMLElement): void => {
    document.documentElement.style.setProperty(FOOTER_HEIGHT_PROPERTY, `${target.getBoundingClientRect().height}px`);
  };

  onMounted(() => {
    const target = element.value;
    if (!target || typeof ResizeObserver === 'undefined') return;

    observer = new ResizeObserver(() => publish(target));
    observer.observe(target);
  });

  onBeforeUnmount(() => observer?.disconnect());
};
