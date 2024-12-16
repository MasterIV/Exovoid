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

export interface ShipType {
    id: string;
    size: string;
    name: string;
    state: 'normal' | 'used' | 'modern';

    currentHull: number;
    currentArmor: number;
    currentShield: number;

    malfunctions: string[];
    systems: ShipSystem[];
    weapons: ShipWeapon[];
    cargo: InventoryItem[];
}