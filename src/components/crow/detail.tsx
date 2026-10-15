import { Link, useRouter } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { ArrowLeft, Bookmark, Check, Info, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { library, episodes } from '@/lib/crow-library';
import { useCrow } from './provider';
import { EmptyState, Metadata, Progress } from './library-ui';
import { focusRemote } from './remote';

export function DetailScreen({ id }: { id: string }) {
  const item = library.find(media => media.id === id);
  const crow = useCrow();
  const router = useRouter();
  const [more, setMore] = useState(false);
  const [season, setSeason] = useState(1);
  const [focusedEpisode, setFocusedEpisode] = useState(0);
  useEffect(() => { if (more) setTimeout(() => focusRemote('close-info'), 40); }, [more]);
  if (!item) return <main className="page"><EmptyState title="This title is unavailable" description="It may have been removed from the library." action={<Button asChild><Link to="/" data-remote="unavailable-home">Back to Home</Link></Button>} /></main>;
  const progress = crow.state.progress[id] ?? 0;
  const unfinished = progress > 0 && progress < item.duration * 60;
  const saved = crow.state.list.includes(id);
  function goBack() { crow.returnToLibrary(); }
  return <main className="detail-page" onKeyDown={event => { if (more && event.key === 'Escape') { event.preventDefault(); setMore(false); setTimeout(() => focusRemote('more-info'), 40); } }}>
    {item.backdrop && <img className="detail-backdrop" src={item.backdrop} alt="" />}
    <Button variant="ghost" className="detail-back" data-remote="detail-back" onClick={goBack}><ArrowLeft /> Back to library</Button>
    <div className="detail-layout"><img className="detail-poster" src={item.poster} alt={`${item.title} poster`} /><div className="detail-info"><div className="eyebrow">{item.kind === 'movie' ? 'MOVIE' : 'SERIES'} · IN YOUR LIBRARY</div><h1>{item.title}</h1><Metadata item={item} /><p>{item.synopsis}</p>
      {unfinished && <div className="detail-progress"><span>{Math.floor(progress / 60)} min watched · {item.duration - Math.floor(progress / 60)} min remaining</span><Progress value={progress} max={item.duration * 60} /></div>}
      <div className="detail-actions"><Button asChild className="crow-action"><Link to="/watch/$id" params={{ id }} data-remote="detail-play" data-initial-focus><Play fill="currentColor" />{unfinished ? item.kind === 'movie' ? 'Resume movie' : 'Resume episode' : item.kind === 'movie' ? 'Play movie' : 'Play first episode'}</Link></Button><Button variant="secondary" className="crow-action" data-remote="detail-list" onClick={() => crow.toggleList(id)}>{saved ? <Check /> : <Bookmark />}{saved ? 'Remove from My List' : 'Add to My List'}</Button></div>
      <div className="detail-secondary"><Button variant="ghost" data-remote="more-info" onClick={() => setMore(true)}><Info /> More info</Button>{unfinished && <Button variant="ghost" data-remote="play-beginning" onClick={() => { crow.setProgress(id, 0); router.navigate({ to: '/watch/$id', params: { id } }); }}><Play /> Play from beginning</Button>}</div>
    </div></div>
    {item.kind === 'series' && <section className="episodes"><div className="season-tabs">{[1, 2].map(value => <Button key={value} variant="ghost" data-remote={`season-${value}`} className={season === value ? 'selected' : ''} onClick={() => setSeason(value)}>Season {value}</Button>)}</div>{id === 'severance' && season === 1 ? episodes.map((episode, index) => <Button variant="ghost" className="episode-row" key={episode.title} data-remote={`episode-${index}`} onFocus={() => setFocusedEpisode(index)} onClick={() => { crow.setProgress(id, index === 0 ? progress : 0); router.navigate({ to: '/watch/$id', params: { id }, search: { episode: index + 1 } }); }}><span className="episode-number">{String(index + 1).padStart(2, '0')}</span><span className="episode-text"><strong>{episode.title}</strong>{focusedEpisode === index && <small>{episode.synopsis}</small>}{index === 0 && unfinished && <Progress value={progress} max={episode.duration * 60} />}</span><span className="episode-duration">{episode.duration} min</span><Play /></Button>) : <div className="empty-state"><h2>Episodes not available</h2><p>This season isn't included in the sample library.</p></div>}</section>}
    {more && <div className="dialog-backdrop"><section className="crow-dialog" role="dialog" aria-label="More info" aria-modal="true" data-remote-modal><div className="dialog-heading"><h2>{item.title}</h2></div><Metadata item={item} /><p className="mt-6">{item.synopsis}</p><div className="dialog-actions"><Button data-remote="close-info" data-initial-focus onClick={() => { setMore(false); setTimeout(() => focusRemote('more-info'), 40); }}>Close</Button></div></section></div>}
  </main>;
}