import { useEffect, useState, useRef } from 'react';
import { useRouter } from '@tanstack/react-router';
import { ArrowLeft, Play, Pause, Volume2, Subtitles, SkipForward, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { library, channels, episodes } from '@/lib/crow-library';
import { formatTime, seekPosition } from '@/lib/crow-model';
import { useCrow } from './provider';
import { Progress } from './library-ui';
import { focusRemote } from './remote';

export function PlayerScreen({ id, episode = 1 }: { id: string; episode?: number }) {
  const crow = useCrow();
  const router = useRouter();
  const [channelId, setChannelId] = useState(id.replace('channel-', ''));
  const [episodeNumber, setEpisodeNumber] = useState(episode);
  const item = library.find(media => media.id === id);
  const isLive = id.startsWith('channel-');
  const channel = channels.find(value => value.id === channelId);
  const duration = item?.kind === 'series' ? (episodes[episodeNumber - 1]?.duration ?? item.duration) * 60 : (item?.duration ?? 100) * 60;
  const [position, setPosition] = useState(crow.state.progress[id] ?? 0);
  const positionRef = useRef(position);
  const [playing, setPlaying] = useState(true);
  const [overlay, setOverlay] = useState(true);
  const [lastInteraction, setLastInteraction] = useState(Date.now());
  const [panel, setPanel] = useState<'audio' | 'subtitles' | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [cancelled, setCancelled] = useState(false);
  positionRef.current = position;
  const title = isLive ? channel?.name : item?.title;
  const exit = () => { if (isLive) router.navigate({ to: '/live', replace: true }); else router.navigate({ to: '/details/$id', params: { id }, replace: true }); };
  useEffect(() => {
    if (!overlay) document.querySelector<HTMLElement>('.player')?.focus({ preventScroll: true });
    else if (!panel) setTimeout(() => focusRemote('player-pause'), 80);
  }, [overlay]);
  useEffect(() => { const timer = setInterval(() => { if (playing && !isLive) setPosition(current => Math.min(duration, current + 1)); }, 1000); return () => clearInterval(timer); }, [playing, isLive, duration]);
  useEffect(() => { if (isLive) return; const timer = setInterval(() => crow.setProgress(id, positionRef.current), 5000); return () => { clearInterval(timer); crow.setProgress(id, positionRef.current); }; }, [id, isLive]);
  useEffect(() => { if (!overlay || panel) return; const timer = setTimeout(() => setOverlay(false), 6000); return () => clearTimeout(timer); }, [overlay, lastInteraction, panel]);
  useEffect(() => { if (panel) setTimeout(() => focusRemote(`track-${panel}-0`), 50); }, [panel]);
  useEffect(() => {
    if (position >= duration && item?.kind === 'series' && crow.state.autoplay && episodeNumber < episodes.length && !cancelled) setCountdown(10);
  }, [position >= duration, episodeNumber, crow.state.autoplay, cancelled]);
  useEffect(() => {
    if (countdown === null) return;
    if (countdown === 0) { setEpisodeNumber(value => value + 1); setPosition(0); setCountdown(null); setCancelled(false); return; }
    const timer = setTimeout(() => setCountdown(value => value === null ? null : value - 1), 1000); return () => clearTimeout(timer);
  }, [countdown]);
  useEffect(() => { if (countdown !== null) setTimeout(() => focusRemote('cancel-next'), 50); }, [countdown !== null]);
  if (!item && !channel) return <div className="player"><div className="player-fallback"><h1>Playback unavailable</h1><Button data-remote="player-unavailable" onClick={exit}>Back to library</Button></div></div>;
  return <main className="player" tabIndex={-1} onClick={() => { setOverlay(true); setLastInteraction(Date.now()); }} onKeyDown={event => {
    setLastInteraction(Date.now());
    if (panel) { if (event.key === 'Escape') { event.preventDefault(); setPanel(null); setTimeout(() => focusRemote('player-pause'), 50); } return; }
    if (event.key === 'Escape') { event.preventDefault(); exit(); return; }
    if ((event.key === 'ArrowLeft' || event.key === 'ArrowRight') && !isLive) { event.preventDefault(); setPosition(current => seekPosition(current, event.key === 'ArrowRight' ? 1 : -1, duration)); setOverlay(true); return; }
    if (!overlay && isLive && ['ArrowUp', 'ArrowDown'].includes(event.key)) { event.preventDefault(); const index = channels.findIndex(value => value.id === channelId); const next = channels[(index + (event.key === 'ArrowDown' ? 1 : -1) + channels.length) % channels.length]; if (next) setChannelId(next.id); return; }
    if (!overlay && ['Enter', 'ArrowUp', 'ArrowDown'].includes(event.key)) { event.preventDefault(); setOverlay(true); setTimeout(() => focusRemote('player-pause'), 50); }
  }}>
    {item?.backdrop ? <img className="player-image" src={item.backdrop} alt="Dune: Part Two scene" /> : <div className="player-fallback">{item ? <img src={item.poster} alt={item.title} /> : <><span className="channel-logo">{channel?.mark}</span><p>No live feed connected</p></>}</div>}
    <div className="player-top">{overlay ? <Button variant="secondary" aria-label="Exit playback" data-remote="player-exit" onClick={exit}><ArrowLeft /> Back</Button> : <span />}<span className="player-demo">{isLive ? 'Sample channel' : 'Playback preview · Simulated video'}</span></div>
    {overlay && <section className="player-controls"><h1>{title}</h1><p>{item?.kind === 'series' ? `S1 · E${episodeNumber} — ${episodes[episodeNumber - 1]?.title ?? 'Episode'}` : isLive ? channel?.label : `${item?.year} · Movie`}</p>{!isLive && <Progress className="player-timeline" value={position} max={duration} />}<div className="player-bottom"><div className="player-buttons"><Button variant="secondary" size="icon" aria-label={playing ? 'Pause' : 'Play'} data-remote="player-pause" data-initial-focus onClick={() => { setPlaying(value => !value); setLastInteraction(Date.now()); }}>{playing ? <Pause /> : <Play />}</Button><Button variant="ghost" data-remote="player-audio" onClick={() => setPanel('audio')}><Volume2 /> Audio</Button><Button variant="ghost" data-remote="player-subtitles" onClick={() => setPanel('subtitles')}><Subtitles /> Subtitles</Button>{item?.kind === 'series' && episodeNumber < episodes.length && <Button variant="ghost" data-remote="next-episode" onClick={() => { setEpisodeNumber(value => value + 1); setPosition(0); setCancelled(false); }}><SkipForward /> Next episode</Button>}</div><span className="player-time">{isLive ? 'LIVE · Preview' : `${formatTime(position)} / ${formatTime(duration)}`}</span></div></section>}
    {panel && <div className="dialog-backdrop"><section className="crow-dialog" role="dialog" aria-modal="true" aria-label={panel === 'audio' ? 'Audio tracks' : 'Subtitles'} data-remote-modal><div className="dialog-heading"><h2>{panel === 'audio' ? 'Audio tracks' : 'Subtitles'}</h2></div>{(panel === 'audio' ? ['Original', 'English'] : ['Off', 'English', 'English CC']).map((track, index) => <Button key={track} variant="ghost" className="setting-row w-full" data-remote={`track-${panel}-${index}`} onClick={() => { crow.preference(panel, track); setPanel(null); setTimeout(() => focusRemote('player-pause'), 50); }}>{track}{crow.state[panel] === track && <Check />}</Button>)}<p className="sample-label">Preview preferences · No media tracks connected</p><div className="dialog-actions"><Button variant="secondary" data-remote="close-tracks" onClick={() => { setPanel(null); setTimeout(() => focusRemote('player-pause'), 50); }}>Close</Button></div></section></div>}
    {countdown !== null && <div className="countdown-panel"><p>Up next: {episodes[episodeNumber]?.title}</p><p>Playing in {countdown} seconds</p><Button data-remote="cancel-next" onClick={() => { setCancelled(true); setCountdown(null); }}>Cancel</Button></div>}
  </main>;
}