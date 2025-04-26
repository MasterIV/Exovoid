import {ShipWeapon} from "../../types/ship";
import Collection, {CollectionItemPros} from "../Collection";
import shipWeapons from "../../data/ship-weapons.json";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Checkbox,
    Grid,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography
} from "@mui/material";
import {Btn, Dropdown, RmBtn} from "../Form";
import React, {useState} from "react";
import * as uuid from "uuid";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Value from "../Value";


const shipWeaponMap: Record<string, typeof shipWeapons[0]> = {};
shipWeapons.forEach(t => shipWeaponMap[t.weapon] = t);


interface WeaponProps extends ShipWeapon, CollectionItemPros {

}

function Weapon({onChange, onRemove, type, powered, ...weapon}: WeaponProps) {
    const details = shipWeaponMap[type];



    const changeAmmo = (k:string,v:number) => onChange('ammo', {...weapon.ammo,[k]: v});

    const togglePower = (e: {target:{checked:boolean}, stopPropagation: () => void}) => {
        e.stopPropagation();
        onChange('powered', e.target.checked)
    }

    return <Accordion expanded={Boolean(weapon.expanded)} onChange={(x, e) => onChange('expanded', e)}>
        <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
            <Typography color={powered ? "white" : "grey"} variant="h6" marginRight={2}>{details.name} ({details.weapon})</Typography>
            <RmBtn size="small" label="Weapon" onRemove={onRemove}/>
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
                            <TableCell>Power</TableCell>
                            <TableCell>Damage</TableCell>
                            <TableCell>Speed</TableCell>
                            <TableCell>Range</TableCell>
                            <TableCell>Magazine</TableCell>
                            <TableCell>Reload</TableCell>
                            <TableCell>Type</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell><Checkbox onChange={togglePower} checked={powered}/> {details.power}</TableCell>
                            <TableCell>{details.damage}</TableCell>
                            <TableCell>{details.speed}</TableCell>
                            <TableCell>{details.range}</TableCell>
                            <TableCell>{details.magazine}</TableCell>
                            <TableCell>{details.reload}</TableCell>
                            <TableCell>{details.damageType}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table></Grid>
            </Grid>
        </AccordionDetails>
    </Accordion>;
}

interface WeaponsProps {
    weapons: ShipWeapon[];
    onChange: (data: any) => void;
}

export default function Weapons({weapons, onChange}: WeaponsProps) {
    const [weapon, setWeapon] = useState(shipWeapons[0].weapon);

    const addWeapon = () => onChange( [...weapons, {
        id: uuid.v4(),
        type: weapon,
        ammo: { loaded: 0, reserve: 0 },
        powered: true,
        expanded: false,
    }]);

    return <>
        <Grid item><Collection
            id="ship-weapons"
            values={weapons}
            onChange={onChange}
            component={Weapon}/></Grid>

        <Grid item container direction="row" spacing={2} alignItems="center">
            <Grid item xs={8}><Dropdown
                id="add-system"
                label="Weapon Type"
                name="weapon"
                values={{weapon}}
                onChange={(k,v) => setWeapon(v)}
                options={shipWeapons.map(w => ({id: w.weapon, name: `${w.name} (${w.weapon})`}))}/></Grid>
            <Grid item xs={4}><Btn fullWidth onClick={addWeapon}>Add Weapon</Btn></Grid>
        </Grid>
    </>;
}