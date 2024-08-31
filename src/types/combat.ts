export interface Combatant {
    id: string;
    name: string;
    maxAp: number;
    currentAp: number;
    maxHealth: number;
    currentHealth: number;
    injuries: string[];
}