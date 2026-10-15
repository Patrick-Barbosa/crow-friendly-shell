import { createFileRoute } from '@tanstack/react-router';
import { DetailScreen } from '@/components/crow/detail';
import { library, pageHead } from '@/lib/crow-library';
export const Route = createFileRoute('/details/$id')({
  head: ({ params }) => { const item = library.find(media => media.id === params.id); const head = pageHead(item?.title ?? 'Title unavailable', item?.synopsis ?? 'This title is not currently available in your CROW library.'); return item?.backdrop ? { meta: [...head.meta, { property: 'og:image', content: item.backdrop }, { name: 'twitter:image', content: item.backdrop }] } : head; },
  component: Detail,
});
function Detail() { const { id } = Route.useParams(); return <DetailScreen id={id} />; }