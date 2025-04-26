export interface ArmorType {
    type: string;
    name: string;
    durability: number;
    primarySoak: number;
    secondarySoak: number;
    qualities: string; // Record<string, number | undefined>;
    modLimit: number;
    moddingOptions: string[],
    specialRules: string;
    cost: number;
    rarity: number;
}