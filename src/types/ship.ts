import {InventoryItem} from "./character";

export interface ShipSystem {
    id: string;
    type: string;
    amount: number;
    powered: boolean;
}

export interface ShipWeapon {
    id: string;
    type: string;
    powered: boolean;
    expanded?: boolean;
    ammo: {
        loaded: number;
        reserve: number;
    }
}

export interface DirectionalValue {
    front: number;
    left: number;
    right: number;
    back: number;
}

export const distributions: Record<string, DirectionalValue> = {
    "balanced": {front: .25, left: .25, right: .25, back: .25},
    "bow": {front: .50, left: .20, right: .20, back: .10},
    "rear": {front: .10, left: .20, right: .20, back: .50},
    "sides": {front: .15, left: .35, right: .35, back: .15},
    "low-sides": {front: .35, left: .15, right: .15, back: .35},
    "low-bow": {front: .10, left: .30, right: .30, back: .30},
    "low-rear": {front: .30, left: .30, right: .30, back: .10},
}

export interface ShipType {
    id: string;
    size: string;
    name: string;
    state: 'normal' | 'used' | 'modern';

    currentHull: number;
    currentArmor: DirectionalValue;
    currentShield: DirectionalValue;
    armorDistribution: keyof typeof distributions;
    shieldDistribution: keyof typeof distributions;

    malfunctions: string[];
    systems: ShipSystem[];
    weapons: ShipWeapon[];
    cargo: InventoryItem[];
}