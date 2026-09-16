import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ResourceLibraryComponent, LIBRARY_LIMIT } from './resource-library.component';
import { ResourceService } from '../../services/resource.service';
import { Resource } from '../../models/resource';

const mockResource = (over: Partial<Resource> = {}): Resource => ({
  id: 'res-1',
  type: 'youtube',
  url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  label: 'Barre Chord Basics',
  tags: ['barre'],
  useCount: 0,
  createdAt: { seconds: 0, nanoseconds: 0 } as any,
  ...over,
});

const mockResourceService = {
  getResources: jest.fn().mockReturnValue(of([])),
  deleteResource: jest.fn().mockResolvedValue(undefined),
  updateResource: jest.fn().mockResolvedValue(undefined),
};

const mockRouter = { navigate: jest.fn() };

describe('ResourceLibraryComponent', () => {
  let component: ResourceLibraryComponent;
  let fixture: ComponentFixture<ResourceLibraryComponent>;

  const build = async (resources: Resource[] = []) => {
    mockResourceService.getResources.mockReturnValue(of(resources));

    await TestBed.configureTestingModule({
      imports: [ResourceLibraryComponent],
      providers: [
        provideNoopAnimations(),
        { provide: ResourceService, useValue: mockResourceService },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ResourceLibraryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockResourceService.getResources.mockReturnValue(of([]));
    mockResourceService.deleteResource.mockResolvedValue(undefined);
    mockResourceService.updateResource.mockResolvedValue(undefined);
    TestBed.resetTestingModule();
  });

  // ── Creation / loading ──────────────────────────────────────

  it('should create', async () => {
    await build();
    expect(component).toBeTruthy();
  });

  it('clears the loading flag once getResources emits', async () => {
    await build([mockResource()]);
    expect(component.loading()).toBe(false);
  });

  it('clears the loading flag when getResources errors', async () => {
    mockResourceService.getResources.mockReturnValue(throwError(() => new Error('boom')));
    await TestBed.configureTestingModule({
      imports: [ResourceLibraryComponent],
      providers: [
        provideNoopAnimations(),
        { provide: ResourceService, useValue: mockResourceService },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(ResourceLibraryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.loading()).toBe(false);
  });

  // ── Empty state ─────────────────────────────────────────────

  it('reports an empty library when no resources are returned', async () => {
    await build([]);
    expect(component.isEmptyLibrary()).toBe(true);
    expect(component.noFilterResults()).toBe(false);
  });

  it('renders the empty-state message and a "Start a session" button', async () => {
    await build([]);
    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain('Your resource library is empty');
    expect(text).toContain('Start a session');
  });

  it('navigates to the new session route from the empty state', async () => {
    await build([]);
    component.startSession();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/app/newSession']);
  });

  // ── Filtering ───────────────────────────────────────────────

  it('filters by label substring, case-insensitively', async () => {
    await build([
      mockResource({ id: 'a', label: 'Barre Chord Basics' }),
      mockResource({ id: 'b', label: 'Fingerpicking Drill', url: 'https://example.com/fp' }),
    ]);

    component.labelFilter.set('barre');
    expect(component.filteredResources().map(r => r.id)).toEqual(['a']);
  });

  it('filters to resources matching ALL selected tags', async () => {
    await build([
      mockResource({ id: 'a', tags: ['barre', 'chords'] }),
      mockResource({ id: 'b', tags: ['barre'], url: 'https://example.com/b' }),
    ]);

    component.selectedTags.set(['barre', 'chords']);
    expect(component.filteredResources().map(r => r.id)).toEqual(['a']);
  });

  it('collects the distinct tags across the library, sorted', async () => {
    await build([
      mockResource({ id: 'a', tags: ['scales', 'barre'] }),
      mockResource({ id: 'b', tags: ['barre'], url: 'https://example.com/b' }),
    ]);

    expect(component.allTags()).toEqual(['barre', 'scales']);
  });

  it('reports a filter no-results state rather than an empty library', async () => {
    await build([mockResource()]);
    component.labelFilter.set('nothing matches this');

    expect(component.noFilterResults()).toBe(true);
    expect(component.isEmptyLibrary()).toBe(false);
  });

  it('clearFilters() resets both filters', async () => {
    await build([mockResource()]);
    component.labelFilter.set('barre');
    component.selectedTags.set(['barre']);

    component.clearFilters();

    expect(component.labelFilter()).toBe('');
    expect(component.selectedTags()).toEqual([]);
    expect(component.hasFilters()).toBe(false);
  });

  // ── 200-item cap notice ─────────────────────────────────────

  it('flags the library limit when exactly 200 resources are returned', async () => {
    const many = Array.from({ length: LIBRARY_LIMIT }, (_, i) =>
      mockResource({ id: `res-${i}`, url: `https://example.com/${i}` })
    );
    await build(many);

    expect(component.atLibraryLimit()).toBe(true);
    expect(fixture.nativeElement.textContent).toContain('Showing 200 resources (library limit)');
  });

  it('does not flag the library limit below 200 resources', async () => {
    await build([mockResource()]);
    expect(component.atLibraryLimit()).toBe(false);
  });

  // ── Type badge severity ─────────────────────────────────────

  it('maps resource types to the DESIGN.md badge severities', async () => {
    await build();
    expect(component.typeSeverity('youtube')).toBe('info');
    expect(component.typeSeverity('pdf')).toBe('danger');
    expect(component.typeSeverity('chord-sheet')).toBe('success');
    expect(component.typeSeverity('custom')).toBe('secondary');
  });

  it('falls back to secondary for unmapped types', async () => {
    await build();
    expect(component.typeSeverity('something-new')).toBe('secondary');
  });

  // ── Delete ──────────────────────────────────────────────────

  it('confirmDelete() opens the confirm dialog without deleting', async () => {
    await build([mockResource()]);
    component.confirmDelete(component.resources()[0]);

    expect(component.deleteTarget()?.id).toBe('res-1');
    expect(mockResourceService.deleteResource).not.toHaveBeenCalled();
  });

  it('cancelDelete() closes the dialog without deleting', async () => {
    await build([mockResource()]);
    component.confirmDelete(component.resources()[0]);
    component.cancelDelete();

    expect(component.deleteTarget()).toBeNull();
    expect(mockResourceService.deleteResource).not.toHaveBeenCalled();
  });

  it('deletes on confirm and resets deletingId', async () => {
    await build([mockResource()]);
    component.confirmDelete(component.resources()[0]);

    await component.onDeleteConfirmed();

    expect(mockResourceService.deleteResource).toHaveBeenCalledWith('res-1');
    expect(component.deletingId()).toBeNull();
    expect(component.deleteTarget()).toBeNull();
  });

  it('marks the card as deleting while deleteResource() is in flight', async () => {
    await build([mockResource()]);
    let resolveDelete!: () => void;
    mockResourceService.deleteResource.mockReturnValue(
      new Promise<void>(resolve => (resolveDelete = resolve))
    );

    component.confirmDelete(component.resources()[0]);
    const pending = component.onDeleteConfirmed();
    expect(component.deletingId()).toBe('res-1');

    resolveDelete();
    await pending;
    expect(component.deletingId()).toBeNull();
  });

  it('resets deletingId when deleteResource() rejects', async () => {
    await build([mockResource()]);
    mockResourceService.deleteResource.mockRejectedValue(new Error('offline'));
    jest.spyOn(console, 'error').mockImplementation(() => {});

    component.confirmDelete(component.resources()[0]);
    await component.onDeleteConfirmed();

    expect(component.deletingId()).toBeNull();
  });

  // ── Edit ────────────────────────────────────────────────────

  it('openEdit() seeds the dialog fields from the resource', async () => {
    await build([mockResource({ label: 'Barre Chords', tags: ['barre'] })]);
    component.openEdit(component.resources()[0]);

    expect(component.editTarget()?.id).toBe('res-1');
    expect(component.editLabel).toBe('Barre Chords');
    expect(component.editTags).toEqual(['barre']);
  });

  it('normalizes edited tags to lowercase and de-duplicates them', async () => {
    await build([mockResource()]);
    component.onEditTagsChange([' Barre ', 'BARRE', 'Chords', '  ']);

    expect(component.editTags).toEqual(['barre', 'chords']);
  });

  it('saves label and tag changes and closes the dialog', async () => {
    await build([mockResource()]);
    component.openEdit(component.resources()[0]);
    component.editLabel = '  Barre Chords v2  ';
    component.onEditTagsChange(['Barre']);

    await component.saveEdit();

    expect(mockResourceService.updateResource).toHaveBeenCalledWith('res-1', {
      label: 'Barre Chords v2',
      tags: ['barre'],
    });
    expect(component.editTarget()).toBeNull();
    expect(component.savingEdit()).toBe(false);
  });

  it('does not save an empty label', async () => {
    await build([mockResource()]);
    component.openEdit(component.resources()[0]);
    component.editLabel = '   ';

    await component.saveEdit();

    expect(mockResourceService.updateResource).not.toHaveBeenCalled();
    expect(component.editTarget()).not.toBeNull();
  });

  it('keeps the edit dialog open when updateResource() rejects', async () => {
    await build([mockResource()]);
    mockResourceService.updateResource.mockRejectedValue(new Error('offline'));
    jest.spyOn(console, 'error').mockImplementation(() => {});

    component.openEdit(component.resources()[0]);
    await component.saveEdit();

    expect(component.editTarget()).not.toBeNull();
    expect(component.savingEdit()).toBe(false);
  });

  it('cancelEdit() closes the dialog without saving', async () => {
    await build([mockResource()]);
    component.openEdit(component.resources()[0]);
    component.cancelEdit();

    expect(component.editTarget()).toBeNull();
    expect(mockResourceService.updateResource).not.toHaveBeenCalled();
  });
});
