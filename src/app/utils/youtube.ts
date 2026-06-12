export interface YouTubeOEmbed {
  title: string;
  thumbnailUrl: string;
}

export function extractYouTubeEmbedUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    const hostname = parsed.hostname.replace('www.', '');

    if (hostname === 'youtube.com') {
      if (parsed.pathname === '/watch') {
        const v = parsed.searchParams.get('v');
        return v ? `https://www.youtube.com/embed/${v}` : null;
      }
      if (parsed.pathname.startsWith('/shorts/')) {
        const videoId = parsed.pathname.split('/')[2];
        return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
      }
      if (parsed.pathname.startsWith('/embed/')) {
        return url;
      }
    }

    if (hostname === 'youtu.be') {
      const videoId = parsed.pathname.slice(1);
      return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
    }

    return null;
  } catch {
    return null;
  }
}

export async function fetchYouTubeOEmbed(url: string): Promise<YouTubeOEmbed | null> {
  try {
    const response = await fetch(
      `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`
    );
    if (!response.ok) return null;
    const data = await response.json();
    return { title: data.title ?? '', thumbnailUrl: data.thumbnail_url ?? '' };
  } catch {
    return null;
  }
}
