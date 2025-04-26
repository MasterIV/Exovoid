import {CharacterArmor} from "../types/character";
import {ArmorType} from "../types/armor";
import armors from '../data/armors.json';

const armorMap: Record<string, ArmorType> = {};
armors.forEach(a => armorMap[a.type] = a);

export default function applyArmorMods(armor: CharacterArmor) : ArmorType {
    return armorMap[armor.type];
}