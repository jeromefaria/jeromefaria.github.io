import type { Ref } from 'vue';
import { onMounted, ref } from 'vue';

export type NewsletterActionMode = 'confirm' | 'unsubscribe';
export type NewsletterActionState = 'idle' | 'pending' | 'done' | 'invalid';

interface UseNewsletterActionReturn {
  state: Ref<NewsletterActionState>;
  submit: () => Promise<void>;
}

export const useNewsletterAction = (
  mode: NewsletterActionMode,
  token: string,
  endpoint: string,
): UseNewsletterActionReturn => {
  const state = ref<NewsletterActionState>(mode === 'confirm' ? 'pending' : 'idle');

  const submit = async (): Promise<void> => {
    state.value = 'pending';

    try {
      const response = await fetch(`${endpoint}?token=${encodeURIComponent(token)}`, { method: 'POST' });
      const body = (await response.json().catch(() => ({ ok: response.ok }))) as { ok?: boolean };
      state.value = response.ok && body.ok !== false ? 'done' : 'invalid';
    } catch {
      state.value = 'invalid';
    }
  };

  onMounted(() => {
    if (mode === 'confirm') void submit();
  });

  return { state, submit };
};
