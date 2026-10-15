import { createFileRoute } from '@tanstack/react-router';
import { SettingsScreen } from '@/components/crow/settings';
import { pageHead } from '@/lib/crow-library';
export const Route = createFileRoute('/settings')({ head: () => pageHead('Profiles & Settings', 'Manage CROW viewers and personal playback, audio, and subtitle preferences.'), component: SettingsScreen });