<script lang="ts">
import { defineComponent, h, type PropType, type VNode } from 'vue';

import { useLocale } from '@/i18n/useLocale';
import type { MetaLink, ReleaseMeta } from '@/types/works';
import { buildMetaSegments } from '@/utils/metaSegments';

const renderLink = (link: MetaLink): VNode | string =>
  link.url
    ? h('a', { href: link.url, target: '_blank', rel: 'noopener noreferrer' }, link.text)
    : link.text;

export default defineComponent({
  name: 'ReleaseMeta',
  props: {
    meta: { type: Object as PropType<ReleaseMeta>, required: true },
  },
  setup(props) {
    const { current } = useLocale();

    return () =>
      buildMetaSegments(props.meta, current.value).map(segment => {
        if (segment.kind === 'text') {
          return segment.text;
        }

        if (segment.kind === 'em') {
          return h('em', [renderLink(segment.link)]);
        }

        return renderLink(segment.link);
      });
  },
});
</script>
