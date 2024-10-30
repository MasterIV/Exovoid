export interface DicePoolType {
  default?: number;
  aptitude?: number;
  expertise?: number;
  injury?: number;
}

export type DiceResultType = {
  type: string;
  symbols: string[];
  exploded?: boolean;
}[];
