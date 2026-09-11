import { describe, expect, it } from 'vitest';

import { findLiveEvent } from './liveEventPermalink';
import { createLiveEventSchema } from './liveSchema';

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
