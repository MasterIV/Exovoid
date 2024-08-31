import React, {useCallback, useEffect, useState} from "react";
import socket from "../socket";
import {Combatant} from "../types/combat";
import {Grid, Paper} from "@mui/material";
import {Btn} from "./Form";
import Value from "./Value";

const UPDATE_DELAY = 2000;
const timers: Record<string, number> = {};

function updateCombatants(updated: Combatant) {
    if (timers[updated.id]) window.clearTimeout(timers[updated.id]);
    timers[updated.id] = window.setTimeout(() => socket.emit("combatant", updated), UPDATE_DELAY);
}

function correctCombatant(c: Combatant, correction: InitiativeCorrection) {
    return {
        ...c,
        currentHealth: correction.currentHealth
    };
}

function updatedCombatants(combatants: Record<string, Combatant>, corrections: Record<string, InitiativeCorrection>): Combatant[] {
    return Object.values(combatants).map(c => corrections[c.id] ? correctCombatant(c, corrections[c.id]) : c);
}

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

interface InitiativeCorrection {
    currentHealth: number;
}

interface InitiativeProps {
    corrections: Record<string, InitiativeCorrection>;
    children?: React.ReactNode;
}

export default function Initiative({corrections, children}: InitiativeProps) {
    const [combatants, setCombatants] = useState<Record<string, Combatant>>({});

    useEffect(() => {
        socket.on('combatant', data => setCombatants(old => ({...old, [data.id]: data})));
        socket.on('reset', () => setCombatants({}));
    }, []);

    // Update combatant if external changes have happened
    useEffect(() => {
        Object.entries(corrections).forEach(([id, stats]) => {
            if (combatants[id] && (
                combatants[id].currentHealth !== stats.currentHealth
            )) {
                return updateCombatants(correctCombatant(combatants[id], stats));
            }
        })
    }, [combatants, corrections]);

    const changeAp = useCallback((c: Combatant) => {
            setCombatants(old => {
                updateCombatants(c);
                return {...old, [c.id]: c};
            })
    }, []);

    const resetCombatant = () => window.confirm("Reset Combat?") && socket.emit("reset");
    const newRound = () => {
        updatedCombatants(combatants, corrections).forEach(c => {
            c.currentAp += c.maxAp;
            socket.emit("combatant", c);
        });
    }

    const ini = updatedCombatants(combatants, corrections);
    ini.sort((a, b) => a.currentAp - b.currentAp);

    return <Grid container direction={"column"} spacing={2}>
        {ini.map(c => <Fighter {...c} onChange={changeAp} key={c.id}/>)}

        <Grid item container spacing={2}>
            <Grid item xs={6}><Btn fullWidth color="error" onClick={resetCombatant}>Reset</Btn></Grid>
            <Grid item xs={6}><Btn fullWidth onClick={newRound}>New Round</Btn></Grid>
        </Grid>

        {children}
    </Grid>;
}
