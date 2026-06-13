import { Component, DestroyRef, EventEmitter, Output, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { AutoComplete } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { Message } from 'primeng/message';
import { Select } from 'primeng/select';
import { Skeleton } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';
import { ResourceService } from '../../../services/resource.service';
import { Resource } from '../../../models/resource';
import { SessionResource } from '../../../models/session-resource';
import { extractYouTubeEmbedUrl, fetchYouTubeOEmbed } from '../../../utils/youtube';

type ResourceType = 'youtube' | 'pdf' | 'chord-sheet' | 'custom';

@Component({
  selector: 'app-session-resource-picker',
  standalone: true,
  imports: [FormsModule, AutoComplete, ButtonModule, Dialog, InputTextModule, Message, Select, Skeleton, TableModule],
  templateUrl: './session-resource-picker.component.html',
})
export class SessionResourcePickerComponent {
  private resourceService = inject(ResourceService);
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
        r.url.toLowerCase().includes(q) ||
        (r.tags ?? []).some(t => t.toLowerCase().includes(q))
      )
      .slice(0, 20);
  }

  // Add-new dialog
  showAddDialog = false;
  newType: ResourceType = 'youtube';
  newUrl = '';
  newLabel = '';
  newTags: string[] = [];
  tagSuggestions: string[] = [];

  private _oEmbedLoading = signal(false);
  private _oEmbedThumbnail = signal<string | null>(null);

  readonly oEmbedLoading = this._oEmbedLoading.asReadonly();
  readonly oEmbedThumbnail = this._oEmbedThumbnail.asReadonly();

  readonly typeOptions = [
    { label: 'YouTube', value: 'youtube' },
    { label: 'PDF', value: 'pdf' },
    { label: 'Chord Sheet', value: 'chord-sheet' },
    { label: 'Custom Link', value: 'custom' },
  ];

  get canAdd(): boolean {
    if (!this.newLabel.trim()) return false;
    try {
      const parsed = new URL(this.newUrl);
      if (!['http:', 'https:'].includes(parsed.protocol)) return false;
      if (this.newType === 'youtube' && extractYouTubeEmbedUrl(this.newUrl) === null) return false;
      return true;
    } catch {
      return false;
    }
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

  async onUrlBlur(): Promise<void> {
    const url = this.newUrl;
    if (this.newType !== 'youtube' || !url) return;

    const urlAtFetchStart = url;
    this._oEmbedLoading.set(true);
    this._oEmbedThumbnail.set(null);

    const oembed = await fetchYouTubeOEmbed(url);

    if (this.newUrl !== urlAtFetchStart) return;

    this._oEmbedLoading.set(false);
    if (oembed) {
      if (!this.newLabel.trim()) this.newLabel = oembed.title;
      this._oEmbedThumbnail.set(oembed.thumbnailUrl || null);
    }
  }

  onTypeChange(): void {
    this._oEmbedThumbnail.set(null);
  }

  onAdd(): void {
    if (!this.canAdd) return;

    this.resourceAdded.emit({
      type: this.newType,
      url: this.newUrl,
      label: this.newLabel.trim(),
      tags: this.newTags.map(t => t.toLowerCase()),
    });

    this.newType = 'youtube';
    this.newUrl = '';
    this.newLabel = '';
    this.newTags = [];
    this._oEmbedThumbnail.set(null);
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
