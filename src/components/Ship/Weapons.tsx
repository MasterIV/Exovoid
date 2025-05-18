import {ShipWeapon} from "../../types/ship";
import Collection, {CollectionItemPros} from "../Collection";
import shipWeapons from "../../data/ship-weapons.json";
import {Accordion, AccordionDetails, AccordionSummary, Checkbox, Chip, Grid, Stack, Typography} from "@mui/material";
import {Btn, Dropdown, RmBtn} from "../Form";
import React, {useState} from "react";
import * as uuid from "uuid";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Value from "../Value";
import {calculateGunneryActions, CombatAction, formatAction} from "../../logic/calculateCombatActions";


const shipWeaponMap: Record<string, typeof shipWeapons[0]> = {};
shipWeapons.forEach(t => shipWeaponMap[t.weapon] = t);

const iconSize = 24;

interface WeaponProps extends ShipWeapon, CollectionItemPros {
    onAction: (action: CombatAction, weapon: ShipWeapon) => void;
}

function createChips(label: string, data: any) {
    return <Stack spacing={1} direction="row" alignItems="center">
        <strong>{label}:</strong>
        {Object.entries(data).map(q => {
            const label = Number(q[1]) > 0 ? `${q[0]}: ${q[1]}` : q[0];
            return <Chip key={q[0]} label={label}/>;
        })}
    </Stack>
}

function Weapon({onChange, onRemove, onAction, ...weapon}: WeaponProps) {
    const details = shipWeaponMap[weapon.type];

    const changeAmmo = (k: string, v: number) => onChange('ammo', {...weapon.ammo, [k]: v});
    const togglePower = (e: { target: { checked: boolean }, stopPropagation: () => void }) => {
        e.stopPropagation();
        onChange('powered', e.target.checked)
    }

    const actions = calculateGunneryActions(details, []);
    const [action, setAction] = useState(Object.keys(actions)[0]);
    const changeData = (name: string, value: string) => setAction(value);

    return <Grid item>
        <div className="ship-weapon">
            <Grid spacing={2} direction="column" container>
                <Grid item container spacing={2} alignItems="center">
                    <Grid item xs="auto" textAlign="right"><Checkbox onChange={togglePower} checked={weapon.powered}/></Grid>

                    <Grid item xs>
                        <Typography color={weapon.powered ? "white" : "grey"} variant="h6" marginRight={2}>
                            {details.name} ({details.weapon})
                        </Typography>
                    </Grid>

                    <Grid item xs="auto" textAlign="right"><RmBtn size="small" label="Weapon" onRemove={onRemove}/></Grid>
                </Grid>

                <Grid item container spacing={1} alignItems="center">
                    <Grid item><strong>Weapon:</strong></Grid>

                    <Grid item><Chip title={`Damage Type: ${details.damageType}`} label={details.damage}
                                     icon={<img src={`img/icons/Damage-${details.damageType}.svg`} height={20}/>}/></Grid>
                    <Grid item><Chip title="Speed" label={details.speed}
                                     icon={<img src="img/icons/speed.svg" height={iconSize}/>}/></Grid>
                    <Grid item><Chip title="Range" label={details.range}
                                     icon={<img src="img/icons/range.svg" height={iconSize}/>}/></Grid>

                    {details.magazine > 0 && <Grid item><Chip title="Magazine" label={details.magazine}
                                                              icon={<img src="img/icons/magazine.svg"
                                                                         height={iconSize}/>}/></Grid>}
                    {details.magazine > 0 && <Grid item><Chip title="Reload" label={details.reload}
                                                              icon={<img src="img/icons/reload.svg"
                                                                         height={iconSize}/>}/></Grid>}

                    <Grid item><Chip title={`Power`} label={details.power}
                                     icon={<img src={`img/icons/Damage-Electrical.svg`} height={20}/>}/></Grid>
                    <Grid item><Chip title="Price" label={details.cost}
                                     icon={<img src="img/icons/money.svg" height={iconSize}/>}/></Grid>

                    {details.magazine > 0 && <Grid item xs><Stack spacing={2} direction="row" justifyContent="flex-end">
                        <Value width={80} label="Loaded" name="loaded" value={weapon.ammo.loaded}
                               onChange={changeAmmo}/>
                        <Value width={80} label="Reserve" name="reserve" value={weapon.ammo.reserve}
                               onChange={changeAmmo}/>
                    </Stack></Grid>}
                </Grid>

                <Grid item container spacing={5}>
                    {Object.keys(details.qualities).length > 0 && <Grid item>{createChips("Qualities", details.qualities)}</Grid>}
                    {Object.keys(details.triggerOptions).length > 0 && <Grid item>{createChips("Trigger Options", details.triggerOptions)}</Grid>}
                </Grid>


                <Grid item container spacing={2} alignItems="center" justifyContent="right">
                    <Grid item xs={8}><Dropdown id={"action-" + weapon.id}
                                                label="Action"
                                                name="action"
                                                values={{action}}
                                                onChange={changeData}
                                                options={Object.values(actions).map(formatAction)}/></Grid>
                    <Grid item xs={4}><Btn fullWidth disabled={!weapon.powered} onClick={() => onAction(actions[action], weapon)}>Execute</Btn></Grid>
                </Grid>
            </Grid>
        </div>
    </Grid>;
}

interface WeaponsProps {
    weapons: ShipWeapon[];
    onChange: (data: any) => void;
    onAction: (action: CombatAction, weapon: ShipWeapon) => void;
}

export default function Weapons({weapons, onChange, onAction}: WeaponsProps) {
    const [weapon, setWeapon] = useState(shipWeapons[0].weapon);

    const addWeapon = () => onChange([...weapons, {
        id: uuid.v4(),
        type: weapon,
        ammo: {loaded: 0, reserve: 0},
        powered: true,
        expanded: false,
    }]);

    return <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon/>}>Weapons</AccordionSummary>
        <AccordionDetails><Grid container spacing={2} direction="column">
            <Collection
                id="ship-weapons"
                values={weapons}
                onChange={onChange}
                onAction={onAction}
                component={Weapon}/>

            <Grid item container direction="row" spacing={2} alignItems="center">
                <Grid item xs={8}><Dropdown
                    id="add-system"
                    label="Weapon Type"
                    name="weapon"
                    values={{weapon}}
                    onChange={(k, v) => setWeapon(v)}
                    options={shipWeapons.map(w => ({id: w.weapon, name: `${w.name} (${w.weapon})`}))}/></Grid>
                <Grid item xs={4}><Btn fullWidth onClick={addWeapon}>Add Weapon</Btn></Grid>
            </Grid>
        </Grid></AccordionDetails></Accordion>;
}