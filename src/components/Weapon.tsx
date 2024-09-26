import React, {useState} from "react";
import {
    Accordion, AccordionDetails, AccordionSummary,
    Autocomplete,
    Grid,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField, Tooltip,
    Typography
} from "@mui/material";
import {Btn, Dropdown} from "./Form";
import weapons from '../data/weapons.json';
import weaponsMods from '../data/weapon-mods.json';
import {CharacterWeapon} from "../types/character";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Value from "./Value";
import {WeaponType} from "../types/wapon";
import calculateWeaponActions from "../logic/calculateWeaponActions";

const weaponMap: Record<string, WeaponType> = {};
weapons.forEach(w => weaponMap[w.weapon] = w as WeaponType);

interface WeaponProps extends CharacterWeapon {
    onRemove: () => void;
    onChange: (name: string, value: any) => void;
    locked?: boolean;
}

export default React.memo(function Weapon({id, type, ammo, mods, locked, expanded, onChange, onRemove}: WeaponProps) {
    const details = weaponMap[type];
    const actions = calculateWeaponActions(details);
    const [data, setData] = useState({
        action: actions[0].id,
    });

    const changeData = (name: string, value: string) => {
        setData({...data, [name]: value});
    }

    const changeAmmo = (k:string,v:number) => onChange('ammo', {...ammo,[k]: v});

    return <Accordion  expanded={Boolean(expanded)} onChange={(x, e) => onChange('expanded', e)}>
        <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
            <Typography variant="h6" marginRight={2}>{type} ({details.type})</Typography>
            <Btn size="small" color={"error"} disabled={locked} onClick={() => (window.confirm("Remove Weapon?") && onRemove())}>Remove</Btn>
        </AccordionSummary>

        <AccordionDetails>
            <Grid container direction="column" spacing={2}>
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
        </AccordionDetails>
    </Accordion>;
});