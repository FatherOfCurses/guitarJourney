import { Resource } from '../models/resource';

/** Library results shown in the listbox at once. */
export const MAX_RESULTS = 50;

/** Recently-used resources offered for one-click re-add. */
export const MAX_RECENT = 3;

/** Minimum query length before a text search starts filtering. */
export const MIN_QUERY_LENGTH = 3;

export type TagSeverity = 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast';

/** DESIGN.md — PrimeNG badge severity mapping (resource-library). */
const TYPE_SEVERITY: Record<string, TagSeverity> = {
  youtube: 'info',
  pdf: 'danger',
  'chord-sheet': 'success',
  custom: 'secondary',
  song: 'secondary',
};

export function typeSeverity(type: string): TagSeverity {
  return TYPE_SEVERITY[type] ?? 'secondary';
}

/**
 * Firestore hands back a real Timestamp in production but a plain `{seconds}` object
 * from some fixtures and the emulator, so read both shapes rather than assuming one.
 * A resource with no timestamp sorts last.
 */
function toMillis(resource: Resource): number {
  const ts = resource.lastUsedAt as unknown as
    | { toMillis?: () => number; seconds?: number }
    | undefined;
  if (!ts) return 0;
  if (typeof ts.toMillis === 'function') return ts.toMillis();
  return (ts.seconds ?? 0) * 1000;
}

/** Every distinct tag across the library, sorted, for the filter's suggestion list. */
export function collectTags(resources: readonly Resource[]): string[] {
  const seen = new Set<string>();
  for (const r of resources) {
    for (const t of r.tags ?? []) seen.add(t);
  }
  return [...seen].sort();
}

/**
 * Results appear once the text query is specific enough, or any tag is selected.
 * Short queries match too much of the library to be useful, so they stay hidden.
 */
export function isFiltering(query: string, tagFilters: readonly string[]): boolean {
  return query.trim().length >= MIN_QUERY_LENGTH || tagFilters.length > 0;
}

/**
 * Filters the library by free text and tags.
 *
 * Text matches label, URL, or any tag. Tag filters are AND — every selected tag must be
 * present, so adding a tag always narrows the result set rather than widening it.
 */
export function filterResources(
  resources: readonly Resource[],
  query: string,
  tagFilters: readonly string[]
): Resource[] {
  if (!isFiltering(query, tagFilters)) return [];

  const q = query.toLowerCase().trim();

  return resources
    .filter(r => {
      if (q.length >= MIN_QUERY_LENGTH) {
        const matchesText =
          r.label.toLowerCase().includes(q) ||
          (r.url ?? '').toLowerCase().includes(q) ||
          (r.tags ?? []).some(t => t.toLowerCase().includes(q));
        if (!matchesText) return false;
      }
      return tagFilters.every(t => (r.tags ?? []).includes(t));
    })
    .slice(0, MAX_RESULTS);
}

/**
 * The most recently used resources, for one-click re-add.
 *
 * Sorted client-side from the already-loaded library rather than by a Firestore
 * `orderBy('lastUsedAt')`, which would need a second query and an index for a list of
 * three. Resources never pinned to a session have no `lastUsedAt` and are excluded —
 * "recent" should mean recently used, not recently created.
 */
export function recentResources(resources: readonly Resource[]): Resource[] {
  return resources
    .filter(r => !!r.lastUsedAt && !!r.id)
    .sort((a, b) => toMillis(b) - toMillis(a))
    .slice(0, MAX_RECENT);
}
