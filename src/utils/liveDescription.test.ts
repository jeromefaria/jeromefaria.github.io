import { describe, expect, it } from 'vitest';

import { liveEvents } from '@/data/live';
import { orgs } from '@/data/orgs';
import type { LiveEvent } from '@/types/live';

import { buildEventDescription } from './liveDescription';

describe('buildEventDescription presentedBy', () => {
  it('resolves every presentedBy key to a registered org', () => {
    for (const event of liveEvents) {
      for (const key of event.presentedBy ?? []) {
        expect(orgs[key], `event "${event.id}" key "${key}"`).toBeDefined();
      }
    }
  });

  it('skips an unknown presenter key while keeping the resolvable ones', () => {
    const event: LiveEvent = {
      id: 'synthetic',
      title: 'Some Event',
      date: '2020-01-01',
      venue: { country: 'Portugal' },
      setup: { kind: 'solo' },
      presentedBy: ['no-such-org', 'apca'],
    };

    expect(buildEventDescription(event, 'en')).toBe('Solo performance. Presented by <a href="https://www.apca-madeira.org/">APCA</a>.');
  });
});
