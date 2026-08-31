import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { defineComponent, reactive } from 'vue';

import { siteConfig } from '@/data/navigation';

import { usePageHead } from './usePageHead';

const headConfig: Record<string, unknown>[] = [];

vi.mock('@unhead/vue', () => ({
  useHead: vi.fn((config: Record<string, unknown>) => {
    headConfig.push(config);
  }),
}));

const mockRoute = reactive({ path: '/test' });

vi.mock('vue-router', () => ({
  useRoute: () => mockRoute,
}));

function mountWithPageHead(options: Parameters<typeof usePageHead>[0]) {
  headConfig.length = 0;

  const TestComponent = defineComponent({
    setup() {
      usePageHead(options);
      return {};
    },
    template: '<div />',
  });

  mount(TestComponent);
  return headConfig[0] as Record<string, unknown>;
}

type MetaTag = { name?: string; property?: string; content: string };

function getMeta(config: Record<string, unknown>, key: string): MetaTag | undefined {
  return (config.meta as MetaTag[]).find(
    m => m.name === key || m.property === key,
  );
}

describe('usePageHead', () => {
  beforeEach(() => {
    headConfig.length = 0;
    mockRoute.path = '/test';
    vi.unstubAllEnvs();
  });

  describe('title', () => {
    it('appends site title to page title', () => {
      const config = mountWithPageHead({ title: 'Works', description: 'desc' });
      expect(config.title).toBe(`Works - ${siteConfig.title}`);
    });

    it('does not duplicate site title if already included', () => {
      const config = mountWithPageHead({ title: siteConfig.title, description: 'desc' });
      expect(config.title).toBe(siteConfig.title);
      expect((config.title as string).split(siteConfig.title).length - 1).toBe(1);
    });
  });

  describe('meta tags', () => {
    it('sets description meta', () => {
      const config = mountWithPageHead({ title: 'About', description: 'My description' });
      expect(getMeta(config, 'description')?.content).toBe('My description');
    });

    it('sets og:title', () => {
      const config = mountWithPageHead({ title: 'About', description: 'desc' });
      expect(getMeta(config, 'og:title')?.content).toBe(`About - ${siteConfig.title}`);
    });

    it('sets og:description', () => {
      const config = mountWithPageHead({ title: 'About', description: 'My description' });
      expect(getMeta(config, 'og:description')?.content).toBe('My description');
    });

    it('defaults og:type to website', () => {
      const config = mountWithPageHead({ title: 'About', description: 'desc' });
      expect(getMeta(config, 'og:type')?.content).toBe('website');
    });

    it('uses provided ogType', () => {
      const config = mountWithPageHead({ title: 'About', description: 'desc', ogType: 'article' });
      expect(getMeta(config, 'og:type')?.content).toBe('article');
    });

    it('sets og:url using route path and siteConfig.url', () => {
      mockRoute.path = '/works';
      const config = mountWithPageHead({ title: 'Works', description: 'desc' });
      expect(getMeta(config, 'og:url')?.content).toBe(`${siteConfig.url}/works`);
    });

    it('sets og:site_name', () => {
      const config = mountWithPageHead({ title: 'About', description: 'desc' });
      expect(getMeta(config, 'og:site_name')?.content).toBe(siteConfig.title);
    });

    it('sets twitter:card to summary_large_image', () => {
      const config = mountWithPageHead({ title: 'About', description: 'desc' });
      expect(getMeta(config, 'twitter:card')?.content).toBe('summary_large_image');
    });

    it('sets twitter:title and twitter:description', () => {
      const config = mountWithPageHead({ title: 'About', description: 'My description' });
      expect(getMeta(config, 'twitter:title')?.content).toBe(`About - ${siteConfig.title}`);
      expect(getMeta(config, 'twitter:description')?.content).toBe('My description');
    });
  });

  describe('canonical link', () => {
    it('sets canonical href using route path', () => {
      mockRoute.path = '/press';
      const config = mountWithPageHead({ title: 'Press', description: 'desc' });
      const links = config.link as Array<{ rel: string; href: string }>;
      const canonical = links.find(l => l.rel === 'canonical');
      expect(canonical?.href).toBe(`${siteConfig.url}/press`);
    });
  });

  describe('hreflang alternates', () => {
    type AltLink = { rel: string; hreflang?: string; href: string };

    const alternates = (config: Record<string, unknown>): AltLink[] =>
      (config.link as AltLink[]).filter(link => link.rel === 'alternate');

    it('omits alternates when i18n is disabled', () => {
      const config = mountWithPageHead({ title: 'Works', description: 'desc' });
      expect(alternates(config)).toHaveLength(0);
    });

    it('emits en, pt and x-default alternates for an en route when i18n is enabled', () => {
      vi.stubEnv('VITE_I18N', 'true');
      mockRoute.path = '/works';

      const config = mountWithPageHead({ title: 'Works', description: 'desc' });

      expect(alternates(config)).toEqual([
        { rel: 'alternate', hreflang: 'en', href: `${siteConfig.url}/works` },
        { rel: 'alternate', hreflang: 'pt', href: `${siteConfig.url}/pt/works` },
        { rel: 'alternate', hreflang: 'x-default', href: `${siteConfig.url}/works` },
      ]);

      vi.unstubAllEnvs();
    });

    it('derives the same cluster from a pt route by stripping the prefix', () => {
      vi.stubEnv('VITE_I18N', 'true');
      mockRoute.path = '/pt/works';

      const config = mountWithPageHead({ title: 'Works', description: 'desc' });

      expect(alternates(config)).toEqual([
        { rel: 'alternate', hreflang: 'en', href: `${siteConfig.url}/works` },
        { rel: 'alternate', hreflang: 'pt', href: `${siteConfig.url}/pt/works` },
        { rel: 'alternate', hreflang: 'x-default', href: `${siteConfig.url}/works` },
      ]);

      vi.unstubAllEnvs();
    });

    it('omits alternates for noindex pages even when i18n is enabled', () => {
      vi.stubEnv('VITE_I18N', 'true');

      const config = mountWithPageHead({ title: 'Press Kit', description: 'desc', noIndex: true });
      expect(alternates(config)).toHaveLength(0);

      vi.unstubAllEnvs();
    });
  });

  describe('social image', () => {
    it('always includes og:image and twitter:image from the site config', () => {
      const config = mountWithPageHead({ title: 'About', description: 'desc' });
      const expectedImage = `${siteConfig.url}${siteConfig.image}`;
      expect(getMeta(config, 'og:image')?.content).toBe(expectedImage);
      expect(getMeta(config, 'twitter:image')?.content).toBe(expectedImage);
    });
  });

  describe('noIndex option', () => {
    it('does not include robots meta by default', () => {
      const config = mountWithPageHead({ title: 'About', description: 'desc' });
      expect(getMeta(config, 'robots')).toBeUndefined();
    });

    it('adds robots noindex when noIndex is true', () => {
      const config = mountWithPageHead({ title: 'About', description: 'desc', noIndex: true });
      expect(getMeta(config, 'robots')?.content).toBe('noindex');
    });
  });

  describe('schema option', () => {
    it('does not include script tag by default', () => {
      const config = mountWithPageHead({ title: 'About', description: 'desc' });
      expect(config.script).toBeUndefined();
    });

    it('adds JSON-LD script tag when schema is provided', () => {
      const schema = { '@context': 'https://schema.org', '@type': 'Person', name: 'Jerome Faria' };
      const config = mountWithPageHead({ title: 'About', description: 'desc', schema });
      const scripts = config.script as Array<{ type: string; innerHTML: string }>;
      expect(scripts).toHaveLength(1);
      expect(scripts[0].type).toBe('application/ld+json');
      expect(JSON.parse(scripts[0].innerHTML)).toEqual(schema);
    });

    it('does not add script tag when schema is null', () => {
      const config = mountWithPageHead({ title: 'About', description: 'desc', schema: null });
      expect(config.script).toBeUndefined();
    });
  });
});
