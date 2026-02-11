import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { AutoComplete, AutoCompleteCompleteEvent } from 'primeng/autocomplete';
import { SongsService } from '@services/songs.service';
import { AutocompleteSuggestionService } from '@services/autocomplete-suggestion.service';

@Component({
  selector: 'app-new-song',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonModule, AutoComplete],
  templateUrl: './new-song.component.html',
})
export class NewSongComponent {
  private fb = inject(FormBuilder);
  private songsService = inject(SongsService);
  private router = inject(Router);
  private suggestionSvc = inject(AutocompleteSuggestionService);

  private _saving = signal(false);
  saving = this._saving.asReadonly();

  titleSuggestions: string[] = [];
  artistSuggestions: string[] = [];
  albumSuggestions: string[] = [];

  songForm: FormGroup = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(1)]],
    artist: ['', [Validators.required, Validators.minLength(1)]],
    album: [''],
    genre: [''],
    audioLink: [''],
    videoLink: [''],
    appleMusicLink: [''],
    spotifyLink: [''],
    notationLinks: this.fb.array([this.fb.control('')]),
  });

  get titleCtrl() { return this.songForm.get('title')!; }
  get artistCtrl() { return this.songForm.get('artist')!; }
  get notationLinksArray() { return this.songForm.get('notationLinks') as FormArray; }

  addNotationLink(): void {
    this.notationLinksArray.push(this.fb.control(''));
  }

  removeNotationLink(index: number): void {
    if (this.notationLinksArray.length > 1) {
      this.notationLinksArray.removeAt(index);
    }
  }

  onSubmit(): void {
    if (this.songForm.invalid) return;

    this._saving.set(true);
    const val = this.songForm.value;

    // Filter out empty notation links
    const notationLinks = (val.notationLinks as string[]).filter(l => l && l.trim().length > 0);

    this.songsService.create({
      title: val.title,
      artist: val.artist,
      album: val.album || undefined,
      genre: val.genre || undefined,
      audioLink: val.audioLink || undefined,
      videoLink: val.videoLink || undefined,
      appleMusicLink: val.appleMusicLink || undefined,
      spotifyLink: val.spotifyLink || undefined,
      notationLinks: notationLinks.length > 0 ? notationLinks : undefined,
    }).then(() => {
      this._saving.set(false);
      this.router.navigate(['/app', 'songs']);
    }).catch((error) => {
      console.error('Error saving song:', error);
      this._saving.set(false);
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

  cancel(): void {
    this.router.navigate(['/app', 'songs']);
  }
}
