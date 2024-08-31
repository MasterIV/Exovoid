import CharacterType from "../types/character";
import {Combatant} from "../types/combat";
import calculateActionPoints from "./calculateActionPoints";
import calculateHealth from "./calculateHealth";

export function charToCombatant(stats: CharacterType) : Combatant {
    return {
        id: stats.id,
        name: stats.name,
        currentAp: calculateActionPoints(stats),
        currentHealth: stats.currentHealth || 0,
        injuries: stats.injuries,
        maxAp: calculateActionPoints(stats),
        maxHealth: calculateHealth(stats)
    }
}
