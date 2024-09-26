import {WeaponType} from "../types/wapon";

export interface CombatAction {
    id: string;
    name: string;
    ap: number;
    ammo?: number;
    skill?: string;
    modifier?: number;
    callback?: () => void;
}

export default function calculateWeaponActions(weapon: WeaponType)  {
    const modifier = 0;
    const actions:CombatAction[] = [{id: "attack", ammo: 1, name: "Attack", ap: weapon.speed, skill: weapon.skill, modifier}];

    if(weapon.magazine > 0 && weapon.reload) {
        actions.push({id: "reload", name: "Reload", ap: weapon.reload})
    }

    if(weapon.skill === "Melee") {
        actions.push({id: "parry", name: "Parry", ap: Math.ceil(weapon.speed/2), skill: "Defense", modifier: -3})
    }

    if(weapon.qualities["Burst"]) {
        actions.push({id: "burst", name: "Fire Burst", ap: weapon.speed, modifier: -2})
    }

    if(weapon.qualities["Full Auto"]) {
        actions.push({id: "auto-main", name: "Full Auto Main Attack", ap: weapon.speed*2, modifier: -4})
        actions.push({id: "auto-up", name: "Full Auto Follow Up", ap: 0, modifier: -4})
    }

    return actions;
}