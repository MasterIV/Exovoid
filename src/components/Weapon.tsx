import React, {useState} from "react";
import {
    Autocomplete,
    Grid,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
    Typography
} from "@mui/material";
import {Btn, Dropdown} from "./Form";
import weapons from '../data/weapons.json';
import weaponsMods from '../data/weapon-mods.json';
import {CharacterWeapon} from "../types/character";
import Value from "./Value";

const weaponMap: Record<string, any> = {};
weapons.forEach(w => weaponMap[w.weapon] = w);

interface WeaponProps extends CharacterWeapon {
    onRemove: () => void;
    onChange: (name: string, value: any) => void;
    locked?: boolean;
}

const actions = [
    {id: "a1", name: "Attack"},
    {id: "a2", name: "Burst"},
    {id: "a3", name: "Full Auto"},
    {id: "a4", name: "Reload"},
]

export function Weapon({id, type, ammo, mods, locked, onChange, onRemove}: WeaponProps) {
    const details = weaponMap[type];
    const [data, setData] = useState({
        action: 'a1',
    });

    const changeData = (name: string, value: string) => {
        setData({...data, [name]: value});
    }

    const changeAmmo = (k:string,v:number) => onChange('ammo', {...ammo,[k]: v})

    return <Grid item>
        <Paper sx={{p: 2}}>
            <Grid container direction="column" spacing={2}>
                <Grid item container spacing={2}>
                    <Grid item xs={8}>
                        <Typography variant="h6">{type} ({details.type})</Typography>
                    </Grid><Grid item xs={4} textAlign="right">
                        <Btn color={"error"} disabled={locked} onClick={() => (window.confirm("Remove Weapon?") && onRemove())}>Remove</Btn>
                    </Grid>
                </Grid>

                {details.magazine > 0 && <Grid item><Stack spacing={2} direction="row">
                    <Value width={120} label="Rounds Loaded" name="loaded" value={ammo.loaded} onChange={changeAmmo} />
                    <Value width={120} label="Ammo Reserve" name="reserve" value={ammo.reserve} onChange={changeAmmo} />
                </Stack></Grid>}

                <Grid item><Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Hands</TableCell>
                            <TableCell>Magazine</TableCell>
                            <TableCell>Reload</TableCell>
                            <TableCell>Speed</TableCell>
                            <TableCell>Damage</TableCell>
                            <TableCell>Type</TableCell>
                            <TableCell>Range</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell>{details.hands}</TableCell>
                            <TableCell>{details.magazine}</TableCell>
                            <TableCell>{details.reload}</TableCell>
                            <TableCell>{details.speed}</TableCell>
                            <TableCell>{details.damage}</TableCell>
                            <TableCell>{details.damageType}</TableCell>
                            <TableCell>{details.range}</TableCell>
                        </TableRow>

                        <TableRow><TableCell colSpan={7}>
                            <strong>Qualities: </strong>
                            {Object.entries(details.qualities).map(q => Number(q[1]) > 1 ? `${q[0]}(${q[1]})` : q[0]).join(", ")}
                        </TableCell></TableRow>

                        <TableRow><TableCell colSpan={7}>
                            <strong>Trigger Options: </strong>
                            {details.triggerOptions}
                        </TableCell></TableRow>

                        {details.specialRules && <TableRow><TableCell colSpan={7}>
                            <strong>Special Rules:</strong> {details.specialRules}
                        </TableCell></TableRow>}
                    </TableBody>
                </Table></Grid>
                
                <Grid item>
                    <Autocomplete multiple
                                  value={mods}
                                  onChange={(e, v) =>  onChange('mods', v)}
                                  renderInput={(params) => <TextField {...params}  label="Mods" />}
                                  options={weaponsMods.map(m => m.name)} />
                </Grid>

                <Grid item container spacing={2} alignItems="center" justifyContent="right">
                    <Grid item xs={8}><Dropdown id={"action-" + id}
                              label="Action"
                              name="action"
                              values={data}
                              onChange={changeData}
                              options={actions}/></Grid>
                    <Grid item xs={4}><Btn fullWidth>Execute</Btn></Grid>
                </Grid>
            </Grid>
        </Paper>
    </Grid>;
}