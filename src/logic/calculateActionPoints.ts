import CharacterType from "../types/character";
import TalentType from "../types/talent";
import talents from "../data/talents.json";

const talentMap: Record<string, TalentType> = {};
talents.forEach(t => talentMap[t.talent] = t);

export default function calculateActionPoints(stats: CharacterType) {
    const AGI = stats.attributes.AGI || 0
    let ap = Math.ceil(3 + AGI / 2);

    stats.talents
        .filter(t => talentMap[t].modifier?.ap)
        .forEach(t => ap += talentMap[t].modifier?.ap || 0);

    return ap;
}