export enum FigureOption {
  JESUS = 'Jesus (耶稣)',
  MOSES = 'Moses (摩西)',
  DAVID = 'David (大卫)',
  MARY = 'Mary (玛利亚)',
  PETER = 'Peter (彼得)',
  PAUL = 'Paul (保罗)',
  CUSTOM = 'Custom (自定义)'
}

export interface GenerationState {
  isLoading: boolean;
  error: string | null;
  resultImage: string | null;
}
