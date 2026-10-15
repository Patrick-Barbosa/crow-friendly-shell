import { createFileRoute } from '@tanstack/react-router';
import { SearchScreen } from '@/components/crow/library-ui';
import { pageHead } from '@/lib/crow-library';
export const Route = createFileRoute('/search')({ head: () => pageHead('Search', 'Find movies and series in your CROW library with remote-friendly search.'), component: SearchScreen });