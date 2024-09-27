import CharacterType from "../types/character";
import talents from "../data/talents.json";
import TalentType from "../types/talent";

const talentMap: Record<string, TalentType> = {};
talents.forEach(t => talentMap[t.talent] = t);

export default function calculateEdge(stats: CharacterType) {
    const COO = stats.attributes.COO || 0;
	const EDU = stats.attributes.EDU || 0;
    let edge = Math.ceil(3 + COO / 4 + EDU / 2);
	
	stats.talents
        .filter(t => talentMap[t].modifier?.edge)
        .forEach(t => edge += talentMap[t].modifier?.edge || 0);
	
	return edge;
}