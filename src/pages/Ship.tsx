import useTable from "../state/table";
import React, {useCallback, useState} from "react";
import {ShipType} from "../types/ship";

import shipTypes from "../data/ships.json";
import shipSystems from "../data/ship-modules.json";
import shipWeapons from "../data/ship-weapons.json";
import {Grid, Paper, Table, TableCell, TableContainer, TableRow} from "@mui/material";
import {Btn, Dropdown, RmBtn, TextInput} from "../components/Form";
import * as uuid from "uuid";
import {useLock} from "../state/lock";
import Systems from "../components/Ship/Systems";
import Weapons from "../components/Ship/Weapons";
import Inventory from "../components/Inventory";
import {ShipPools} from "../components/Ship/ShipDetails";

const shipTypeMap: Record<string, typeof shipTypes[0]> = {};
shipTypes.forEach(t => shipTypeMap[t.class] = t);
const shipSystemMap: Record<string, typeof shipSystems[0]> = {};
shipSystems.forEach(t => shipSystemMap[t.name] = t);
const shipWeaponMap: Record<string, typeof shipWeapons[0]> = {};
shipWeapons.forEach(t => shipWeaponMap[t.weapon] = t);

interface ShipPageProps {

}

const shipDefaults: ShipType = {
    id: "",
    cargo: [],
    currentArmor: 0,
    currentHull: 0,
    currentShield: 0,
    malfunctions: [],
    name: "",
    size: shipTypes[0].class,
    state: 'normal',
    systems: [],
    weapons: []
}

const shipStates = [
    {id: "normal", name: "normal"},
    {id: "used", name: "used"},
    {id: "modern", name: "state od the art"}
];

export default function ShipPage({}: ShipPageProps) {
    const ships: ShipType[] = useTable(state => state.ships) || [];
    if(!ships.length) ships.push({...shipDefaults, id: uuid.v4()});
    const onChange = useTable(state => state.update);

    const [selected, setSelected] = useState(0);
    const ship = ships[selected];

    const changeShip = useCallback((k: string, v: any) => onChange('ships', ships.map(
        (s: ShipType) : ShipType => ship.id === s.id ? {...ship, [k]: v} : s
    )), [ship, onChange]);

    const changeSystem = useCallback((data: any) => changeShip('systems', data), [changeShip]);
    const changeWeapon = useCallback((data: any) => changeShip('weapons', data), [changeShip]);
    const changeCargo = useCallback((data: any) => changeShip('cargo', data), [changeShip]);

    const locked = useLock();
    const definition = shipTypeMap[ship.size];

    return <Grid container spacing={2} margin={1}>
        <Grid container direction={"column"} item spacing={2} xs={3}>
            <Grid item>
                <Dropdown
                    id="ship"
                    label="Ship"
                    name="selected"
                    values={{selected}}
                    disabled={locked}
                    onChange={(k,v) => setSelected(v)}
                    options={ships.map((s, i) => ({id: String(i), name: s.name}))} />
            </Grid>

            <Grid item><TextInput label="Name" name="name" values={ship} onChange={changeShip} /></Grid>

            <Grid item>
                <Dropdown
                    id="ship-size"
                    label="Class"
                    name="size"
                    values={ship}
                    disabled={locked}
                    onChange={changeShip}
                    options={shipTypes.map(t => ({id: t.class, name: t.class}))} />
            </Grid>

            <Grid item>
                <Dropdown
                    id="ship-state"
                    label="State"
                    name="state"
                    disabled={locked}
                    values={ship}
                    onChange={changeShip}
                    options={shipStates} />
            </Grid>

            <ShipPools maxHull={definition.hull} maxArmor={definition.armor} maxShield={0} ship={ship} onChange={changeShip} />

            <Grid item>
                <TableContainer component={Paper}>
                    <Table>
                        <TableRow>
                            <TableCell>Maneuverability</TableCell>
                            <TableCell>{definition.maneuverability}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Speed</TableCell>
                            <TableCell>{definition.speed}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Soak</TableCell>
                            <TableCell>{definition.primarySoak} / {definition.secondarySoak}</TableCell>
                        </TableRow>
                    </Table>
                </TableContainer>
            </Grid>

            <Grid item>
                <TableContainer component={Paper}>
                    <Table>
                        <TableRow>
                            <TableCell>Power</TableCell>
                            <TableCell>{-(definition.basePowerGenerated - definition.basePowerNeeded)}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Capacity</TableCell>
                            <TableCell>{definition.capacity}</TableCell>
                        </TableRow>

                        <TableRow>
                            <TableCell>Cost</TableCell>
                            <TableCell>{definition.cost}</TableCell>
                        </TableRow>
                    </Table>
                </TableContainer>
            </Grid>

            <Grid item container spacing={2}>
                <Grid item xs={6}><Btn fullWidth>Add Ship</Btn></Grid>
                <Grid item xs={6}><RmBtn fullWidth label="Ship" onRemove={() => {}} /></Grid>
            </Grid>

        </Grid><Grid item container direction="column" spacing={2} xs={9}>
            <Systems systems={ship.systems} onChange={changeSystem} capacity={definition.capacity}/>
            <Weapons weapons={ship.weapons} onChange={changeWeapon} />
            <Inventory inventory={ship.cargo} onChange={changeCargo} />
        </Grid>
    </Grid>;
}