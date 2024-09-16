import CharacterType from "../types/character";
import talents from "../data/talents.json";
import TalentType from "../types/talent";

const talentMap: Record<string, TalentType> = {};
talents.forEach(t => talentMap[t.talent] = t);

export default function calculateSpeed(stats: CharacterType) {
    const CON = stats.attributes.CON || 0;
    const AGI = stats.attributes.AGI || 0;
    let speed = Math.ceil(3 + (CON + AGI) / 2);

    stats.talents
        .filter(t => talentMap[t].modifier?.speed)
        .forEach(t => speed += talentMap[t].modifier?.speed || 0);

    return speed;
}