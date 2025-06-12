export interface IRange {
  endColumn: number;
  endLineNumber: number;
  startColumn: number;
  startLineNumber: number;
}

export interface Edit {
  range: IRange;
  rangeLength: number;
  rangeOffset: number;
  text: string;
}

export interface Init {
  type: string;
  content: string;
}
