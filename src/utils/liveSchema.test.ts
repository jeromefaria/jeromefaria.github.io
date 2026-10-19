import { describe, expect, it } from 'vitest';

import { siteConfig } from '@/data/navigation';
import { localize } from '@/i18n/localized';

import { findLiveEvent } from './liveEventPermalink';
import { createLiveEventBreadcrumbSchema, createLiveEventSchema } from './liveSchema';

describe('createLiveEventSchema', () => {
  it('wraps a single event as a standalone MusicEvent with @context and mainEntityOfPage', () => {
    const event = findLiveEvent('showcase-casa-amarela');
    expect(event).not.toBeNull();
    if (!event) return;

    const canonicalUrl = 'https://jeromefaria.com/live/showcase-casa-amarela';
    const schema = createLiveEventSchema(event, 'en', canonicalUrl);

    expect(schema['@context']).toBe('https://schema.org');
    expect(schema['@type']).toBe('MusicEvent');
    expect(schema.mainEntityOfPage).toBe(canonicalUrl);
    expect(schema.startDate).toBe(event.date);
  });
});

describe('createLiveEventBreadcrumbSchema', () => {
  it('builds a Home → Live → event trail with the localized event title', () => {
    const event = findLiveEvent('showcase-casa-amarela');
    expect(event).not.toBeNull();
    if (!event) return;

    const canonicalUrl = 'https://jeromefaria.com/live/showcase-casa-amarela';
    const schema = createLiveEventBreadcrumbSchema(event, 'en', canonicalUrl);
    const names = schema.itemListElement.map(element => element.name);
    const items = schema.itemListElement.map(element => element.item);

    expect(names).toEqual([siteConfig.title, 'Live', localize(event.title, 'en')]);
    expect(items).toEqual([siteConfig.url, `${siteConfig.url}/live`, canonicalUrl]);
  });

  it('localizes the Live label in Portuguese', () => {
    const event = findLiveEvent('showcase-casa-amarela');
    if (!event) return;

    const schema = createLiveEventBreadcrumbSchema(event, 'pt', 'https://jeromefaria.com/pt/live/showcase-casa-amarela');
    expect(schema.itemListElement[1]?.name).toBe('Concertos');
  });
});
