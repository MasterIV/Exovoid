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
}