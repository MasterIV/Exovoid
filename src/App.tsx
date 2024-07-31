import React, {useCallback} from 'react';
import {Box, Container, Tab, Tabs} from "@mui/material";
import CharacterPage from "./pages/Character";
import LorePage from "./pages/Lore";
import CombatPage from "./pages/Combat";
import InventoryPage from "./pages/Inventory";
import TalentPage from "./pages/Talents";

function App() {
    const [stats, setStats] = React.useState({
        exp: 0,
        currentHealth: 0,
        currentEdge: 0,
        attributes: {INT:3, STR:3, COO:3, CON:3, AGI:3, EDU:3, PER:3},
        skills: {}
    });

    const [tab, setTab] = React.useState(0);

    const onChange = useCallback((name: string, value: any) => {
        setStats({...stats, [name]: value});
    }, [stats]);

    const changeTab = useCallback((event: React.SyntheticEvent, newValue: number) => {
        setTab(newValue);
    }, []);

    const tabs = [
        {name: "Character", content: <CharacterPage stats={stats} onChange={onChange}/>},
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

export default App;
