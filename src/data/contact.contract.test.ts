import { describe, expect, it } from 'vitest';

// The real worker validator, imported across the package boundary. This is the single
// seam that proves the payload the browser actually sends still passes worker-side
// validation. A worker tightening that rejected a live inquiry label — as one shipped
// bug did, validating the slug id instead of the human label and 400-ing every real
// submission — fails here rather than in production.
import { type ContactPayload, validationError } from '../../worker/src/index';
import { contactContent } from './contact';

const { inquiryTypes } = contactContent.form;

// Mirror useContactForm.buildPayload: inquiry carries the human label (e.g.
// "Mixing & Mastering"), and each field is { label, value }.
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

    // The regression validated inquiry against /^[a-z][a-z0-9-]*$/; these labels are
    // exactly the shapes that broke, so the contract above must keep exercising them.
    expect(labels).toContain('Mixing & Mastering');
    expect(labels).toContain('Other');
  });
});
