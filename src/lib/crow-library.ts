import dune from '@/assets/dune.asset.json';
import hero from '@/assets/dune-hero.asset.json';
import interstellar from '@/assets/interstellar.asset.json';
import arrival from '@/assets/arrival.asset.json';
import blade from '@/assets/blade.asset.json';
import batman from '@/assets/batman.asset.json';
import budapest from '@/assets/budapest.asset.json';
import severance from '@/assets/severance.asset.json';
import shogun from '@/assets/shogun.asset.json';
import bear from '@/assets/bear.asset.json';
import type { Media } from './crow-model';

export const library: Media[] = [
  { id: 'dune', title: 'Dune: Part Two', year: 2024, genre: 'Science fiction', duration: 166, kind: 'movie', poster: dune.url, backdrop: hero.url, synopsis: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family. Facing a choice between love and the fate of the universe, he must prevent a terrible future only he can foresee.' },
  { id: 'interstellar', title: 'Interstellar', year: 2014, genre: 'Science fiction', duration: 169, kind: 'movie', poster: interstellar.url, synopsis: 'A team of explorers travels beyond this galaxy to discover whether mankind has a future among the stars.' },
  { id: 'arrival', title: 'Arrival', year: 2016, genre: 'Science fiction', duration: 116, kind: 'movie', poster: arrival.url, synopsis: 'Linguist Louise Banks leads an investigation when mysterious spacecraft touch down across the globe.' },
  { id: 'blade', title: 'Blade Runner 2049', year: 2017, genre: 'Science fiction', duration: 164, kind: 'movie', poster: blade.url, synopsis: 'A new blade runner uncovers a long-buried secret that leads him on a quest to find Rick Deckard, missing for thirty years.' },
  { id: 'batman', title: 'The Batman', year: 2022, genre: 'Thriller', duration: 176, kind: 'movie', poster: batman.url, synopsis: 'When a killer targets Gotham’s elite, Batman must forge new relationships and bring justice to the abuse of power corrupting the city.' },
  { id: 'budapest', title: 'The Grand Budapest Hotel', year: 2014, genre: 'Comedy', duration: 100, kind: 'movie', poster: budapest.url, synopsis: 'The adventures of Gustave H, a legendary concierge, and Zero Moustafa, the lobby boy who becomes his most trusted friend.' },
  { id: 'severance', title: 'Severance', year: 2022, genre: 'Thriller', duration: 50, kind: 'series', poster: severance.url, synopsis: 'Mark leads a team of office workers whose memories have been surgically divided between their work and personal lives.' },
  { id: 'shogun', title: 'Shōgun', year: 2024, genre: 'Drama', duration: 60, kind: 'series', poster: shogun.url, synopsis: 'In Japan in the year 1600, Lord Yoshii Toranaga fights for his life as enemies on the Council of Regents unite against him.' },
  { id: 'bear', title: 'The Bear', year: 2022, genre: 'Drama', duration: 30, kind: 'series', poster: bear.url, synopsis: 'A young chef from the fine-dining world comes home to Chicago to run his family’s sandwich shop.' },
];

export const episodes = [
  { title: 'Good News About Hell', duration: 57, synopsis: 'Mark is promoted to lead a team of employees whose memories have been divided.' },
  { title: 'Half Loop', duration: 53, synopsis: 'The team welcomes a new colleague. Mark reconnects with a former coworker.' },
  { title: 'In Perpetuity', duration: 56, synopsis: 'Mark takes the team on a field trip, but Helly continues to resist.' },
  { title: 'The You You Are', duration: 46, synopsis: 'Irving finds a mysterious book. Mark struggles with his memories.' },
];

export const channels = [
  { id: 'arte', name: 'ARTE', label: 'Culture & documentary', program: 'A world of cinema', mark: 'arte' },
  { id: 'bbc', name: 'BBC News', label: 'World news', program: 'World News Today', mark: 'BBC' },
  { id: 'france', name: 'France 24', label: 'International news', program: 'The world this hour', mark: '24' },
];

export function pageHead(title: string, description: string) {
  return { meta: [{ title: `${title} — CROW` }, { name: 'description', content: description }, { property: 'og:title', content: `${title} — CROW` }, { property: 'og:description', content: description }, { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary_large_image' }] };
}