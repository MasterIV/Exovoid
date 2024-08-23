import AttributeType from "./attributes";

export interface CharacterWeapon {
    id: string;
    type: string;
    mods: string[];
    ammo: {
        loaded: number;
        reserve: number;
    }
}

export interface InventoryItem {
    name: string;
    quantity: number;
    location: string;
    notes?: string;
}

export default interface CharacterType {
    id: string,
    name: string;
    table: string;
    description?: string;
    image?: string;

    attributes: AttributeType;
    skills: Record<string, number>;

    currentHealth: number;
    currentEdge: number;
    exp: number;

    classes: string[];
    talents: string[];
    weapons: CharacterWeapon[];
    injuries: string[];
    inventory: InventoryItem[];
    currency: {
        assets: number;
        credits: number;
    }
}