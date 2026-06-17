import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ButtonModule } from 'primeng/button';
import { SessionResource } from '../../../models/session-resource';
import { extractYouTubeEmbedUrl } from '../../../utils/youtube';

@Component({
  selector: 'app-session-resource',
  standalone: true,
  imports: [ButtonModule],
  templateUrl: './session-resource.component.html',
})
export class SessionResourceComponent {
  private sanitizer = inject(DomSanitizer);

  @Input({ required: true }) resource!: SessionResource;
  @Input() showRemove = false;
  @Output() remove = new EventEmitter<void>();

  get safeEmbedUrl(): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(
      extractYouTubeEmbedUrl(this.resource.url ?? '')!
    );
  }
}
