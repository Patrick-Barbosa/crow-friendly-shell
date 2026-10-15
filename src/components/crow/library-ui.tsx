import { Link } from '@tanstack/react-router';
import { ArrowRight, Bookmark, Play, Info, RotateCcw, Search } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { library } from '@/lib/crow-library';
import { filterLibrary, type Media } from '@/lib/crow-model';
import { useCrow } from './provider';
import { Avatar, Brand } from './brand';

export function Metadata({ item }: { item: Media }) {
  return <div className="media-metadata"><span>{item.year}</span><i className="metadata-dot" /><span>{item.kind === 'series' ? 'Series' : `${Math.floor(item.duration / 60)}h ${item.duration % 60}m`}</span><i className="metadata-dot" /><span>{item.genre}</span></div>;
}

export function Progress({ value, max, className = '' }: { value: number; max: number; className?: string }) {
  return <div className={`progress-track ${className}`}><progress value={value} max={max} aria-label="Playback progress" /></div>;
}

export function ContentCard({ item, landscape = false, prefix = 'card' }: { item: Media; landscape?: boolean; prefix?: string }) {
  const crow = useCrow();
  const progress = crow.state.progress[item.id] ?? 0;
  const remote = `${prefix}-${item.id}`;
  return <Button variant="ghost" asChild className={`content-card ${landscape ? 'landscape-card' : ''}`}><Link to="/details/$id" params={{ id: item.id }} data-remote={remote} aria-label={`${landscape ? 'Continue ' : ''}${item.title}`} onClick={() => crow.remember(remote)}>
    <div className="card-art"><img src={landscape && item.backdrop ? item.backdrop : item.poster} alt={item.title} loading="lazy" />{landscape && <><span className="continue-title">{item.title}</span><Progress value={progress} max={item.duration * 60} /></>}</div>
    <span className="card-title">{landscape && item.kind === 'series' ? 'S1 · E1 — Good News About Hell' : item.title}</span><span className="card-subtitle">{landscape ? `${Math.max(0, item.duration - Math.floor(progress / 60))} min remaining` : `${item.year} · ${item.kind === 'movie' ? 'Movie' : 'Series'}`}</span>
  </Link></Button>;
}

export function Header({ title, description }: { title: string; description?: string }) {
  const crow = useCrow();
  return <header className="page-header"><div><h1>{title}</h1>{description && <p>{description}</p>}</div>{crow.active && <div className="header-profile"><span>{crow.active.name}'s library</span><Avatar variant={crow.active.avatar} /></div>}</header>;
}

export function Row({ title, items, landscape, prefix, seeAll }: { title: string; items: Media[]; landscape?: boolean; prefix: string; seeAll?: '/movies' | '/series' | '/my-list' }) {
  if (!items.length) return null;
  return <section className="content-row"><div className="section-heading"><h2>{title}<span className="row-count">{items.length}</span></h2>{seeAll && <Button variant="ghost" className="section-link" asChild><Link to={seeAll} data-remote={`all-${prefix}`}>View all <ArrowRight /></Link></Button>}</div><div className="horizontal-row">{items.map(item => <ContentCard key={item.id} item={item} landscape={landscape} prefix={prefix} />)}</div></section>;
}

export function HomeScreen() {
  const crow = useCrow();
  const item = library[0];
  if (!item) return null;
  const continuing = library.filter(media => (crow.state.progress[media.id] ?? 0) > 0 && (crow.state.progress[media.id] ?? 0) < media.duration * 60);
  return <main>
    <div className="topbar"><Brand /><div className="topbar-right"><span className="library-status"><i />Local library</span><div className="topbar-profile"><span>{crow.active?.name}</span><Avatar variant={crow.active?.avatar} /></div></div></div>
    <section className="hero"><img className="hero-art" src={item.backdrop} alt="Paul Atreides and Chani in the desert of Arrakis" /><div className="hero-copy"><div className="featured-label"><FilmMark /> FROM YOUR LIBRARY</div><h1 className="hero-title">Dune: Part Two</h1><Metadata item={item} /><p className="hero-synopsis">{item.synopsis}</p><div className="hero-actions"><Button asChild className="crow-action"><Link to="/watch/$id" params={{ id: item.id }} data-remote="hero-play" data-initial-focus onClick={() => crow.remember('hero-play')}><Play fill="currentColor" /> Play movie</Link></Button><Button variant="secondary" className="crow-action" asChild><Link to="/details/$id" params={{ id: item.id }} data-remote="hero-details" onClick={() => crow.remember('hero-details')}><Info /> More details</Link></Button><Button variant="secondary" className="crow-action" size="icon" aria-label={crow.state.list.includes(item.id) ? 'Remove Dune from My List' : 'Add Dune to My List'} data-remote="hero-list" onClick={() => crow.toggleList(item.id)}><Bookmark fill={crow.state.list.includes(item.id) ? 'currentColor' : 'none'} /></Button></div></div><div className="hero-position"><i /><span>FEATURED</span></div></section>
    <Row title="Continue watching" items={continuing} landscape prefix="continue" />
    <Row title="My List" items={library.filter(media => crow.state.list.includes(media.id))} prefix="saved" seeAll="/my-list" />
    <Row title="Recently added" items={library} prefix="recent" seeAll="/movies" />
    <Row title="Series to settle into" items={library.filter(media => media.kind === 'series')} prefix="home-series" seeAll="/series" />
    <footer className="library-footer"><span>CROW · Your personal cinema</span><span>{library.length} titles in your library</span></footer>
  </main>;
}
function FilmMark() { return <svg viewBox="0 0 20 20" fill="none" stroke="currentColor"><rect x="3" y="3" width="14" height="14" rx="1"/><path d="M7 3v14M13 3v14M3 7h4m-4 6h4m6-6h4m-4 6h4" /></svg>; }

export function LibraryScreen({ kind }: { kind: 'movie' | 'series' }) {
  const [genre, setGenre] = useState('All genres');
  const [year, setYear] = useState('All years');
  const [sort, setSort] = useState('Recently added');
  const items = library.filter(item => item.kind === kind);
  const visible = filterLibrary(items, genre, year, sort);
  const reset = () => { setGenre('All genres'); setYear('All years'); setSort('Recently added'); };
  return <main className="page"><Header title={kind === 'movie' ? 'Movies' : 'Series'} description={`${items.length} ${kind === 'movie' ? 'movies' : 'series'}. A world worth getting lost in.`} /><div className="filters">
    <select aria-label="Genre" data-remote="genre" value={genre} onChange={event => setGenre(event.target.value)}><option>All genres</option>{[...new Set(items.map(item => item.genre))].map(value => <option key={value}>{value}</option>)}</select>
    <select aria-label="Year" data-remote="year" value={year} onChange={event => setYear(event.target.value)}><option>All years</option>{[...new Set(items.map(item => item.year))].sort((a, b) => b - a).map(value => <option key={value}>{value}</option>)}</select>
    <Button variant="ghost" className="reset-filter" data-remote="reset" onClick={reset}><RotateCcw />Reset</Button>
    <select aria-label="Sort" data-remote="sort" value={sort} onChange={event => setSort(event.target.value)}><option>Recently added</option><option>Title A–Z</option></select>
  </div>{visible.length ? <div className="poster-grid">{visible.map(item => <ContentCard item={item} key={item.id} prefix={kind} />)}</div> : <EmptyState title="No titles match" description="Try another genre or year." action={<Button data-remote="empty-reset" onClick={reset}>Reset filters</Button>} />}</main>;
}

export function EmptyState({ title, description, action }: { title: string; description: string; action?: React.ReactNode }) {
  return <div className="empty-state"><Bookmark /><h2>{title}</h2><p>{description}</p>{action}</div>;
}

export function MyListScreen() {
  const crow = useCrow();
  const items = library.filter(item => crow.state.list.includes(item.id));
  return <main className="page"><Header title="My List" description={`${items.length} saved ${items.length === 1 ? 'title' : 'titles'} · Your next good watch`} />{items.length ? <div className="poster-grid">{items.map(item => <ContentCard item={item} key={item.id} prefix="my-list" />)}</div> : <EmptyState title="Something to look forward to" description="Save movies and series here for another evening." action={<Button asChild><Link to="/movies" data-remote="browse-movies">Browse movies <ArrowRight /></Link></Button>} />}</main>;
}

export function SearchScreen() {
  const [query, setQuery] = useState('');
  const [inputFocused, setInputFocused] = useState(false);
  const items = filterLibrary(library, 'All genres', 'All years', 'Recently added', query);
  const keys = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.split('');
  return <main className="page"><Header title="Search" /><div className="search-input-wrap"><Search /><input aria-label="Search your library" placeholder="Movies, series, a little inspiration…" value={query} onFocus={() => setInputFocused(true)} onBlur={() => setInputFocused(false)} onChange={event => setQuery(event.target.value)} data-remote="search-input" data-initial-focus /><Button variant="ghost" aria-label="Clear search" data-remote="clear-search" onClick={() => setQuery('')}><RotateCcw /></Button></div>
    <div className="keyboard" aria-label="On-screen keyboard">{keys.map(key => <Button variant="secondary" key={key} data-remote={`key-${key}`} onClick={() => setQuery(current => current + key.toLowerCase())}>{key}</Button>)}<Button variant="secondary" className="wide-key" data-remote="key-space" onClick={() => setQuery(current => current + ' ')}>Space</Button><Button variant="secondary" className="wide-key" data-remote="key-delete" onClick={() => setQuery(current => current.slice(0, -1))}>Delete</Button><Button variant="secondary" className="wide-key" data-remote="key-clear" onClick={() => setQuery('')}>Clear</Button></div>
    <div className="section-heading"><h2>{query ? `Results for “${query}”` : 'In your library'}<span className="row-count">{items.length}</span></h2></div>{items.length ? <div className="poster-grid">{items.map(item => <ContentCard key={item.id} item={item} prefix="search" />)}</div> : <EmptyState title="Nothing here just yet" description="No titles match your search. Try another name." action={<Button data-remote="edit-query" onClick={() => document.querySelector<HTMLInputElement>('[data-remote="search-input"]')?.focus()}>Edit search</Button>} />}
  </main>;
}