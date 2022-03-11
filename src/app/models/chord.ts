export interface ChordConfigure {
  strings: 6;
  frets: number;
  position: number;
  tuning: [string];
  fretLabelFontSize: number;
  tuningsFontSize: number;
  nutSize: number;
  nutColor: string;
  nutTextColor: string;
  nutTextSize: number;
  nutStrokeColor: string;
  nutStrokeWidth: number;
  barreChordStrokeColor: string;
  barreChordStrokeWidth: number;
  fretSize: number;
  sidePadding: number;
  fontFamily: [string];
  title: string;
  titleFontSize: number;
  titleBottomMargin: number;
  color: string;
  backgroundColor: string;
  barreChordRadius: number;
  emptyStringIndicatorSize: number;
  strokeWidth: number;
  topFretWidth: number;
  titleColor: string;
  stringColor: string;
  fretLabelColor: string;
  tuningsColor: string;
  fretColor: string;
  fixedDiagramPosition: boolean;
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
  fingers: number[][];
  barre?: Barre;
  title: string;
  position: number;
}

export class ChordObject {
  configure: ChordConfigure;
  chord: ChordLayout;
}
