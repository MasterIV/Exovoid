import React, {useMemo, useState} from "react";
import {Accordion, AccordionDetails, AccordionSummary, Chip, Grid, Paper, Stack, Typography} from "@mui/material";
import {Btn, Dropdown, RmBtn, TextInput} from "../Form";
import weaponsMods from '../../data/weapon-mods.json';
import manufacturers from '../../data/manufacturer.json';
import {CharacterWeapon} from "../../types/character";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Value from "../Value";
import {calculateWeaponActions, CombatAction, formatAction} from "../../logic/calculateCombatActions";
import applyWeaponMods from "../../logic/applyWeaponMods";
import {CollectionItemPros} from "../Collection";
import ModSlot from "./ModSlot";
import {WeaponModType} from "../../types/weapon";

const modMap: Record<string, typeof weaponsMods[0]> = {};
weaponsMods.forEach(mod => modMap[mod.name] = mod);

interface WeaponProps extends CharacterWeapon, CollectionItemPros {
    onAction: (action: CombatAction, weapon: CharacterWeapon | null) => void;
    talents: string[];
    heft: number;
}

const iconSize = 24;

const slotLocations: Record<string, {left: number, top: number}> = {
    "Muzzle / Barrel": {left: 50, top: 150},
    "Head / Blade": {left: 50, top: 200},
    "Scopes": {left: 330, top: 80},
    "Material": {left: 330, top: 130},
    "Mechanism": {left: 300, top: 200},
    "Body": {left: 300, top: 250},
    "Stock": {left: 460, top: 150},
    "Handle": {left: 460, top: 200},
    "Grip": {left: 420, top: 300},
    "Magazine / Battery": {left: 430, top: 360},
    "Rail Attachments": {left: 150, top: 260},
}

export default React.memo(function Weapon({heft, onChange, onRemove, onAction, talents, ...weapon}: WeaponProps) {
    const details = useMemo(
        () => applyWeaponMods(weapon, heft),
        [weapon.type, weapon.manufacturer, weapon.mods, weapon.overwrites, heft]);
    const actions = calculateWeaponActions(details, talents);

    const [action, setAction] = useState(Object.keys(actions)[0]);
    const changeData = (name: string, value: string) => setAction(value);

    const changeAmmo = (k: string, v: number) => onChange('ammo', {...weapon.ammo, [k]: v});
    const performAction = () => onAction(actions[action], weapon);

    const setOverwrite = (name: string) => () => {
        const overwrites: Record<string, any> = weapon.overwrites || {}
        const val = window.prompt(`Overwrite ${name}?`, overwrites[name]);
        if(val !== null) onChange('overwrites', {...overwrites, [name]: val});
    }

    const installedMods: Record<string, WeaponModType | null> = Object.fromEntries(weapon.mods.map(m => [modMap[m].slot, modMap[m]]));
    const modLimitReached = weapon.mods.length >= details.modLimit;
    const setMod = (slot: string, mod: WeaponModType | null) => {
        installedMods[slot] = mod;
        onChange("mods", Object.values(installedMods)
            .filter(m => m !== null)
            .map(m => m?.name))
    }

    const availableManufacturers = manufacturers
        .filter(m => m.compatible.includes(details.type))
        .map(m => ({id: m.name, name: m.name}));

    return <Accordion expanded={Boolean(weapon.expanded)} onChange={(x, e) => onChange('expanded', e)}>
        <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
            <Typography variant="h6" marginRight={2}>{details.name} ({details.weapon})</Typography>
            <RmBtn size="small" label="Weapon" onRemove={onRemove}/>
        </AccordionSummary>

        <AccordionDetails>
            <Grid container direction="column" spacing={2}>
                {details.magazine > 0 && <Grid item><Stack spacing={2} direction="row">
                    <Value width={120} label="Rounds Loaded" name="loaded" value={weapon.ammo.loaded}
                           onChange={changeAmmo}/>
                    <Value width={120} label="Ammo Reserve" name="reserve" value={weapon.ammo.reserve}
                           onChange={changeAmmo}/>
                </Stack></Grid>}

                <Grid item>
                    <div className="weapon" style={{backgroundImage: `url(img/weapons/${details.image})`}}>
                        {availableManufacturers.length > 0 && <div style={{position: "absolute", top: 10, left: 10,}}>
                            <Dropdown
                                size="small"
                                id={"manufacturer"}
                                label={"Manufacturer"}
                                name={"manufacturer"}
                                values={weapon}
                                onChange={onChange}
                                defaultValue={"No-Name"}
                                options={availableManufacturers}/>
                        </div>}

                        <Grid spacing={2} container style={{position: "absolute", bottom: 10, left: 10}}
                              alignItems="flex-end">
                            {Object.keys(details.qualities).length > 0 && <Grid item>
                                <Paper className="weapon-qualities">
                                    <strong>Qualities:</strong>
                                    <ul>
                                        {Object.entries(details.qualities).map(q => {
                                            const label = Number(q[1]) > 0 ? `${q[0]}: ${q[1]}` : q[0];
                                            return <li key={q[0]}>{label}</li>;
                                        })}
                                    </ul>
                                </Paper>
                            </Grid>}

                            {Object.keys(details.triggerOptions).length > 0 && <Grid item>
                                <Paper className="weapon-qualities">
                                    <strong>Trigger Options:</strong>
                                    <ul>
                                        {Object.entries(details.triggerOptions).map(q => {
                                            const label = Number(q[1]) > 0 ? `${q[0]}: ${q[1]}` : q[0];
                                            return <li key={q[0]}>{label}</li>;
                                        })}
                                    </ul>
                                </Paper>
                            </Grid>}
                        </Grid>

                        <Stack direction="row" spacing={1} style={{position: "absolute", top: 12, right: 12}}>
                            <Chip title={`Damage Type: ${details.damageType}`} label={details.damage}
                                  onClick={setOverwrite('damage')}
                                  icon={<img src={`img/icons/Damage-${details.damageType}.svg`} height={20}/>}/>
                            <Chip title="Speed" label={details.speed}
                                  onClick={setOverwrite('speed')}
                                  icon={<img src="img/icons/speed.svg" height={iconSize}/>}/>
                            <Chip title="Range" label={details.range}
                                  onClick={setOverwrite('range')}
                                  icon={<img src="img/icons/range.svg" height={iconSize}/>}/>
                            {details.magazine > 0 && <Chip title="Magazine" label={details.magazine}
                                                           onClick={setOverwrite('magazine')}
                                                           icon={<img src="img/icons/magazine.svg" height={iconSize}/>}/>}
                            {details.magazine > 0 && <Chip title="Reload" label={details.reload}
                                                           onClick={setOverwrite('reload')}
                                                           icon={<img src="img/icons/reload.svg" height={iconSize}/>}/>}
                        </Stack>

                        <Stack direction={"row"} spacing={1} style={{position: "absolute", bottom: 12, right: 12,}}>
                            <Chip title="Hands" label={details.hands}
                                  icon={<img src="img/icons/twohanded.svg" height={iconSize}/>}/>
                            <Chip title="Mod Limit" label={details.modLimit}
                                  icon={<img src="img/icons/mods.svg" height={iconSize}/>}/>
                            <Chip title="Price" label={details.cost}
                                  icon={<img src="img/icons/money.svg" height={iconSize}/>}/>
                        </Stack>

                        {Object.keys(slotLocations).map((location) => {
                            const availableMods = weaponsMods
                                .filter(m => m.slot === location)
                                .filter(m => m.compatible.includes(details.type));

                            if(availableMods.length < 1) return null;
                            const position = details.slots?.[location] ?? slotLocations[location];
                            const installed = installedMods[location];

                            return <ModSlot
                                key={location}
                                available={availableMods}
                                installed={installed}
                                position={position}
                                disabled={modLimitReached}
                                slot={location}
                                onChange={setMod} />
                        }).filter(s => s !== null)}


                    </div>

                </Grid>

                {details.specialRules && <Grid item>
                    <div style={{padding: 8}}>
                        <strong>Special Rules:</strong> {details.specialRules}
                    </div>
                </Grid>}

                <Grid item>
                    <TextInput size="small" name="customization" values={weapon} onChange={onChange} label="Customizations" />
                </Grid>

                <Grid item container spacing={2} alignItems="center" justifyContent="right">
                    <Grid item xs={8}><Dropdown id={"action-" + weapon.id}
                                                label="Action"
                                                name="action"
                                                values={{action}}
                                                onChange={changeData}
                                                options={Object.values(actions).map(formatAction)}/></Grid>
                    <Grid item xs={4}><Btn fullWidth onClick={performAction}>Execute</Btn></Grid>
                </Grid>
            </Grid>
        </AccordionDetails>
    </Accordion>;
});