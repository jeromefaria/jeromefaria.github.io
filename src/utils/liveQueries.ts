import { liveEvents } from '@/data/live';
import type { Format, LiveEvent, Setup } from '@/types/live';

export const eventsBySetup = (kind: Setup['kind']): LiveEvent[] =>
  liveEvents.filter(event => event.setup.kind === kind);

export const eventsByFormat = (kind: Format['kind']): LiveEvent[] =>
  liveEvents.filter(event => event.format?.kind === kind);
