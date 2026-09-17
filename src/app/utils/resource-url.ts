import { extractYouTubeEmbedUrl } from './youtube';

/** Link resource types — every type except 'song', which is identified by title/artist. */
export type LinkResourceType = 'youtube' | 'pdf' | 'chord-sheet' | 'custom';

/**
 * Whether a URL can be saved as a resource of the given type.
 *
 * Shared by the session picker and the Add Resource form so the rule cannot drift
 * between them: a URL accepted in one place must be accepted in the other.
 *
 * Requires a parseable http(s) URL, and for `youtube` a URL a video id can be
 * extracted from — otherwise the embed would render an empty iframe.
 */
export function isValidResourceUrl(url: string, type: LinkResourceType): boolean {
  const trimmed = (url ?? '').trim();
  if (!trimmed) return false;

  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    return false;
  }
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return false;

  if (type === 'youtube') return extractYouTubeEmbedUrl(trimmed) !== null;
  return true;
}

/** Lowercases, trims and de-duplicates free-form tag input. */
export function normalizeTags(tags: readonly string[] | null | undefined): string[] {
  const seen = new Set<string>();
  for (const raw of tags ?? []) {
    const normalized = String(raw).trim().toLowerCase();
    if (normalized) seen.add(normalized);
  }
  return [...seen];
}
