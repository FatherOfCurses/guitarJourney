import { isValidResourceUrl, normalizeTags } from './resource-url';

describe('isValidResourceUrl', () => {
  const YT = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';

  it('rejects an empty or whitespace URL', () => {
    expect(isValidResourceUrl('', 'custom')).toBe(false);
    expect(isValidResourceUrl('   ', 'custom')).toBe(false);
  });

  it('rejects an unparseable URL', () => {
    expect(isValidResourceUrl('not a url', 'custom')).toBe(false);
  });

  it('rejects non-http(s) schemes', () => {
    expect(isValidResourceUrl('javascript:alert(1)', 'custom')).toBe(false);
    expect(isValidResourceUrl('file:///etc/passwd', 'custom')).toBe(false);
    expect(isValidResourceUrl('ftp://example.com/x.pdf', 'pdf')).toBe(false);
  });

  it('accepts http and https for non-youtube types', () => {
    expect(isValidResourceUrl('http://example.com/tab.pdf', 'pdf')).toBe(true);
    expect(isValidResourceUrl('https://example.com/tab.pdf', 'pdf')).toBe(true);
    expect(isValidResourceUrl('https://ultimate-guitar.com/x', 'chord-sheet')).toBe(true);
    expect(isValidResourceUrl('https://example.com/anything', 'custom')).toBe(true);
  });

  it('accepts a YouTube URL a video id can be extracted from', () => {
    expect(isValidResourceUrl(YT, 'youtube')).toBe(true);
    expect(isValidResourceUrl('https://youtu.be/dQw4w9WgXcQ', 'youtube')).toBe(true);
    expect(isValidResourceUrl('https://www.youtube.com/shorts/abc123', 'youtube')).toBe(true);
  });

  it('rejects a non-YouTube https URL when the type is youtube', () => {
    expect(isValidResourceUrl('https://example.com/video', 'youtube')).toBe(false);
  });

  it('tolerates surrounding whitespace', () => {
    expect(isValidResourceUrl(`  ${YT}  `, 'youtube')).toBe(true);
  });
});

describe('normalizeTags', () => {
  it('lowercases and trims', () => {
    expect(normalizeTags([' Barre ', 'CHORDS'])).toEqual(['barre', 'chords']);
  });

  it('de-duplicates case-insensitively', () => {
    expect(normalizeTags(['Barre', 'barre', 'BARRE'])).toEqual(['barre']);
  });

  it('drops empty and whitespace-only entries', () => {
    expect(normalizeTags(['barre', '', '   '])).toEqual(['barre']);
  });

  it('returns [] for null or undefined', () => {
    expect(normalizeTags(null)).toEqual([]);
    expect(normalizeTags(undefined)).toEqual([]);
  });
});
