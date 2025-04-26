export interface ArmorType {
    armor: string;
    name: string;
    type: string;
    durability: number;
    primarySoak: number;
    secondarySoak: number;
    qualities: Record<string, number | undefined>;
    modLimit: number;
    moddingOptions: string[],
    specialRules: string;
    cost: number;
    rarity: number;
}