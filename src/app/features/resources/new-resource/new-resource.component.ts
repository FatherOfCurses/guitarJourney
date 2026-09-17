import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AutoComplete, AutoCompleteCompleteEvent } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageService } from 'primeng/api';
import { Select } from 'primeng/select';
import { Skeleton } from 'primeng/skeleton';
import { Toast } from 'primeng/toast';
import { ResourceService } from '../../../services/resource.service';
import { fetchYouTubeOEmbed } from '../../../utils/youtube';
import { isValidResourceUrl, normalizeTags, LinkResourceType } from '../../../utils/resource-url';

@Component({
  selector: 'app-new-resource',
  standalone: true,
  imports: [FormsModule, AutoComplete, ButtonModule, InputTextModule, Select, Skeleton, Toast],
  templateUrl: './new-resource.component.html',
})
export class NewResourceComponent {
  private resourceService = inject(ResourceService);
  private router = inject(Router);
  private messageService = inject(MessageService);
  private destroyRef = inject(DestroyRef);

  /**
   * Song is deliberately absent: a song is identified by title and artist, not a URL,
   * and is added from the session picker where it can be pinned to a session.
   */
  readonly typeOptions: { label: string; value: LinkResourceType }[] = [
    { label: 'YouTube video', value: 'youtube' },
    { label: 'PDF', value: 'pdf' },
    { label: 'Chord sheet', value: 'chord-sheet' },
    { label: 'Custom link', value: 'custom' },
  ];

  type: LinkResourceType = 'youtube';
  url = '';
  label = '';
  tags: string[] = [];
  tagSuggestions: string[] = [];

  /** Set once the user edits the label, so an oEmbed response never clobbers their text. */
  private labelTouched = false;

  private _oEmbedLoading = signal(false);
  readonly oEmbedLoading = this._oEmbedLoading.asReadonly();

  private _thumbnailUrl = signal<string | null>(null);
  readonly thumbnailUrl = this._thumbnailUrl.asReadonly();

  private _saving = signal(false);
  readonly saving = this._saving.asReadonly();

  private _libraryTags = signal<string[]>([]);

  /**
   * A getter, not a `computed()`: `url` and `type` are plain template-bound fields, not
   * signals, so a computed would cache its first result and never re-run as the user types.
   */
  canSave(): boolean {
    return !this._saving() && !this._oEmbedLoading() && isValidResourceUrl(this.url, this.type);
  }

  constructor() {
    // Existing tags power the autocomplete, so tags converge instead of fragmenting.
    this.resourceService
      .getResources()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: resources => {
          const seen = new Set<string>();
          for (const r of resources) for (const t of r.tags ?? []) seen.add(t);
          this._libraryTags.set([...seen].sort());
        },
        error: () => this._libraryTags.set([]),
      });
  }

  searchTagSuggestions(event: AutoCompleteCompleteEvent): void {
    const q = (event.query ?? '').toLowerCase();
    this.tagSuggestions = this._libraryTags().filter(t => t.includes(q));
  }

  onTagsChange(tags: string[]): void {
    this.tags = normalizeTags(tags);
  }

  onLabelInput(): void {
    this.labelTouched = true;
  }

  onTypeChange(): void {
    this._thumbnailUrl.set(null);
    this._oEmbedLoading.set(false);
  }

  /**
   * Fetches oEmbed metadata for a YouTube URL, discarding a stale response: if the URL
   * changed while the request was in flight, an older fetch must not overwrite the label
   * or thumbnail belonging to the current URL.
   */
  async onUrlBlur(): Promise<void> {
    const url = this.url.trim();
    if (this.type !== 'youtube' || !isValidResourceUrl(url, 'youtube')) {
      this._thumbnailUrl.set(null);
      return;
    }

    const urlAtFetchStart = this.url;
    this._oEmbedLoading.set(true);

    let data: Awaited<ReturnType<typeof fetchYouTubeOEmbed>> = null;
    try {
      data = await fetchYouTubeOEmbed(url);
    } finally {
      // A newer blur owns the loading flag now — leave it alone.
      if (this.url === urlAtFetchStart) this._oEmbedLoading.set(false);
    }

    if (this.url !== urlAtFetchStart) return; // stale response, discard
    if (!data) {
      this._thumbnailUrl.set(null);
      return;
    }

    this._thumbnailUrl.set(data.thumbnailUrl || null);
    if (!this.labelTouched && data.title) this.label = data.title;
  }

  cancel(): void {
    this.router.navigate(['/app/resources']);
  }

  async save(): Promise<void> {
    if (!this.canSave()) return;

    const url = this.url.trim();
    this._saving.set(true);
    try {
      await this.resourceService.createResource({
        type: this.type,
        url,
        // Falling back to the URL keeps every library entry labelled.
        label: this.label.trim() || url,
        tags: this.tags,
      });
      this.router.navigate(['/app/resources']);
    } catch (error) {
      console.error('Error saving resource:', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Save failed',
        detail: 'Could not save the resource. Please try again.',
        sticky: true,
      });
    } finally {
      this._saving.set(false);
    }
  }
}
