import {ShipType} from "../types/ship";
import shipSystems from "../data/ship-modules.json";
import shipWeapons from "../data/ship-weapons.json";

const shipSystemMap: Record<string, typeof shipSystems[0]> = {};
shipSystems.forEach(t => shipSystemMap[t.name] = t);
const shipWeaponMap: Record<string, typeof shipWeapons[0]> = {};
shipWeapons.forEach(t => shipWeaponMap[t.weapon] = t);


export function parseShipStat(expr: string | number, Max: number, Cap: number = 0) {
    return Math.round(eval(String(expr)) * 100) / 100;
}

export interface ShipDefinition {
    size: number;
    bridge: number;
    maneuverability: number;
    speed: number;
    basePowerNeeded: number;
    basePowerGenerated: number;
    hull: number;
    armor: number;
    primarySoak: number;
    secondarySoak: number;
    capacity: number;
    cost: number;
}

export interface ShipStats extends ShipDefinition {
    shield: number;
    power: number;
    powerGenerated: number;
}

export default function calculateShipStats(definition: ShipDefinition, ship: ShipType): ShipStats {
    const result = {
        ...definition,
        shield: 0,
        power: definition.basePowerGenerated - definition.basePowerNeeded,
        powerGenerated: definition.basePowerGenerated,
        hullMultiplier: 1,
        armorMultiplier: 1,
    };

    ship.systems.forEach(system => {
        const def = shipSystemMap[system.type]
        const capacity = parseShipStat(def.capacity, definition.capacity) * system.amount;
        const power = parseShipStat(def.power, definition.capacity, capacity) * system.amount;
        const cost = parseShipStat(def.cost, definition.capacity, capacity) * system.amount;

        result.cost += cost;
        result.capacity -= capacity;

        if (!def.power || system.powered) {
            result.power -= power;
            if (power < 0) result.basePowerGenerated -= power;

            if(def.modifier) {
                // @ts-ignore
                Object.entries(def.modifier).forEach((k, v) => result[k] += v * system.amount);
            }

            switch (system.type) {
                case "":
                    break;
            }
        }
    });

    ship.weapons.forEach(weapon => {
       const def = shipWeaponMap[weapon.type];
       result.cost += def.cost;
       result.capacity -= def.capacity;
       if(weapon.powered) result.power -= def.power;
    });

    result.armor *= result.armorMultiplier;
    result.hull  *= result.hullMultiplier;

    return result;
}