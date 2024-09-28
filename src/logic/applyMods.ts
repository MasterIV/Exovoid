import {WeaponType} from "../types/weapon";
import {CharacterWeapon} from "../types/character";
import weapons from '../data/weapons.json';

const weaponMap: Record<string, WeaponType> = {};
weapons.forEach(w => weaponMap[w.weapon] = w as WeaponType);

export function applyWeaponMods(weapon: CharacterWeapon): WeaponType {
    const mods = weapon.mods;
    const updated = {...weaponMap[weapon.type]};

    // todo Muzzle compensator and Shock Absorption Stock

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

    if (mods.includes("High-Cap"))
        updated.magazine = Math.floor(updated.magazine * 1.5);

    if (mods.includes("Quick-Reload") && updated.reload)
        updated.reload--;

    if (mods.includes("Drum / Block") && updated.reload) {
        updated.reload++;
        updated.qualities["Handling"] = (updated.qualities["Handling"] || 0) - 1;
        updated.magazine = Math.max(15, Math.ceil(updated.magazine * 3));
    }

    return updated;
}