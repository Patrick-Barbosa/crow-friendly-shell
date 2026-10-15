import { createFileRoute } from "@tanstack/react-router";
import { HomeScreen } from '@/components/crow/library-ui';
import { library, pageHead } from '@/lib/crow-library';
export const Route = createFileRoute("/")({
  head: () => {
    const head = pageHead('Your personal cinema', 'Browse your private CROW library, continue watching, and find your next movie or series.');
    const image = library[0]?.backdrop;
    return image ? { meta: [...head.meta, { property: 'og:image', content: image }, { name: 'twitter:image', content: image }] } : head;
  },
  component: HomeScreen,
});
