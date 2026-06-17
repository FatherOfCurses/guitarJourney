import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { Subject, of } from 'rxjs';
import { SessionResourcePickerComponent } from './session-resource-picker.component';
import { ResourceService } from '../../../services/resource.service';
import { AutocompleteSuggestionService } from '../../../services/autocomplete-suggestion.service';
import { Resource } from '../../../models/resource';

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

    it('returns at most 20 results', () => {
      const manyResources = Array.from({ length: 25 }, (_, i) =>
        mockResource({ id: `r${i}`, label: `searchable item ${i}` })
      );
      mockResourceService.getResources.mockReturnValue(of(manyResources));

      fixture = TestBed.createComponent(SessionResourcePickerComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();

      component.searchQuery = 'searchable';
      expect(component.searchResults.length).toBeLessThanOrEqual(20);
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
});
