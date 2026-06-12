import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { SessionResourcePickerComponent } from './session-resource-picker.component';
import { ResourceService } from '../../../services/resource.service';
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

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('sets libraryLoading to false after getResources emits', () => {
    expect(component.libraryLoading()).toBe(false);
  });

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

  it('does not emit if onLibrarySelect receives a resource without an id', () => {
    const resource = mockResource({ id: undefined });
    const emitted: any[] = [];
    component.resourceAdded.subscribe(v => emitted.push(v));

    component.onLibrarySelect(resource);

    expect(emitted).toHaveLength(0);
  });

  it('filteredResources filters by label case-insensitively', () => {
    mockResourceService.getResources.mockReturnValue(
      of([
        mockResource({ id: '1', label: 'Blues Scale' }),
        mockResource({ id: '2', label: 'Jazz Chord' }),
      ])
    );

    fixture = TestBed.createComponent(SessionResourcePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.labelFilter = 'blues';
    expect(component.filteredResources.map(r => r.id)).toEqual(['1']);
  });

  it('onTypeChange clears the oEmbed thumbnail', () => {
    (component as any)._oEmbedThumbnail.set('https://img.youtube.com/vi/test/0.jpg');
    component.onTypeChange();
    expect(component.oEmbedThumbnail()).toBeNull();
  });
});
