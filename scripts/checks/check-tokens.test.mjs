import { describe, expect, it } from 'vitest';

import { AA_NORMAL_RATIO, blockOf, compare, contrastIssues, scssColors } from './check-tokens.mjs';

const SCSS = `:root {
  --color-bg: #fff;
  --color-text: #1a1a1a;
}
[data-theme="dark"] {
  --color-bg: #000;
  --color-text: #fafafa;
}`;

describe('blockOf', () => {
  it('returns the declaration block for a selector', () => {
    const block = blockOf(SCSS, ':root');

    expect(block).toContain('--color-bg: #fff;');
    expect(block).toContain('--color-text: #1a1a1a;');
    expect(block).not.toContain('#000');
  });

  it('returns an empty string for a selector that is absent', () => {
    expect(blockOf(SCSS, '.nope')).toBe('');
  });
});

describe('scssColors', () => {
  it('reads each known custom property, leaving the absent ones null', () => {
    const colors = scssColors(blockOf(SCSS, ':root'));

    expect(colors.bg).toBe('#fff');
    expect(colors.text).toBe('#1a1a1a');
    expect(colors.link).toBeNull();
  });
});

describe('compare', () => {
  it('passes when the tokens match _base.scss', () => {
    expect(compare(SCSS, 'light', ':root', { bg: '#fff', text: '#1a1a1a' })).toEqual([]);
  });

  it('reports a value that has drifted from the stylesheet', () => {
    expect(compare(SCSS, 'light', ':root', { text: '#000' })).toEqual(['  light.text: tokens.ts=#000, _base.scss=#1a1a1a']);
  });

  it('reports a token that is missing from the stylesheet', () => {
    expect(compare(SCSS, 'light', ':root', { link: '#06c' })).toEqual(['  light.link: missing from _base.scss (:root)']);
  });
});

describe('contrastIssues', () => {
  const passing = { text: '#000', secondary: '#000', muted: '#000', link: '#000', linkHover: '#000', error: '#000', bg: '#fff' };

  it('passes when every text colour clears AA against the background', () => {
    expect(contrastIssues('light', passing)).toEqual([]);
  });

  it('flags a text colour that falls below the AA ratio', () => {
    const issues = contrastIssues('light', { ...passing, error: '#eee' });

    expect(issues).toHaveLength(1);
    expect(issues[0]).toContain('light.error (#eee on #fff)');
    expect(issues[0]).toContain(`needs ≥ ${AA_NORMAL_RATIO}:1`);
  });
});
