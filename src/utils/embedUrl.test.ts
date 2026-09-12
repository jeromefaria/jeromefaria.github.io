import { describe, expect, it } from 'vitest';

import { isAllowedEmbedUrl } from './embedUrl';

describe('isAllowedEmbedUrl', () => {
  it('allows the supported provider embed origins over https', () => {
    expect(isAllowedEmbedUrl('https://www.youtube-nocookie.com/embed/abc123')).toBe(true);
    expect(isAllowedEmbedUrl('https://www.youtube.com/embed/abc123')).toBe(true);
    expect(isAllowedEmbedUrl('https://player.vimeo.com/video/123')).toBe(true);
  });

  it('rejects unlisted origins', () => {
    expect(isAllowedEmbedUrl('https://player.example.com/v/1')).toBe(false);
    expect(isAllowedEmbedUrl('https://evil-youtube.com/embed/x')).toBe(false);
  });

  it('rejects a lookalike domain that only ends with the provider name', () => {
    expect(isAllowedEmbedUrl('https://notvimeo.com/video/1')).toBe(false);
    expect(isAllowedEmbedUrl('https://vimeo.com.attacker.test/video/1')).toBe(false);
  });

  it('rejects non-https schemes on an allowed host', () => {
    expect(isAllowedEmbedUrl('http://player.vimeo.com/video/123')).toBe(false);
  });

  it('rejects dangerous and malformed urls', () => {
    expect(isAllowedEmbedUrl('javascript:alert(1)')).toBe(false);
    expect(isAllowedEmbedUrl('data:text/html,<script>alert(1)</script>')).toBe(false);
    expect(isAllowedEmbedUrl('/relative/path')).toBe(false);
    expect(isAllowedEmbedUrl('not a url')).toBe(false);
  });
});
