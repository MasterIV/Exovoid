import AttributeType from "./attributes";
import NpcType from "./npc";

export interface CharacterWeapon {
    id: string;
    type: string;
    mods: string[];
    expanded?: boolean;
    ammo: {
        loaded: number;
        reserve: number;
    }
}

export interface InventoryItem {
    id: string;
    name: string;
    quantity: number;
    location: string;
    notes?: string;
}

export interface CharacterCyberWare {
    id: string;
    name: string;
    enabled: boolean;
    notes?: string;
}

export interface StatModifierType {
    health?: number;
    ap?: number;
    immunity?: number;
    speed?: number;
    heft?: number;
	edge?: number;
}

export interface CharacterCyberMalfunction {
    active: boolean;
    slots: boolean[];
}

export interface CharacterArmor {
    id: string;
    type: string;
    durability: number;
    mods: string[];
    expanded?: boolean;
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
    armor: CharacterArmor[];
    injuries: string[];
    cyberware: CharacterCyberWare[];
    malfunctions: Record<string, CharacterCyberMalfunction>;
    inventory: InventoryItem[];
    currency: {
        assets: number;
        credits: number;
    };

    npcs?: NpcType[];
}