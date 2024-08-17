import React, {useCallback, useState} from 'react';
import {Box, Container, Modal, Paper, Stack, Tab, Tabs} from "@mui/material";
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
        {name: "Character", content: <CharacterPage stats={character} onChange={onChange} onRoll={changeRoll}/>},
        {name: "Combat", content: <CombatPage/>},
        {name: "Talents", content: <TalentPage/>},
        {name: "Inventory", content: <InventoryPage/>},
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

        <Tabs value={tab} onChange={changeTab}>
            {tabs.map(tab => (<Tab key={tab.name} label={tab.name}/>))}
        </Tabs>

        <Box>{tabs[tab].content}</Box>
    </Container>);
}

export default Game;
