import CharacterType from "../types/character";
import {Combatant} from "../types/combat";
import calculateActionPoints from "./calculateActionPoints";
import {randomIni} from "./randomIni";

export default function charToCombatant(stats: CharacterType) : Combatant {
    return {
        id: stats.id,
        name: stats.name,
        currentAp: calculateActionPoints(stats) + randomIni(),
        currentHealth: stats.currentHealth || 0,
        injuries: stats.injuries,
        maxAp: calculateActionPoints(stats),
    }
}
