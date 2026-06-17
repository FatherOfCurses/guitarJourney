import { Component, DestroyRef, EventEmitter, Output, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { AutoComplete, AutoCompleteCompleteEvent } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { Message } from 'primeng/message';
import { Skeleton } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';
import { ResourceService } from '../../../services/resource.service';
import { AutocompleteSuggestionService } from '../../../services/autocomplete-suggestion.service';
import { Resource } from '../../../models/resource';
import { SessionResource } from '../../../models/session-resource';

@Component({
  selector: 'app-session-resource-picker',
  standalone: true,
  imports: [FormsModule, AutoComplete, ButtonModule, Dialog, InputTextModule, Message, Skeleton, TableModule],
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

  // Search
  searchQuery = '';

  get searchResults(): Resource[] {
    const q = this.searchQuery.toLowerCase().trim();
    if (q.length < 3) return [];
    return this._allResources()
      .filter(r =>
        r.label.toLowerCase().includes(q) ||
        (r.url ?? '').toLowerCase().includes(q) ||
        (r.tags ?? []).some(t => t.toLowerCase().includes(q))
      )
      .slice(0, 20);
  }

  // Add-new dialog
  showAddDialog = false;

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

  get canAdd(): boolean {
    return this.newTitle.trim().length > 0 && this.newArtist.trim().length > 0;
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

  searchTitles(event: AutoCompleteCompleteEvent): void {
    this.suggestionSvc.suggestTitles(event.query).subscribe(
      results => this.titleSuggestions = results,
    );
  }

  searchArtists(event: AutoCompleteCompleteEvent): void {
    this.suggestionSvc.suggestArtists(event.query).subscribe(
      results => this.artistSuggestions = results,
    );
  }

  searchAlbums(event: AutoCompleteCompleteEvent): void {
    this.suggestionSvc.suggestAlbums(event.query).subscribe(
      results => this.albumSuggestions = results,
    );
  }

  addNotationLink(): void {
    this.newNotationLinks = [...this.newNotationLinks, ''];
  }

  removeNotationLink(index: number): void {
    if (this.newNotationLinks.length > 1) {
      this.newNotationLinks = this.newNotationLinks.filter((_, i) => i !== index);
    }
  }

  onAdd(): void {
    if (!this.canAdd) return;

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

    this.newTitle = '';
    this.newArtist = '';
    this.newAlbum = '';
    this.newGenre = '';
    this.newAudioLink = '';
    this.newVideoLink = '';
    this.newAppleMusicLink = '';
    this.newSpotifyLink = '';
    this.newNotationLinks = [''];
    this.showAddDialog = false;
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
