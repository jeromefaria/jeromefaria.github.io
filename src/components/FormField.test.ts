import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import FormField from './FormField.vue';

const mountField = (props: Record<string, unknown>, slots = {}) =>
  mount(FormField, { props: { id: 'name', label: 'Name', modelValue: '', ...props }, slots });

describe('FormField', () => {
  it('renders a labelled text input by default, named and id-matched', () => {
    const field = mountField({});
    const input = field.get('input');

    expect(input.attributes('id')).toBe('name');
    expect(input.attributes('name')).toBe('name');
    expect(input.attributes('type')).toBe('text');
    expect(field.get('label').attributes('for')).toBe('name');
    expect(field.get('label').text()).toContain('Name');
  });

  it('renders a textarea when type is "textarea"', () => {
    const field = mountField({ id: 'message', label: 'Message', type: 'textarea', rows: 8 });

    expect(field.find('textarea').exists()).toBe(true);
    expect(field.find('input').exists()).toBe(false);
    expect(field.get('textarea').attributes('rows')).toBe('8');
  });

  it('shows a required marker only when required', () => {
    expect(mountField({ required: true }).find('abbr').exists()).toBe(true);
    expect(mountField({ required: false }).find('abbr').exists()).toBe(false);
  });

  it('exposes an announced error and aria wiring when invalid', () => {
    const field = mountField({ invalid: true, error: 'Name is required' });

    expect(field.get('input').attributes('aria-invalid')).toBe('true');
    expect(field.get('input').attributes('aria-describedby')).toBe('name-error');
    const error = field.get('#name-error');
    expect(error.attributes('role')).toBe('alert');
    expect(error.text()).toBe('Name is required');
  });

  it('omits aria-invalid entirely for an unvalidated field (invalid undefined)', () => {
    const field = mountField({});

    expect(field.get('input').attributes('aria-invalid')).toBeUndefined();
    expect(field.find('.contact-form__error').exists()).toBe(false);
  });

  it('emits update:modelValue and input on input, and blur on blur', async () => {
    const field = mountField({});
    const input = field.get('input');

    await input.setValue('Ada');
    expect(field.emitted('update:modelValue')?.[0]).toEqual(['Ada']);
    expect(field.emitted('input')).toHaveLength(1);

    await input.trigger('blur');
    expect(field.emitted('blur')).toHaveLength(1);
  });

  it('renders slotted content (e.g. a hidden reply-to input)', () => {
    const field = mountField({}, { default: '<input type="hidden" name="_replyto">' });
    expect(field.find('input[name="_replyto"]').exists()).toBe(true);
  });
});
