import React, {useCallback, useContext, useState} from "react";
import {Grid} from "@mui/material";
import CharacterType, {CharacterWeapon} from "../types/character";
import Weapon from "../components/Weapon";
import {Btn, Dropdown} from "../components/Form";
import Collection from "../components/Collection";
import weapons from '../data/weapons.json';
import * as uuid from 'uuid';
import Value from "../components/Value";
import calculateHealth from "../logic/calculateHealth";
import calculateEdge from "../logic/calculateEdge";
import Initiative from "../components/Initiative";
import socket from "../socket";
import charToCombatant from "../logic/charToCombatant";
import Injuries from "../components/Injuries";
import {calculateCombatActions, CombatAction} from "../logic/calculateCombatActions";
import {attributeAverage} from "../logic/calculatePool";
import {InitiativeContext} from "../provider/InitiativeProvider";
import {WeaponType} from "../types/weapon";

const weaponMap: Record<string, WeaponType> = {};
weapons.forEach(w => weaponMap[w.weapon] = w as WeaponType);

interface CombatPageProps {
    onChange: (name: string, value: any) => void;
    onRoll: (skill: number, attribute: number, modifier?: number, metadata?: Record<string, any>) => void;
    stats: CharacterType;
    locked?: boolean;
}

export default function CombatPage({stats, onChange, onRoll, locked} : CombatPageProps) {
    const actions = calculateCombatActions(stats);
    const [data,setData] = useState({
        weapon: weapons[0].weapon,
        action: Object.keys(actions)[0],
    })

    const changeWeapons = useCallback((data: any) => onChange('weapons', data), [onChange]);
    const changeData = useCallback((k: string, v: any) => setData(old => ({...old, [k]: v})), []);
    const joinCombat = () => socket.emit("combatant", charToCombatant(stats));
    const {spendAp} = useContext(InitiativeContext);

    const characterWeapons = stats.weapons || [];
    const addWeapon = () => onChange('weapons', [...characterWeapons, {
        id: uuid.v4(),
        type: data.weapon,
        mods: [],
        ammo: {loaded: 0, reserve: 0}
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
                <Grid item container spacing={2}>
                    <Grid item xs={12}><Btn fullWidth onClick={joinCombat}>Join Combat</Btn></Grid>
                </Grid>

                <Grid item>
                    <Dropdown id={"action-general"}
                              label="Action"
                              name="action"
                              values={data}
                              onChange={changeData}
                              options={Object.values(actions)}/>
                </Grid>

                <Grid item>
                    <Btn fullWidth onClick={() => performAction(actions[data.action])}>Execute</Btn>
                </Grid>
            </Initiative>
        </Grid>
        <Grid item xs={6}>

                <Collection
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
                        options={weapons.map(w => ({id: w.weapon, name: w.weapon}))} /></Grid>
                    <Grid item xs={4}><Btn fullWidth size="large" onClick={addWeapon}>Add Weapon</Btn></Grid>
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