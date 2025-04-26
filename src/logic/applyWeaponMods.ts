import {WeaponType} from "../types/weapon";
import {CharacterWeapon} from "../types/character";
import weapons from '../data/weapons.json';
import weaponsMods from "../data/weapon-mods.json";
import manufacturers from '../data/manufacturer.json';

const weaponMap: Record<string, WeaponType> = {};
weapons.forEach(w => weaponMap[w.weapon] = w as WeaponType);

const modMap: Record<string, typeof weaponsMods[0]> = {};
weaponsMods.forEach(mod => modMap[mod.name] = mod);

export default function applyWeaponMods(weapon: CharacterWeapon, heft: number = 0): WeaponType {
    const mods = weapon.mods;
    const updated = {
        ...weaponMap[weapon.type],
        qualities: {...weaponMap[weapon.type].qualities},
        triggerOptions: {...weaponMap[weapon.type].triggerOptions},
    };

    const manufacturer = manufacturers
        .filter(m => m.compatible.includes(updated.type))
        .find(m => m.name === weapon.manufacturer);
    if(manufacturer?.showEffect) updated.specialRules += " " + manufacturer.effects

    switch (weapon.manufacturer) {
        case "No-Name":
            updated.cost = Math.round(updated.cost / 2 );
            break;
        case "Akura Micro":
            updated.speed -= 1;
            updated.damage -= updated.damageType === "Laser" ? 2 : 1;
            break;
        case "Azerra Firearms":
            updated.triggerOptions["Shredding"] = (updated.triggerOptions["Shredding"] || 1) + 1;
            break;
        case "Callisto":
            updated.modLimit -= 1;
            break;
        case "Cerberus Armory":
            updated.modLimit -= 1;
            break;
        case "Forge Titan Dynamics":
            updated.damage += 2;
            break;
        case "Ghinroh Clan Forge":
            updated.triggerOptions["Lethal"] = (updated.triggerOptions["Lethal"] || 0) + 3;
            updated.cost = updated.cost * 2 + 200;
            updated.modLimit -= 1;
            break;
        case "Korvex Spinalworks":
            updated.qualities["Intoxicating"] = 0;
            break;
        case "Lugtah Codex":
            updated.cost = updated.cost * 2 + 200;
            updated.modLimit -= 1;
            break;
        case "Orion Tactical":
            updated.modLimit += 1;
            break;
        case "Triton Systems":
            updated.qualities["Concealed"] = Math.max((updated.qualities["Concealed"] || 4) - 1, 1);
            break;
        case "Nova Industries (Laser)":
            updated.damageType = "Laser";
            updated.triggerOptions["Penetrating"] = (updated.triggerOptions["Penetrating"] || 3) + 2;
            delete updated.qualities["Loud"];
            updated.qualities["Silenced"] = 0;
            updated.cost *= 2;
            break;
        case "Nova Industries (Electrical)":
            updated.damageType = "Electrical";
            updated.triggerOptions["Concussing"] = 0;
            updated.cost *= 2;
            break;
        case "Nova Industries (Fire)":
            updated.damageType = "Fire";
            updated.triggerOptions["Plasmascorch"] = 0;
            updated.cost *= 2;
            break;
    }

    // this needs to be before magazine modifications
    if (mods.includes("Fast Trigger Unit")) {
        if(!updated.qualities["Burst"])
            updated.qualities["Burst"] = Math.max(5, Math.ceil(updated.magazine/5));
        if(!updated.qualities["Full Auto"])
            updated.qualities["Full Auto"] = updated.qualities["Burst"] * 3;
    }

    if(mods.includes("AP Chamber"))
        updated.triggerOptions["Penetrating"] = (updated.triggerOptions["Penetrating"] || 0) + 2;

    if(mods.includes("Focus Lense") && updated.triggerOptions["Penetrating"])
        updated.triggerOptions["Penetrating"] = Math.ceil(updated.triggerOptions["Penetrating"] * 1.2);

    if(mods.includes("Muzzle Compensator"))
        updated.qualities["Compensated"] = (updated.qualities["Compensated"] || 0) + 1;

    if(mods.includes("Shock Absorption Stock"))
        updated.qualities["Compensated"] = (updated.qualities["Compensated"] || 0) + 1;

    if (mods.includes("Silencer"))
        if (updated.qualities["Loud"]) delete updated.qualities["Loud"];
        else updated.qualities["Silenced"] = 0;

    if (mods.includes("Heavy-Duty Coupler")) {
        updated.damage = Math.ceil(updated.damage * 1.2);
        updated.magazine = Math.ceil(updated.magazine * .7);
    }

    if (mods.includes("Focus Lense") && updated.qualities["Penetrating"])
        updated.qualities["Penetrating"] = Math.ceil(updated.qualities["Penetrating"] * 1.2);

    if (mods.includes("Tactical Folding Stock"))
        if (updated.qualities["Concealed"]) updated.qualities["Concealed"]--;
        else updated.qualities["Concealed"] = 3;

    if (mods.includes("Adjustable Combat Stock"))
        updated.qualities["Handling"] = (updated.qualities["Handling"] || 0) + 1;

    if (mods.includes("Smartgun Integration"))
        updated.qualities["Handling"] = (updated.qualities["Handling"] || 0) + 2;

    if (mods.includes("High-Cap"))
        updated.magazine = Math.floor(updated.magazine * 1.5);

    if (mods.includes("Quick-Reload") && updated.reload)
        updated.reload--;

    if (mods.includes("Drum / Block") && updated.reload) {
        updated.reload++;
        updated.qualities["Handling"] = (updated.qualities["Handling"] || 0) - 1;
        if(updated.qualities["Handling"] === 0) delete updated.qualities["Handling"];
        updated.magazine = Math.max(15, Math.ceil(updated.magazine * 3));
    }

    mods
        .filter(m => modMap[m].showEffect)
        .forEach(m=> updated.specialRules += " " + modMap[m].effects);

    if (updated.skill === "Melee")
        updated.damage += updated.hands * heft;

    if(weapon.overwrites) {
        Object.keys(weapon.overwrites) // @ts-ignore
            .filter(k => weapon.overwrites[k]) // @ts-ignore
            .forEach(k => updated[k] = weapon.overwrites[k])
    }

    updated.cost += mods.map(m => modMap[m].cost).reduce((a, b) => a+b, 0)

    return updated;
}