import React from "react";
import {Grid, Stack} from "@mui/material";
import CharacterType from "../types/character";
import {Weapon} from "../components/Weapon";
import {Btn} from "../components/Form";

interface CombatPageProps {
    onChange: (name: string, value: any) => void;
    onRoll: (skill: number, attribute: number, modifier?: number, metadata?: Record<string, any>) => void;
    stats: CharacterType
}

export default function CombatPage({} : CombatPageProps) {
    return (<Grid container spacing={2} margin={1}>
        <Grid item xs={3}>
            Initiative
        </Grid>
        <Grid item xs={6}>
            <Stack spacing={2}>
                <Weapon />
                <Weapon />
                <Weapon />
                <Btn>Add Weapon</Btn>

            </Stack>
        </Grid>
        <Grid item xs={3}>
            Wunden
        </Grid>
    </Grid>);
}