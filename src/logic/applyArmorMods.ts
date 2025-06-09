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
    const updated: ArmorType = {
        ...armorMap[armor.type],
        qualities: {...armorMap[armor.type].qualities},
    };

    const manufacturer = manufacturers
        .filter(m => m.compatible.includes(updated.type))
        .find(m => m.name === armor.manufacturer);
    if(manufacturer?.showEffect) updated.specialRules += " " + manufacturer.effects;

    switch (armor.manufacturer) {
        case "No-Name":
            updated.cost = Math.round(updated.cost / 2 );
            break;
        case "Argonis Framewerks":
            updated.modLimit += 1;
            updated.moddingOptions = armorMods.map(m => m.name);
            break;
        case "Exocore":
            if(updated.moddingOptions.includes("Sealed"))
                updated.qualities["Vacuum-Sealed"] = 0;
            break;
        case "Ferroclave Systems":
            updated.qualities["Evasive"] = (updated.qualities["Evasive"] || 0) - 2;
            break;
        case "Redline Dynamics":
            updated.qualities["Speed"] = (updated.qualities["Speed"] || 0) + 2;
            updated.qualities["Evasive"] = (updated.qualities["Evasive"] || 0) + 2;
            break;
    }

    if(mods.includes("State-of-the-Art"))
        updated.durability = Math.ceil(updated.durability * 1.5);
    else if(mods.includes("Advanced Materials"))
        updated.durability = Math.ceil(updated.durability * 1.25);

    if(mods.includes("Battery Expansion"))
        updated.qualities["Battery"] = (updated.qualities["Battery"]||0) * 3;

    if(armor.durability > 0 || mods.includes("Emergency Systems")) {
        // apply mod effects that require durability
        if(mods.includes("Sealed"))
            updated.qualities["Vacuum-Sealed"] = 0;
        if(mods.includes("Servos")) {
            updated.qualities["Speed"] = (updated.qualities["Speed"] || 0) + 2;
            updated.qualities["Evasive"] = (updated.qualities["Evasive"] || 0) + 1;
        }
    }

    mods
        .filter(m => modMap[m].showEffect)
        .filter(m => !modMap[m].requireDurability || armor.durability > 0 || mods.includes("Emergency Systems"))
        .forEach(m=> updated.specialRules += " " + modMap[m].effects);

    return updated;
}