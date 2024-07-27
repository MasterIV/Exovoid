import React, {useCallback} from 'react';
import {Box, Container, Grid, Tab, Tabs} from "@mui/material";
import CharacterPage from "./pages/Character";
import LorePage from "./pages/Lore";
import CombatPage from "./pages/Combat";
import InventoryPage from "./pages/Inventory";

function App() {
    const [stats, setStats] = React.useState({attributes: {}, skills: {}});
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
