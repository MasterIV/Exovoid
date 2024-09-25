import React, {useCallback, useState} from "react";
import {Grid} from "@mui/material";
import CharacterType from "../types/character";
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

interface CombatPageProps {
    onChange: (name: string, value: any) => void;
    onRoll: (skill: number, attribute: number, modifier?: number, metadata?: Record<string, any>) => void;
    stats: CharacterType;
    locked?: boolean;
}

export default function CombatPage({stats, onChange, locked} : CombatPageProps) {
    const [data,setData] = useState({
        weapon: "",
        wound: "",
        damage: "",
    })

    const changeWeapons = useCallback((data: any) => onChange('weapons', data), [onChange]);
    const changeData = useCallback((k: string, v: any) => setData(old => ({...old, [k]: v})), []);
    const joinCombat = () => socket.emit("combatant", charToCombatant(stats));

    const characterWeapons = stats.weapons || [];
    const addWeapon = () => onChange('weapons', [...characterWeapons, {
        id: uuid.v4(),
        type: data.weapon,
        mods: [],
        ammo: {loaded: 0, reserve: 0}
    }])

    const changeHealth = useCallback((hp: number) => onChange('currentHealth', hp), [onChange]);
    const changeInjuries = useCallback((i: string[]) => onChange('injuries', i), [onChange]);

    return (<Grid container spacing={2} margin={1}>
        <Grid item xs={3}>
            <Initiative>
                <Grid item container spacing={2}>
                    <Grid item xs={12}><Btn fullWidth onClick={joinCombat}>Join Combat</Btn></Grid>
                </Grid>
            </Initiative>
        </Grid>
        <Grid item container spacing={2} direction="column" xs={6}>

                <Collection
                    locked={locked}
                    values={characterWeapons}
                    onChange={changeWeapons}
                    component={Weapon} />

                <Grid item container direction="row" spacing={2} alignItems="center">
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