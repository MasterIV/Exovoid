import CharacterType from "../types/character";
import talents from "../data/talents.json";
import TalentType from "../types/talent";

const talentMap: Record<string, TalentType> = {};
talents.forEach(t => talentMap[t.talent] = t);

export default function calculateHeft(stats: CharacterType) {
    const STR = stats.attributes.STR || 0;
    let heft = Math.ceil(STR / 2);

    stats.talents
        .filter(t => talentMap[t].modifier?.heft)
        .forEach(t => heft += talentMap[t].modifier?.heft || 0);

    return heft;
}