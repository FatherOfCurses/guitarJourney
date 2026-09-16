import { Component, DestroyRef, EventEmitter, Output, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { AutoComplete, AutoCompleteCompleteEvent } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { Listbox } from 'primeng/listbox';
import { Message } from 'primeng/message';
import { Select } from 'primeng/select';
import { Skeleton } from 'primeng/skeleton';
import { Tag } from 'primeng/tag';
import { ResourceService } from '../../../services/resource.service';
import { AutocompleteSuggestionService } from '../../../services/autocomplete-suggestion.service';
import { Resource } from '../../../models/resource';
import { SessionResource } from '../../../models/session-resource';
import { extractYouTubeEmbedUrl, fetchYouTubeOEmbed } from '../../../utils/youtube';

export type PickerResourceType = 'song' | 'youtube' | 'pdf' | 'chord-sheet' | 'custom';

type TagSeverity = 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast';

/** DESIGN.md — PrimeNG badge severity mapping (resource-library). */
const TYPE_SEVERITY: Record<string, TagSeverity> = {
  youtube: 'info',
  pdf: 'danger',
  'chord-sheet': 'success',
  custom: 'secondary',
  song: 'secondary',
};

/** Library results shown in the listbox at once. */
const MAX_RESULTS = 50;

@Component({
  selector: 'app-session-resource-picker',
  standalone: true,
  imports: [
    FormsModule,
    AutoComplete,
    ButtonModule,
    Dialog,
    InputTextModule,
    Listbox,
    Message,
    Select,
    Skeleton,
    Tag,
  ],
  templateUrl: './session-resource-picker.component.html',
})
export class SessionResourcePickerComponent {
  private resourceService = inject(ResourceService);
  private suggestionSvc = inject(AutocompleteSuggestionService);
  private destroyRef = inject(DestroyRef);

  @Output() resourceAdded = new EventEmitter<Omit<SessionResource, 'id' | 'pinnedAt'>>();

  private _allResources = signal<Resource[]>([]);
  private _libraryLoading = signal(true);

  readonly libraryLoading = this._libraryLoading.asReadonly();
  readonly allResources = this._allResources.asReadonly();

  // ── LIBRARY SEARCH ──────────────────────────────────────────
  searchQuery = '';
  selectedTagFilters: string[] = [];

  /** Every distinct tag in the library, for the tag filter's suggestion list. */
  readonly libraryTags = computed(() => {
    const seen = new Set<string>();
    for (const r of this._allResources()) {
      for (const t of r.tags ?? []) seen.add(t);
    }
    return [...seen].sort();
  });

  tagFilterSuggestions: string[] = [];

  /** Results appear once the text query is specific enough, or any tag is selected. */
  get isFiltering(): boolean {
    return this.searchQuery.trim().length >= 3 || this.selectedTagFilters.length > 0;
  }

  get searchResults(): Resource[] {
    if (!this.isFiltering) return [];
    const q = this.searchQuery.toLowerCase().trim();
    const tags = this.selectedTagFilters;

    return this._allResources()
      .filter(r => {
        if (q.length >= 3) {
          const matchesText =
            r.label.toLowerCase().includes(q) ||
            (r.url ?? '').toLowerCase().includes(q) ||
            (r.tags ?? []).some(t => t.toLowerCase().includes(q));
          if (!matchesText) return false;
        }
        // All selected tags must be present, not just one.
        return tags.every(t => (r.tags ?? []).includes(t));
      })
      .slice(0, MAX_RESULTS);
  }

  // ── ADD NEW ─────────────────────────────────────────────────
  showAddDialog = false;

  readonly typeOptions: { label: string; value: PickerResourceType }[] = [
    { label: 'Song', value: 'song' },
    { label: 'YouTube video', value: 'youtube' },
    { label: 'PDF', value: 'pdf' },
    { label: 'Chord sheet', value: 'chord-sheet' },
    { label: 'Custom link', value: 'custom' },
  ];

  /** Song stays the default: it is the app's primary flow and predates the link types. */
  newType: PickerResourceType = 'song';

  // Song fields
  newTitle = '';
  newArtist = '';
  newAlbum = '';
  newGenre = '';
  newAudioLink = '';
  newVideoLink = '';
  newAppleMusicLink = '';
  newSpotifyLink = '';
  newNotationLinks: string[] = [''];

  titleSuggestions: string[] = [];
  artistSuggestions: string[] = [];
  albumSuggestions: string[] = [];

  // Link-resource fields (youtube / pdf / chord-sheet / custom)
  newUrl = '';
  newLabel = '';
  newTags: string[] = [];
  tagSuggestions: string[] = [];

  /** Set once the user edits the label, so an oEmbed response never clobbers their text. */
  private labelTouched = false;

  private _oEmbedLoading = signal(false);
  readonly oEmbedLoading = this._oEmbedLoading.asReadonly();

  private _thumbnailUrl = signal<string | null>(null);
  readonly thumbnailUrl = this._thumbnailUrl.asReadonly();

  get isSongType(): boolean {
    return this.newType === 'song';
  }

  get canAdd(): boolean {
    return this.isSongType ? this.canAddSong : this.canAddLink;
  }

  private get canAddSong(): boolean {
    return this.newTitle.trim().length > 0 && this.newArtist.trim().length > 0;
  }

  private get canAddLink(): boolean {
    // Never let a pending oEmbed response land after the resource is already added.
    if (this._oEmbedLoading()) return false;

    const url = this.newUrl.trim();
    if (!url) return false;

    let parsed: URL;
    try {
      parsed = new URL(url);
    } catch {
      return false;
    }
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return false;

    if (this.newType === 'youtube') return extractYouTubeEmbedUrl(url) !== null;
    return true;
  }

  constructor() {
    this.resourceService
      .getResources()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: resources => {
          this._allResources.set(resources);
          this._libraryLoading.set(false);
        },
        error: () => this._libraryLoading.set(false),
      });
  }

  typeSeverity(type: string): TagSeverity {
    return TYPE_SEVERITY[type] ?? 'secondary';
  }

  // ── MUSICBRAINZ SUGGESTIONS ─────────────────────────────────
  searchTitles(event: AutoCompleteCompleteEvent): void {
    this.suggestionSvc.suggestTitles(event.query)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(results => (this.titleSuggestions = results));
  }

  searchArtists(event: AutoCompleteCompleteEvent): void {
    this.suggestionSvc.suggestArtists(event.query)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(results => (this.artistSuggestions = results));
  }

  searchAlbums(event: AutoCompleteCompleteEvent): void {
    this.suggestionSvc.suggestAlbums(event.query)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(results => (this.albumSuggestions = results));
  }

  addNotationLink(): void {
    this.newNotationLinks = [...this.newNotationLinks, ''];
  }

  removeNotationLink(index: number): void {
    if (this.newNotationLinks.length > 1) {
      this.newNotationLinks = this.newNotationLinks.filter((_, i) => i !== index);
    }
  }

  // ── TAGS ────────────────────────────────────────────────────
  /** Tags are stored lowercase; normalize here rather than in the service or converter. */
  private normalizeTags(tags: string[]): string[] {
    const seen = new Set<string>();
    for (const raw of tags ?? []) {
      const normalized = String(raw).trim().toLowerCase();
      if (normalized) seen.add(normalized);
    }
    return [...seen];
  }

  onTagsChange(tags: string[]): void {
    this.newTags = this.normalizeTags(tags);
  }

  onTagFiltersChange(tags: string[]): void {
    this.selectedTagFilters = this.normalizeTags(tags);
  }

  searchTagSuggestions(event: AutoCompleteCompleteEvent): void {
    const q = (event.query ?? '').toLowerCase();
    this.tagSuggestions = this.libraryTags().filter(t => t.includes(q));
  }

  searchTagFilterSuggestions(event: AutoCompleteCompleteEvent): void {
    const q = (event.query ?? '').toLowerCase();
    this.tagFilterSuggestions = this.libraryTags().filter(t => t.includes(q));
  }

  // ── oEMBED ──────────────────────────────────────────────────
  onLabelInput(): void {
    this.labelTouched = true;
  }

  onTypeChange(): void {
    // Type drives which fields are valid; drop any preview from the previous type.
    this._thumbnailUrl.set(null);
    this._oEmbedLoading.set(false);
  }

  /**
   * Fetches oEmbed metadata for a YouTube URL. Guards against a stale response:
   * if the URL changed while the request was in flight, the result is discarded so
   * an older fetch cannot overwrite the label or thumbnail for the current URL.
   */
  async onUrlBlur(): Promise<void> {
    const url = this.newUrl.trim();
    if (this.newType !== 'youtube' || !url) return;
    if (extractYouTubeEmbedUrl(url) === null) {
      this._thumbnailUrl.set(null);
      return;
    }

    const urlAtFetchStart = this.newUrl;
    this._oEmbedLoading.set(true);

    let data: Awaited<ReturnType<typeof fetchYouTubeOEmbed>> = null;
    try {
      data = await fetchYouTubeOEmbed(url);
    } finally {
      // A newer blur owns the loading flag now — leave it alone.
      if (this.newUrl === urlAtFetchStart) this._oEmbedLoading.set(false);
    }

    if (this.newUrl !== urlAtFetchStart) return; // stale response, discard
    if (!data) {
      this._thumbnailUrl.set(null);
      return;
    }

    this._thumbnailUrl.set(data.thumbnailUrl || null);
    if (!this.labelTouched && data.title) this.newLabel = data.title;
  }

  // ── ADD ─────────────────────────────────────────────────────
  onAdd(): void {
    if (!this.canAdd) return;
    if (this.isSongType) this.addSong();
    else this.addLinkResource();
    this.showAddDialog = false;
  }

  private addSong(): void {
    const filledNotationLinks = this.newNotationLinks.filter(l => l.trim().length > 0);
    const primaryUrl = this.newVideoLink.trim() ||
                       this.newAudioLink.trim() ||
                       this.newSpotifyLink.trim() ||
                       this.newAppleMusicLink.trim() ||
                       filledNotationLinks[0] ||
                       undefined;

    this.resourceAdded.emit({
      type: 'song',
      url: primaryUrl,
      label: `${this.newTitle.trim()} — ${this.newArtist.trim()}`,
      title: this.newTitle.trim(),
      artist: this.newArtist.trim(),
      album: this.newAlbum.trim() || undefined,
      genre: this.newGenre.trim() || undefined,
      audioLink: this.newAudioLink.trim() || undefined,
      videoLink: this.newVideoLink.trim() || undefined,
      appleMusicLink: this.newAppleMusicLink.trim() || undefined,
      spotifyLink: this.newSpotifyLink.trim() || undefined,
      notationLinks: filledNotationLinks.length > 0 ? filledNotationLinks : undefined,
    });

    this.resetSongForm();
  }

  private addLinkResource(): void {
    const url = this.newUrl.trim();
    this.resourceAdded.emit({
      type: this.newType as Exclude<PickerResourceType, 'song'>,
      url,
      // Falling back to the URL keeps every pinned resource labelled.
      label: this.newLabel.trim() || url,
      tags: this.newTags,
    });

    this.resetLinkForm();
  }

  private resetSongForm(): void {
    this.newTitle = '';
    this.newArtist = '';
    this.newAlbum = '';
    this.newGenre = '';
    this.newAudioLink = '';
    this.newVideoLink = '';
    this.newAppleMusicLink = '';
    this.newSpotifyLink = '';
    this.newNotationLinks = [''];
  }

  private resetLinkForm(): void {
    this.newUrl = '';
    this.newLabel = '';
    this.newTags = [];
    this.labelTouched = false;
    this._thumbnailUrl.set(null);
    this._oEmbedLoading.set(false);
  }

  onLibrarySelect(resource: Resource): void {
    if (!resource?.id) return;
    this.resourceAdded.emit({
      resourceId: resource.id,
      type: resource.type,
      url: resource.url,
      label: resource.label,
      tags: resource.tags ?? [],
    });
  }
}
