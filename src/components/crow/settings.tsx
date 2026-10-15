import { useEffect, useState } from 'react';
import { Plus, Check, ArrowLeft, Radio, Play } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { channels } from '@/lib/crow-library';
import type { Viewer } from '@/lib/crow-model';
import { useCrow, ProfileEditor } from './provider';
import { Avatar } from './brand';
import { Header } from './library-ui';
import { focusRemote } from './remote';

export function LiveScreen() {
  const [focused, setFocused] = useState(channels[0]?.id);
  const current = channels.find(channel => channel.id === focused);
  return <main className="page"><Header title="Live TV" description="A different window on the world." /><div className="channel-layout"><div>{channels.map(channel => <Button variant="ghost" asChild className={`channel-row ${focused === channel.id ? 'current' : ''}`} key={channel.id}><Link to="/watch/$id" params={{ id: `channel-${channel.id}` }} data-remote={`channel-${channel.id}`} onFocus={() => setFocused(channel.id)}><span className="channel-logo">{channel.mark}</span><span className="channel-description"><strong>{channel.name}</strong><small>{channel.label}</small></span><Play /></Link></Button>)}<span className="sample-label">Sample channels · No live feed connected</span></div><div><div className="channel-preview"><Radio /><strong>{current?.name}</strong><p>Live feed not connected</p></div></div></div></main>;
}

export function SettingsScreen() {
  const crow = useCrow();
  const [editing, setEditing] = useState<Viewer | null>(null);
  const [deleting, setDeleting] = useState<Viewer | null>(null);
  useEffect(() => { if (deleting) setTimeout(() => focusRemote('cancel-delete'), 40); }, [deleting]);
  const close = () => { setEditing(null); setDeleting(null); setTimeout(() => focusRemote('settings-add'), 40); };
  return <main className="page" onKeyDown={event => { if ((editing || deleting) && event.key === 'Escape') { event.preventDefault(); close(); } }}><Header title="Profiles & Settings" />
    <section className="settings-section"><h2>Profiles</h2><div className="settings-profiles">{crow.profiles.map(profile => <Button key={profile.id} variant="ghost" className="settings-profile" data-remote={`edit-${profile.id}`} onClick={() => setEditing(profile)}><Avatar variant={profile.avatar} /><span>{profile.name}{profile.id === crow.active?.id && ' · You'}</span></Button>)}<Button variant="ghost" className="settings-profile" data-remote="settings-add" onClick={() => setEditing({ id: `viewer-${Date.now()}`, name: '', avatar: 3 })}><div className="viewer-avatar"><Plus /></div><span>Add profile</span></Button></div><Button variant="outline" data-remote="settings-switch" onClick={crow.switchProfile}>Switch profile</Button></section>
    <section className="settings-section"><h2>Playback</h2><div className="setting-row"><label>Play the next episode<small>Continue a series automatically</small></label><Button variant="ghost" className={`toggle-control ${crow.state.autoplay ? 'is-on' : ''}`} role="switch" aria-checked={crow.state.autoplay} aria-label="Play the next episode" data-remote="autoplay" onClick={() => crow.preference('autoplay', !crow.state.autoplay)}><span /></Button></div></section>
    <section className="settings-section"><h2>Audio & subtitles</h2><div className="setting-row"><label htmlFor="audio-default">Default audio</label><select id="audio-default" data-remote="default-audio" value={crow.state.audio} onChange={event => crow.preference('audio', event.target.value)}><option>Original</option><option>English</option></select></div><div className="setting-row"><label htmlFor="subtitle-default">Default subtitles</label><select id="subtitle-default" data-remote="default-subtitles" value={crow.state.subtitles} onChange={event => crow.preference('subtitles', event.target.value)}><option>Off</option><option>English</option><option>English CC</option></select></div></section>
    <section className="settings-section"><h2>Application</h2><div className="setting-row"><label>CROW<small>Your personal cinema</small></label><span>Design preview · 0.1</span></div><div className="setting-row"><label>Library connection</label><span>Sample library</span></div><div className="setting-row"><label>Playback</label><span>Simulated · No video source</span></div><div className="setting-row"><label>Viewer data</label><span>This session only</span></div></section>
    {editing && <><ProfileEditor profile={editing} onClose={close} onSave={profile => { crow.saveProfile(profile); close(); }} />{crow.profiles.some(profile => profile.id === editing.id) && <div className="profile-delete-action"><Button variant="ghost" data-remote="delete-profile" onClick={() => { setDeleting(editing); setEditing(null); }}>Delete profile</Button></div>}</>}
    {deleting && <div className="dialog-backdrop"><section className="crow-dialog" role="dialog" aria-modal="true" aria-label="Delete profile" data-remote-modal><div className="dialog-heading"><h2>Delete {deleting.name}?</h2></div><p>Their list and viewing progress will be removed. Other profiles won't be affected.</p><div className="dialog-actions"><Button variant="secondary" data-remote="cancel-delete" data-initial-focus onClick={close}>Cancel</Button><Button variant="destructive" data-remote="confirm-delete" onClick={() => { crow.deleteProfile(deleting.id); close(); }}>Delete profile</Button></div></section></div>}
  </main>;
}