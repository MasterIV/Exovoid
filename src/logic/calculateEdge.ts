import CharacterType from "../types/character";

export default function calculateEdge(stats: CharacterType) {
    const COO = stats.attributes.COO || 0;
	const EDU = stats.attributes.EDU || 0;
    return  Math.ceil(3 + COO / 4 + EDU / 2);
}