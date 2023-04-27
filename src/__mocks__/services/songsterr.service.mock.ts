import { SongsterrResponse } from '../../app/models/songsterrResponse';
import { Observable, of } from "rxjs";

const songsterrResponse = [{
  artist: {
    id: 1728283,
    name: 'Gourds for Chucking',
    nameWithoutThePrefix: 'Gourds',
    type: 'Metal',
    useThePrefix: false
  },
  chordsPresent: true,
  id: '82738291',
  tabTypes: ['simple','complex'],
  title: 'Chuck It Up',
  type: 'sludge'
}];

const SongsterrServiceMock = {
  getSearchResults$: jest.fn(() => of(songsterrResponse as SongsterrResponse[])),
  getSongById$: jest.fn(() => of('response'))
}

export default SongsterrServiceMock;
