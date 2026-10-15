import { createFileRoute } from '@tanstack/react-router';
import { LiveScreen } from '@/components/crow/settings';
import { pageHead } from '@/lib/crow-library';
export const Route = createFileRoute('/live')({ head: () => pageHead('Live TV', 'Choose a channel from your personal CROW television library.'), component: LiveScreen });