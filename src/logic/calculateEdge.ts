import CharacterType from "../types/character";

export default function calculateEdge(stats: CharacterType) {
    const COO = stats.attributes.COO || 0;
    return  Math.ceil(4 + COO / 2);
}