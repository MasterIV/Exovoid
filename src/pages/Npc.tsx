import React from "react";
import {Grid} from "@mui/material";
import Initiative from "../components/Initiative";
import Collection from "../components/Collection";
import NpcType from "../types/npc";
import Npc from "../components/Npc";
import {Btn} from "../components/Form";
import * as uuid from 'uuid';

const defaults: NpcType = {
    id: "",
    name: "",
    currentHealth: 0,
    currentAp: 0,
    maxAp: 0,
    actions: [],
    injuries: [],
};

interface NpcPageProps {
    npcs: NpcType[];
    onChange: (npcs: object[]) => void;
    onRoll: (skill: number, attribute: number, modifier?: number, metadata?: Record<string, any>) => void;
}

export default React.memo( function NpcPage({npcs, onChange, onRoll} : NpcPageProps) {
    const addNpc = () => onChange([...npcs, {...defaults, id: uuid.v4()}]);

    return (<Grid container spacing={2} margin={1}>
        <Grid item xs={3}>
            <Initiative />
        </Grid>
        <Grid item container spacing={2} direction="column" xs={9}>
            <Collection values={npcs} onChange={onChange} component={Npc} onRoll={onRoll} />
            <Grid item><Btn onClick={addNpc}>Add Npc</Btn></Grid>
        </Grid>
    </Grid>);
});