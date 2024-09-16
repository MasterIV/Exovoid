import CharacterType from "../types/character";
import talents from "../data/talents.json";
import TalentType from "../types/talent";

const talentMap: Record<string, TalentType> = {};
talents.forEach(t => talentMap[t.talent] = t);

export default function calculateImmunity(stats: CharacterType) {
    const CON = stats.attributes.CON || 0;
    const STR = stats.attributes.STR || 0;
    let immunity = CON + STR;

    stats.talents
        .filter(t => talentMap[t].modifier?.immunity)
        .forEach(t => immunity += talentMap[t].modifier?.immunity || 0);

    return immunity;
}