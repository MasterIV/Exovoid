import React, {useCallback, useState} from 'react';
import {Alert, Box, Checkbox, Container, FormControlLabel, Grid, Modal, Paper, Stack, Tab, Tabs} from "@mui/material";
import CharacterPage from "./pages/Character";
import LorePage from "./pages/Lore";
import CombatPage from "./pages/Combat";
import InventoryPage from "./pages/Inventory";
import CyberWarePage from "./pages/Cyberware";
import TalentPage from "./pages/Talents";
import {RollResult} from "./components/RollResults";
import socket from "./socket";
import {DicePool} from "./components/Roll";
import calculatePool from "./logic/calculatePool";
import {Btn, TextInput} from "./components/Form";
import NpcPage from "./pages/Npc";
import {DicePoolType} from "./types/dice";
import NotesPage from "./pages/Notes";
import useCharacter from "./state/character";
import {setLock, useLock} from "./state/lock";
import useCombat from "./state/combat";
import ShipPage from "./pages/Ship";
import ContentPage from "./pages/Content";
import useTable from "./state/table";

interface GameProps {
    error?: string;
}

interface RollConfig {
    show: boolean;
    attribute: number;
    skill: number;
    modifier: number;
    metadata?: Record<string, any>;
    support: boolean;
}

function emptyPool(pool: DicePoolType) {
    return (pool.default ?? 0) < 1 &&
        (pool.aptitude ?? 0) < 1 &&
        (pool.expertise ?? 0) < 1 &&
        (pool.injury ?? 0) < 1;
}

function Game({error}: GameProps) {
    const locked = useLock();
    const setLocked = setLock;

    const [roll, setRoll] = useState<RollConfig>({
        show: false, attribute: 0, skill: 0, modifier: 0, metadata: {}, support: false
    });

    const [tab, setTab] = React.useState(0);
    const changeTab = useCallback((event: React.SyntheticEvent, newValue: number) => {
        setTab(newValue);
    }, []);

    const spendAp = useCombat(state => state.spendAp);

    const resetRoll = useCallback(() => setRoll({show: false, attribute: 0, skill: 0, modifier: 0, metadata: {}, support: false}), []);
    const changeRoll = useCallback((skill: number, attribute: number, modifier = 0, metadata?: Record<string, any>, support = false) => setRoll({
        show: true,
        skill,
        attribute,
        modifier,
        metadata,
        support
    }), []);

    const onChange = useCharacter(state => state.update);

    const onRoll = () => {
        const weapons = useCharacter.getState().weapons;
        const ship = useTable.getState().ships.find(s => s.id === roll.metadata?.ship);
        const onChangeShip = useTable.getState().updateShip;

        if(roll.support) socket.emit("roll", {aptitude: roll.attribute+roll.modifier}, roll.metadata);
        else socket.emit("roll", calculatePool(roll.attribute, roll.skill, roll.modifier), roll.metadata);

        if(roll.metadata?.id && roll.metadata?.ap)
            spendAp(roll.metadata.id, roll.metadata.ap);
        if(roll.metadata?.weapon && roll.metadata?.ammo)
            if(ship)
                onChangeShip(ship.id, "weapons", ship.weapons.map(w => {
                    const ammo =  {...w.ammo, loaded: w.ammo.loaded - roll.metadata?.ammo};
                    return roll.metadata?.weapon === w.id ? {...w, ammo} : w;
                }));
            else if(weapons.find(w => w.id === roll.metadata?.weapon))
                onChange('weapons', weapons.map(w => {
                    const ammo =  {...w.ammo, loaded: w.ammo.loaded - roll.metadata?.ammo};
                    return roll.metadata?.weapon === w.id ? {...w, ammo} : w;
                }));

        resetRoll();
    }

    const tabs = [
        {name: "Character", content: () => <CharacterPage locked={locked} onRoll={changeRoll}/>},
        {name: "Combat", content: () => <CombatPage onRoll={changeRoll}/>},
        {name: "Talents", content: () => <TalentPage />},
        {name: "Cyberware", content: () => <CyberWarePage />},
        {name: "Inventory", content: () => <InventoryPage />},
        {name: "Npc", content: () => <NpcPage locked={locked} onRoll={changeRoll} />},
        {name: "Ships", content: () => <ShipPage onRoll={changeRoll} />},
        {name: "Notes", content: () => <NotesPage />},
        {name: "Content", content: () => <ContentPage />},
        {name: "Lore", content: () => <LorePage/>},
    ];

    const pool = roll.support
        ? {aptitude: roll.attribute+roll.modifier}
        : calculatePool(roll.attribute, roll.skill, roll.modifier);

    return (<Container maxWidth="xl">
        {(error) && <Alert severity="error">{error}</Alert>}

        <RollResult/>

        <Modal open={roll.show} onClose={resetRoll}>
            <Paper className="paperSmall">
                <Stack spacing={3} textAlign="center">
                    <TextInput label="Modifier" type="number" name="modifier" values={roll}
                               onChange={(k, v) => setRoll({...roll, [k]: Number(v)})}/>
                    <DicePool {...pool} large/>
                    <Btn disabled={emptyPool(pool)} onClick={onRoll}>Roll!</Btn>
                </Stack>
            </Paper>
        </Modal>

        <Grid container direction="row">
            <Grid xs={true} item><Tabs value={tab} onChange={changeTab}>
                {tabs.map(tab => (<Tab key={tab.name} label={tab.name}/>))}
            </Tabs></Grid>

            <Grid xs="auto" display="flex" alignItems="center" justifyContent="end" item>
                <FormControlLabel control={<Checkbox  checked={locked} onChange={e => setLocked(e.target.checked)} />} label="Lock" />
                <Btn size="small" variant="outlined" color="secondary" disabled>Logout</Btn>
            </Grid>
        </Grid>

        <Box marginTop={2}>{tabs[tab].content()}</Box>
    </Container>);
}

export default Game;
