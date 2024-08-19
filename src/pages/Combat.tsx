import React from "react";
import {Grid} from "@mui/material";
import CharacterType from "../types/character";

interface CombatPageProps {
    onChange: (name: string, value: any) => void;
    onRoll: (skill: number, attribute: number, modifier?: number, metadata?: Record<string, any>) => void;
    stats: CharacterType
}

export default function CombatPage({} : CombatPageProps) {
    return (<Grid item container spacing={2} margin={1}>
        <Grid item xs={3}>
            Initiative
        </Grid>
        <Grid item xs={6}>
            Waffen, Rüstung
        </Grid>
        <Grid item xs={3}>
            Wunden
        </Grid>
    </Grid>);
}