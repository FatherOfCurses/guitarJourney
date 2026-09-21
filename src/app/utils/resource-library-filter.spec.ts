import { Timestamp } from 'firebase/firestore';
import { Resource } from '../models/resource';
import {
  MAX_RECENT,
  MAX_RESULTS,
  collectTags,
  filterResources,
  isFiltering,
  recentResources,
  typeSeverity,
} from './resource-library-filter';

function res(overrides: Partial<Resource> = {}): Resource {
  return {
    id: 'r1',
    type: 'custom',
    url: 'https://example.com',
    label: 'Example',
    createdAt: { seconds: 0 } as unknown as Timestamp,
    ...overrides,
  };
}

/** Firestore-shaped timestamp that exposes toMillis(), like the real SDK. */
function realTimestamp(millis: number): Timestamp {
  return { toMillis: () => millis } as unknown as Timestamp;
}

/** Plain-object timestamp, as the emulator and some fixtures produce. */
function plainTimestamp(seconds: number): Timestamp {
  return { seconds } as unknown as Timestamp;
}

describe('typeSeverity', () => {
  it('maps the known types to their DESIGN.md severities', () => {
    expect(typeSeverity('youtube')).toBe('info');
    expect(typeSeverity('pdf')).toBe('danger');
    expect(typeSeverity('chord-sheet')).toBe('success');
    expect(typeSeverity('custom')).toBe('secondary');
    expect(typeSeverity('song')).toBe('secondary');
  });

  it('falls back to secondary for an unknown type', () => {
    expect(typeSeverity('banjo-tab')).toBe('secondary');
  });
});

describe('collectTags', () => {
  it('is empty for an empty library', () => {
    expect(collectTags([])).toEqual([]);
  });

  it('collects distinct tags and sorts them', () => {
    const library = [
      res({ id: 'a', tags: ['rock', 'blues'] }),
      res({ id: 'b', tags: ['blues', 'acoustic'] }),
    ];
    expect(collectTags(library)).toEqual(['acoustic', 'blues', 'rock']);
  });

  it('tolerates resources with no tags', () => {
    expect(collectTags([res({ id: 'a' }), res({ id: 'b', tags: ['jazz'] })])).toEqual(['jazz']);
  });
});

describe('isFiltering', () => {
  it('is false for a short query with no tags', () => {
    expect(isFiltering('ab', [])).toBe(false);
  });

  it('is true once the query reaches three characters', () => {
    expect(isFiltering('abc', [])).toBe(true);
  });

  it('ignores surrounding whitespace when measuring the query', () => {
    expect(isFiltering('  ab  ', [])).toBe(false);
  });

  it('is true for any selected tag even with an empty query', () => {
    expect(isFiltering('', ['blues'])).toBe(true);
  });
});

describe('filterResources', () => {
  const library = [
    res({ id: 'a', label: 'Blues Shuffle', url: 'https://yt/1', tags: ['blues', 'rock'] }),
    res({ id: 'b', label: 'Jazz Comping', url: 'https://yt/2', tags: ['jazz'] }),
    res({ id: 'c', label: 'Scales', url: 'https://drills.example/blues', tags: ['blues'] }),
  ];

  it('returns nothing when not filtering', () => {
    expect(filterResources(library, 'ab', [])).toEqual([]);
  });

  it('matches the label case-insensitively', () => {
    expect(filterResources(library, 'blues shuffle', []).map(r => r.id)).toEqual(['a']);
  });

  it('matches the url', () => {
    expect(filterResources(library, 'drills.example', []).map(r => r.id)).toEqual(['c']);
  });

  it('matches a tag', () => {
    expect(filterResources(library, 'jazz', []).map(r => r.id)).toEqual(['b']);
  });

  it('ANDs multiple tag filters rather than ORing them', () => {
    expect(filterResources(library, '', ['blues', 'rock']).map(r => r.id)).toEqual(['a']);
  });

  it('combines the text query with the tag filter', () => {
    expect(filterResources(library, 'scales', ['blues']).map(r => r.id)).toEqual(['c']);
  });

  it('returns nothing when the tag filter excludes every text match', () => {
    expect(filterResources(library, 'scales', ['jazz'])).toEqual([]);
  });

  it('caps the result set at MAX_RESULTS', () => {
    const many = Array.from({ length: MAX_RESULTS + 10 }, (_, i) =>
      res({ id: `r${i}`, label: `Etude ${i}` })
    );
    expect(filterResources(many, 'etude', [])).toHaveLength(MAX_RESULTS);
  });
});

describe('recentResources', () => {
  it('is empty when nothing has ever been used', () => {
    expect(recentResources([res({ id: 'a' }), res({ id: 'b' })])).toEqual([]);
  });

  it('excludes resources that were never pinned to a session', () => {
    const library = [res({ id: 'a' }), res({ id: 'b', lastUsedAt: plainTimestamp(10) })];
    expect(recentResources(library).map(r => r.id)).toEqual(['b']);
  });

  it('excludes a resource with no id, which cannot be re-added', () => {
    const library = [res({ id: undefined, lastUsedAt: plainTimestamp(99) })];
    expect(recentResources(library)).toEqual([]);
  });

  it('orders by lastUsedAt, most recent first', () => {
    const library = [
      res({ id: 'old', lastUsedAt: plainTimestamp(10) }),
      res({ id: 'new', lastUsedAt: plainTimestamp(30) }),
      res({ id: 'mid', lastUsedAt: plainTimestamp(20) }),
    ];
    expect(recentResources(library).map(r => r.id)).toEqual(['new', 'mid', 'old']);
  });

  it('supports a real Timestamp exposing toMillis()', () => {
    const library = [
      res({ id: 'a', lastUsedAt: realTimestamp(1_000) }),
      res({ id: 'b', lastUsedAt: realTimestamp(5_000) }),
    ];
    expect(recentResources(library).map(r => r.id)).toEqual(['b', 'a']);
  });

  it('caps at MAX_RECENT', () => {
    const library = Array.from({ length: MAX_RECENT + 4 }, (_, i) =>
      res({ id: `r${i}`, lastUsedAt: plainTimestamp(i) })
    );
    expect(recentResources(library)).toHaveLength(MAX_RECENT);
  });

  it('does not mutate the caller\'s array', () => {
    const library = [
      res({ id: 'old', lastUsedAt: plainTimestamp(10) }),
      res({ id: 'new', lastUsedAt: plainTimestamp(30) }),
    ];
    const order = library.map(r => r.id);
    recentResources(library);
    expect(library.map(r => r.id)).toEqual(order);
  });
});
