import { localize, type Localized } from '@/i18n/localized';
import { localizeInternalLinks } from '@/i18n/messages';
import { useLocale } from '@/i18n/useLocale';
import { externalizeLinks } from '@/utils/externalizeLinks';

export const useProse = (): ((body: Localized<string>) => string) => {
  const { current } = useLocale();
  return body => externalizeLinks(localizeInternalLinks(localize(body, current.value), current.value));
};
