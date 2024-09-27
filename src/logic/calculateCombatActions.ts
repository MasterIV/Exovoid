import {WeaponType} from "../types/wapon";
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
    const modifier = weapon.qualities['Handling']|0;
    const actions: Record<string, CombatAction> = {attack: {id: "attack", ammo: 1, name: "Attack", ap: weapon.speed, skill: weapon.skill, modifier}};

    if(weapon.magazine > 0 && weapon.reload) {
        actions.reload = {id: "reload", name: "Reload", ap: weapon.reload, ammo: weapon.magazine};
    }

    if(weapon.skill === "Melee") {
        actions.parry = {id: "parry", name: "Parry", ap: Math.ceil(weapon.speed/2), skill: "Defense", modifier: modifier-3};
    }

    if(weapon.qualities["Burst"]) {
        const penalty = weapon.qualities['Compensated'] ? 2 : 1;
        actions.burst = {id: "burst", name: "Fire Burst", ap: weapon.speed, skill: weapon.skill, modifier: modifier-penalty, ammo: 1+weapon.qualities["Burst"]};
    }

    if(weapon.qualities["Full Auto"]) {
        const penalty = weapon.qualities['Compensated'] ? 4 : 2;
        actions['auto-main'] = {id: "auto-main", name: "Full Auto Main Attack", ap: weapon.speed*2, skill: weapon.skill, modifier: modifier-penalty, ammo: 1+weapon.qualities["Full Auto"]};
        actions['auto-up'] = {id: "auto-up", name: "Full Auto Follow Up", ap: 0, skill: weapon.skill, modifier: modifier-penalty};
    }

    return actions;
}

export function calculateCombatActions(stats: CharacterType) {
    const actions: Record<string, CombatAction> = {
        maneuver: {id: "maneuver", name: "Maneuver", ap: 4},
        disengage: {id: "disengage", name: "Disengage", ap: 3},
        quickstep: {id: "quickstep", name: "Quickstep", ap: 1},
        prepare: {id: "Prepare", name: "Prepare", ap: 1},
        weapon: {id: "weapon", name: "Ready Weapon", ap: 3},
        dodge: {id: "dodge", name: "Dodge", ap: 2, skill: "Defense", modifier: -3},
        assist: {id: "assist", name: "Assist: Command", ap: 3, skill: "Command"},
        secondWind: {id: "secondWind", name: "Second Wind", ap: 4, skill: "Survival"},
        // assess: {id: "assess", name: "Assess Opportunities", ap: 4, skill: "Vigilance"}, todo: vigilance is not an actual skill... might need to be able to treat it line one?
        firstAid: {id: "firstAid", name: "First Aid", ap: 8, skill: "Medicine"},
    }

    return actions;
}