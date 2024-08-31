export interface Combatant {
    id: string;
    name: string;
    maxAp: number;
    currentAp: number;
    currentHealth: number;
    injuries: string[];
}