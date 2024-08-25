import React, {useCallback, useState} from 'react';
import {Box, Checkbox, Container, FormControlLabel, Grid, Modal, Paper, Stack, Tab, Tabs} from "@mui/material";
import CharacterPage from "./pages/Character";
import LorePage from "./pages/Lore";
import CombatPage from "./pages/Combat";
import InventoryPage from "./pages/Inventory";
import TalentPage from "./pages/Talents";
import CharacterType from "./types/character";
import {RollResult} from "./components/RollResults";
import socket from "./socket";
import {DicePool} from "./components/Roll";
import calculatePool from "./logic/calculatePool";
import {Btn, TextInput} from "./components/Form";

interface GameProps {
    character: CharacterType;
    onChange: (name: string, value: any) => void;
}

interface RollConfig {
    show: boolean;
    attribute: number;
    skill: number;
    modifier: number;
    metadata?: Record<string, any>;
}

function Game({character, onChange}: GameProps) {
    const [locked, setLocked] = useState(false);
    const [roll, setRoll] = useState<RollConfig>({
        show: false, attribute: 0, skill: 0, modifier: 0, metadata: {}
    });

    const [tab, setTab] = React.useState(0);
    const changeTab = useCallback((event: React.SyntheticEvent, newValue: number) => {
        setTab(newValue);
    }, []);

    const resetRoll = useCallback(() => setRoll({show: false, attribute: 0, skill: 0, modifier: 0, metadata: {}}), []);
    const changeRoll = useCallback((skill: number, attribute: number, modifier = 0, metadata?: Record<string, any>) => setRoll({
        show: true,
        skill,
        attribute,
        modifier,
        metadata
    }), []);

    const onRoll = () => {
        socket.emit("roll", calculatePool(roll.attribute, roll.skill, roll.modifier), roll.metadata);
        resetRoll();
    }

    const tabs = [
        {name: "Character", content: <CharacterPage locked={locked} stats={character} onChange={onChange} onRoll={changeRoll}/>},
        {name: "Combat", content: <CombatPage locked={locked} stats={character} onChange={onChange} onRoll={changeRoll}/>},
        {name: "Talents", content: <TalentPage stats={character} onChange={onChange}/>},
        {name: "Inventory", content: <InventoryPage locked={locked} stats={character} onChange={onChange}/>},
        {name: "Lore", content: <LorePage/>},
    ];

    return (<Container maxWidth="xl">
        <RollResult/>

        <Modal open={roll.show} onClose={resetRoll}>
            <Paper className="paperSmall">
                <Stack spacing={3} textAlign="center">
                    <TextInput label="Modifier" type="number" name="modifier" values={roll}
                               onChange={(k, v) => setRoll({...roll, [k]: Number(v)})}/>
                    <DicePool {...calculatePool(roll.attribute, roll.skill, roll.modifier)} large/>
                    <Btn onClick={onRoll}>Roll!</Btn>
                </Stack>
            </Paper>
        </Modal>

        <Grid container direction="row">
            <Grid xs={8} item><Tabs value={tab} onChange={changeTab}>
                {tabs.map(tab => (<Tab key={tab.name} label={tab.name}/>))}
            </Tabs></Grid>

            <Grid xs={4} textAlign="right" item>
                <FormControlLabel control={<Checkbox  checked={locked} onChange={e => setLocked(e.target.checked)} />} label="Lock" />
                <Btn>Logut</Btn>
            </Grid>
        </Grid>

        <Box>{tabs[tab].content}</Box>
    </Container>);
}

export default Game;
