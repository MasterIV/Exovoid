import CharacterType from "../types/character";

export default function calculateHealth(stats: CharacterType) {
    const CON = stats.attributes.CON || 0
    return 8 + CON;
}