export interface SongsterrArtist {
  id: number;
  name: string;
  nameWithoutThePrefix: string;
  type: string;
  useThePrefix: boolean;
}

export class SongsterrResponse {
  artist: SongsterrArtist;
  chordsPresent: boolean;
  id: string;
  tabTypes: string[];
  title: string;
  type: string;
}
