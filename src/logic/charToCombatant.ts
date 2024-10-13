import CharacterType from "../types/character";
import {Combatant} from "../types/combat";
import {calculateActionPoints} from "./calculateDerived";

export default function charToCombatant(stats: CharacterType, ap = 0) : Combatant {
    return {
        id: stats.id,
        name: stats.name,
        currentAp: ap,
        currentHealth: stats.currentHealth || 0,
        injuries: stats.injuries,
        maxAp: calculateActionPoints(stats),
    }
}
