import React, {useCallback} from 'react';
import {Box, Container, Tab, Tabs} from "@mui/material";
import CharacterPage from "./pages/Character";
import LorePage from "./pages/Lore";
import CombatPage from "./pages/Combat";
import InventoryPage from "./pages/Inventory";
import TalentPage from "./pages/Talents";
import CharacterType from "./types/character";

interface GameProps {
    character: CharacterType;
    onChange: (name: string, value: any) => void;
}

function Game({character, onChange}: GameProps) {
    const [tab, setTab] = React.useState(0);
    const changeTab = useCallback((event: React.SyntheticEvent, newValue: number) => {
        setTab(newValue);
    }, []);

    const tabs = [
        {name: "Character", content: <CharacterPage stats={character} onChange={onChange}/>},
        {name: "Combat", content: <CombatPage />},
        {name: "Talents", content: <TalentPage />},
        {name: "Inventory", content: <InventoryPage />},
        {name: "Lore", content: <LorePage />},
    ];

    return (<Container maxWidth="xl">
        <Tabs value={tab} onChange={changeTab}>
            {tabs.map(tab => (<Tab key={tab.name} label={tab.name} />))}
        </Tabs>

        <Box>{tabs[tab].content}</Box>
    </Container>);
}

export default Game;
