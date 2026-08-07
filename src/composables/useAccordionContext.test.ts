import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { defineComponent, nextTick, type Ref, ref } from 'vue';

import { provideAccordionExpanded, useAccordionVisibility } from './useAccordionContext';

const Child = defineComponent({
  setup() {
    return { visible: useAccordionVisibility() };
  },
  template: '<div />',
});

const mountInAccordion = (expanded: Ref<boolean>) => {
  const wrapper = mount(defineComponent({
    components: { Child },
    setup() {
      provideAccordionExpanded(expanded);
      return {};
    },
    template: '<Child />',
  }));
  return wrapper.findComponent(Child);
};

describe('useAccordionVisibility', () => {
  it('defaults to visible when used outside an accordion', () => {
    const child = mount(Child);
    expect(child.vm.visible).toBe(true);
  });

  it('starts hidden for a collapsed section and reveals once expanded', async () => {
    const expanded = ref(false);
    const child = mountInAccordion(expanded);
    expect(child.vm.visible).toBe(false);

    expanded.value = true;
    await nextTick();
    expect(child.vm.visible).toBe(true);
  });

  it('stays visible after a revealed section is collapsed again (latch)', async () => {
    const expanded = ref(true);
    const child = mountInAccordion(expanded);
    expect(child.vm.visible).toBe(true);

    expanded.value = false;
    await nextTick();
    expect(child.vm.visible).toBe(true);
  });
});
