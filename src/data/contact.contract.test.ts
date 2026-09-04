import { describe, expect, it } from 'vitest';

import { type ContactPayload, validationError } from '../../worker/src/index';
import { contactContent } from './contact';

const { inquiryTypes } = contactContent.form;

const payloadFor = (inquiry: (typeof inquiryTypes)[number]): ContactPayload => ({
  token: 'turnstile-token',
  inquiry: inquiry.label,
  name: 'Jane Roe',
  email: 'jane@example.com',
  message: 'Hello, I would like to get in touch.',
  fields: (inquiry.fields ?? []).map(field => ({ label: field.label, value: 'sample value' })),
});

describe('contact payload contract (frontend buildPayload ↔ worker validator)', () => {
  it('accepts a payload for every inquiry type exactly as the form sends it', () => {
    for (const inquiry of inquiryTypes) {
      expect(validationError(payloadFor(inquiry)), `inquiry "${inquiry.label}"`).toBeNull();
    }
  });

  it('still carries the special-character labels the shipped slug regex rejected', () => {
    const labels = inquiryTypes.map(inquiry => inquiry.label);

    expect(labels).toContain('Mixing & Mastering');
    expect(labels).toContain('Other');
  });
});
