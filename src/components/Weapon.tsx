import React, {useMemo, useState} from "react";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Autocomplete,
    Chip,
    Grid,
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
import weaponsMods from '../data/weapon-mods.json';
import {CharacterWeapon} from "../types/character";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Value from "./Value";
import {calculateWeaponActions, CombatAction} from "../logic/calculateCombatActions";
import {applyWeaponMods} from "../logic/applyMods";

const modMap: Record<string, typeof weaponsMods[0]> = {};
weaponsMods.forEach(mod => modMap[mod.name] = mod);

interface WeaponProps extends CharacterWeapon {
    onRemove: () => void;
    onChange: (name: string, value: any) => void;
    onAction: (action: CombatAction, weapon: CharacterWeapon | null) => void;
    locked?: boolean;
    talents: string[];
    heft: number;
}

function createChips(data: Record<string, number | undefined>) {
    return <Stack direction="row" spacing={1} marginX={1} display={"inline-block"}>
        {Object.entries(data).map(q => {
            const label = Number(q[1]) > 0 ? `${q[0]}: ${q[1]}` : q[0];
            return <Chip size="small" label={label} />;
        })}
    </Stack>
}

export default React.memo(function Weapon({locked, heft, onChange, onRemove, onAction, talents, ...weapon}: WeaponProps) {
    const details = useMemo(() => applyWeaponMods(weapon), [weapon.type, weapon.mods]);
    const actions = calculateWeaponActions(details, talents);

    const [action, setAction] = useState(Object.keys(actions)[0]);
    const changeData = (name: string, value: string) => setAction(value);

    const changeAmmo = (k:string,v:number) => onChange('ammo', {...weapon.ammo,[k]: v});
    const performAction = () => onAction(actions[action], weapon);

    const removeWeapon = (e: any) => {
        e.stopPropagation();
        if(window.confirm("Remove Weapon?"))
            onRemove();
    }

    const filledSlots = weapon.mods.map(m => modMap[m].slot);
    const availableMods = weaponsMods
        .filter(m => !filledSlots.includes(m.slot))
        .filter(m => m.compatible.includes(details.type));

    let damage = details.damage;
    if(details.skill === "Melee")
        damage += details.hands * heft;

    return <Accordion  expanded={Boolean(weapon.expanded)} onChange={(x, e) => onChange('expanded', e)}>
        <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
            <Typography variant="h6" marginRight={2}>{details.name} ({details.weapon})</Typography>
            <Btn size="small" color={"error"} disabled={locked} onClick={removeWeapon}>Remove</Btn>
        </AccordionSummary>

        <AccordionDetails>
            <Grid container direction="column" spacing={2}>
                {details.magazine > 0 && <Grid item><Stack spacing={2} direction="row">
                    <Value width={120} label="Rounds Loaded" name="loaded" value={weapon.ammo.loaded} onChange={changeAmmo} />
                    <Value width={120} label="Ammo Reserve" name="reserve" value={weapon.ammo.reserve} onChange={changeAmmo} />
                </Stack></Grid>}

                <Grid item><Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Damage</TableCell>
                            <TableCell>Speed</TableCell>
                            <TableCell>Range</TableCell>
                            <TableCell>Magazine</TableCell>
                            <TableCell>Reload</TableCell>
                            <TableCell>Type</TableCell>
                            <TableCell>Hands</TableCell>
                            <TableCell>Mods</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell>{damage}</TableCell>
                            <TableCell>{details.speed}</TableCell>
                            <TableCell>{details.range}</TableCell>
                            <TableCell>{details.magazine}</TableCell>
                            <TableCell>{details.reload}</TableCell>
                            <TableCell>{details.damageType}</TableCell>
                            <TableCell>{details.hands}</TableCell>
                            <TableCell>{details.modLimit}</TableCell>
                        </TableRow>

                        <TableRow><TableCell colSpan={8}>
                            <strong>Qualities: </strong>
                            {createChips(details.qualities)}
                        </TableCell></TableRow>

                        <TableRow><TableCell colSpan={8}>
                            <strong>Trigger Options: </strong>
                            {createChips(details.triggerOptions)}
                        </TableCell></TableRow>

                        {details.specialRules && <TableRow><TableCell colSpan={8}>
                            <strong>Special Rules:</strong> {details.specialRules}
                        </TableCell></TableRow>}
                    </TableBody>
                </Table></Grid>
                
                <Grid item>
                    <Autocomplete multiple disableClearable
                                  value={weapon.mods}
                                  onChange={(e, v) =>  onChange('mods', v)}
                                  renderInput={(params) => <TextField {...params}  label="Mods" />}
                                  options={availableMods.map(m => m.name)} />
                </Grid>

                <Grid item container spacing={2} alignItems="center" justifyContent="right">
                    <Grid item xs={8}><Dropdown id={"action-" + weapon.id}
                              label="Action"
                              name="action"
                              values={{action}}
                              onChange={changeData}
                              options={Object.values(actions)}/></Grid>
                    <Grid item xs={4}><Btn fullWidth onClick={performAction}>Execute</Btn></Grid>
                </Grid>
            </Grid>
        </AccordionDetails>
    </Accordion>;
});