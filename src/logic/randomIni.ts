import {Combatant} from "../types/combat";

export function randomIni(c: Combatant) {
    return 1 + Math.floor(Math.random() * 6);
}