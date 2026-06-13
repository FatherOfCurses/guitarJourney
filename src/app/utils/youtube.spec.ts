import { extractYouTubeEmbedUrl, fetchYouTubeOEmbed } from './youtube';

describe('extractYouTubeEmbedUrl', () => {
  it('extracts video ID from watch?v= URL', () => {
    expect(extractYouTubeEmbedUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ'))
      .toBe('https://www.youtube.com/embed/dQw4w9WgXcQ');
  });

  it('extracts video ID from youtu.be short URL', () => {
    expect(extractYouTubeEmbedUrl('https://youtu.be/dQw4w9WgXcQ'))
      .toBe('https://www.youtube.com/embed/dQw4w9WgXcQ');
  });

  it('extracts video ID from /shorts/ URL', () => {
    expect(extractYouTubeEmbedUrl('https://www.youtube.com/shorts/dQw4w9WgXcQ'))
      .toBe('https://www.youtube.com/embed/dQw4w9WgXcQ');
  });

  it('returns embed URL as-is when already in embed format', () => {
    expect(extractYouTubeEmbedUrl('https://www.youtube.com/embed/dQw4w9WgXcQ'))
      .toBe('https://www.youtube.com/embed/dQw4w9WgXcQ');
  });

  it('returns null for a non-YouTube URL', () => {
    expect(extractYouTubeEmbedUrl('https://vimeo.com/123456')).toBeNull();
  });

  it('returns null for an invalid URL string', () => {
    expect(extractYouTubeEmbedUrl('not-a-url')).toBeNull();
  });

  it('returns null for a YouTube URL with no video ID', () => {
    expect(extractYouTubeEmbedUrl('https://www.youtube.com/watch')).toBeNull();
  });

  it('returns null for a /shorts/ URL with no video ID', () => {
    expect(extractYouTubeEmbedUrl('https://www.youtube.com/shorts/')).toBeNull();
  });

  it('returns null for a youtu.be URL with empty path', () => {
    expect(extractYouTubeEmbedUrl('https://youtu.be/')).toBeNull();
  });
});

describe('fetchYouTubeOEmbed', () => {
  const g = globalThis as any;
  let savedFetch: unknown;

  beforeEach(() => { savedFetch = g.fetch; });
  afterEach(() => { g.fetch = savedFetch; });

  it('returns title and thumbnailUrl on success', async () => {
    g.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ title: 'Rick Astley', thumbnail_url: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg' }),
    });
    expect(await fetchYouTubeOEmbed('https://www.youtube.com/watch?v=dQw4w9WgXcQ')).toEqual({
      title: 'Rick Astley',
      thumbnailUrl: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
    });
  });

  it('returns null when response is not ok', async () => {
    g.fetch = jest.fn().mockResolvedValue({ ok: false });
    expect(await fetchYouTubeOEmbed('https://www.youtube.com/watch?v=private')).toBeNull();
  });

  it('returns null when fetch throws (network error)', async () => {
    g.fetch = jest.fn().mockRejectedValue(new TypeError('Failed to fetch'));
    expect(await fetchYouTubeOEmbed('https://www.youtube.com/watch?v=x')).toBeNull();
  });

  it('returns null when JSON is malformed', async () => {
    g.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => { throw new SyntaxError('Unexpected token'); },
    });
    expect(await fetchYouTubeOEmbed('https://www.youtube.com/watch?v=x')).toBeNull();
  });

  it('defaults missing title and thumbnail_url to empty string', async () => {
    g.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => ({}) });
    expect(await fetchYouTubeOEmbed('https://www.youtube.com/watch?v=x')).toEqual({
      title: '',
      thumbnailUrl: '',
    });
  });
});
