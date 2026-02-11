/** MusicBrainz API response types */

// -- Shared primitives --

export interface MbArtistCredit {
  name: string;
  artist: {
    id: string;
    name: string;
    'sort-name': string;
    disambiguation?: string;
  };
}

export interface MbLifeSpan {
  begin: string | null;
  end: string | null;
  ended: boolean;
}

export interface MbArea {
  id: string;
  name: string;
  'sort-name': string;
  'iso-3166-1-codes'?: string[];
}

export interface MbTag {
  count: number;
  name: string;
}

export interface MbAlias {
  name: string;
  'sort-name': string;
  type: string | null;
  locale: string | null;
  primary: boolean | null;
}

// -- Artist --

export interface MbArtist {
  id: string;
  type: string | null;
  score?: number;
  name: string;
  'sort-name': string;
  country?: string;
  disambiguation?: string;
  area?: MbArea;
  'begin-area'?: MbArea;
  'life-span'?: MbLifeSpan;
  aliases?: MbAlias[];
  tags?: MbTag[];
  isnis?: string[];
}

export interface MbArtistSearchResponse {
  created: string;
  count: number;
  offset: number;
  artists: MbArtist[];
}

// -- Recording --

export interface MbRecordingRelease {
  id: string;
  title: string;
  status?: string;
  date?: string;
  country?: string;
  'track-count'?: number;
  'release-group'?: {
    id: string;
    title: string;
    'primary-type'?: string;
  };
}

export interface MbRecording {
  id: string;
  score?: number;
  title: string;
  length?: number;
  'first-release-date'?: string;
  'artist-credit'?: MbArtistCredit[];
  releases?: MbRecordingRelease[];
  tags?: MbTag[];
}

export interface MbRecordingSearchResponse {
  created: string;
  count: number;
  offset: number;
  recordings: MbRecording[];
}

// -- Release --

export interface MbReleaseMedia {
  format?: string;
  'disc-count'?: number;
  'track-count'?: number;
}

export interface MbRelease {
  id: string;
  score?: number;
  title: string;
  status?: string;
  date?: string;
  country?: string;
  barcode?: string;
  'track-count'?: number;
  'artist-credit'?: MbArtistCredit[];
  'release-group'?: {
    id: string;
    title: string;
    'primary-type'?: string;
  };
  'release-events'?: Array<{
    date?: string;
    area?: MbArea;
  }>;
  'label-info'?: Array<{
    'catalog-number'?: string;
    label?: { id: string; name: string };
  }>;
  media?: MbReleaseMedia[];
  'text-representation'?: {
    language?: string;
    script?: string;
  };
}

export interface MbReleaseSearchResponse {
  created: string;
  count: number;
  offset: number;
  releases: MbRelease[];
}

// -- Genre --

export interface MbGenre {
  id: string;
  name: string;
  disambiguation?: string;
}

export interface MbGenreListResponse {
  'genre-offset': number;
  'genre-count': number;
  genres: MbGenre[];
}

// -- Lookup responses (single entity with includes) --

export interface MbArtistLookup extends MbArtist {
  recordings?: MbRecording[];
  releases?: MbRelease[];
  'release-groups'?: Array<{
    id: string;
    title: string;
    'primary-type'?: string;
    'first-release-date'?: string;
  }>;
}

export interface MbRecordingLookup extends MbRecording {
  isrcs?: string[];
}

export interface MbReleaseLookup extends MbRelease {
  media?: Array<MbReleaseMedia & {
    tracks?: Array<{
      id: string;
      number: string;
      title: string;
      length?: number;
      position: number;
      recording?: MbRecording;
    }>;
  }>;
}
