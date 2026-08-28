import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import PlayableCover from './PlayableCover.vue';

const base = { src: '/images/x.jpg', alt: 'X cover', title: 'X', active: false, busy: false };

describe('PlayableCover', () => {
  it('shows a Play label and no spinner when idle', () => {
    const wrapper = mount(PlayableCover, { props: base });

    expect(wrapper.get('.release-cover__play').attributes('aria-label')).toBe('Play X');
    expect(wrapper.find('.release-cover__spinner').exists()).toBe(false);
  });

  it('shows a Pause label and the active modifier when active', () => {
    const wrapper = mount(PlayableCover, { props: { ...base, active: true } });

    expect(wrapper.get('.release-cover__play').attributes('aria-label')).toBe('Pause X');
    expect(wrapper.get('.release-cover--playable').classes()).toContain('is-active');
  });

  it('shows a spinner while busy', () => {
    const wrapper = mount(PlayableCover, { props: { ...base, active: true, busy: true } });

    expect(wrapper.find('.release-cover__spinner').exists()).toBe(true);
  });

  it('emits toggle when the button is clicked', async () => {
    const wrapper = mount(PlayableCover, { props: base });

    await wrapper.get('.release-cover__play').trigger('click');
    expect(wrapper.emitted('toggle')).toHaveLength(1);
  });

  it('bubbles a cover load error', async () => {
    const wrapper = mount(PlayableCover, { props: base });

    await wrapper.get('img').trigger('error');
    expect(wrapper.emitted('error')).toHaveLength(1);
  });
});
