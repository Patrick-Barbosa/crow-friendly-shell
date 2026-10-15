import { createFileRoute } from '@tanstack/react-router';
import { MyListScreen } from '@/components/crow/library-ui';
import { pageHead } from '@/lib/crow-library';
export const Route = createFileRoute('/my-list')({ head: () => pageHead('My List', 'Your personal collection of movies and series saved for another evening.'), component: MyListScreen });