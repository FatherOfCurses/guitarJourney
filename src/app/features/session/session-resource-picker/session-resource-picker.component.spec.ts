import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { Subject, of } from 'rxjs';
import { SessionResourcePickerComponent } from './session-resource-picker.component';
import { ResourceService } from '../../../services/resource.service';
import { Resource } from '../../../models/resource';
import * as youtube from '../../../utils/youtube';

jest.mock('../../../utils/youtube', () => {
  const actual = jest.requireActual('../../../utils/youtube');
  return {
    ...actual,
    fetchYouTubeOEmbed: jest.fn(),
  };
});

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

  it('canAdd is false when url is empty', () => {
    component.newUrl = '';
    component.newLabel = 'Some label';
    expect(component.canAdd).toBe(false);
  });

  it('canAdd is false when label is empty', () => {
    component.newUrl = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
    component.newLabel = '';
    expect(component.canAdd).toBe(false);
  });

  it('canAdd is false when URL has non-http protocol', () => {
    component.newType = 'pdf';
    component.newUrl = 'ftp://example.com/tab.pdf';
    component.newLabel = 'My PDF';
    expect(component.canAdd).toBe(false);
  });

  it('canAdd is false when youtube type but URL is not a valid youtube URL', () => {
    component.newType = 'youtube';
    component.newUrl = 'https://example.com/video';
    component.newLabel = 'My Video';
    expect(component.canAdd).toBe(false);
  });

  it('canAdd is true for a valid youtube URL with a label', () => {
    component.newType = 'youtube';
    component.newUrl = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
    component.newLabel = 'My Video';
    expect(component.canAdd).toBe(true);
  });

  it('canAdd is true for a non-youtube type with any valid https URL', () => {
    component.newType = 'pdf';
    component.newUrl = 'https://example.com/tab.pdf';
    component.newLabel = 'Tab PDF';
    expect(component.canAdd).toBe(true);
  });

  // ── onAdd ───────────────────────────────────────────────────

  it('onAdd does nothing when canAdd is false', () => {
    component.newUrl = '';
    component.newLabel = '';
    const emitted: any[] = [];
    component.resourceAdded.subscribe(v => emitted.push(v));
    component.onAdd();
    expect(emitted).toHaveLength(0);
  });

  it('emits resourceAdded with correct shape when onAdd is called', () => {
    component.newType = 'pdf';
    component.newUrl = 'https://example.com/tab.pdf';
    component.newLabel = 'My Tab';
    component.newTags = ['Blues', 'Beginner'];

    const emitted: any[] = [];
    component.resourceAdded.subscribe(v => emitted.push(v));

    component.onAdd();

    expect(emitted).toHaveLength(1);
    expect(emitted[0]).toEqual({
      type: 'pdf',
      url: 'https://example.com/tab.pdf',
      label: 'My Tab',
      tags: ['blues', 'beginner'],
    });
  });

  it('resets form fields after onAdd', () => {
    component.newType = 'pdf';
    component.newUrl = 'https://example.com/tab.pdf';
    component.newLabel = 'My Tab';
    component.newTags = ['blues'];

    component.resourceAdded.subscribe(() => {});
    component.onAdd();

    expect(component.newType).toBe('youtube');
    expect(component.newUrl).toBe('');
    expect(component.newLabel).toBe('');
    expect(component.newTags).toEqual([]);
  });

  it('closes the Add New dialog after onAdd', () => {
    component.showAddDialog = true;
    component.newType = 'pdf';
    component.newUrl = 'https://example.com/tab.pdf';
    component.newLabel = 'My Tab';

    component.resourceAdded.subscribe(() => {});
    component.onAdd();

    expect(component.showAddDialog).toBe(false);
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

      // 'xyzunique' matches label so resource is found; tags check is not reached here
      component.searchQuery = 'xyzunique';
      expect(component.searchResults).toHaveLength(1);

      // Now search something that doesn't match label or URL but tags would (if defined)
      // Since tags is undefined, ?? [] kicks in and returns [] — resource not found, no crash
      component.searchQuery = 'nosuchtag';
      expect(component.searchResults).toHaveLength(0);
    });
  });

  // ── showAddDialog ────────────────────────────────────────────

  it('showAddDialog is false initially', () => {
    expect(component.showAddDialog).toBe(false);
  });

  // ── onTypeChange ─────────────────────────────────────────────

  it('onTypeChange clears the oEmbed thumbnail', () => {
    (component as any)._oEmbedThumbnail.set('https://img.youtube.com/vi/test/0.jpg');
    component.onTypeChange();
    expect(component.oEmbedThumbnail()).toBeNull();
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

  // ── onUrlBlur ────────────────────────────────────────────────

  it('onUrlBlur returns early when newType is not youtube', async () => {
    const fetchSpy = jest.spyOn(youtube, 'fetchYouTubeOEmbed');
    component.newType = 'pdf';
    component.newUrl = 'https://example.com/tab.pdf';
    await component.onUrlBlur();
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('onUrlBlur returns early when url is empty', async () => {
    const fetchSpy = jest.spyOn(youtube, 'fetchYouTubeOEmbed');
    component.newType = 'youtube';
    component.newUrl = '';
    await component.onUrlBlur();
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('onUrlBlur returns early when url changes during fetch', async () => {
    const ytUrl = 'https://www.youtube.com/watch?v=abc';
    (youtube.fetchYouTubeOEmbed as jest.Mock).mockImplementation(async () => {
      component.newUrl = 'https://www.youtube.com/watch?v=changed';
      return { title: 'Rick', thumbnailUrl: 'https://img' };
    });

    component.newType = 'youtube';
    component.newUrl = ytUrl;
    component.newLabel = '';
    await component.onUrlBlur();

    expect(component.newLabel).toBe('');
    expect(component.oEmbedThumbnail()).toBeNull();
  });

  it('onUrlBlur sets label from oembed.title when label is empty', async () => {
    (youtube.fetchYouTubeOEmbed as jest.Mock).mockResolvedValue({
      title: 'Rick Astley',
      thumbnailUrl: 'https://img.youtube.com/vi/abc/0.jpg',
    });

    component.newType = 'youtube';
    component.newUrl = 'https://www.youtube.com/watch?v=abc';
    component.newLabel = '';
    await component.onUrlBlur();

    expect(component.newLabel).toBe('Rick Astley');
    expect(component.oEmbedThumbnail()).toBe('https://img.youtube.com/vi/abc/0.jpg');
  });

  it('onUrlBlur does not overwrite existing label', async () => {
    (youtube.fetchYouTubeOEmbed as jest.Mock).mockResolvedValue({
      title: 'Rick Astley',
      thumbnailUrl: 'https://img.youtube.com/vi/abc/0.jpg',
    });

    component.newType = 'youtube';
    component.newUrl = 'https://www.youtube.com/watch?v=abc';
    component.newLabel = 'My custom label';
    await component.onUrlBlur();

    expect(component.newLabel).toBe('My custom label');
  });

  it('onUrlBlur sets thumbnail to null when oembed.thumbnailUrl is empty', async () => {
    (youtube.fetchYouTubeOEmbed as jest.Mock).mockResolvedValue({
      title: 'Some video',
      thumbnailUrl: '',
    });

    component.newType = 'youtube';
    component.newUrl = 'https://www.youtube.com/watch?v=abc';
    component.newLabel = 'Existing';
    await component.onUrlBlur();

    expect(component.oEmbedThumbnail()).toBeNull();
  });

  it('onUrlBlur does nothing when oembed is null', async () => {
    (youtube.fetchYouTubeOEmbed as jest.Mock).mockResolvedValue(null);

    component.newType = 'youtube';
    component.newUrl = 'https://www.youtube.com/watch?v=abc';
    component.newLabel = 'Existing';
    await component.onUrlBlur();

    expect(component.newLabel).toBe('Existing');
    expect(component.oEmbedThumbnail()).toBeNull();
  });
});
