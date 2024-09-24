import CharacterType from "../types/character";
import talents from "../data/talents.json";
import TalentType from "../types/talent";
import cyberware from "../data/cyberware.json";
import CyberWareType from "../types/cyberware";

const talentMap: Record<string, TalentType> = {};
talents.forEach(t => talentMap[t.talent] = t);

const cyberMap: Record<string, CyberWareType> = {};
cyberware.forEach(c => cyberMap[c.name] = c);

export default function calculateHealth(stats: CharacterType) {
    const CON = stats.attributes.CON || 0;
    let health = 5 + CON;

    stats.talents
        .filter(t => talentMap[t].modifier?.health)
        .forEach(t => health += talentMap[t].modifier?.health || 0);

    stats.cyberware
        .filter(c => c.enabled)
        .filter(c => cyberMap[c.name].modifier?.health)
        .forEach(c => health += cyberMap[c.name].modifier?.health || 0);

    return health;
}