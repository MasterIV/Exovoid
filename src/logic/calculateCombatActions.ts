import {WeaponType} from "../types/weapon";
import CharacterType from "../types/character";

export interface CombatAction {
    id: string;
    name: string;
    ap: number;
    ammo?: number;
    skill?: string;
    modifier?: number;
    callback?: () => void;
}

export function calculateWeaponActions(weapon: WeaponType, talents: string[] = [])  {
    const modifier = Number(weapon.qualities['Handling'])|0;
    const ammo = weapon.skill === "Melee" ? 0 : 1;
    const actions: Record<string, CombatAction> = {attack: {id: "attack", ammo, name: "Attack", ap: weapon.speed, skill: weapon.skill, modifier}};

    if(weapon.magazine > 0 && weapon.reload) {
        actions.reload = {id: "reload", name: "Reload", ap: weapon.reload, ammo: weapon.magazine};
    }

    if(weapon.skill === "Melee") {
        actions.parry = {id: "parry", name: "Parry", ap: Math.ceil(weapon.speed/2), skill: "Defense", modifier: modifier-3};
    }

    if(weapon.skill === "Melee" && talents.includes("Charge")) {
        actions.charge = {id: "charge", name: "Charge", ap: weapon.speed+2, skill: weapon.skill, modifier};
    }

    if(weapon.skill === "Melee" && talents.includes("Flurry")) {
        actions.flurry = {id: "flurry", name: "Flurry", ap: Math.ceil(weapon.speed/2), skill: weapon.skill, modifier: modifier-2};
    }

    if(weapon.skill === "Melee" && talents.includes("Heavy Blow")) {
        actions.heavy = {id: "heavy", name: "Heavy Blow", ap: weapon.speed*2, skill: weapon.skill, modifier};
    }

    if(talents.includes("Dual Wield")) {
        actions.dual = {id: "dual", name: "Dual Wield", ammo, ap: Math.floor(weapon.speed/2), skill: weapon.skill, modifier};
    }

    if(weapon.skill === "Firearms" && talents.includes("Speed Trigger")) {
        actions.trigger = {id: "trigger", name: "Speed Trigger",  ammo, ap: 0, skill: weapon.skill, modifier};
    }

    if(weapon.qualities["Burst"]) {
        const penalty = weapon.qualities['Compensated'] ? 1 : 2;
        actions.burst = {id: "burst", name: "Fire Burst", ap: weapon.speed, skill: weapon.skill, modifier: modifier-penalty, ammo: ammo+weapon.qualities["Burst"]};

        if(talents.includes("Dual Wield")) {
            actions["dual-burst"] = {id: "dual-burst", name: "Dual Wield Burst", ap: Math.floor(weapon.speed/2), skill: weapon.skill, modifier: modifier-penalty, ammo: ammo+weapon.qualities["Burst"]};
        }
    }

    if(weapon.qualities["Full Auto"]) {
        const penalty = weapon.qualities['Compensated'] ? 2 : 4;
        actions['auto-main'] = {id: "auto-main", name: "Full Auto Main Attack", ap: weapon.speed*2, skill: weapon.skill, modifier: modifier-penalty, ammo: ammo+weapon.qualities["Full Auto"]};

        if(talents.includes("Dual Wield")) {
            actions['dual-auto-main'] = {id: "dual-auto-main", name: "Dual Wield Full Auto Main Attack", ap: Math.floor(weapon.speed/2)*2, skill: weapon.skill, modifier: modifier-penalty, ammo: ammo+weapon.qualities["Full Auto"]};
        }

        actions['auto-up'] = {id: "auto-up", name: "Full Auto Follow Up", ap: 0, skill: weapon.skill, modifier: modifier-penalty};
    }

    return actions;
}

export function calculateCombatActions(stats: CharacterType) {
    const actions: Record<string, CombatAction> = {
        maneuver: {id: "maneuver", name: "Maneuver", ap: 4},
        disengage: {id: "disengage", name: "Disengage", ap: 3},
        quickstep: {id: "quickstep", name: "Quickstep", ap: 1},
        prepare: {id: "prepare", name: "Prepare", ap: 1},
        weapon: {id: "weapon", name: "Ready Weapon", ap: 3},
        dodge: {id: "dodge", name: "Dodge", ap: 2, skill: "Defense", modifier: -3},
        assist: {id: "assist", name: "Assist: Command", ap: 3, skill: "Command"},
        secondWind: {id: "secondWind", name: "Second Wind", ap: stats.talents.includes("Third Wind") ? 2 : 4, skill: "Survival"},
        // assess: {id: "assess", name: "Assess Opportunities", ap: 4, skill: "Vigilance"}, todo: vigilance is not an actual skill... might need to be able to treat it line one?
        firstAid: {id: "firstAid", name: "First Aid", ap: stats.talents.includes("Field Doctor") ? 5 : 8, skill: "Medicine"},
    }

    if(stats.talents.includes("Air Of Authority")) {
        actions.authority = {id: "authority", name: "Air Of Authority", ap: 2};
    }

    if(stats.talents.includes("Breath In, Exhale, Fire")) {
        actions.breath = {id: "breath", name: "Breath In, Exhale, Fire", ap: 3};
    }

    if(stats.talents.includes("Call Target")) {
        actions.call = {id: "call", name: "Call Target", ap: 2, skill: "Command"};
    }

    if(stats.talents.includes("Combat Clarity")) {
        actions.clarity = {id: "clarity", name: "Combat Clarity", ap: -2};
    }

    if(stats.talents.includes("Demand Obedience")) {
        actions.obedience = {id: "obedience", name: "Demand Obedience", ap: 6, skill: "Command"};
    }

    if(stats.talents.includes("Intimidation")) {
        actions.intimidation = {id: "intimidation", name: "Intimidation", ap: 4, skill: "Command"};
    }

    return actions;
}
