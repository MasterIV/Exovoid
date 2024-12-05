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
import Value from "../components/Value";

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
        <TableCell>{definition.power !== 0 &&<Checkbox onChange={e => onChange('powered', e.target.checked)} checked={powered}/>}</TableCell>
        <TableCell>{type}</TableCell>
        <TableCell><TextInput type="number" name="amount" values={system} onChange={onChange}/></TableCell>
        <TableCell>{definition.capacity}</TableCell>
        <TableCell><Typography color={powered ? "white" : "grey"}>{definition.power}</Typography></TableCell>
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

const shipStates = [
    {id: "normal", name: "normal"},
    {id: "used", name: "used"},
    {id: "modern", name: "state od the art"}
];

export default function ShipPage({}: ShipPageProps) {
    const ships: ShipType[] = useTable(state => state.ships) || [];
    if(!ships.length) ships.push({...shipDefaults, id: uuid.v4()});
    const onChange = useTable(state => state.update);

    const [state, setState] = useState({
        selected: 0,
        system: shipSystems[0].name,
        weapon: shipWeapons[0].weapon
    });

    const {selected} = state;
    const ship = ships[selected];

    const setData = useCallback((k: string, v: any) => setState(state => ({...state, [k]: v})), []);
    const changeShip = useCallback((k: string, v: any) => onChange('ships', ships.map(
        (s: ShipType) : ShipType => ship.id === s.id ? {...ship, [k]: v} : s
    )), [ship, onChange]);

    const changeSystem = useCallback((data: any) => changeShip('systems', data), [changeShip]);
    const addSystem = () => changeShip('systems', [...ship.systems, {
        id: uuid.v4(),
        type: state.system,
        amount: 1,
        powered: true,
    }]);

    const changeWeapon = useCallback((data: any) => changeShip('weapons', data), [changeShip]);
    const addWeapon = () => changeShip('weapons', [...ship.weapons, {
        id: uuid.v4(),
        type: state.weapon,
        ammo: { loaded: 0, reserve: 0 },
        powered: true,
    }]);

    const changeCargo = useCallback((data: any) => changeShip('cargo', data), [changeShip]);
    const locked = useLock();
    const definition = shipTypeMap[ship.size];

    return <Grid container spacing={2} margin={1}>
        <Grid container direction={"column"} item spacing={2} xs={3}>
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

            <Grid item display="flex" justifyContent="center">
                <Value fullWidth name="currentHull" value={ship.currentHull} onChange={changeShip} label="Hull" mask={`/ ${definition.hull}`} />
            </Grid>

            <Grid item display="flex" justifyContent="center">
                <Value fullWidth name="currentArmor" value={ship.currentArmor} onChange={changeShip} label="Armor" mask={`/ ${definition.armor}`} />
            </Grid>

            <Grid item display="flex" justifyContent="center">
                <Value fullWidth name="currentShield" value={ship.currentShield} onChange={changeShip} label="Shield" mask={`/ tbd`}/>
            </Grid>

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
                            <TableCell>{definition.systemsCapacity}</TableCell>
                        </TableRow>

                        <TableRow>
                            <TableCell>Cost</TableCell>
                            <TableCell>{definition.cost}</TableCell>
                        </TableRow>
                    </Table>
                </TableContainer>
            </Grid>
        </Grid><Grid item container direction="column" spacing={2} xs={9}>

            <Grid item>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell width="5%"/>
                                <TableCell width="20%">System</TableCell>
                                <TableCell width="10%">Quantity</TableCell>
                                <TableCell width="10%">Capacity</TableCell>
                                <TableCell width="10%">Power</TableCell>
                                <TableCell width="10%">Cost</TableCell>
                                <TableCell width="30%">Description</TableCell>
                                <TableCell width="5%"/>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <Collection values={ship.systems} onChange={changeSystem} component={System}/>
                        </TableBody>
                    </Table>
                </TableContainer>
            </Grid>

            <Grid item container direction="row" spacing={2} alignItems="center">
                <Grid item xs={8}><Dropdown
                    id="add-system"
                    label="System Type"
                    name="system"
                    values={state}
                    onChange={setData}
                    options={shipSystems.map(s => ({id: s.name, name: `${s.name} (${s.type})`}))}/></Grid>
                <Grid item xs={4}><Btn fullWidth size="large" onClick={addSystem}>Add System</Btn></Grid>
            </Grid>

            <Collection
                values={ship.weapons}
                onChange={changeWeapon}
                component={Armament}/>

            <Grid item container direction="row" spacing={2} alignItems="center">
                <Grid item xs={8}><Dropdown
                    id="add-system"
                    label="Weapon Type"
                    name="weapon"
                    values={state}
                    onChange={setData}
                    options={shipWeapons.map(w => ({id: w.weapon, name: `${w.name} (${w.weapon})`}))}/></Grid>
                <Grid item xs={4}><Btn fullWidth size="large" onClick={addWeapon}>Add Weapon</Btn></Grid>
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