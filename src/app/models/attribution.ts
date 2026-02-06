export class Attribution {
    title!: string;            // Work title if available
    creatorName!: string;      // Required for CC BY
    creatorUrl?: string;
    sourceName: 'Openverse' = 'Openverse';
    sourceUrl!: string;        // Openverse detail page
    license!: string;          // e.g. "CC BY 4.0"
    licenseUrl!: string;       // Link to license text
    changesMade?: string;      // e.g., "Cropped & resized"
    originalFileUrl?: string;  // Direct file URL you downloaded from
  }