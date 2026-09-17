import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { Subject, of } from 'rxjs';
import { SessionResourcePickerComponent } from './session-resource-picker.component';
import { ResourceService } from '../../../services/resource.service';
import { AutocompleteSuggestionService } from '../../../services/autocomplete-suggestion.service';
import { Resource } from '../../../models/resource';

jest.mock('../../../utils/youtube', () => ({
  ...jest.requireActual('../../../utils/youtube'),
  fetchYouTubeOEmbed: jest.fn(),
}));
import { fetchYouTubeOEmbed } from '../../../utils/youtube';
const mockFetchOEmbed = fetchYouTubeOEmbed as jest.MockedFunction<typeof fetchYouTubeOEmbed>;

const mockResource = (over: Partial<Resource> = {}): Resource => ({
  id: 'res-1',
  type: 'youtube',
  url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  label: 'Test Video',
  tags: ['tag1'],
  useCount: 0,
  createdAt: { seconds: 0, nanoseconds: 0 } as any,
  ...over,
});

const mockResourceService = {
  getResources: jest.fn().mockReturnValue(of([])),
};

const mockSuggestionSvc = {
  suggestTitles: jest.fn().mockReturnValue(of([])),
  suggestArtists: jest.fn().mockReturnValue(of([])),
  suggestAlbums: jest.fn().mockReturnValue(of([])),
};

describe('SessionResourcePickerComponent', () => {
  let component: SessionResourcePickerComponent;
  let fixture: ComponentFixture<SessionResourcePickerComponent>;

  beforeEach(async () => {
    jest.clearAllMocks();
    mockResourceService.getResources.mockReturnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [SessionResourcePickerComponent],
      providers: [
        provideNoopAnimations(),
        { provide: ResourceService, useValue: mockResourceService },
        { provide: AutocompleteSuggestionService, useValue: mockSuggestionSvc },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SessionResourcePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // ── Creation ────────────────────────────────────────────────

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('sets libraryLoading to false after getResources emits', () => {
    expect(component.libraryLoading()).toBe(false);
  });

  // ── canAdd ──────────────────────────────────────────────────

  it('canAdd is false when title is empty', () => {
    component.newTitle = '';
    component.newArtist = 'The Beatles';
    expect(component.canAdd).toBe(false);
  });

  it('canAdd is false when artist is empty', () => {
    component.newTitle = 'Yesterday';
    component.newArtist = '';
    expect(component.canAdd).toBe(false);
  });

  it('canAdd is false when both title and artist are empty', () => {
    component.newTitle = '';
    component.newArtist = '';
    expect(component.canAdd).toBe(false);
  });

  it('canAdd is true when title and artist are both provided', () => {
    component.newTitle = 'Yesterday';
    component.newArtist = 'The Beatles';
    expect(component.canAdd).toBe(true);
  });

  it('canAdd trims whitespace before checking', () => {
    component.newTitle = '   ';
    component.newArtist = 'Artist';
    expect(component.canAdd).toBe(false);
  });

  // ── onAdd ───────────────────────────────────────────────────

  it('onAdd does nothing when canAdd is false', () => {
    component.newTitle = '';
    component.newArtist = '';
    const emitted: any[] = [];
    component.resourceAdded.subscribe(v => emitted.push(v));
    component.onAdd();
    expect(emitted).toHaveLength(0);
  });

  it('emits a song-shaped resource with type "song" when onAdd is called', () => {
    component.newTitle = 'Yesterday';
    component.newArtist = 'The Beatles';
    component.newAlbum = 'Help!';
    component.newGenre = 'Pop';
    component.newVideoLink = 'https://www.youtube.com/watch?v=NJ-lgS6oVSY';

    const emitted: any[] = [];
    component.resourceAdded.subscribe(v => emitted.push(v));
    component.onAdd();

    expect(emitted).toHaveLength(1);
    expect(emitted[0].type).toBe('song');
    expect(emitted[0].title).toBe('Yesterday');
    expect(emitted[0].artist).toBe('The Beatles');
    expect(emitted[0].album).toBe('Help!');
    expect(emitted[0].genre).toBe('Pop');
    expect(emitted[0].label).toBe('Yesterday — The Beatles');
  });

  it('sets url to videoLink when videoLink is provided', () => {
    component.newTitle = 'Yesterday';
    component.newArtist = 'The Beatles';
    component.newVideoLink = 'https://www.youtube.com/watch?v=NJ-lgS6oVSY';

    const emitted: any[] = [];
    component.resourceAdded.subscribe(v => emitted.push(v));
    component.onAdd();

    expect(emitted[0].url).toBe('https://www.youtube.com/watch?v=NJ-lgS6oVSY');
  });

  it('falls back to audioLink for url when videoLink is absent', () => {
    component.newTitle = 'Yesterday';
    component.newArtist = 'The Beatles';
    component.newAudioLink = 'https://example.com/audio.mp3';

    const emitted: any[] = [];
    component.resourceAdded.subscribe(v => emitted.push(v));
    component.onAdd();

    expect(emitted[0].url).toBe('https://example.com/audio.mp3');
  });

  it('sets url to undefined when no links are provided', () => {
    component.newTitle = 'Yesterday';
    component.newArtist = 'The Beatles';

    const emitted: any[] = [];
    component.resourceAdded.subscribe(v => emitted.push(v));
    component.onAdd();

    expect(emitted[0].url).toBeUndefined();
  });

  it('omits optional fields that are empty', () => {
    component.newTitle = 'Yesterday';
    component.newArtist = 'The Beatles';
    component.newAlbum = '';
    component.newGenre = '';

    const emitted: any[] = [];
    component.resourceAdded.subscribe(v => emitted.push(v));
    component.onAdd();

    expect(emitted[0].album).toBeUndefined();
    expect(emitted[0].genre).toBeUndefined();
  });

  it('includes only filled notation links in the emitted resource', () => {
    component.newTitle = 'Yesterday';
    component.newArtist = 'The Beatles';
    component.newNotationLinks = ['https://example.com/tab.pdf', '', 'https://example.com/sheet.pdf'];

    const emitted: any[] = [];
    component.resourceAdded.subscribe(v => emitted.push(v));
    component.onAdd();

    expect(emitted[0].notationLinks).toEqual([
      'https://example.com/tab.pdf',
      'https://example.com/sheet.pdf',
    ]);
  });

  it('sets notationLinks to undefined when all notation link inputs are empty', () => {
    component.newTitle = 'Yesterday';
    component.newArtist = 'The Beatles';
    component.newNotationLinks = ['', ''];

    const emitted: any[] = [];
    component.resourceAdded.subscribe(v => emitted.push(v));
    component.onAdd();

    expect(emitted[0].notationLinks).toBeUndefined();
  });

  it('resets all form fields after onAdd', () => {
    component.newTitle = 'Yesterday';
    component.newArtist = 'The Beatles';
    component.newAlbum = 'Help!';
    component.newGenre = 'Pop';
    component.newAudioLink = 'https://example.com/audio.mp3';
    component.newVideoLink = 'https://www.youtube.com/watch?v=abc';
    component.newAppleMusicLink = 'https://music.apple.com/abc';
    component.newSpotifyLink = 'https://open.spotify.com/abc';
    component.newNotationLinks = ['https://example.com/tab.pdf'];

    component.resourceAdded.subscribe(() => {});
    component.onAdd();

    expect(component.newTitle).toBe('');
    expect(component.newArtist).toBe('');
    expect(component.newAlbum).toBe('');
    expect(component.newGenre).toBe('');
    expect(component.newAudioLink).toBe('');
    expect(component.newVideoLink).toBe('');
    expect(component.newAppleMusicLink).toBe('');
    expect(component.newSpotifyLink).toBe('');
    expect(component.newNotationLinks).toEqual(['']);
  });

  it('closes the Add New dialog after onAdd', () => {
    component.showAddDialog = true;
    component.newTitle = 'Yesterday';
    component.newArtist = 'The Beatles';

    component.resourceAdded.subscribe(() => {});
    component.onAdd();

    expect(component.showAddDialog).toBe(false);
  });

  // ── notation link management ─────────────────────────────────

  it('addNotationLink appends an empty string', () => {
    component.newNotationLinks = ['https://example.com/tab.pdf'];
    component.addNotationLink();
    expect(component.newNotationLinks).toEqual(['https://example.com/tab.pdf', '']);
  });

  it('removeNotationLink removes the entry at the given index', () => {
    component.newNotationLinks = ['https://a.com', 'https://b.com', 'https://c.com'];
    component.removeNotationLink(1);
    expect(component.newNotationLinks).toEqual(['https://a.com', 'https://c.com']);
  });

  it('removeNotationLink does nothing when only one entry remains', () => {
    component.newNotationLinks = ['https://only.com'];
    component.removeNotationLink(0);
    expect(component.newNotationLinks).toEqual(['https://only.com']);
  });

  // ── onLibrarySelect ─────────────────────────────────────────

  it('emits resourceAdded with resourceId when onLibrarySelect is called', () => {
    const resource = mockResource({ id: 'lib-id-1', type: 'youtube', tags: ['jazz'] });
    const emitted: any[] = [];
    component.resourceAdded.subscribe(v => emitted.push(v));

    component.onLibrarySelect(resource);

    expect(emitted).toHaveLength(1);
    expect(emitted[0].resourceId).toBe('lib-id-1');
    expect(emitted[0].url).toBe(resource.url);
    expect(emitted[0].type).toBe('youtube');
  });

  it('onLibrarySelect defaults tags to [] when resource.tags is undefined', () => {
    const resource = mockResource({ id: 'lib-id-2', tags: undefined });
    const emitted: any[] = [];
    component.resourceAdded.subscribe(v => emitted.push(v));
    component.onLibrarySelect(resource);
    expect(emitted[0].tags).toEqual([]);
  });

  it('does not emit if onLibrarySelect receives a resource without an id', () => {
    const resource = mockResource({ id: undefined });
    const emitted: any[] = [];
    component.resourceAdded.subscribe(v => emitted.push(v));

    component.onLibrarySelect(resource);

    expect(emitted).toHaveLength(0);
  });

  // ── searchResults ────────────────────────────────────────────

  describe('searchResults', () => {
    beforeEach(async () => {
      mockResourceService.getResources.mockReturnValue(of([
        mockResource({ id: '1', label: 'Blues Scale Tutorial', url: 'https://yt.com/blues', tags: ['blues', 'scale'] }),
        mockResource({ id: '2', label: 'Jazz Chord Voicings', url: 'https://yt.com/jazz', tags: ['jazz'] }),
        mockResource({ id: '3', label: 'Pentatonic Runs', url: 'https://example.com/tab.pdf', tags: ['blues', 'lead'] }),
      ]));

      fixture = TestBed.createComponent(SessionResourcePickerComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('returns empty array when searchQuery is fewer than 3 chars', () => {
      component.searchQuery = 'bl';
      expect(component.searchResults).toHaveLength(0);
    });

    it('returns empty array when searchQuery is empty', () => {
      component.searchQuery = '';
      expect(component.searchResults).toHaveLength(0);
    });

    it('filters by label (case-insensitive)', () => {
      component.searchQuery = 'blues';
      const ids = component.searchResults.map(r => r.id);
      expect(ids).toContain('1');
      expect(ids).not.toContain('2');
      expect(ids).toContain('3');
    });

    it('filters by URL', () => {
      component.searchQuery = 'example.com';
      const ids = component.searchResults.map(r => r.id);
      expect(ids).toEqual(['3']);
    });

    it('filters by tag', () => {
      component.searchQuery = 'jazz';
      const ids = component.searchResults.map(r => r.id);
      expect(ids).toEqual(['2']);
    });

    it('returns at most 50 results (T8 listbox cap)', () => {
      const manyResources = Array.from({ length: 60 }, (_, i) =>
        mockResource({ id: `r${i}`, label: `searchable item ${i}` })
      );
      mockResourceService.getResources.mockReturnValue(of(manyResources));

      fixture = TestBed.createComponent(SessionResourcePickerComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();

      component.searchQuery = 'searchable';
      expect(component.searchResults.length).toBe(50);
    });

    it('returns empty array when no resources match', () => {
      component.searchQuery = 'xyznotfound';
      expect(component.searchResults).toHaveLength(0);
    });

    it('handles resources without tags (tags is undefined) without throwing', () => {
      mockResourceService.getResources.mockReturnValue(of([
        mockResource({ id: '10', label: 'xyzunique', url: 'https://zt.com/abc', tags: undefined }),
      ]));

      fixture = TestBed.createComponent(SessionResourcePickerComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();

      component.searchQuery = 'xyzunique';
      expect(component.searchResults).toHaveLength(1);

      component.searchQuery = 'nosuchtag';
      expect(component.searchResults).toHaveLength(0);
    });
  });

  // ── showAddDialog ────────────────────────────────────────────

  it('showAddDialog is false initially', () => {
    expect(component.showAddDialog).toBe(false);
  });

  // ── libraryLoading error path ────────────────────────────────

  it('sets libraryLoading to false when getResources errors', async () => {
    jest.clearAllMocks();
    const err$ = new Subject<Resource[]>();
    mockResourceService.getResources.mockReturnValue(err$.asObservable());

    fixture = TestBed.createComponent(SessionResourcePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.libraryLoading()).toBe(true);

    err$.error(new Error('network error'));
    fixture.detectChanges();

    expect(component.libraryLoading()).toBe(false);
  });

  // ── T8: link-resource types ─────────────────────────────────

  describe('link resource types (T8)', () => {
    const YT = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';

    beforeEach(() => {
      mockFetchOEmbed.mockReset();
      component.newType = 'youtube';
    });

    it('defaults to the song type so the existing flow is the primary path', () => {
      const fresh = TestBed.createComponent(SessionResourcePickerComponent).componentInstance;
      expect(fresh.newType).toBe('song');
      expect(fresh.isSongType).toBe(true);
    });

    it('offers all five types', () => {
      expect(component.typeOptions.map(o => o.value)).toEqual([
        'song', 'youtube', 'pdf', 'chord-sheet', 'custom',
      ]);
    });

    // canAdd

    it('canAdd is false for an unparseable URL', () => {
      component.newUrl = 'not a url';
      expect(component.canAdd).toBe(false);
    });

    it('canAdd is false for a non-http(s) scheme', () => {
      component.newType = 'custom';
      component.newUrl = 'javascript:alert(1)';
      expect(component.canAdd).toBe(false);
    });

    it('canAdd is false for an http(s) URL that is not a YouTube video when type is youtube', () => {
      component.newUrl = 'https://example.com/not-a-video';
      expect(component.canAdd).toBe(false);
    });

    it('canAdd is true for a valid YouTube URL', () => {
      component.newUrl = YT;
      expect(component.canAdd).toBe(true);
    });

    it('canAdd is true for any https URL when type is not youtube', () => {
      component.newType = 'pdf';
      component.newUrl = 'https://example.com/tab.pdf';
      expect(component.canAdd).toBe(true);
    });

    it('canAdd is false while an oEmbed fetch is in flight (NE2)', async () => {
      let resolve!: (v: any) => void;
      mockFetchOEmbed.mockReturnValue(new Promise(r => (resolve = r)));

      component.newUrl = YT;
      const pending = component.onUrlBlur();

      expect(component.oEmbedLoading()).toBe(true);
      expect(component.canAdd).toBe(false);

      resolve({ title: 'Never Gonna Give You Up', thumbnailUrl: 'https://img/1.jpg' });
      await pending;

      expect(component.oEmbedLoading()).toBe(false);
      expect(component.canAdd).toBe(true);
    });

    // oEmbed

    it('auto-fills the label and thumbnail from oEmbed', async () => {
      mockFetchOEmbed.mockResolvedValue({ title: 'Barre Chords', thumbnailUrl: 'https://img/t.jpg' });

      component.newUrl = YT;
      await component.onUrlBlur();

      expect(component.newLabel).toBe('Barre Chords');
      expect(component.thumbnailUrl()).toBe('https://img/t.jpg');
    });

    it('does not overwrite a label the user already edited', async () => {
      mockFetchOEmbed.mockResolvedValue({ title: 'From oEmbed', thumbnailUrl: '' });

      component.newLabel = 'My own label';
      component.onLabelInput();
      component.newUrl = YT;
      await component.onUrlBlur();

      expect(component.newLabel).toBe('My own label');
    });

    it('collapses the preview when oEmbed returns null', async () => {
      mockFetchOEmbed.mockResolvedValue(null);

      component.newUrl = YT;
      await component.onUrlBlur();

      expect(component.thumbnailUrl()).toBeNull();
      expect(component.oEmbedLoading()).toBe(false);
    });

    it('does not fetch oEmbed for non-youtube types', async () => {
      component.newType = 'pdf';
      component.newUrl = 'https://example.com/tab.pdf';
      await component.onUrlBlur();

      expect(mockFetchOEmbed).not.toHaveBeenCalled();
    });

    it('discards a stale oEmbed response when the URL changed mid-flight', async () => {
      let resolveFirst!: (v: any) => void;
      mockFetchOEmbed.mockReturnValueOnce(new Promise(r => (resolveFirst = r)));

      component.newUrl = YT;
      const first = component.onUrlBlur();

      // User retypes before the first request settles.
      component.newUrl = 'https://youtu.be/abcdefghijk';

      resolveFirst({ title: 'STALE TITLE', thumbnailUrl: 'https://img/stale.jpg' });
      await first;

      expect(component.newLabel).toBe('');
      expect(component.thumbnailUrl()).toBeNull();
    });

    // emit + reset

    it('emits a link-shaped resource with normalized tags', () => {
      component.newUrl = YT;
      component.newLabel = 'Barre Chords';
      component.onTagsChange([' Barre ', 'BARRE', 'Chords']);

      const emitted: any[] = [];
      component.resourceAdded.subscribe(v => emitted.push(v));
      component.onAdd();

      expect(emitted).toHaveLength(1);
      expect(emitted[0]).toEqual({
        type: 'youtube',
        url: YT,
        label: 'Barre Chords',
        tags: ['barre', 'chords'],
      });
      expect(emitted[0].title).toBeUndefined();
    });

    it('falls back to the URL when no label is given', () => {
      component.newType = 'custom';
      component.newUrl = 'https://example.com/thing';

      const emitted: any[] = [];
      component.resourceAdded.subscribe(v => emitted.push(v));
      component.onAdd();

      expect(emitted[0].label).toBe('https://example.com/thing');
    });

    it('resets the link form after adding', async () => {
      mockFetchOEmbed.mockResolvedValue({ title: 'T', thumbnailUrl: 'https://img/t.jpg' });
      component.newUrl = YT;
      await component.onUrlBlur();
      component.onTagsChange(['barre']);

      component.resourceAdded.subscribe(() => {});
      component.onAdd();

      expect(component.newUrl).toBe('');
      expect(component.newLabel).toBe('');
      expect(component.newTags).toEqual([]);
      expect(component.thumbnailUrl()).toBeNull();
      expect(component.showAddDialog).toBe(false);
    });

    it('clears the preview when the type changes', async () => {
      mockFetchOEmbed.mockResolvedValue({ title: 'T', thumbnailUrl: 'https://img/t.jpg' });
      component.newUrl = YT;
      await component.onUrlBlur();

      component.newType = 'pdf';
      component.onTypeChange();

      expect(component.thumbnailUrl()).toBeNull();
    });

    it('does not emit a link resource when canAdd is false', () => {
      component.newUrl = 'nonsense';
      const emitted: any[] = [];
      component.resourceAdded.subscribe(v => emitted.push(v));
      component.onAdd();
      expect(emitted).toHaveLength(0);
    });
  });

  // ── T8: tag filtering ───────────────────────────────────────

  describe('library tag filter (T8)', () => {
    beforeEach(() => {
      mockResourceService.getResources.mockReturnValue(of([
        mockResource({ id: 'a', label: 'Alpha', tags: ['barre', 'chords'] }),
        mockResource({ id: 'b', label: 'Beta', url: 'https://example.com/b', tags: ['barre'] }),
        mockResource({ id: 'c', label: 'Gamma', url: 'https://example.com/c', tags: [] }),
      ]));
      fixture = TestBed.createComponent(SessionResourcePickerComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('collects distinct library tags, sorted', () => {
      expect(component.libraryTags()).toEqual(['barre', 'chords']);
    });

    it('shows results from a tag filter alone, with no text query', () => {
      component.onTagFiltersChange(['barre']);
      expect(component.isFiltering).toBe(true);
      expect(component.searchResults.map(r => r.id)).toEqual(['a', 'b']);
    });

    it('requires ALL selected tags to match', () => {
      component.onTagFiltersChange(['barre', 'chords']);
      expect(component.searchResults.map(r => r.id)).toEqual(['a']);
    });

    it('normalizes tag filters to lowercase', () => {
      component.onTagFiltersChange([' BARRE ']);
      expect(component.selectedTagFilters).toEqual(['barre']);
    });

    it('combines the text query and the tag filter', () => {
      component.searchQuery = 'alpha';
      component.onTagFiltersChange(['barre']);
      expect(component.searchResults.map(r => r.id)).toEqual(['a']);
    });

    it('is not filtering when the query is short and no tag is selected', () => {
      component.searchQuery = 'al';
      expect(component.isFiltering).toBe(false);
      expect(component.searchResults).toEqual([]);
    });

    it('maps type badges to the DESIGN.md severities', () => {
      expect(component.typeSeverity('youtube')).toBe('info');
      expect(component.typeSeverity('pdf')).toBe('danger');
      expect(component.typeSeverity('chord-sheet')).toBe('success');
      expect(component.typeSeverity('song')).toBe('secondary');
    });
  });


  // ── T8: DOM rendering ───────────────────────────────────────

  describe('renders the spec\'d picker chrome (T8)', () => {
    beforeEach(() => {
      mockResourceService.getResources.mockReturnValue(of([
        mockResource({ id: 'a', label: 'Barre Chords', tags: ['barre'] }),
      ]));
      fixture = TestBed.createComponent(SessionResourcePickerComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('renders both section labels', () => {
      const text = fixture.nativeElement.textContent as string;
      expect(text).toContain('Your Library');
      expect(text).toContain('Add New');
    });

    it('applies the DESIGN.md section separator to the Add New block', () => {
      const sep = fixture.nativeElement.querySelector('.border-t');
      expect(sep).toBeTruthy();
      expect(sep.className).toContain('border-[var(--gj-border)]');
      // 0.05em per DESIGN.md > Typography, not Tailwind's tracking-wide (0.025em).
      const label = sep.querySelector('p');
      expect(label.className).toContain('tracking-[0.05em]');
    });

    it('renders a p-listbox of results once filtering', () => {
      component.searchQuery = 'barre';
      fixture.detectChanges();

      const listbox = fixture.nativeElement.querySelector('p-listbox');
      expect(listbox).toBeTruthy();
      expect(listbox.textContent).toContain('Barre Chords');
    });

    it('renders a type badge next to each library result', () => {
      component.searchQuery = 'barre';
      fixture.detectChanges();

      const tag = fixture.nativeElement.querySelector('p-listbox p-tag');
      expect(tag).toBeTruthy();
      expect(tag.textContent).toContain('youtube');
    });

    it('shows a warn message when filters match nothing', () => {
      component.searchQuery = 'zzzznomatch';
      fixture.detectChanges();

      const text = fixture.nativeElement.textContent as string;
      expect(text).toContain('No resources match your filters.');
    });
  });


  // ── Recently used quick-select ──────────────────────────────

  describe('recently used quick-select', () => {
    const ts = (seconds: number) => ({ seconds, nanoseconds: 0 }) as any;

    const withRecent = async (resources: Resource[]) => {
      mockResourceService.getResources.mockReturnValue(of(resources));
      fixture = TestBed.createComponent(SessionResourcePickerComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    };

    it('is empty when nothing has ever been used', async () => {
      await withRecent([mockResource({ id: 'a', lastUsedAt: undefined })]);
      expect(component.recentResources()).toEqual([]);
    });

    it('excludes resources that were never pinned to a session', async () => {
      await withRecent([
        mockResource({ id: 'used', lastUsedAt: ts(100) }),
        mockResource({ id: 'never', url: 'https://example.com/n', lastUsedAt: undefined }),
      ]);
      expect(component.recentResources().map(r => r.id)).toEqual(['used']);
    });

    it('orders by lastUsedAt, most recent first', async () => {
      await withRecent([
        mockResource({ id: 'old', url: 'https://example.com/1', lastUsedAt: ts(100) }),
        mockResource({ id: 'newest', url: 'https://example.com/2', lastUsedAt: ts(300) }),
        mockResource({ id: 'mid', url: 'https://example.com/3', lastUsedAt: ts(200) }),
      ]);
      expect(component.recentResources().map(r => r.id)).toEqual(['newest', 'mid', 'old']);
    });

    it('caps at three', async () => {
      await withRecent(
        Array.from({ length: 6 }, (_, i) =>
          mockResource({ id: `r${i}`, url: `https://example.com/${i}`, lastUsedAt: ts(i) })
        )
      );
      expect(component.recentResources().length).toBe(3);
    });

    it('supports a real Timestamp exposing toMillis()', async () => {
      await withRecent([
        mockResource({ id: 'a', url: 'https://example.com/a', lastUsedAt: { toMillis: () => 100 } as any }),
        mockResource({ id: 'b', url: 'https://example.com/b', lastUsedAt: { toMillis: () => 900 } as any }),
      ]);
      expect(component.recentResources().map(r => r.id)).toEqual(['b', 'a']);
    });

    it('renders a quick-add button per recent resource', async () => {
      await withRecent([mockResource({ id: 'a', label: 'Barre Basics', lastUsedAt: ts(10) })]);

      const text = fixture.nativeElement.textContent as string;
      expect(text).toContain('Recently used');
      expect(text).toContain('Barre Basics');
    });

    it('hides the section entirely when there is nothing recent', async () => {
      await withRecent([mockResource({ id: 'a', lastUsedAt: undefined })]);
      expect(fixture.nativeElement.textContent).not.toContain('Recently used');
    });

    it('emits the same payload as a listbox pick, carrying resourceId', async () => {
      await withRecent([mockResource({ id: 'res-9', label: 'Quick', lastUsedAt: ts(10), tags: ['x'] })]);

      const emitted: any[] = [];
      component.resourceAdded.subscribe(v => emitted.push(v));
      component.onLibrarySelect(component.recentResources()[0]);

      expect(emitted[0]).toEqual(
        expect.objectContaining({ resourceId: 'res-9', label: 'Quick', tags: ['x'] })
      );
    });
  });

});
