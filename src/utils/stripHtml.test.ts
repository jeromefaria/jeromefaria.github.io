import { describe, expect, it } from 'vitest';

import { stripHtml } from './stripHtml';

describe('stripHtml', () => {
  it('removes tags and collapses whitespace', () => {
    expect(stripHtml('A <a href="#">linked</a>  note.')).toBe('A linked note.');
  });

  it('does not inject a space where a tag abutted text, matching rendered output', () => {
    expect(stripHtml('<a href="#">Robert Wiene</a>\'s 1920 film')).toBe("Robert Wiene's 1920 film");
    expect(stripHtml('recalls <em>Discreet Music</em>, with static')).toBe('recalls Discreet Music, with static');
  });

  it('strips nested and malformed tags, terminating on the stripped text', () => {
    expect(stripHtml('<img src=x onerror=alert(1)>')).toBe('');
    expect(stripHtml('one <a href="#"><em>two</em></a> three')).toBe('one two three');
  });

  it('returns an empty string for undefined input', () => {
    expect(stripHtml()).toBe('');
  });
});
