import { describe, expect, it } from 'vitest';

import { type ContactPayload, validationError } from '../../worker/src/index';
import { buildContactPayload } from '../utils/buildContactPayload';
import { contactContent } from './contact';

const { form } = contactContent;
const { inquiryTypes } = form;

const filledFormData = (inquiry: (typeof inquiryTypes)[number]): Record<string, string> => ({
  [form.inquiry.id]: inquiry.id,
  [form.baseFields.name.id]: 'Jane Roe',
  [form.baseFields.email.id]: 'jane@example.com',
  [form.baseFields.message.id]: 'Hello, I would like to get in touch.',
  ...Object.fromEntries((inquiry.fields ?? []).map(field => [field.id, 'sample value'])),
});

describe('contact payload contract (frontend buildContactPayload ↔ worker validator)', () => {
  it('produces a worker-valid payload for every inquiry type via the real serializer', () => {
    for (const inquiry of inquiryTypes) {
      const payload: ContactPayload = buildContactPayload(
        form,
        filledFormData(inquiry),
        inquiry,
        'turnstile-token',
        '',
      );

      expect(validationError(payload), `inquiry "${inquiry.label}"`).toBeNull();
    }
  });

  it('still carries the special-character labels the shipped slug regex rejected', () => {
    const labels = inquiryTypes.map(inquiry => inquiry.label);

    expect(labels).toContain('Mixing & Mastering');
    expect(labels).toContain('Other');
  });
});
