import CharacterType from "../types/character";
import TalentType from "../types/talent";
import talents from "../data/talents.json";
import cyberware from "../data/cyberware.json";
import CyberWareType from "../types/cyberware";

const talentMap: Record<string, TalentType> = {};
talents.forEach(t => talentMap[t.talent] = t);

const cyberMap: Record<string, CyberWareType> = {};
cyberware.forEach(c => cyberMap[c.name] = c);

export default function calculateActionPoints(stats: CharacterType) {
    const AGI = stats.attributes.AGI || 0
    let ap = Math.ceil(3 + AGI / 2);

    stats.talents
        .filter(t => talentMap[t].modifier?.ap)
        .forEach(t => ap += talentMap[t].modifier?.ap || 0);
		
	stats.cyberware
        .filter(c => c.enabled)
        .filter(c => cyberMap[c.name].modifier?.ap)
        .forEach(c => ap += cyberMap[c.name].modifier?.ap || 0);

    return ap;
}