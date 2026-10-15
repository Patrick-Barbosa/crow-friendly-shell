export type Media = {
  id: string;
  title: string;
  year: number;
  genre: string;
  duration: number;
  kind: 'movie' | 'series';
  synopsis: string;
  poster: string;
  backdrop?: string;
};

export type Viewer = { id: string; name: string; avatar: number };
export type ViewerState = { list: string[]; progress: Record<string, number>; autoplay: boolean; subtitles: string; audio: string };

export function emptyViewerState(): ViewerState {
  return { list: [], progress: {}, autoplay: true, subtitles: 'Off', audio: 'Original' };
}

export function toggleSaved(state: ViewerState, id: string): ViewerState {
  return { ...state, list: state.list.includes(id) ? state.list.filter(item => item !== id) : [...state.list, id] };
}

export function seekPosition(current: number, direction: number, duration: number): number {
  return Math.max(0, Math.min(duration, current + direction * 10));
}

export function filterLibrary(items: Media[], genre: string, year: string, sort: string, query = '') {
  const result = items.filter(item => (genre === 'All genres' || item.genre === genre) && (year === 'All years' || String(item.year) === year) && item.title.toLowerCase().includes(query.toLowerCase()));
  return sort === 'Title A–Z' ? result.sort((a, b) => a.title.localeCompare(b.title)) : result;
}

export function formatTime(seconds: number) {
  const value = Math.max(0, Math.floor(seconds));
  return `${Math.floor(value / 60)}:${String(value % 60).padStart(2, '0')}`;
}