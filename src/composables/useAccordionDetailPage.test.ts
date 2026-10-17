import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { defineComponent, reactive } from 'vue';

import { siteConfig } from '@/data/navigation';

import { useAccordionDetailPage } from './useAccordionDetailPage';

const mockRoute = reactive<{ params: Record<string, string>; path: string }>({ params: {}, path: '/works' });

vi.mock('vue-router', () => ({ useRoute: () => mockRoute }));

interface Entity {
  id: string;
}

const ENTITIES: Record<string, Entity> = { alpha: { id: 'alpha' } };

type PageVm = {
  focusId: string;
  focusEntity: Entity | null | undefined;
  notFound: boolean;
  head: { title: string; description: string; schema?: { canonicalUrl: string } };
};

const mountPage = () => {
  const detailHead = vi.fn((entity: Entity, canonicalUrl: string) => ({
    title: `detail:${entity.id}`,
    description: 'detail',
    schema: { canonicalUrl },
  }));
  const listHead = vi.fn(() => ({ title: 'list', description: 'list' }));

  const wrapper = mount(
    defineComponent({
      setup: () => ({
        ...useAccordionDetailPage<Entity>({
          paramName: 'id',
          find: id => ENTITIES[id] ?? null,
          detailHead,
          listHead,
        }),
      }),
      template: '<div></div>',
    }),
  );

  return { vm: wrapper.vm as unknown as PageVm, detailHead, listHead };
};

describe('useAccordionDetailPage', () => {
  beforeEach(() => {
    mockRoute.params = {};
    mockRoute.path = '/works';
  });

  it('returns the list head with no focus when the route carries no id', () => {
    const { vm, detailHead, listHead } = mountPage();

    expect(vm.focusId).toBe('');
    expect(vm.notFound).toBe(false);
    expect(vm.head.title).toBe('list');
    expect(listHead).toHaveBeenCalled();
    expect(detailHead).not.toHaveBeenCalled();
  });

  it('resolves the focus entity and builds the detail head with a canonical url', () => {
    mockRoute.params = { id: 'alpha' };
    mockRoute.path = '/works/alpha';

    const { vm, detailHead } = mountPage();

    expect(vm.focusId).toBe('alpha');
    expect(vm.focusEntity).toEqual({ id: 'alpha' });
    expect(vm.notFound).toBe(false);
    expect(vm.head.title).toBe('detail:alpha');
    expect(detailHead).toHaveBeenCalledWith({ id: 'alpha' }, `${siteConfig.url}/works/alpha`);
  });

  it('flags notFound and falls back to the list head when the id matches nothing', () => {
    mockRoute.params = { id: 'ghost' };
    mockRoute.path = '/works/ghost';

    const { vm } = mountPage();

    expect(vm.focusId).toBe('ghost');
    expect(vm.notFound).toBe(true);
    expect(vm.head.title).toBe('list');
  });
});
