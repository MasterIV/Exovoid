import React from "react";
import {Grid, Paper} from "@mui/material";
import {TextInput} from "./Form";

interface CombatantProps {
    id: string;
    name: string;
    hp: number;
    ap: number;
    onChange: (k: string, v: any) => void;
}

export function Combatant({name, onChange, ...props}: CombatantProps) {
    return <Paper>
        <Grid container>
            <Grid xs={6} item>{name}</Grid>
            <Grid xs={3} item><TextInput label="Health" name="hp" values={props} onChange={onChange} /></Grid>
            <Grid xs={3} item><TextInput label="Action Points" name="ap" values={props} onChange={onChange} /></Grid>
        </Grid>
    </Paper>
}