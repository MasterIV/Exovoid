import React from "react";
import {Combatant} from "../../types/combat";
import {Grid, Paper} from "@mui/material";
import {Btn} from "../Form";
import Value from "../Value";
import useCombat from "../../state/combat";

interface FighterProps extends Combatant {
    onChange: (updated: Combatant) => void;
}

const Fighter = React.memo(({onChange, ...props}: FighterProps) => {
    const {name, currentHealth, currentAp} = props;

    return <Grid item><Paper className="combatant">
        <Grid container spacing={2} direction="column">
            <Grid item container spacing={2} direction="row">
                <Grid xs={9} item>{name}</Grid>
                <Grid xs={3} item textAlign="right">{currentHealth} HP</Grid>
            </Grid>

            <Grid item>
                <Value name="currentAp"
                       value={currentAp}
                       label="Action Points"
                       width={200}
                       onChange={(k, v) => onChange({...props, [k]: v}) } />
            </Grid>
        </Grid>
    </Paper></Grid>;
});

interface InitiativeProps {
    children?: React.ReactNode;
}

export default function Initiative({ children}: InitiativeProps) {
    const {combatants, update, reset, round} = useCombat();

    const ini = Object.values(combatants);
    ini.sort((a, b) => b.currentAp - a.currentAp);

    return <Grid container direction={"column"} spacing={2}>
        {ini.map(c => <Fighter {...c} onChange={update} key={c.id}/>)}

        <Grid item container spacing={2}>
            <Grid item xs={4}><Btn fullWidth color="error" onClick={reset}>Reset</Btn></Grid>
            <Grid item xs={8}><Btn fullWidth onClick={round}>New Round</Btn></Grid>
        </Grid>

        {children}
    </Grid>;
}
