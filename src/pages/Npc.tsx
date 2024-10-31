import React from "react";
import {Box, Grid} from "@mui/material";
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

    return (
        <Grid container direction="row" spacing={2}>
            <Grid item md={3} xs={12}>
                <Initiative/>
            </Grid>
            <Grid item md={9} xs={12}>
                <Collection locked={locked} values={npcs} onChange={onChange} component={Npc} onRoll={onRoll}/>
                <Box display="flex" justifyContent="end" marginTop={2}><Btn onClick={addNpc}>Add Npc</Btn></Box>
            </Grid>
        </Grid>
    );
});
