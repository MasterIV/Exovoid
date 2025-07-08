import useTable from "../state/table";
import React, {useCallback, useState} from "react";
import {DirectionalValue, distributions, ShipType, ShipWeapon} from "../types/ship";

import shipTypes from "../data/ships.json";
import {Accordion, AccordionDetails, AccordionSummary, Grid} from "@mui/material";
import {Btn, Dropdown, RmBtn} from "../components/Form";
import * as uuid from "uuid";
import {useLock} from "../state/lock";
import Systems from "../components/Ship/Systems";
import Weapons from "../components/Ship/Weapons";
import Inventory from "../components/Inventory";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ShipDetails, {applyDistribution} from "../components/Ship/ShipDetails";
import Initiative from "../components/Combat/Initiative";
import socket from "../socket";
import charToCombatant from "../logic/charToCombatant";
import useCharacter from "../state/character";
import Malfunctions from "../components/Ship/Malfunctions";
import {CombatAction} from "../logic/calculateCombatActions";
import useCombat from "../state/combat";
import {attributeAverage} from "../logic/calculatePool";
import calculateShipStats from "../logic/calculateShipStats";

const shipTypeMap: Record<string, typeof shipTypes[0]> = {};
shipTypes.forEach(t => shipTypeMap[t.class] = t);


interface ShipPageProps {
    onRoll: (skill: number, attribute: number, modifier?: number, metadata?: Record<string, any>) => void;
}

const shipDefaults: ShipType = {
    id: "",
    cargo: [],
    currentHull: 0,
    currentArmor: {front: 0, left: 0, right: 0, back: 0},
    currentShield: {front: 0, left: 0, right: 0, back: 0},
    armorDistribution: "balanced",
    shieldDistribution: "balanced",
    malfunctions: [],
    name: "New Ship",
    size: shipTypes[0].class,
    state: 'normal',
    systems: [],
    weapons: []
}

export default function ShipPage({onRoll}: ShipPageProps) {
    const stats = useCharacter();
    const ships: ShipType[] = useTable(state => state.ships) || [];
    if(!ships.length) ships.push({...shipDefaults, id: uuid.v4()});

    const onChange = useTable(state => state.update);
    const onChangeShip = useTable(state => state.updateShip);

    const [selected, setSelected] = useState(0);
    const ship = ships[selected];
    const changeShip = useCallback((k: string, v: any) => onChangeShip(ship.id, k, v), [ship.id, onChangeShip]);

    const addShip = () => onChange('ships',[...ships, {...shipDefaults}]);
    const removeShip = () => {
        onChange('ships',ships.filter(s => s.id !== ship.id));
        setSelected(0);
    }

    const changeSystem = useCallback((data: any) => changeShip('systems', data), [changeShip]);
    const changeWeapon = useCallback((data: any) => changeShip('weapons', data), [changeShip]);
    const changeCargo = useCallback((data: any) => changeShip('cargo', data), [changeShip]);

    const joinCombat = () => socket.emit("combatant", charToCombatant(stats));
    const leaveCombat = () => window.confirm("Leave Combat?") && socket.emit("remove", stats.id);

    const changeHull = useCallback((hull: number) => {
        changeShip('currentHull', hull)
    }, [changeShip]);
    const changeMalfunctions = useCallback((m: string[]) => changeShip('malfunctions', m), [changeShip]);

    const locked = useLock();
    const definition = shipTypeMap[ship.size];

    const rechargeShield = () => {
        const {shield, shieldRecharge} = calculateShipStats(definition, ship);
        const distributed: DirectionalValue = applyDistribution(shield, distributions[ship.shieldDistribution]);
        const rechargedShield: DirectionalValue = {...ship.currentShield};

        Object.keys(distributed).forEach(d => {
            const key = d as keyof DirectionalValue
            const max = distributed[key];
            rechargedShield[key] = Math.min(max, rechargedShield[key] + Math.ceil(max * shieldRecharge));
        })

        changeShip('currentShield', rechargedShield)
    }

    const performAction = useCallback((action: CombatAction, weapon: ShipWeapon | null = null) => {
        const spendAp = useCombat.getState().spendAp;
        const character = useCharacter.getState()

        if(action.id !== "reload" && Number(action.ammo) > Number(weapon?.ammo.loaded))
            return alert("Not enough ammo!");

        if(action.skill) {
            const metadata = {
                skill: action.skill,
                id: character.id,
                ap: action.ap,
                weapon: weapon?.id,
                ammo: action.ammo,
                ship: ship.id,
            };

            // defer any further action to roll submission
            return onRoll(
                character.skills[action.skill] || 0,
                attributeAverage(action.skill, character.attributes),
                action.modifier,
                metadata);
        }

        if(action.id === "reload" && action.ammo && weapon) {
            const loaded = Math.min(action.ammo, weapon.ammo.loaded + weapon.ammo.reserve);
            const reserve = weapon.ammo.reserve - loaded + weapon.ammo.loaded;
            const ammo = {loaded, reserve};
            changeWeapon(ship.weapons.map(w => w.id === weapon.id ? {...w, ammo} : w))
        }

        spendAp(character.id, action.ap);
    }, [changeWeapon, ship]);

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

            <Grid item container spacing={2}>
                <Grid item xs={6}><Btn fullWidth onClick={addShip}>Add Ship</Btn></Grid>
                <Grid item xs={6}><RmBtn fullWidth label={`Ship "${ship.name}"`} onRemove={removeShip} /></Grid>
            </Grid>

            <Malfunctions
                id={"ship-malfunctions-"+ship.id}
                ship={ship}
                changeHull={changeHull}
                changeMalfunctions={changeMalfunctions} />

            <Grid item>
                <Initiative onRound={rechargeShield}>
                    <Grid item container spacing={2}>
                        <Grid item xs={6}>
                            <Btn fullWidth onClick={joinCombat}>Join Combat</Btn>
                        </Grid>

                        <Grid item xs={6}>
                            <Btn fullWidth onClick={leaveCombat} color="error">Leave Combat</Btn>
                        </Grid>
                    </Grid>
                </Initiative>
            </Grid>

        </Grid><Grid item xs={9}>
            <ShipDetails ship={ship} onChange={changeShip} onAction={performAction} />
            <Systems systems={ship.systems} onChange={changeSystem} capacity={definition.capacity}/>
            <Weapons weapons={ship.weapons} onChange={changeWeapon} onAction={performAction} />

            <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon/>}>Inventory</AccordionSummary>
                <AccordionDetails><Grid container direction="column" spacing={2}>
                    <Inventory id="ship-inventory" inventory={ship.cargo} onChange={changeCargo} />
                </Grid></AccordionDetails>
            </Accordion>
        </Grid>
    </Grid>;
}