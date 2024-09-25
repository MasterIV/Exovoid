import {Combatant} from "../types/combat";
import NpcType from "../types/npc";

export default function npcToCombatant(stats: NpcType, ap = 0) : Combatant {
    return {
        id: stats.id,
        name: stats.name,
        currentAp: ap,
        currentHealth: stats.currentHealth || 0,
        injuries: stats.injuries,
        maxAp: stats.maxAp,
    }
}
