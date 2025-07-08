import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Checkbox,
    FormControlLabel,
    Grid,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableRow
} from "@mui/material";
import Value from "../Value";
import React, {useCallback, useState} from "react";
import {DirectionalValue, distributions, ShipType} from "../../types/ship";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {Btn, Dropdown, TextInput} from "../Form";
import shipTypes from "../../data/ships.json";
import {useLock} from "../../state/lock";
import {calculateShipActions, CombatAction, formatAction} from "../../logic/calculateCombatActions";
import useCharacter from "../../state/character";
import calculateShipStats from "../../logic/calculateShipStats";

const shipTypeMap: Record<string, typeof shipTypes[0]> = {};
shipTypes.forEach(t => shipTypeMap[t.class] = t);

const shipStates = [
    {id: "normal", name: "normal"},
    {id: "used", name: "used"},
    {id: "modern", name: "state od the art"}
];

interface ShipDetailsProps {
    ship: ShipType;
    onChange: (n: string, v: any) => void;
    onAction: (action: CombatAction) => void;
}

interface ShipSegmentProps {
    name: keyof DirectionalValue;
    currentArmor: DirectionalValue;
    maxArmor: DirectionalValue;
    currentShield: DirectionalValue;
    maxShield: DirectionalValue;
    onShieldChange: (direction: string, value: number) => void;
    onArmorChange: (direction: string, value: number) => void;
}

function ShipSegment({
                         name,
                         maxArmor,
                         currentArmor,
                         maxShield,
                         currentShield,
                         onShieldChange,
                         onArmorChange
                     }: ShipSegmentProps) {
    return <Stack spacing={2}>
        <Value width={80} name={name} label={"Shield"} mask={`/ ${maxShield[name]}`} value={currentShield[name] | 0}
               onChange={onShieldChange}/>
        <Value width={80} name={name} label={"Armor"} mask={`/ ${maxArmor[name]}`} value={currentArmor[name] | 0}
               onChange={onArmorChange}/>
    </Stack>
}

export function applyDistribution(value: number, distribution: DirectionalValue) {
    const front = Math.round(value * distribution.front);
    const left = Math.round(value * distribution.left);
    const right = Math.round(value * distribution.right);
    const back = value - front - left - right;
    return {front, left, right, back};
}

const availableStations = {
    officer: "Officer",
    pilot: "Pilot",
    gunner: "Gunner",
    engineer: "Engineer",
    sensors: "Sensors",
    computer: "Computer",
}

export default function ShipDetails({ship, onChange, onAction}: ShipDetailsProps) {
    const locked = useLock();
    const stats = useCharacter();
    const definition = calculateShipStats(shipTypeMap[ship.size], ship);
    const format = new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 })

    const [stations, setStations] = useState(Object.fromEntries(Object.keys(availableStations).map(k => [k, false])));
    const actions = calculateShipActions(stats, definition.size, stations, ship.systems.map(s => s.type));
    const [data,setData] = useState({action: 'switch'})

    const changeData = useCallback((k: string, v: any) => setData(old => ({...old, [k]: v})), []);
    const switchStation = useCallback((k: string, v: any) => {
        setStations(old => ({...old, [k]: v}));
        setData({action: 'switch'});
    }, []);

    const segmentProps: ShipSegmentProps = {
        maxArmor: applyDistribution(definition.armor, distributions[ship.armorDistribution] || distributions.balanced),
        currentArmor: ship.currentArmor,
        maxShield: applyDistribution(definition.shield, distributions[ship.shieldDistribution] || distributions.balanced),
        currentShield: ship.currentShield,
        onArmorChange: (d, v) => onChange('currentArmor', {...ship.currentArmor, [d]: v}),
        onShieldChange: (d, v) => onChange('currentShield', {...ship.currentShield, [d]: v}),
        name: "front",
    }

    return <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon/>}>Details</AccordionSummary>
        <AccordionDetails><Grid container spacing={2}>
            <Grid item xs container spacing={2} direction={"column"}>
                <Grid item>
                    <TextInput size="small" label="Name" name="name" values={ship} onChange={onChange}/>
                </Grid>

                <Grid item>
                    <Dropdown
                        id="ship-size"
                        label="Class"
                        name="size"
                        values={ship}
                        disabled={locked}
                        onChange={onChange}
                        options={shipTypes.map(t => ({id: t.class, name: t.class}))}/>
                </Grid>

                <Grid item>
                    <Dropdown
                        id="ship-state"
                        label="State"
                        name="state"
                        disabled={locked}
                        values={ship}
                        onChange={onChange}
                        options={shipStates}/>
                </Grid>

                <Grid item>
                    <Dropdown
                        id="armor-distirbution"
                        label="Armor Distribution"
                        name="armorDistribution"
                        disabled={locked}
                        values={ship}
                        onChange={onChange}
                        defaultValue="balanced"
                        options={Object.keys(distributions).map(s => ({id: s, name: s}))}/>
                </Grid>

                <Grid item>
                    <Dropdown
                        id="shield-distirbution"
                        label="Shield Distribution"
                        name="shieldDistribution"
                        disabled={locked}
                        values={ship}
                        onChange={onChange}
                        defaultValue="balanced"
                        options={Object.keys(distributions).map(s => ({id: s, name: s}))}/>
                </Grid>

                <Grid item>
                    <Value
                        fullWidth
                        name="currentHull"
                        value={ship.currentHull}
                        onChange={onChange}
                        label="Hull"
                        mask={`/ ${definition.hull}`}/>
                </Grid>


                <Grid item>
                    <Dropdown id={"action-general"}
                              label="Action"
                              name="action"
                              values={data}
                              onChange={changeData}
                              options={Object.values(actions).map(formatAction)}/>
                </Grid>

                <Grid item>
                    <Btn fullWidth onClick={() => onAction(actions[data.action])}>Execute</Btn>
                </Grid>
            </Grid>

            <Grid item xs={"auto"}>
                <div className="ship">
                    <div style={{top: 25, left: 155}}>
                        <ShipSegment {...segmentProps} name="front"/>
                    </div>

                    <div style={{left: 25, top: 195}}>
                        <ShipSegment {...segmentProps} name="left"/>
                    </div>

                    <div style={{right: 25, top: 195}}>
                        <ShipSegment {...segmentProps} name="right"/>
                    </div>

                    <div style={{bottom: 25, left: 155}}>
                        <ShipSegment {...segmentProps} name="back"/>
                    </div>
                </div>

            </Grid>


            <Grid item container direction="column" spacing={2} xs>
                <Grid item>
                    <div className="ship-stats">
                        <Table>
                            <TableBody>
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
                                <TableRow>
                                    <TableCell>Power</TableCell>
                                    <TableCell>{format.format(definition.power)}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Capacity</TableCell>
                                    <TableCell>{format.format(definition.capacity)}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Cost</TableCell>
                                    <TableCell>{format.format(definition.cost)}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </div>
                </Grid>

                <Grid item>
                    <div className="ship-stats" style={{padding: "0 12px"}}>
                        {Object.entries(availableStations).map(([k, l]) => <FormControlLabel key={k} control={<Checkbox
                            onChange={e => switchStation(k, e.target.checked)}
                            checked={stations[k]}/>} label={l}/>)}
                    </div>
                </Grid>
            </Grid>
        </Grid></AccordionDetails>
    </Accordion>
}