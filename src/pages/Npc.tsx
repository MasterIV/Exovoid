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
    name: "Alrik",
    currentHealth: 0,
    currentAp: 0,
    maxAp: 0,
    minion: true,
    actions: [
        {id: "dodge", name: "Dodge", aptitude: 4, expertise: 0, ap: 2},
        {id: "attack", name: "Attack", aptitude: 4, expertise: 0, ap: 3},
    ],
    injuries: [],
};

interface NpcPageProps {
    npcs: NpcType[];
    onChange: (npcs: object[]) => void;
    onRoll: (skill: number, attribute: number, modifier?: number, metadata?: Record<string, any>) => void;
    locked?: boolean;
}

export default React.memo( function NpcPage({npcs, onChange, onRoll, locked} : NpcPageProps) {
    const addNpc = () => onChange([...npcs, {...defaults, id: uuid.v4()}]);

    return (<Grid container spacing={2} margin={1}>
        <Grid item xs={3}>
            <Initiative />
        </Grid>
        <Grid item xs={9}>
            <Collection locked={locked} values={npcs} onChange={onChange} component={Npc} onRoll={onRoll} />
            <p><Btn onClick={addNpc}>Add Npc</Btn></p>
        </Grid>
    </Grid>);
});