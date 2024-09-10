import {Grid, Paper, Table, TableBody, TableCell, TableHead, TableRow} from "@mui/material";
import NpcType, {NpcActionType} from "../types/npc";
import {Btn, TextInput} from "./Form";
import Value from "./Value";
import socket from "../socket";
import npcToCombatant from "../logic/npcToCombatant";
import React from "react";
import Collection from "./Collection";
import * as uuid from 'uuid';
import {DicePool} from "./Roll";
import calculatePool from "../logic/calculatePool";


interface NpcActionProps extends NpcActionType {
    npc: string;
    onRemove: () => void;
    onChange: (name: string, value: any) => void;
    onRoll: (skill: number, attribute: number, modifier?: number, metadata?: Record<string, any>) => void;
}

function NpcAction({onChange, onRemove, onRoll, npc, ...props}: NpcActionProps) {
    const a = props.aptitude||0;
    const e = props.expertise||0;
    const pool = calculatePool(a, e);

    return <TableRow>
        <TableCell><TextInput label="Name" name="name" values={props} onChange={onChange} /></TableCell>
        <TableCell><Value width={75} name={"aptitude"} value={a} onChange={onChange} /></TableCell>
        <TableCell><Value width={75} name={"expertise"} value={e} onChange={onChange} /></TableCell>
        <TableCell><Value width={75} name={"ap"} value={props.ap||0} onChange={onChange} /></TableCell>
        <TableCell><Btn onClick={() => onRoll(a, e, 0, {skill: props.name, npc})} fullWidth>
            <DicePool {...pool} />
        </Btn></TableCell>
    </TableRow>;
}


interface NpcProps extends NpcType {
    onRemove: () => void;
    onChange: (name: string, value: any) => void;
    onRoll: (skill: number, attribute: number, modifier?: number, metadata?: Record<string, any>) => void;
}

export default function Npc({onChange, onRemove, onRoll, ...props} : NpcProps) {
    const joinCombat = () => socket.emit("combatant", npcToCombatant(props));
    const addAction = () => onChange('actions', [...props.actions, {
        id: uuid.v4(),
        name: "",
        aptitude: 1,
        expertise: 0,
        ap: 0,
    }]);

    return <Grid item>
        <Paper className="npc">
            <Grid container direction="column" spacing={2}>
                <Grid item container spacing={2} alignItems="center">
                    <Grid xs={9} item><TextInput label="Name" name="name" values={props} onChange={onChange} /></Grid>
                    <Grid xs={3} item><Btn onClick={() => (window.confirm("Remove NPC?") && onRemove())} fullWidth color="error">Remove</Btn></Grid>
                </Grid>

                <Grid item container spacing={2}>
                    <Grid item><Value width={150} label="Current Health" name={"currentHealth"} value={props.currentHealth||0} onChange={onChange} /></Grid>
                    <Grid item><Value width={150} label="Action Points" name={"maxAp"} value={props.maxAp||0} onChange={onChange} /></Grid>
                </Grid>

                <Grid item>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell width="25%">Action</TableCell>
                                    <TableCell>Aptitude</TableCell>
                                    <TableCell>Expertise</TableCell>
                                    <TableCell>Action Points</TableCell>
                                    <TableCell>Roll</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <Collection
                                    npc={props.name}
                                    onRoll={onRoll}
                                    values={props.actions||[]}
                                    onChange={v => onChange('actions', v)}
                                    component={NpcAction} />
                            </TableBody>
                        </Table>
                </Grid>

                <Grid item container spacing={2}>
                    <Grid item><Btn onClick={addAction}>Add Action</Btn></Grid>
                    <Grid item><Btn onClick={joinCombat}>Join Combat</Btn></Grid>
                    <Grid item><Btn>Take Damage</Btn></Grid>
                </Grid>
            </Grid>
        </Paper>
    </Grid>;
}