import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import TransportControls from './TransportControls.vue';

const props = {
  playing: false,
  hasPrevious: true,
  hasNext: true,
  currentTime: 0,
};

describe('TransportControls', () => {
  it('renders previous, primary, and next controls', () => {
    const wrapper = mount(TransportControls, { props });
    const buttons = wrapper.findAll('.transport-controls__button');

    expect(buttons).toHaveLength(3);
    expect(buttons[0].attributes('aria-label')).toBe('Previous track');
    expect(buttons[1].attributes('aria-label')).toBe('Play');
    expect(buttons[2].attributes('aria-label')).toBe('Next track');
  });

  it('labels the primary control Pause while playing', () => {
    const wrapper = mount(TransportControls, { props: { ...props, playing: true } });
    expect(wrapper.findAll('.transport-controls__button')[1].attributes('aria-label')).toBe('Pause');
  });

  it('shows only the spinner while busy', () => {
    const wrapper = mount(TransportControls, { props: { ...props, busy: true } });
    expect(wrapper.find('.transport-controls__spinner').exists()).toBe(true);
    expect(wrapper.findAll('.transport-controls__button')[1].findAll('path')).toHaveLength(0);
  });

  it('marks the primary control busy for assistive tech while buffering', () => {
    const idle = mount(TransportControls, { props });
    expect(idle.findAll('.transport-controls__button')[1].attributes('aria-busy')).toBe('false');

    const busy = mount(TransportControls, { props: { ...props, busy: true } });
    expect(busy.findAll('.transport-controls__button')[1].attributes('aria-busy')).toBe('true');
  });

  it('disables previous only at the queue head within the first three seconds', () => {
    const head = mount(TransportControls, { props: { ...props, hasPrevious: false, currentTime: 0 } });
    expect(head.findAll('.transport-controls__button')[0].attributes('disabled')).toBeDefined();

    const restart = mount(TransportControls, { props: { ...props, hasPrevious: false, currentTime: 5 } });
    expect(restart.findAll('.transport-controls__button')[0].attributes('disabled')).toBeUndefined();
  });

  it('disables next at the queue tail', () => {
    const wrapper = mount(TransportControls, { props: { ...props, hasNext: false } });
    expect(wrapper.findAll('.transport-controls__button')[2].attributes('disabled')).toBeDefined();
  });

  it('emits previous, toggle, and next on click', async () => {
    const wrapper = mount(TransportControls, { props });
    const buttons = wrapper.findAll('.transport-controls__button');

    await buttons[0].trigger('click');
    await buttons[1].trigger('click');
    await buttons[2].trigger('click');

    expect(wrapper.emitted('previous')).toHaveLength(1);
    expect(wrapper.emitted('toggle')).toHaveLength(1);
    expect(wrapper.emitted('next')).toHaveLength(1);
  });
});
