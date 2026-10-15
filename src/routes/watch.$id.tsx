import { createFileRoute } from '@tanstack/react-router';
import { PlayerScreen } from '@/components/crow/player';
import { library, pageHead } from '@/lib/crow-library';
export const Route = createFileRoute('/watch/$id')({
  validateSearch: (search: Record<string, unknown>): { episode?: number } => ({ episode: typeof search.episode === 'number' ? search.episode : undefined }),
  head: ({ params }) => { const item = library.find(media => media.id === params.id); const head = pageHead(`Watching ${item?.title ?? 'Live TV'}`, 'CROW playback preview with remote controls for your personal cinema.'); return item?.backdrop ? { meta: [...head.meta, { property: 'og:image', content: item.backdrop }, { name: 'twitter:image', content: item.backdrop }] } : head; },
  component: Watch,
});
function Watch() { const { id } = Route.useParams(); const { episode } = Route.useSearch(); return <PlayerScreen key={id} id={id} episode={episode} />; }