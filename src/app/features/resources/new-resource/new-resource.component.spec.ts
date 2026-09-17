import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { of, throwError } from 'rxjs';
import { NewResourceComponent } from './new-resource.component';
import { ResourceService } from '../../../services/resource.service';
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
  label: 'Test',
  tags: ['barre'],
  useCount: 0,
  createdAt: { seconds: 0, nanoseconds: 0 } as any,
  ...over,
});

const YT = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';

describe('NewResourceComponent', () => {
  let component: NewResourceComponent;
  let fixture: ComponentFixture<NewResourceComponent>;
  const svc = { getResources: jest.fn(), createResource: jest.fn() };
  const router = { navigate: jest.fn() };

  const build = async (resources: Resource[] = []) => {
    svc.getResources.mockReturnValue(of(resources));
    svc.createResource.mockResolvedValue('new-res-id');

    await TestBed.configureTestingModule({
      imports: [NewResourceComponent],
      providers: [
        provideNoopAnimations(),
        MessageService,
        { provide: ResourceService, useValue: svc },
        { provide: Router, useValue: router },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NewResourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockFetchOEmbed.mockReset();
    TestBed.resetTestingModule();
  });

  it('should create', async () => {
    await build();
    expect(component).toBeTruthy();
  });

  it('offers only link types — song is added from the session picker', async () => {
    await build();
    expect(component.typeOptions.map(o => o.value)).toEqual(['youtube', 'pdf', 'chord-sheet', 'custom']);
  });

  // ── canSave ─────────────────────────────────────────────────

  it('cannot save with an empty URL', async () => {
    await build();
    expect(component.canSave()).toBe(false);
  });

  it('cannot save a non-YouTube URL when the type is youtube', async () => {
    await build();
    component.url = 'https://example.com/video';
    expect(component.canSave()).toBe(false);
  });

  it('cannot save a non-http(s) scheme', async () => {
    await build();
    component.type = 'custom';
    component.url = 'javascript:alert(1)';
    expect(component.canSave()).toBe(false);
  });

  it('can save a valid YouTube URL', async () => {
    await build();
    component.url = YT;
    expect(component.canSave()).toBe(true);
  });

  it('can save any https URL for non-youtube types', async () => {
    await build();
    component.type = 'pdf';
    component.url = 'https://example.com/tab.pdf';
    expect(component.canSave()).toBe(true);
  });

  it('cannot save while an oEmbed fetch is in flight', async () => {
    await build();
    let resolve!: (v: any) => void;
    mockFetchOEmbed.mockReturnValue(new Promise(r => (resolve = r)));

    component.url = YT;
    const pending = component.onUrlBlur();
    expect(component.canSave()).toBe(false);

    resolve({ title: 'T', thumbnailUrl: '' });
    await pending;
    expect(component.canSave()).toBe(true);
  });

  // ── oEmbed ──────────────────────────────────────────────────

  it('auto-fills label and thumbnail from oEmbed', async () => {
    await build();
    mockFetchOEmbed.mockResolvedValue({ title: 'Barre Chords', thumbnailUrl: 'https://img/t.jpg' });

    component.url = YT;
    await component.onUrlBlur();

    expect(component.label).toBe('Barre Chords');
    expect(component.thumbnailUrl()).toBe('https://img/t.jpg');
  });

  it('does not overwrite a label the user edited', async () => {
    await build();
    mockFetchOEmbed.mockResolvedValue({ title: 'From oEmbed', thumbnailUrl: '' });

    component.label = 'Mine';
    component.onLabelInput();
    component.url = YT;
    await component.onUrlBlur();

    expect(component.label).toBe('Mine');
  });

  it('discards a stale oEmbed response when the URL changed mid-flight', async () => {
    await build();
    let resolveFirst!: (v: any) => void;
    mockFetchOEmbed.mockReturnValueOnce(new Promise(r => (resolveFirst = r)));

    component.url = YT;
    const first = component.onUrlBlur();
    component.url = 'https://youtu.be/abcdefghijk';

    resolveFirst({ title: 'STALE', thumbnailUrl: 'https://img/stale.jpg' });
    await first;

    expect(component.label).toBe('');
    expect(component.thumbnailUrl()).toBeNull();
  });

  it('does not call oEmbed for non-youtube types', async () => {
    await build();
    component.type = 'pdf';
    component.url = 'https://example.com/tab.pdf';
    await component.onUrlBlur();

    expect(mockFetchOEmbed).not.toHaveBeenCalled();
  });

  it('clears the preview when the type changes', async () => {
    await build();
    mockFetchOEmbed.mockResolvedValue({ title: 'T', thumbnailUrl: 'https://img/t.jpg' });
    component.url = YT;
    await component.onUrlBlur();

    component.type = 'pdf';
    component.onTypeChange();

    expect(component.thumbnailUrl()).toBeNull();
  });

  // ── tags ────────────────────────────────────────────────────

  it('normalizes tags to lowercase and de-duplicates', async () => {
    await build();
    component.onTagsChange([' Barre ', 'BARRE', 'Chords']);
    expect(component.tags).toEqual(['barre', 'chords']);
  });

  it('suggests existing library tags', async () => {
    await build([mockResource({ tags: ['barre', 'scales'] })]);
    component.searchTagSuggestions({ query: 'sc' } as any);
    expect(component.tagSuggestions).toEqual(['scales']);
  });

  // ── save ────────────────────────────────────────────────────

  it('saves the resource and returns to the library', async () => {
    await build();
    component.url = YT;
    component.label = '  Barre Chords  ';
    component.onTagsChange(['Barre']);

    await component.save();

    expect(svc.createResource).toHaveBeenCalledWith({
      type: 'youtube',
      url: YT,
      label: 'Barre Chords',
      tags: ['barre'],
    });
    expect(router.navigate).toHaveBeenCalledWith(['/app/resources']);
  });

  it('falls back to the URL when no label is given', async () => {
    await build();
    component.type = 'custom';
    component.url = 'https://example.com/thing';

    await component.save();

    expect(svc.createResource).toHaveBeenCalledWith(
      expect.objectContaining({ label: 'https://example.com/thing' })
    );
  });

  it('does not save when the form is invalid', async () => {
    await build();
    component.url = 'nonsense';
    await component.save();
    expect(svc.createResource).not.toHaveBeenCalled();
  });

  it('raises a sticky toast and stays on the page when the save fails', async () => {
    await build();
    svc.createResource.mockRejectedValue(new Error('offline'));
    jest.spyOn(console, 'error').mockImplementation(() => {});
    const addSpy = jest.spyOn(TestBed.inject(MessageService), 'add');

    component.url = YT;
    await component.save();

    expect(addSpy).toHaveBeenCalledWith(
      expect.objectContaining({ severity: 'error', sticky: true })
    );
    expect(router.navigate).not.toHaveBeenCalled();
    expect(component.saving()).toBe(false);
  });

  it('cancel returns to the library without saving', async () => {
    await build();
    component.cancel();
    expect(router.navigate).toHaveBeenCalledWith(['/app/resources']);
    expect(svc.createResource).not.toHaveBeenCalled();
  });

  it('survives getResources() erroring', async () => {
    svc.getResources.mockReturnValue(throwError(() => new Error('boom')));
    await TestBed.configureTestingModule({
      imports: [NewResourceComponent],
      providers: [
        provideNoopAnimations(),
        MessageService,
        { provide: ResourceService, useValue: svc },
        { provide: Router, useValue: router },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(NewResourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component).toBeTruthy();
    expect(component.tagSuggestions).toEqual([]);
  });
});
