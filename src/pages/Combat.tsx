import React from "react";
import {Grid, Paper, TextField, Typography} from "@mui/material";
import {TextInput} from "../components/Form";

interface CombatPageProps {

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