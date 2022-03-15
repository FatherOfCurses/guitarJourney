export interface ChordConfigure {
  strings: 6;
  frets: 5;
  position: 1;
  tuning: ['E', 'A', 'D', 'G', 'B', 'E'];
  fretLabelFontSize: 38;
  tuningsFontSize: 28;
  nutSize: 0.65;
  nutColor: '#000';
  nutTextColor: '#FFF';
  nutTextSize: 22;
  nutStrokeColor: '#000000';
  nutStrokeWidth: 0;
  barreChordStrokeColor: '#000000';
  barreChordStrokeWidth: 0;
  fretSize: 1.5;
  sidePadding: 0.2;
  fontFamily: 'Arial, "Helvetica Neue", Helvetica, sans-serif';
  title: 'Chord Title';
  titleFontSize: 48;
  titleBottomMargin: 0;
  color: '#000000';
  backgroundColor: 'none';
  barreChordRadius: 0.25;
  emptyStringIndicatorSize: 0.6;
  strokeWidth: 2;
  topFretWidth: 10;
  titleColor: '#000000';
  stringColor: '#000000';
  fretLabelColor: '#000000';
  tuningsColor: '#000000';
  fretColor: '#000000';
  fixedDiagramPosition: false;
}

export interface Barre {
  fromString: number,
  toString: number,
  fret: number,
  text: string,
  color: string,
  textColor: string
}

export interface ChordLayout {
  fingers: [
    [1,2],
    [2,3],
    [3,3],
    [6, 'x']
  ];
  title: 'F# minor';
  position: 2;
}

export class ChordObject {
  configure: ChordConfigure;
  chord: ChordLayout;
}
