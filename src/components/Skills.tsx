import {
    Chip,
    Grid,
    Paper, Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from "@mui/material";
import skillDefinition from "../data/skills.json";
import Value from "./Value";
import {Btn} from "./Form";
import React from "react";
import AttributeType from "../types/attributes";
import {DiceCounter, DicePool} from "./Roll";
import calculatePool from "../logic/calculatePool";

interface SkillsProps {
    onChange: (name: string, value: number) => void;
    attributes: AttributeType,
    skills: { [key: string]: number },
}

export default function Skills({skills, attributes, onChange}: SkillsProps) {
    const half = Math.ceil(skillDefinition.length / 2);
    const definitions = [skillDefinition.slice(0, half), skillDefinition.slice(half)];


    return (<Grid item container spacing={2}>
        {definitions.map((d, i) => (
            <Grid item xs={6} key={i}>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Skill</TableCell>
                                <TableCell>Attribute</TableCell>
                                <TableCell>Roll</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {d.map(s => {
                                const sum = s.attributes
                                    .map(a => attributes[a as keyof typeof attributes] || 0)
                                    .reduce((a, b) => a + b, 0);
                                const avg = Math.ceil(sum / s.attributes.length);

                                return (<TableRow>
                                    <TableCell>
                                        <Value key={s.name} name={s.name} label={s.name}
                                               value={skills[s.name] || 0} onChange={onChange}/>
                                    </TableCell>
                                    <TableCell> <Stack direction="row" spacing={1}>
                                        {s.attributes.map(a => (
                                            <Chip label={`${a}: ${attributes[a as keyof typeof attributes]}`}/>))}
                                    </Stack></TableCell>
                                    <TableCell><Btn fullWidth>
                                        <DicePool {...calculatePool(avg, skills[s.name] || 0)} />
                                    </Btn></TableCell>
                                </TableRow>);
                            })}
                        </TableBody>
                    </Table>
                </TableContainer></Grid>
        ))}
    </Grid>);
}

