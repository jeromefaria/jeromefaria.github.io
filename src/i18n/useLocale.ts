import { computed, type ComputedRef } from 'vue';
import { useRoute } from 'vue-router';

import { type Locale, localeFromMeta, localePath } from './messages';

interface UseLocale {
  current: ComputedRef<Locale>;
  other: ComputedRef<Locale>;
  toLocalePath: (path: string) => string;
  switchPath: ComputedRef<string>;
}

const stripPrefix = (path: string): string => (path.startsWith('/pt') ? path.slice(3) || '/' : path);

export const useLocale = (): UseLocale => {
  const route = useRoute();
  const current = computed(() => localeFromMeta(route.meta));
  const other = computed<Locale>(() => (current.value === 'en' ? 'pt' : 'en'));

  return {
    current,
    other,
    toLocalePath: path => localePath(path, current.value),
    switchPath: computed(() => localePath(stripPrefix(route.path), other.value)),
  };
};
