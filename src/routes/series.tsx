import { createFileRoute } from '@tanstack/react-router';
import { LibraryScreen } from '@/components/crow/library-ui';
import { pageHead } from '@/lib/crow-library';
export const Route = createFileRoute('/series')({ head: () => pageHead('Series', 'Browse your CROW series collection, discover episodes, and pick up where you left off.'), component: Series });
function Series() { return <LibraryScreen kind="series" />; }