import React from "react";
import {Grid} from "@mui/material";
import Initiative from "../components/Initiative";
import Collection from "../components/Collection";
import NpcType from "../types/npc";
import Npc from "../components/Npc";

interface NpcPageProps {
    npcs: NpcType[];
    onChange: (npcs: NpcType[]) => void;
}

export default function NpcPage({npcs, onChange} : NpcPageProps) {

    return (<Grid container spacing={2} margin={1}>
        <Grid item xs={3}>
            <Initiative corrections={{}} />
        </Grid>
        <Grid item container spacing={2} direction="column" xs={9}>
            <Collection values={npcs} onChange={onChange} component={Npc} />
        </Grid>
    </Grid>);
}