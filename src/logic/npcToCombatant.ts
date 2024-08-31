import {Combatant} from "../types/combat";
import NpcType from "../types/npc";
import {randomIni} from "./randomIni";

export default function npcToCombatant(stats: NpcType) : Combatant {
    return {
        id: stats.id,
        name: stats.name,
        currentAp: stats.maxAp + randomIni(),
        currentHealth: stats.currentHealth || 0,
        injuries: stats.injuries,
        maxAp: stats.maxAp,
    }
}
