import {CharacterArmor} from "../types/character";
import {ArmorType} from "../types/armor";
import armors from '../data/armors.json';
import armorMods from "../data/armor-mods.json";
import manufacturers from "../data/manufacturer.json";

const armorMap: Record<string, ArmorType> = {};
armors.forEach(a => armorMap[a.armor] = a);

const modMap: Record<string, typeof armorMods[0]> = {};
armorMods.forEach(mod => modMap[mod.name] = mod);

export default function applyArmorMods(armor: CharacterArmor) : ArmorType {
    const mods = armor.mods;
    const updated: ArmorType = {...armorMap[armor.type]};

    const manufacturer = manufacturers
        .filter(m => m.compatible.includes(updated.type))
        .find(m => m.name === armor.manufacturer);
    if(manufacturer?.showEffect) updated.specialRules += " " + manufacturer.effects;

    mods
        .filter(m => modMap[m].showEffect)
        .forEach(m=> updated.specialRules += " " + modMap[m].effects);

    return updated;
}