export function CrowMark({ className = '' }: { className?: string }) {
  return <svg className={className} viewBox="0 0 48 40" fill="currentColor" aria-hidden="true"><path d="M2 7 23 14 33 5 39 10 47 12 39 16 34 29 17 35 22 23 7 24 15 18Z" /></svg>;
}

export function Brand() {
  return <div className="brand"><CrowMark /><span>CROW</span></div>;
}

export function Avatar({ variant = 0 }: { variant?: number }) {
  return <div className={`viewer-avatar avatar-${variant % 4}`}>
    {variant % 4 === 0 ? <svg viewBox="0 0 160 160" aria-hidden="true"><circle cx="80" cy="80" r="47" fill="currentColor"/><path d="M102 29a53 53 0 0 0 0 102A66 66 0 0 1 102 29Z" className="avatar-cut"/><circle cx="41" cy="38" r="2" fill="currentColor"/><circle cx="126" cy="116" r="2" fill="currentColor"/></svg> : variant % 4 === 1 ? <svg viewBox="0 0 160 160" aria-hidden="true"><path d="m22 113 44-69 26 39 14-22 34 52Z" fill="currentColor"/><path d="m52 66 14-22 16 24-16-6Z" className="avatar-cut"/><circle cx="111" cy="39" r="9" fill="currentColor"/></svg> : variant % 4 === 2 ? <svg viewBox="0 0 160 160" aria-hidden="true"><circle cx="80" cy="80" r="29" fill="currentColor"/><ellipse cx="80" cy="80" rx="64" ry="20" transform="rotate(-32 80 80)" fill="none" stroke="currentColor" strokeWidth="4"/></svg> : <CrowMark />}
  </div>;
}