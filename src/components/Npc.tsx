import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Grid,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography
} from "@mui/material";
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
import Injuries from "./Injuries";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";


interface NpcActionProps extends NpcActionType {
    npc: NpcType;
    onRemove: () => void;
    onChange: (name: string, value: any) => void;
    onRoll: (skill: number, attribute: number, modifier?: number, metadata?: Record<string, any>) => void;
}

function NpcAction({onChange, onRemove, onRoll, id, npc, ...props}: NpcActionProps) {
    const a = props.aptitude||0;
    const e = props.expertise||0;
    const pool = calculatePool(a, e);
    const meta = {skill: props.name, name: npc.name, ap: props.ap, id: npc.id};

    return <TableRow>
        <TableCell><TextInput label="Name" name="name" values={props} onChange={onChange} /></TableCell>
        <TableCell><Value width={75} name={"aptitude"} value={a} onChange={onChange} /></TableCell>
        <TableCell><Value width={75} name={"expertise"} value={e} onChange={onChange} /></TableCell>
        <TableCell><Value width={75} name={"ap"} value={props.ap||0} onChange={onChange} /></TableCell>
        <TableCell><Btn onClick={() => onRoll(a, e, 0, meta)} fullWidth>
            <DicePool {...pool} />
        </Btn></TableCell>
    </TableRow>;
}


interface NpcProps extends NpcType {
    onRemove: () => void;
    onChange: (name: string, value: any) => void;
    onRoll: (skill: number, attribute: number, modifier?: number, metadata?: Record<string, any>) => void;
    locked?: boolean;
}

export default function Npc({onChange, onRemove, onRoll, locked, ...props} : NpcProps) {
    const joinCombat = () => socket.emit("combatant", npcToCombatant(props));
    const addAction = () => onChange('actions', [...props.actions, {
        id: uuid.v4(),
        name: "",
        aptitude: 1,
        expertise: 0,
        ap: 0,
    }]);

    const removeNpc = (e: any) => {
        e.stopPropagation();
        if(window.confirm("Remove Npc?"))
            onRemove();
    }

    return  <Accordion  expanded={Boolean(props.expanded)} onChange={(x, e) => onChange('expanded', e)}>
        <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
            <Typography variant="h6" marginRight={2}>{props.name}</Typography>
            <Btn size="small" color={"error"} disabled={locked} onClick={removeNpc}>Remove</Btn>
        </AccordionSummary>

        <AccordionDetails>
            <Grid container direction="column" spacing={2}>
                <Grid item container spacing={2} alignItems="center">
                    <Grid xs={6} item><TextInput label="Name" name="name" values={props} onChange={onChange} /></Grid>
                    <Grid xs={3} item textAlign={"center"}><Value width={140} label="Current Health" name={"currentHealth"} value={props.currentHealth||0} onChange={onChange} /></Grid>
                    <Grid xs={3} item textAlign={"center"}><Value width={140} label="Action Points" name={"maxAp"} value={props.maxAp||0} onChange={onChange} /></Grid>
                </Grid>

                <Grid item>
                    <TextInput name={"notes"} values={props} onChange={onChange} multiline />
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
                                    npc={props}
                                    onRoll={onRoll}
                                    values={props.actions||[]}
                                    onChange={v => onChange('actions', v)}
                                    component={NpcAction} />
                            </TableBody>
                        </Table>
                </Grid>

                <Grid item container spacing={2}>
                    <Injuries
                        npc
                        injuries={props.injuries || []}
                        health={props.currentHealth}
                        changeHealth={h => onChange('currentHealth', h)}
                        changeInjuries={h => onChange('injuries', h)}  />

                    <Grid item><Btn onClick={addAction}>Add Action</Btn></Grid>
                    <Grid item><Btn onClick={joinCombat}>Join Combat</Btn></Grid>
                </Grid>
            </Grid>
        </AccordionDetails>
    </Accordion>;
}
