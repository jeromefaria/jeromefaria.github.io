import { describe, expect, it } from 'vitest';

import { contactContent } from '@/data/contact';

import { buildContactPayload } from './buildContactPayload';

describe('buildContactPayload', () => {
  it('falls back to empty inquiry and no adaptive fields when no type is selected', () => {
    const payload = buildContactPayload(contactContent.form, {}, null, 'tok', '');

    expect(payload.inquiry).toBe('');
    expect(payload.fields).toEqual([]);
    expect(payload.name).toBe('');
    expect(payload.token).toBe('tok');
  });
});
