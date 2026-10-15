import { createFileRoute } from '@tanstack/react-router';
import { LibraryScreen } from '@/components/crow/library-ui';
import { pageHead } from '@/lib/crow-library';
export const Route = createFileRoute('/movies')({ head: () => pageHead('Movies', 'Explore the movies in your private CROW library by genre, year, or title.'), component: Movies });
function Movies() { return <LibraryScreen kind="movie" />; }