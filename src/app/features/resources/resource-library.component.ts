import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AutoComplete } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { Message } from 'primeng/message';
import { MultiSelect } from 'primeng/multiselect';
import { Skeleton } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';
import { Tag } from 'primeng/tag';
import { ResourceService } from '../../services/resource.service';
import { Resource } from '../../models/resource';

/** Matches the `limit(200)` in ResourceService.getResources(). */
export const LIBRARY_LIMIT = 200;

type TagSeverity = 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast';

/** DESIGN.md — PrimeNG badge severity mapping (resource-library). */
const TYPE_SEVERITY: Record<string, TagSeverity> = {
  youtube: 'info',
  pdf: 'danger',
  'chord-sheet': 'success',
  custom: 'secondary',
  song: 'secondary',
};

@Component({
  selector: 'app-resource-library',
  standalone: true,
  imports: [
    FormsModule,
    AutoComplete,
    ButtonModule,
    Dialog,
    InputTextModule,
    Message,
    MultiSelect,
    Skeleton,
    TableModule,
    Tag,
  ],
  templateUrl: './resource-library.component.html',
})
export class ResourceLibraryComponent {
  private resourceService = inject(ResourceService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  // ---------- LIBRARY STATE ----------
  private _resources = signal<Resource[]>([]);
  readonly resources = this._resources.asReadonly();

  private _loading = signal(true);
  readonly loading = this._loading.asReadonly();

  private _deletingId = signal<string | null>(null);
  readonly deletingId = this._deletingId.asReadonly();

  // ---------- FILTER STATE ----------
  readonly labelFilter = signal('');
  readonly selectedTags = signal<string[]>([]);

  /** Every distinct tag in the library, for the tag multi-select. */
  readonly allTags = computed(() => {
    const seen = new Set<string>();
    for (const r of this._resources()) {
      for (const t of r.tags ?? []) seen.add(t);
    }
    return [...seen].sort();
  });

  /** Client-side filter: label substring (case-insensitive) AND all selected tags. */
  readonly filteredResources = computed(() => {
    const q = this.labelFilter().toLowerCase().trim();
    const tags = this.selectedTags();
    return this._resources().filter(r => {
      if (q && !r.label.toLowerCase().includes(q)) return false;
      if (tags.length && !tags.every(t => (r.tags ?? []).includes(t))) return false;
      return true;
    });
  });

  readonly hasFilters = computed(
    () => this.labelFilter().trim().length > 0 || this.selectedTags().length > 0
  );

  /**
   * No items at all — distinct from "filters matched nothing". Both render through the
   * table's emptymessage template, which picks between them on hasFilters().
   */
  readonly isEmptyLibrary = computed(() => !this._loading() && this._resources().length === 0);

  readonly noFilterResults = computed(
    () => !this._loading() && this._resources().length > 0 && this.filteredResources().length === 0
  );

  /** The service caps at 200; a full page means older resources may be hidden. */
  readonly atLibraryLimit = computed(() => this._resources().length === LIBRARY_LIMIT);

  // ---------- DELETE ----------
  private _deleteTarget = signal<Resource | null>(null);
  readonly deleteTarget = this._deleteTarget.asReadonly();

  // ---------- EDIT ----------
  private _editTarget = signal<Resource | null>(null);
  readonly editTarget = this._editTarget.asReadonly();

  private _savingEdit = signal(false);
  readonly savingEdit = this._savingEdit.asReadonly();

  editLabel = '';
  editTags: string[] = [];

  constructor() {
    this.resourceService
      .getResources()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: resources => {
          this._resources.set(resources);
          this._loading.set(false);
        },
        error: () => this._loading.set(false),
      });
  }

  typeSeverity(type: string): TagSeverity {
    return TYPE_SEVERITY[type] ?? 'secondary';
  }

  clearFilters(): void {
    this.labelFilter.set('');
    this.selectedTags.set([]);
  }

  /** Resources are added through the song form for now; a dedicated form is follow-on work. */
  addResource(): void {
    this.router.navigate(['/app/newSong']);
  }

  // ---------- DELETE FLOW ----------
  confirmDelete(resource: Resource): void {
    this._deleteTarget.set(resource);
  }

  cancelDelete(): void {
    this._deleteTarget.set(null);
  }

  async onDeleteConfirmed(): Promise<void> {
    const target = this._deleteTarget();
    if (!target?.id) return;

    this._deletingId.set(target.id);
    this._deleteTarget.set(null);
    try {
      await this.resourceService.deleteResource(target.id);
    } catch (error) {
      console.error('Error deleting resource:', error);
    } finally {
      this._deletingId.set(null);
    }
  }

  // ---------- EDIT FLOW ----------
  openEdit(resource: Resource): void {
    this.editLabel = resource.label;
    this.editTags = [...(resource.tags ?? [])];
    this._editTarget.set(resource);
  }

  cancelEdit(): void {
    this._editTarget.set(null);
  }

  /** Tags are stored lowercase; normalize on every change to the multi-value input. */
  onEditTagsChange(tags: string[]): void {
    const seen = new Set<string>();
    for (const raw of tags ?? []) {
      const normalized = String(raw).trim().toLowerCase();
      if (normalized) seen.add(normalized);
    }
    this.editTags = [...seen];
  }

  async saveEdit(): Promise<void> {
    const target = this._editTarget();
    if (!target?.id) return;

    const label = this.editLabel.trim();
    if (!label) return;

    this._savingEdit.set(true);
    try {
      await this.resourceService.updateResource(target.id, { label, tags: this.editTags });
      this._editTarget.set(null);
    } catch (error) {
      console.error('Error updating resource:', error);
    } finally {
      this._savingEdit.set(false);
    }
  }
}
