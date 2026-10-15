import { describe, expect, it } from 'vitest';
import { emptyViewerState, seekPosition, toggleSaved } from './crow-model';

describe('CROW viewer rules', () => {
  it('keeps a new viewer separate from another viewer’s saved list', () => {
    const alex = toggleSaved(emptyViewerState(), 'dune');
    const sam = emptyViewerState();
    expect(alex.list).toEqual(['dune']);
    expect(sam.list).toEqual([]);
  });
  it('removes an already saved item immediately', () => {
    expect(toggleSaved(toggleSaved(emptyViewerState(), 'dune'), 'dune').list).toEqual([]);
  });
  it('seeks in ten-second steps without exceeding playback bounds', () => {
    expect(seekPosition(50, 1, 100)).toBe(60);
    expect(seekPosition(50, -1, 100)).toBe(40);
    expect(seekPosition(5, -1, 100)).toBe(0);
    expect(seekPosition(95, 1, 100)).toBe(100);
  });
  it('gives each viewer independent playback preferences', () => {
    const first = { ...emptyViewerState(), subtitles: 'English' };
    expect(first.subtitles).toBe('English');
    expect(emptyViewerState().subtitles).toBe('Off');
  });
});