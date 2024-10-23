import React, {useCallback, useContext, useState} from 'react';
import {Alert, Box, Checkbox, Container, FormControlLabel, Grid, Modal, Paper, Stack, Tab, Tabs} from "@mui/material";
import CharacterPage from "./pages/Character";
import LorePage from "./pages/Lore";
import CombatPage from "./pages/Combat";
import InventoryPage from "./pages/Inventory";
import CyberWarePage from "./pages/Cyberware";
import TalentPage from "./pages/Talents";
import CharacterType from "./types/character";
import {RollResult} from "./components/RollResults";
import socket from "./socket";
import {DicePool} from "./components/Roll";
import calculatePool from "./logic/calculatePool";
import {Btn, TextInput} from "./components/Form";
import NpcPage from "./pages/Npc";
import {InitiativeContext} from "./provider/InitiativeProvider";
import {DicePoolType} from "./types/dice";

interface GameProps {
    character: CharacterType;
    onChange: (name: string, value: any) => void;
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

function Game({character, error, onChange}: GameProps) {
    const [locked, setLocked] = useState(false);
    const [roll, setRoll] = useState<RollConfig>({
        show: false, attribute: 0, skill: 0, modifier: 0, metadata: {}, support: false
    });

    const [tab, setTab] = React.useState(0);
    const changeTab = useCallback((event: React.SyntheticEvent, newValue: number) => {
        setTab(newValue);
    }, []);

    const {spendAp} = useContext(InitiativeContext);

    const resetRoll = useCallback(() => setRoll({show: false, attribute: 0, skill: 0, modifier: 0, metadata: {}, support: false}), []);
    const changeRoll = useCallback((skill: number, attribute: number, modifier = 0, metadata?: Record<string, any>, support = false) => setRoll({
        show: true,
        skill,
        attribute,
        modifier,
        metadata,
        support
    }), []);

    const onRoll = () => {
        if(roll.support) socket.emit("roll", {aptitude: roll.attribute+roll.modifier}, roll.metadata);
        else socket.emit("roll", calculatePool(roll.attribute, roll.skill, roll.modifier), roll.metadata);

        if(roll.metadata?.id && roll.metadata?.ap)
            spendAp(roll.metadata.id, roll.metadata.ap);
        if(roll.metadata?.weapon && roll.metadata?.ammo)
            onChange('weapons', character.weapons.map(w => {
                const ammo =  {...w.ammo, loaded: w.ammo.loaded - roll.metadata?.ammo};
                return roll.metadata?.weapon === w.id ? {...w, ammo} : w;
            }));

        resetRoll();
    }

    const changeNpc = React.useCallback((npcs: object[]) => onChange('npcs', npcs), [onChange]);

    const tabs = [
        {name: "Character", content: () => <CharacterPage locked={locked} stats={character} onChange={onChange} onRoll={changeRoll}/>},
        {name: "Combat", content: () => <CombatPage locked={locked} stats={character} onChange={onChange} onRoll={changeRoll}/>},
        {name: "Talents", content: () => <TalentPage locked={locked} stats={character} onChange={onChange}/>},
        {name: "Cyberware", content: () => <CyberWarePage locked={locked} stats={character} onChange={onChange}/>},
        {name: "Inventory", content: () => <InventoryPage locked={locked} inventory={character.inventory} currency={character.currency} onChange={onChange}/>},
        {name: "Npc", content: () => <NpcPage locked={locked}  npcs={character.npcs || []} onChange={changeNpc} onRoll={changeRoll} />},
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
            <Grid xs={8} item><Tabs value={tab} onChange={changeTab}>
                {tabs.map(tab => (<Tab key={tab.name} label={tab.name}/>))}
            </Tabs></Grid>

            <Grid xs={4} textAlign="right" item>
                <FormControlLabel control={<Checkbox  checked={locked} onChange={e => setLocked(e.target.checked)} />} label="Lock" />
                <Btn>Logout</Btn>
            </Grid>
        </Grid>

        <Box>{tabs[tab].content()}</Box>
    </Container>);
}

export default Game;
