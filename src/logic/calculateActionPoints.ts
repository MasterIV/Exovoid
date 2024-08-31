import CharacterType from "../types/character";

export default function calculateActionPoints(stats: CharacterType) {
    const AGI = stats.attributes.AGI || 0
    return Math.ceil(3 + AGI / 2);
}