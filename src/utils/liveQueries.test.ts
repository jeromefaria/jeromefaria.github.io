import { describe, expect, it } from 'vitest';

import { eventsByFormat, eventsBySetup } from './liveQueries';

describe('eventsBySetup', () => {
  it('returns only events with the requested setup kind', () => {
    const solos = eventsBySetup('solo');

    expect(solos.length).toBeGreaterThan(0);
    expect(solos.every(event => event.setup.kind === 'solo')).toBe(true);
  });

  it('finds a known band-setup event', () => {
    expect(eventsBySetup('band').map(event => event.id)).toContain('reviralho');
  });
});

describe('eventsByFormat', () => {
  it('returns only events with the requested format kind', () => {
    const theatre = eventsByFormat('theatre');

    expect(theatre.length).toBeGreaterThan(0);
    expect(theatre.every(event => event.format?.kind === 'theatre')).toBe(true);
  });

  it('finds a known talk-format event', () => {
    expect(eventsByFormat('talk').map(event => event.id)).toContain('olhares-de-outono-2010');
  });

  it('excludes events that have no format', () => {
    expect(eventsByFormat('filmScore').every(event => event.format !== undefined)).toBe(true);
    expect(eventsByFormat('theatre').some(event => event.id === 'madeiradig-2005')).toBe(false);
  });
});
