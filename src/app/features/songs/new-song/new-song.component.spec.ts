import { TestBed, fakeAsync, flushMicrotasks } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { NewSongComponent } from './new-song.component';
import { SongsService } from '@services/songs.service';
import { AutocompleteSuggestionService } from '@services/autocomplete-suggestion.service';
import { Router } from '@angular/router';

function type(el: HTMLInputElement | HTMLTextAreaElement, value: string) {
  el.value = value;
  el.dispatchEvent(new Event('input'));
}

const songsSvcMock: any = {
  create: jest.fn(() => Promise.resolve('new-song-id')),
};

const routerMock: any = {
  navigate: jest.fn(),
};

const suggestionSvcMock: any = {
  suggestTitles: jest.fn(() => of([])),
  suggestArtists: jest.fn(() => of([])),
  suggestAlbums: jest.fn(() => of([])),
};

describe('NewSongComponent', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    await TestBed.configureTestingModule({
      imports: [NewSongComponent],
      providers: [
        { provide: SongsService, useValue: songsSvcMock },
        { provide: Router, useValue: routerMock },
        { provide: AutocompleteSuggestionService, useValue: suggestionSvcMock },
      ],
    }).compileComponents();
  });

  function createFixture() {
    const fixture = TestBed.createComponent(NewSongComponent);
    fixture.detectChanges();
    return { fixture, cmp: fixture.componentInstance };
  }

  // ---------- Creation & form defaults ----------

  it('should create', () => {
    const { cmp } = createFixture();
    expect(cmp).toBeTruthy();
  });

  it('initialises with an invalid form (title and artist are empty)', () => {
    const { cmp } = createFixture();
    expect(cmp.songForm.invalid).toBe(true);
    expect(cmp.titleCtrl.invalid).toBe(true);
    expect(cmp.artistCtrl.invalid).toBe(true);
  });

  it('starts with one empty notation link control', () => {
    const { cmp } = createFixture();
    expect(cmp.notationLinksArray.length).toBe(1);
    expect(cmp.notationLinksArray.at(0).value).toBe('');
  });

  it('saving signal is initially false', () => {
    const { cmp } = createFixture();
    expect(cmp.saving()).toBe(false);
  });

  // ---------- Validation ----------

  it('form becomes valid when title and artist are filled', () => {
    const { cmp } = createFixture();
    cmp.songForm.patchValue({ title: 'Blackbird', artist: 'The Beatles' });
    expect(cmp.songForm.valid).toBe(true);
  });

  it('title is required — setting it to empty keeps form invalid', () => {
    const { cmp } = createFixture();
    cmp.songForm.patchValue({ title: '', artist: 'The Beatles' });
    expect(cmp.songForm.invalid).toBe(true);
  });

  it('artist is required — setting it to empty keeps form invalid', () => {
    const { cmp } = createFixture();
    cmp.songForm.patchValue({ title: 'Blackbird', artist: '' });
    expect(cmp.songForm.invalid).toBe(true);
  });

  // ---------- Validation error display in DOM ----------

  it('shows title error when touched and empty', () => {
    const { fixture } = createFixture();

    const titleCtrl = fixture.componentInstance.titleCtrl;
    titleCtrl.markAsTouched();
    titleCtrl.markAsDirty();
    fixture.detectChanges();

    const errors = fixture.nativeElement.querySelectorAll('.text-red-600');
    const titleError = Array.from(errors as NodeListOf<HTMLElement>).find(
      (el) => el.textContent?.includes('Title is required')
    );
    expect(titleError).toBeTruthy();
  });

  it('shows artist error when touched and empty', () => {
    const { fixture } = createFixture();

    const artistCtrl = fixture.componentInstance.artistCtrl;
    artistCtrl.markAsTouched();
    artistCtrl.markAsDirty();
    fixture.detectChanges();

    const errors = fixture.nativeElement.querySelectorAll('.text-red-600');
    const artistError = Array.from(errors as NodeListOf<HTMLElement>).find(
      (el) => el.textContent?.includes('Artist is required')
    );
    expect(artistError).toBeTruthy();
  });

  // ---------- Save button disabled state ----------

  it('Save button is disabled when form is invalid', () => {
    const { fixture } = createFixture();
    const submitBtn = fixture.debugElement.query(
      By.css('button[type="submit"]')
    ).nativeElement as HTMLButtonElement;
    expect(submitBtn.disabled).toBe(true);
  });

  it('Save button is enabled when form is valid', () => {
    const { fixture, cmp } = createFixture();
    cmp.songForm.patchValue({ title: 'Creep', artist: 'Radiohead' });
    fixture.detectChanges();

    const submitBtn = fixture.debugElement.query(
      By.css('button[type="submit"]')
    ).nativeElement as HTMLButtonElement;
    expect(submitBtn.disabled).toBe(false);
  });

  // ---------- Notation links management ----------

  it('addNotationLink() adds a new control to the FormArray', () => {
    const { cmp } = createFixture();
    expect(cmp.notationLinksArray.length).toBe(1);
    cmp.addNotationLink();
    expect(cmp.notationLinksArray.length).toBe(2);
    cmp.addNotationLink();
    expect(cmp.notationLinksArray.length).toBe(3);
  });

  it('removeNotationLink() removes a control when more than one exists', () => {
    const { cmp } = createFixture();
    cmp.addNotationLink();
    expect(cmp.notationLinksArray.length).toBe(2);
    cmp.removeNotationLink(0);
    expect(cmp.notationLinksArray.length).toBe(1);
  });

  it('removeNotationLink() does not remove the last control', () => {
    const { cmp } = createFixture();
    expect(cmp.notationLinksArray.length).toBe(1);
    cmp.removeNotationLink(0);
    expect(cmp.notationLinksArray.length).toBe(1);
  });

  // ---------- cancel ----------

  it('cancel() navigates to /app/songs', () => {
    const { cmp } = createFixture();
    cmp.cancel();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/app', 'songs']);
  });

  // ---------- onSubmit ----------

  it('onSubmit() does nothing when form is invalid', () => {
    const { cmp } = createFixture();
    cmp.onSubmit();
    expect(songsSvcMock.create).not.toHaveBeenCalled();
    expect(cmp.saving()).toBe(false);
  });

  it('onSubmit() calls create with required fields and navigates on success', fakeAsync(() => {
    const { cmp } = createFixture();
    cmp.songForm.patchValue({ title: 'Blackbird', artist: 'The Beatles' });

    cmp.onSubmit();

    expect(cmp.saving()).toBe(true);
    expect(songsSvcMock.create).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Blackbird',
        artist: 'The Beatles',
      })
    );

    flushMicrotasks();

    expect(cmp.saving()).toBe(false);
    expect(routerMock.navigate).toHaveBeenCalledWith(['/app', 'songs']);
  }));

  it('onSubmit() passes all optional fields when provided', fakeAsync(() => {
    const { cmp } = createFixture();
    cmp.songForm.patchValue({
      title: 'Hotel California',
      artist: 'Eagles',
      album: 'Hotel California',
      genre: 'Rock',
      audioLink: 'https://example.com/audio.mp3',
      videoLink: 'https://example.com/video.mp4',
      appleMusicLink: 'https://music.apple.com/track/123',
      spotifyLink: 'https://open.spotify.com/track/456',
    });
    cmp.notationLinksArray.at(0).setValue('https://example.com/tabs.pdf');

    cmp.onSubmit();
    flushMicrotasks();

    expect(songsSvcMock.create).toHaveBeenCalledWith({
      title: 'Hotel California',
      artist: 'Eagles',
      album: 'Hotel California',
      genre: 'Rock',
      audioLink: 'https://example.com/audio.mp3',
      videoLink: 'https://example.com/video.mp4',
      appleMusicLink: 'https://music.apple.com/track/123',
      spotifyLink: 'https://open.spotify.com/track/456',
      notationLinks: ['https://example.com/tabs.pdf'],
    });
  }));

  it('onSubmit() filters out empty notation links', fakeAsync(() => {
    const { cmp } = createFixture();
    cmp.songForm.patchValue({ title: 'Test', artist: 'Artist' });
    cmp.addNotationLink();
    cmp.addNotationLink();
    cmp.notationLinksArray.at(0).setValue('https://example.com/tab1.pdf');
    cmp.notationLinksArray.at(1).setValue('');
    cmp.notationLinksArray.at(2).setValue('  ');

    cmp.onSubmit();
    flushMicrotasks();

    expect(songsSvcMock.create).toHaveBeenCalledWith(
      expect.objectContaining({
        notationLinks: ['https://example.com/tab1.pdf'],
      })
    );
  }));

  it('onSubmit() sets notationLinks to undefined when all links are empty', fakeAsync(() => {
    const { cmp } = createFixture();
    cmp.songForm.patchValue({ title: 'Test', artist: 'Artist' });
    // default notation link is already ''

    cmp.onSubmit();
    flushMicrotasks();

    expect(songsSvcMock.create).toHaveBeenCalledWith(
      expect.objectContaining({
        notationLinks: undefined,
      })
    );
  }));

  it('onSubmit() converts empty optional strings to undefined', fakeAsync(() => {
    const { cmp } = createFixture();
    cmp.songForm.patchValue({
      title: 'Song',
      artist: 'Artist',
      album: '',
      genre: '',
      audioLink: '',
      videoLink: '',
      appleMusicLink: '',
      spotifyLink: '',
    });

    cmp.onSubmit();
    flushMicrotasks();

    expect(songsSvcMock.create).toHaveBeenCalledWith(
      expect.objectContaining({
        album: undefined,
        genre: undefined,
        audioLink: undefined,
        videoLink: undefined,
        appleMusicLink: undefined,
        spotifyLink: undefined,
      })
    );
  }));

  it('onSubmit() turns off saving and does not navigate on error', fakeAsync(() => {
    songsSvcMock.create.mockRejectedValueOnce(new Error('write failed'));
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    const { cmp } = createFixture();
    cmp.songForm.patchValue({ title: 'Bad', artist: 'Song' });

    cmp.onSubmit();
    expect(cmp.saving()).toBe(true);

    flushMicrotasks();

    expect(cmp.saving()).toBe(false);
    expect(errorSpy).toHaveBeenCalledWith('Error saving song:', expect.any(Error));
    expect(routerMock.navigate).not.toHaveBeenCalled();

    errorSpy.mockRestore();
  }));

  // ---------- Autocomplete handlers ----------

  it('searchTitles() calls suggestion service and updates titleSuggestions', () => {
    const { cmp } = createFixture();
    suggestionSvcMock.suggestTitles.mockReturnValue(of(['Blackbird', 'Black Dog']));

    cmp.searchTitles({ query: 'bla' } as any);

    expect(suggestionSvcMock.suggestTitles).toHaveBeenCalledWith('bla');
    expect(cmp.titleSuggestions).toEqual(['Blackbird', 'Black Dog']);
  });

  it('searchArtists() calls suggestion service and updates artistSuggestions', () => {
    const { cmp } = createFixture();
    suggestionSvcMock.suggestArtists.mockReturnValue(of(['The Beatles', 'The Who']));

    cmp.searchArtists({ query: 'the' } as any);

    expect(suggestionSvcMock.suggestArtists).toHaveBeenCalledWith('the');
    expect(cmp.artistSuggestions).toEqual(['The Beatles', 'The Who']);
  });

  it('searchAlbums() calls suggestion service and updates albumSuggestions', () => {
    const { cmp } = createFixture();
    suggestionSvcMock.suggestAlbums.mockReturnValue(of(['Abbey Road', 'Appetite for Destruction']));

    cmp.searchAlbums({ query: 'a' } as any);

    expect(suggestionSvcMock.suggestAlbums).toHaveBeenCalledWith('a');
    expect(cmp.albumSuggestions).toEqual(['Abbey Road', 'Appetite for Destruction']);
  });

  // ---------- Template-driven interactions ----------

  it('filling title and artist via DOM and submitting calls create', fakeAsync(() => {
    const { fixture, cmp } = createFixture();

    // PrimeNG AutoComplete renders an inner input with the inputId attribute
    const titleInput = fixture.nativeElement.querySelector('input#title') as HTMLInputElement;
    const artistInput = fixture.nativeElement.querySelector('input#artist') as HTMLInputElement;

    type(titleInput, 'Wish You Were Here');
    type(artistInput, 'Pink Floyd');
    fixture.detectChanges();

    const form = fixture.debugElement.query(By.css('form')).nativeElement as HTMLFormElement;
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    fixture.detectChanges();

    expect(songsSvcMock.create).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Wish You Were Here',
        artist: 'Pink Floyd',
      })
    );

    flushMicrotasks();

    expect(cmp.saving()).toBe(false);
    expect(routerMock.navigate).toHaveBeenCalledWith(['/app', 'songs']);
  }));
});
