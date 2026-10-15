import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { useRouter, useRouterState, Link } from '@tanstack/react-router';
import { Home, Film, Tv, Radio, Search, Bookmark, Settings, Plus, Pencil, Check, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Brand, CrowMark, Avatar } from './brand';
import { focusRemote, useRemote } from './remote';
import { emptyViewerState, toggleSaved, type Viewer, type ViewerState } from '@/lib/crow-model';

type CrowContextValue = {
  profiles: Viewer[]; active: Viewer | null; state: ViewerState; notice: string;
  selectProfile: (id: string) => void; switchProfile: () => void;
  saveProfile: (profile: Viewer) => void; deleteProfile: (id: string) => void;
  toggleList: (id: string) => void; setProgress: (id: string, value: number) => void;
  preference: <K extends keyof ViewerState>(key: K, value: ViewerState[K]) => void;
  remember: (id: string) => void; restore: () => void; notify: (message: string) => void;
};
const CrowContext = createContext<CrowContextValue | null>(null);
export function useCrow() {
  const context = useContext(CrowContext);
  if (!context) throw new Error('CROW provider is required');
  return context;
}

const nav = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/movies', label: 'Movies', icon: Film },
  { to: '/series', label: 'Series', icon: Tv },
  { to: '/live', label: 'Live TV', icon: Radio },
  { to: '/search', label: 'Search', icon: Search },
  { to: '/my-list', label: 'My List', icon: Bookmark },
  { to: '/settings', label: 'Profiles & Settings', icon: Settings },
] as const;

export function CrowProvider({ children }: { children: ReactNode }) {
  const [profiles, setProfiles] = useState<Viewer[]>([{ id: 'alex', name: 'Alex', avatar: 0 }, { id: 'sam', name: 'Sam', avatar: 1 }, { id: 'guest', name: 'Guest', avatar: 2 }]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [lastUsed, setLastUsed] = useState('alex');
  const [states, setStates] = useState<Record<string, ViewerState>>({ alex: { ...emptyViewerState(), list: ['arrival', 'blade', 'severance', 'budapest'], progress: { interstellar: 3360, severance: 1260, batman: 4380 } } });
  const [notice, setNotice] = useState('');
  const [expanded, setExpanded] = useState(false);
  const [editing, setEditing] = useState<Viewer | null>(null);
  const [manage, setManage] = useState(false);
  const [previousFocus, setPreviousFocus] = useState('');
  const pathname = useRouterState({ select: state => state.location.pathname });
  const router = useRouter();
  const active = profiles.find(profile => profile.id === activeId) ?? null;
  const state = activeId ? states[activeId] ?? emptyViewerState() : emptyViewerState();
  const fullscreen = pathname.startsWith('/watch');

  const notify = useCallback((message: string) => setNotice(message), []);
  useEffect(() => { if (!notice) return; const timer = setTimeout(() => setNotice(''), 2600); return () => clearTimeout(timer); }, [notice]);
  const restore = useCallback(() => { setTimeout(() => focusRemote(previousFocus), 100); }, [previousFocus]);
  useEffect(() => { const timer = setTimeout(() => focusRemote(pathname.startsWith('/details') || fullscreen ? undefined : previousFocus), 100); return () => clearTimeout(timer); }, [pathname, activeId, fullscreen, previousFocus]);
  useEffect(() => { if (editing) setTimeout(() => focusRemote('profile-name'), 60); }, [editing]);
  const back = useCallback(() => {
    if (editing) { setEditing(null); setTimeout(() => focusRemote(), 50); return; }
    if (!active) { setManage(false); return; }
    if (pathname.startsWith('/watch')) {
      const id = pathname.split('/').pop();
      if (id?.startsWith('channel-')) router.navigate({ to: '/live' });
      else if (id) router.navigate({ to: '/details/$id', params: { id } });
    } else if (pathname.startsWith('/details')) { router.history.back(); restore(); }
    else focusRemote(`nav-${pathname}`);
  }, [active, pathname, editing, router, restore]);
  useRemote(back);

  function updateState(update: (current: ViewerState) => ViewerState) {
    if (!activeId) return;
    setStates(current => ({ ...current, [activeId]: update(current[activeId] ?? emptyViewerState()) }));
  }
  const value: CrowContextValue = {
    profiles, active, state, notice, notify,
    selectProfile: id => { setActiveId(id); setLastUsed(id); setManage(false); setPreviousFocus(''); router.navigate({ to: '/' }); },
    switchProfile: () => { setActiveId(null); setTimeout(() => focusRemote(`profile-${lastUsed}`), 50); },
    saveProfile: profile => { setProfiles(current => current.some(p => p.id === profile.id) ? current.map(p => p.id === profile.id ? profile : p) : [...current, profile]); notify('Profile saved'); },
    deleteProfile: id => { setProfiles(current => current.filter(p => p.id !== id)); setStates(current => { const next = { ...current }; delete next[id]; return next; }); if (id === activeId) setActiveId(null); notify('Profile deleted'); },
    toggleList: id => { const saved = state.list.includes(id); updateState(current => toggleSaved(current, id)); notify(saved ? 'Removed from My List' : 'Added to My List'); },
    setProgress: (id, progress) => updateState(current => ({ ...current, progress: { ...current.progress, [id]: progress } })),
    preference: (key, preferenceValue) => { updateState(current => ({ ...current, [key]: preferenceValue })); notify('Preference updated'); },
    remember: id => setPreviousFocus(id), restore,
  };

  return <CrowContext.Provider value={value}>
    {!active ? <main className="profile-entry">
      <div className="entry-brand"><Brand /><span className="installation-label">YOUR PERSONAL CINEMA</span></div>
      <div className="profile-stage"><div className="eyebrow">A little time for yourself.</div><h1>Who's watching?</h1>
        <div className="profiles-row">{profiles.map(profile => <Button variant="ghost" className="profile-choice" key={profile.id} data-remote={`profile-${profile.id}`} data-initial-focus={profile.id === lastUsed || undefined} onClick={() => manage ? setEditing(profile) : value.selectProfile(profile.id)}>
          <Avatar variant={profile.avatar} /><span className="profile-name">{profile.name}</span><span className="profile-hint">{manage ? <><Pencil /> Edit profile</> : profile.id === lastUsed ? <><span className="last-used-dot" /> Last watched</> : '\u00a0'}</span>
        </Button>)}
        <Button variant="ghost" className="profile-choice add-profile" data-remote="add-profile" onClick={() => setEditing({ id: `viewer-${Date.now()}`, name: '', avatar: 3 })}><div className="viewer-avatar"><Plus /></div><span className="profile-name">Add profile</span><span className="profile-hint">{'\u00a0'}</span></Button></div>
        <Button variant="outline" className="manage-profiles" data-remote="manage-profiles" onClick={() => setManage(current => !current)}>{manage ? <Check /> : <Pencil />}{manage ? 'Done' : 'Manage profiles'}</Button>
      </div>
      <div className="entry-footer"><span>Just your library. Just your people.</span><span>CROW <span className="version">/ 01</span></span></div>
    </main> : <div className="crow-app">
      {!fullscreen && <aside className={`sidebar ${expanded ? 'is-expanded' : ''}`} onFocus={() => setExpanded(true)} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setExpanded(false); }}>
        <Link to="/" aria-label="CROW home" tabIndex={-1} className="sidebar-brand"><CrowMark /><span>CROW</span></Link>
        <nav aria-label="Main navigation"><div className="nav-caption">LIBRARY</div>{nav.map((item, index) => <div key={item.to} className={index === 5 ? 'personal-nav-start' : ''}>{index === 5 && <div className="nav-caption">PERSONAL</div>}<Button variant="ghost" asChild className={`nav-item ${pathname === item.to ? 'is-active' : ''}`}><Link to={item.to} data-remote={`nav-${item.to}`} aria-label={item.label} onClick={() => setPreviousFocus('')}><item.icon /><span>{item.label}</span><i /></Link></Button></div>)}</nav>
        <Button variant="ghost" className="sidebar-viewer" aria-label="Switch viewer" data-remote="switch-viewer" onClick={value.switchProfile}><Avatar variant={active.avatar} /><span>{active.name}<small>Switch profile</small></span></Button>
      </aside>}
      <div className={fullscreen ? 'fullscreen-content' : 'shell-content'}>{children}</div>
    </div>}
    {editing && <ProfileEditor profile={editing} onClose={() => { setEditing(null); setTimeout(() => focusRemote(), 50); }} onSave={profile => { value.saveProfile(profile); setEditing(null); setTimeout(() => focusRemote(`profile-${profile.id}`), 50); }} />}
    {notice && <div className="action-notice" role="status"><Check />{notice}</div>}
  </CrowContext.Provider>;
}

export function ProfileEditor({ profile, onClose, onSave }: { profile: Viewer; onClose: () => void; onSave: (profile: Viewer) => void }) {
  const [name, setName] = useState(profile.name);
  const [avatar, setAvatar] = useState(profile.avatar);
  useEffect(() => { setTimeout(() => focusRemote('profile-name'), 50); }, []);
  return <div className="dialog-backdrop"><section className="crow-dialog" role="dialog" aria-modal="true" aria-label="Edit profile" data-remote-modal>
    <div className="dialog-heading"><h2>{profile.name ? 'Edit profile' : 'A new viewer'}</h2><Button variant="ghost" size="icon" data-remote="close-editor" aria-label="Close" onClick={onClose}><ArrowLeft /></Button></div>
    <label htmlFor="profile-name">Name</label><input id="profile-name" value={name} data-remote="profile-name" onChange={event => setName(event.target.value)} placeholder="Your name" maxLength={20} />
    <label>Choose an avatar</label><div className="avatar-options">{[0, 1, 2, 3].map(index => <Button key={index} variant="ghost" className={`avatar-option ${avatar === index ? 'selected-avatar' : ''}`} aria-label={`Avatar ${index + 1}`} data-remote={`avatar-${index}`} onClick={() => setAvatar(index)}><Avatar variant={index} />{avatar === index && <Check />}</Button>)}</div>
    <div className="dialog-actions"><Button variant="secondary" data-remote="cancel-profile" onClick={onClose}>Cancel</Button><Button data-remote="save-profile" disabled={!name.trim()} onClick={() => onSave({ ...profile, name: name.trim(), avatar })}>Save profile</Button></div>
  </section></div>;
}