import React, {useCallback, useState} from "react";
import {Grid} from "@mui/material";
import {CharacterWeapon} from "../types/character";
import Weapon from "../components/Combat/Weapon";
import {Btn, Dropdown} from "../components/Form";
import Collection from "../components/Collection";
import weapons from '../data/weapons.json';
import armors from '../data/armors.json';
import * as uuid from 'uuid';
import Value from "../components/Value";
import Initiative from "../components/Combat/Initiative";
import socket from "../socket";
import charToCombatant from "../logic/charToCombatant";
import Injuries from "../components/Combat/Injuries";
import {calculateCombatActions, CombatAction, formatAction} from "../logic/calculateCombatActions";
import {attributeAverage} from "../logic/calculatePool";
import {WeaponType} from "../types/weapon";
import {Armor} from "../components/Combat/Armor";
import {calculateEdge, calculateHealth, calculateHeft} from "../logic/calculateDerived";
import useCharacter from "../state/character";
import useCombat from "../state/combat";

const weaponMap: Record<string, WeaponType> = {};
weapons.forEach(w => weaponMap[w.weapon] = w as WeaponType);

const armorMap: Record<string, typeof armors[0]> = {};
armors.forEach(w => armorMap[w.type] = w);

interface CombatPageProps {
    onRoll: (skill: number, attribute: number, modifier?: number, metadata?: Record<string, any>) => void;
    locked?: boolean;
}

export default function CombatPage({onRoll, locked} : CombatPageProps) {
    const stats = useCharacter();
    const onChange = useCharacter(state => stats.update);

    const actions = calculateCombatActions(stats);
    const [data,setData] = useState({
        weapon: weapons[0].weapon,
        armor: armors[0].type,
        action: Object.keys(actions)[0],
    })

    const changeWeapons = useCallback((data: any) => onChange('weapons', data), [onChange]);
    const changeData = useCallback((k: string, v: any) => setData(old => ({...old, [k]: v})), []);
    const joinCombat = () => socket.emit("combatant", charToCombatant(stats));
    const leaveCombat = () => window.confirm("Leave Combat?") && socket.emit("remove", stats.id);
    const spendAp = useCombat(state => state.spendAp);

    const characterWeapons = stats.weapons || [];
    const addWeapon = () => onChange('weapons', [...characterWeapons, {
        id: uuid.v4(),
        type: data.weapon,
        mods: [],
        ammo: {loaded: 0, reserve: 0}
    }]);

    const changeArmor = useCallback((data: any) => onChange('armor', data), [onChange]);
    const addArmor = ()  => onChange('armor', [...stats.armor, {
        id: uuid.v4(),
        type: data.armor,
        durability: armorMap[data.armor].durability,
        mods: [],
    }]);

    const performAction = (action: CombatAction, weapon: CharacterWeapon | null = null) => {
        if(action.id !== "reload" && Number(action.ammo) > Number(weapon?.ammo.loaded))
            return alert("Not enough ammo!");

        if(action.skill) {
            const metadata = {
                skill: action.skill,
                id: stats.id,
                ap: action.ap,
                weapon: weapon?.id,
                ammo: action.ammo
            };

            // defer any further action to roll submission
            return onRoll(
                stats.skills[action.skill] || 0,
                attributeAverage(action.skill, stats.attributes),
                action.modifier,
                metadata);
        }

        if(action.id === "reload" && action.ammo && weapon) {
            const loaded = Math.min(action.ammo, weapon.ammo.loaded + weapon.ammo.reserve);
            const reserve = weapon.ammo.reserve - loaded + weapon.ammo.loaded;
            onChange('weapons', characterWeapons.map(w => w.id === weapon.id ? {...w, ammo: {loaded, reserve}} : w));
        }

        spendAp(stats.id, action.ap);
    }

    const changeHealth = useCallback((hp: number) => onChange('currentHealth', hp), [onChange]);
    const changeInjuries = useCallback((i: string[]) => onChange('injuries', i), [onChange]);

    return (<Grid container spacing={2} margin={1}>
        <Grid item xs={3}>
            <Initiative>
                <Grid item>
                    <Btn fullWidth onClick={joinCombat}>Join Combat</Btn>
                </Grid>

                <Grid item>
                    <Btn fullWidth onClick={leaveCombat} color="error">Leave Combat</Btn>
                </Grid>

                <Grid item>
                    <Dropdown id={"action-general"}
                              label="Action"
                              name="action"
                              values={data}
                              onChange={changeData}
                              options={Object.values(actions).map(formatAction)}/>
                </Grid>

                <Grid item>
                    <Btn fullWidth onClick={() => performAction(actions[data.action])}>Execute</Btn>
                </Grid>
            </Initiative>
        </Grid>
        <Grid item xs={6}>

                <Collection
                    heft={calculateHeft(stats)}
                    locked={locked}
                    talents={stats.talents}
                    values={characterWeapons}
                    onChange={changeWeapons}
                    onAction={performAction}
                    component={Weapon} />

                <Grid container direction="row" spacing={2} alignItems="center" marginY={1}>
                    <Grid item xs={8}><Dropdown
                        id="add-weapon"
                        label="Weapon Type"
                        name="weapon"
                        values={data}
                        onChange={changeData}
                        options={weapons.map(w => ({id: w.weapon, name: `${w.name} (${w.weapon})`}))} /></Grid>
                    <Grid item xs={4}><Btn fullWidth onClick={addWeapon}>Add Weapon</Btn></Grid>
                </Grid>

                <Collection
                    locked={locked}
                    values={stats.armor}
                    onChange={changeArmor}
                    component={Armor} />

                <Grid container direction="row" spacing={2} alignItems="center" marginY={1}>
                    <Grid item xs={8}><Dropdown
                        id="add-armor"
                        label="Armor Type"
                        name="armor"
                        values={data}
                        onChange={changeData}
                        options={armors.map(a => ({id: a.type, name: `${a.name} (${a.type})`}))} /></Grid>
                    <Grid item xs={4}><Btn fullWidth onClick={addArmor}>Add Armor</Btn></Grid>
                </Grid>

        </Grid>
        <Grid container direction="column" item xs={3} spacing={2}>
            <Grid item textAlign='center'>
                <Value name='currentHealth' width={250} label='Health' mask={` / ${calculateHealth(stats)}`}
                       value={stats.currentHealth} onChange={onChange}/>
            </Grid>
            <Grid item textAlign='center'>
                <Value name='currentEdge' width={250} label='Edge' mask={` / ${calculateEdge(stats)}`} value={stats.currentEdge}
                       onChange={onChange}/>
            </Grid>

            <Injuries
                injuries={stats.injuries || []}
                health={stats.currentHealth}
                changeHealth={changeHealth}
                changeInjuries={changeInjuries}  />
        </Grid>
    </Grid>);
}