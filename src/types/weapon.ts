export interface WeaponType {
    name: string;
    weapon: string;
    skill: string;
    type: string;

    hands: number;
    magazine: number;
    reload?: number;
    speed: number;
    damage: number;

    range: string;
    damageType: string;
    specialRules: string;
    triggerOptions: Record<string, number>;
    qualities: Record<string, number>;

    modLimit: number;
    cost: number;
    ammoCost?: number;
    rarity: number;
}