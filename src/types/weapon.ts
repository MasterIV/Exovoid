export interface WeaponType {
    name: string;
    weapon: string;
    skill: string;
    type: string;
    image: string;

    hands: number;
    magazine: number;
    reload?: number;
    speed: number;
    damage: number;

    range: string;
    damageType: string;
    specialRules: string;
    triggerOptions: Record<string, number | undefined>;
    qualities: Record<string, number | undefined>;

    modLimit: number;
    cost: number;
    ammoCost?: number;
    rarity: number;

    slots?: Record<string, {left: number, top: number}>;
}

export interface WeaponModType {
    slot: string;
    name: string;
    effects: string;
    compatible: string[];
    cost: number | string;
    rarity: number;
    showEffect: boolean;
}