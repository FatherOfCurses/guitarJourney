import { TestBed, ComponentFixture } from '@angular/core/testing';
import { provideRouter, Router, ActivatedRoute, convertToParamMap } from '@angular/router';
import { Subject, of, throwError } from 'rxjs';
import { DisplaySongComponent } from './display-song.component';
import { SongsService } from '@services/songs.service';
import type { Song } from '@models/song';

describe('DisplaySongComponent', () => {
  let fixture: ComponentFixture<DisplaySongComponent>;
  let paramMap$: Subject<ReturnType<typeof convertToParamMap>>;
  let get$: Subject<Song | undefined>;

  const songsSvcMock: any = {
    get$: jest.fn(() => get$),
  };

  const makeSong = (over: Partial<Song> = {}): Song => ({
    id: 'song-1',
    ownerUid: 'u1',
    title: 'Blackbird',
    artist: 'The Beatles',
    ...over,
  });

  async function setup() {
    paramMap$ = new Subject();
    get$ = new Subject<Song | undefined>();

    // Reset the mock so it returns the fresh Subject each test
    songsSvcMock.get$.mockImplementation(() => get$);

    await TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: paramMap$.asObservable(),
            snapshot: { paramMap: convertToParamMap({}) },
          },
        },
        { provide: SongsService, useValue: songsSvcMock },
      ],
      imports: [DisplaySongComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DisplaySongComponent);
    fixture.detectChanges();
  }

  const emitId = (id: string) => {
    paramMap$.next(convertToParamMap({ id }));
  };

  function textContent(): string {
    return (fixture.nativeElement as HTMLElement).textContent ?? '';
  }

  afterEach(() => {
    jest.clearAllMocks();
  });

  // ---------- Loading state ----------

  it('shows Loading… while waiting for song data', async () => {
    await setup();
    emitId('song-1');
    fixture.detectChanges();

    expect(textContent()).toContain('Loading');
  });

  // ---------- Error state ----------

  it('stays in loading state when the service errors (catchError emits null, same as initial)', async () => {
    await setup();
    songsSvcMock.get$.mockReturnValue(throwError(() => new Error('boom')));
    emitId('bad-id');
    fixture.detectChanges();

    await new Promise(resolve => setTimeout(resolve, 0));
    fixture.detectChanges();

    // With the current loading() computed (song === null && songId !== null),
    // the error case is indistinguishable from the loading state.
    expect(textContent()).toContain('Loading');
  });

  // ---------- Success state: required fields ----------

  it('renders the song title in the header', async () => {
    await setup();
    emitId('song-1');
    get$.next(makeSong({ title: 'Hotel California' }));
    get$.complete();
    fixture.detectChanges();

    expect(textContent()).toContain('Hotel California');
  });

  it('renders the artist', async () => {
    await setup();
    emitId('song-1');
    get$.next(makeSong({ artist: 'Eagles' }));
    get$.complete();
    fixture.detectChanges();

    expect(textContent()).toContain('Eagles');
  });

  // ---------- Success state: optional fields shown when present ----------

  it('renders album when present', async () => {
    await setup();
    emitId('song-1');
    get$.next(makeSong({ album: 'The White Album' }));
    get$.complete();
    fixture.detectChanges();

    expect(textContent()).toContain('Album');
    expect(textContent()).toContain('The White Album');
  });

  it('renders genre when present', async () => {
    await setup();
    emitId('song-1');
    get$.next(makeSong({ genre: 'Folk' }));
    get$.complete();
    fixture.detectChanges();

    expect(textContent()).toContain('Genre');
    expect(textContent()).toContain('Folk');
  });

  it('renders audio link when present', async () => {
    await setup();
    emitId('song-1');
    get$.next(makeSong({ audioLink: 'https://example.com/audio.mp3' }));
    get$.complete();
    fixture.detectChanges();

    expect(textContent()).toContain('Audio');
    const link = fixture.nativeElement.querySelector('a[href="https://example.com/audio.mp3"]');
    expect(link).toBeTruthy();
    expect(link.target).toBe('_blank');
  });

  it('renders video link when present', async () => {
    await setup();
    emitId('song-1');
    get$.next(makeSong({ videoLink: 'https://example.com/video.mp4' }));
    get$.complete();
    fixture.detectChanges();

    expect(textContent()).toContain('Video');
    const link = fixture.nativeElement.querySelector('a[href="https://example.com/video.mp4"]');
    expect(link).toBeTruthy();
    expect(link.target).toBe('_blank');
  });

  it('renders Apple Music link when present', async () => {
    await setup();
    emitId('song-1');
    get$.next(makeSong({ appleMusicLink: 'https://music.apple.com/track/1' }));
    get$.complete();
    fixture.detectChanges();

    expect(textContent()).toContain('Apple Music');
    const link = fixture.nativeElement.querySelector('a[href="https://music.apple.com/track/1"]');
    expect(link).toBeTruthy();
  });

  it('renders Spotify link when present', async () => {
    await setup();
    emitId('song-1');
    get$.next(makeSong({ spotifyLink: 'https://open.spotify.com/track/2' }));
    get$.complete();
    fixture.detectChanges();

    expect(textContent()).toContain('Spotify');
    const link = fixture.nativeElement.querySelector('a[href="https://open.spotify.com/track/2"]');
    expect(link).toBeTruthy();
  });

  it('renders notation links as a list when present', async () => {
    await setup();
    emitId('song-1');
    get$.next(makeSong({
      notationLinks: [
        'https://example.com/tab1.pdf',
        'https://example.com/tab2.pdf',
      ],
    }));
    get$.complete();
    fixture.detectChanges();

    expect(textContent()).toContain('Notation');
    const links = fixture.nativeElement.querySelectorAll('ul a');
    expect(links).toHaveLength(2);
    expect(links[0].href).toContain('tab1.pdf');
    expect(links[1].href).toContain('tab2.pdf');
  });

  // ---------- Optional fields hidden when absent ----------

  it('does not render optional sections when fields are absent', async () => {
    await setup();
    emitId('song-1');
    // Only required fields
    get$.next(makeSong({
      album: undefined,
      genre: undefined,
      audioLink: undefined,
      videoLink: undefined,
      appleMusicLink: undefined,
      spotifyLink: undefined,
      notationLinks: undefined,
    }));
    get$.complete();
    fixture.detectChanges();

    const text = textContent();
    expect(text).not.toContain('Album');
    expect(text).not.toContain('Genre');
    expect(text).not.toContain('Audio');
    expect(text).not.toContain('Video');
    expect(text).not.toContain('Apple Music');
    expect(text).not.toContain('Spotify');
    expect(text).not.toContain('Notation');
  });

  it('does not render notation section when notationLinks is empty array', async () => {
    await setup();
    emitId('song-1');
    get$.next(makeSong({ notationLinks: [] }));
    get$.complete();
    fixture.detectChanges();

    expect(textContent()).not.toContain('Notation');
  });

  // ---------- All links open in new tab ----------

  it('all links have target="_blank" and rel="noopener noreferrer"', async () => {
    await setup();
    emitId('song-1');
    get$.next(makeSong({
      audioLink: 'https://a.com',
      videoLink: 'https://v.com',
      appleMusicLink: 'https://am.com',
      spotifyLink: 'https://sp.com',
      notationLinks: ['https://n.com'],
    }));
    get$.complete();
    fixture.detectChanges();

    const links = fixture.nativeElement.querySelectorAll('a') as NodeListOf<HTMLAnchorElement>;
    expect(links.length).toBeGreaterThanOrEqual(5);
    links.forEach((link: HTMLAnchorElement) => {
      expect(link.target).toBe('_blank');
      expect(link.rel).toContain('noopener');
      expect(link.rel).toContain('noreferrer');
    });
  });

  // ---------- returnToList ----------

  it('returnToList() navigates to /app/songs', async () => {
    await setup();
    const router = TestBed.inject(Router);
    const navigateSpy = jest.spyOn(router, 'navigate').mockResolvedValue(true);

    fixture.componentInstance.returnToList();

    expect(navigateSpy).toHaveBeenCalledWith(['/app', 'songs']);
  });

  // ---------- Service called with correct id ----------

  it('calls songsService.get$ with the route param id', async () => {
    await setup();
    emitId('my-song-42');
    get$.next(makeSong());
    get$.complete();
    fixture.detectChanges();

    expect(songsSvcMock.get$).toHaveBeenCalledWith('my-song-42');
  });

  // ---------- Renders a full song correctly ----------

  it('renders all fields for a fully-populated song', async () => {
    await setup();
    emitId('full-song');
    get$.next(makeSong({
      id: 'full-song',
      title: 'Wish You Were Here',
      artist: 'Pink Floyd',
      album: 'Wish You Were Here',
      genre: 'Rock',
      audioLink: 'https://example.com/audio',
      videoLink: 'https://example.com/video',
      appleMusicLink: 'https://music.apple.com/1',
      spotifyLink: 'https://open.spotify.com/1',
      notationLinks: ['https://example.com/tab.pdf'],
    }));
    get$.complete();
    fixture.detectChanges();

    const text = textContent();
    expect(text).toContain('Wish You Were Here');
    expect(text).toContain('Pink Floyd');
    expect(text).toContain('Rock');
    expect(text).toContain('Audio');
    expect(text).toContain('Video');
    expect(text).toContain('Apple Music');
    expect(text).toContain('Spotify');
    expect(text).toContain('Notation');
  });
});
