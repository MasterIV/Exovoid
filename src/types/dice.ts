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

export interface PersistentRollEntry {
    id: string;
    timestamp: number;
    result: DiceResultType;
    metadata: Record<string, any>;
}