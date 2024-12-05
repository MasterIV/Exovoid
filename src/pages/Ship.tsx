import useTable from "../state/table";
import React, {useCallback, useState} from "react";
import {ShipSystem, ShipType, ShipWeapon} from "../types/ship";

import shipTypes from "../data/ships.json";
import shipSystems from "../data/ship-modules.json";
import shipWeapons from "../data/ship-weapons.json";
import {
    Checkbox,
    Grid,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from "@mui/material";
import Collection, {CollectionItemPros} from "../components/Collection";
import {Btn, Dropdown, RmBtn, TextInput} from "../components/Form";
import * as uuid from "uuid";
import Item from "../components/Item";
import {useLock} from "../state/lock";

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

interface SystemProps extends ShipSystem, CollectionItemPros {

}

function System({onChange, onRemove, type, powered, ...system}: SystemProps) {
    const definition = shipSystemMap[type];

    return <TableRow>
        <TableCell>{type}</TableCell>
        <TableCell><TextInput type="number" name="quantity" values={system} onChange={onChange}/></TableCell>
        <TableCell>{definition.capacity}</TableCell>
        <TableCell>
            <Typography color={powered ? "textPrimary" : "textDisabled"}>{definition.power}</Typography>
            <Checkbox onChange={e => onChange('powered', e.target.checked)} checked={powered}/>
        </TableCell>
        <TableCell>{definition.cost}</TableCell>
        <TableCell>{definition.description}</TableCell>
        <TableCell><RmBtn label="System" onRemove={onRemove}/></TableCell>
    </TableRow>;
}

interface ArmamentProps extends ShipWeapon, CollectionItemPros {

}

function Armament({onChange, onRemove, type, ...weapon}: ArmamentProps) {
    const definition = shipWeaponMap[type];

    return null;
}

const itemDefaults = {name: "", quantity: 1, location: "", notes: ""};

export default function ShipPage({}: ShipPageProps) {
    const ships: ShipType[] = useTable(state => state.ships) || [{...shipDefaults, id: uuid.v4()}];
    const onChange = useTable(state => state.update);

    const [state, setState] = useState({
        selected: 0,
        system: null,
        weapon: null
    });

    const {selected} = state;
    const ship = ships[selected];

    const setData = useCallback((k: string, v: any) => setState(state => ({...state, [k]: v})), []);
    const changeShip = useCallback((k: string, d: any) => onChange('ships', ships.map(
        (s) => ship.id === s.id ? {...ship, [k]: d} : s
    )), [ship]);

    const changeSystem = useCallback((data: any) => onChange('systems', data), [onChange]);
    const addSystem = () => changeShip('systems', [...ship.systems, {
        id: uuid.v4(),
        type: state.system,
        amount: 1,
        powered: true,
    }]);

    const changeWeapon = useCallback((data: any) => onChange('weapons', data), [onChange]);
    const addWeapon = () => changeShip('weapons', [...ship.weapons, {
        id: uuid.v4(),
        type: state.weapon,
        ammo: { loaded: 0, reserve: 0 },
        powered: true,
    }]);

    const changeCargo = useCallback((data: any) => onChange('cargo', data), [onChange]);

    return <Grid container spacing={2} margin={1}>
        <Grid item xs={3}>


        </Grid><Grid item xs={9}>

        <Grid item>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell width="20%">System</TableCell>
                            <TableCell width="10%">Quantity</TableCell>
                            <TableCell width="10%">Capacity</TableCell>
                            <TableCell width="10%">Power</TableCell>
                            <TableCell width="10%">Cost</TableCell>
                            <TableCell width="35%">Description</TableCell>
                            <TableCell width="5%"/>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <Collection values={ship.systems} onChange={changeSystem} component={System}/>
                    </TableBody>
                </Table>
            </TableContainer>
        </Grid>

            <Grid container direction="row" spacing={2} alignItems="center" marginY={1}>
                <Grid item xs={8}><Dropdown
                    id="add-system"
                    label="System Type"
                    name="system"
                    values={state}
                    onChange={setData}
                    options={shipSystems.map(s => ({id: s.name, name: `${s.name} (${s.type})`}))}/></Grid>
                <Grid item xs={4}><Btn fullWidth size="large" onClick={addSystem}>Add Armor</Btn></Grid>
            </Grid>

            <Collection
                values={ship.weapons}
                onChange={changeWeapon}
                component={Armament}/>

            <Grid container direction="row" spacing={2} alignItems="center" marginY={1}>
                <Grid item xs={8}><Dropdown
                    id="add-system"
                    label="Weapon Type"
                    name="weapon"
                    values={state}
                    onChange={setData}
                    options={shipWeapons.map(w => ({id: w.weapon, name: `${w.name} (${w.weapon})`}))}/></Grid>
                <Grid item xs={4}><Btn fullWidth size="large" onClick={addWeapon}>Add Armor</Btn></Grid>
            </Grid>

            <Grid item>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell width="30%">Item</TableCell>
                                <TableCell width="10%">Quantity</TableCell>
                                <TableCell width="20%">Location</TableCell>
                                <TableCell width="25%">Notes</TableCell>
                                <TableCell width="5%"/>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <Collection values={ship.cargo} onChange={changeCargo} component={Item}/>
                        </TableBody>
                    </Table>
                </TableContainer>
            </Grid>

            <Grid item display="flex" justifyContent="end">
                <Btn onClick={() => changeCargo([...ship.cargo, {...itemDefaults, id: uuid.v4()}])}>Add Item</Btn>
            </Grid>
        </Grid>
    </Grid>;
}