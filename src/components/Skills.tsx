import {
    Chip,
    Grid,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from "@mui/material";
import skillDefinition from "../data/skills.json";
import Value from "./Value";
import {Btn} from "./Form";
import AttributeType from "../types/attributes";
import {DicePool} from "./Roll";
import calculatePool, {attributeAverage} from "../logic/calculatePool";
import React from "react";

interface SkillsProps {
    onChange: (name: string, value: number) => void;
    onRoll: (skill: number, attribute: number, modifier?: number, metadata?: Record<string, any>) => void;
    attributes: AttributeType;
    skills: { [key: string]: number };
    locked?: boolean;
}

export default React.memo(function Skills({skills, attributes, onChange, onRoll, locked=false}: SkillsProps) {
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
                                const avg = attributeAverage(s.name, attributes);
                                const pool = calculatePool(avg, skills[s.name] || 0);

                                return (<TableRow key={s.name}>
                                    <TableCell>
                                        <Value disabled={locked} name={s.name} label={s.name}
                                               value={skills[s.name] || 0} onChange={onChange}/>
                                    </TableCell>
                                    <TableCell> <Stack direction="row" spacing={1}>
                                        {s.attributes.map(a => (
                                            <Chip key={a} label={`${a}: ${attributes[a as keyof typeof attributes]}`}/>))}
                                    </Stack></TableCell>
                                    <TableCell><Btn onClick={() => onRoll(skills[s.name] || 0, avg, 0, {skill: s.name})} fullWidth>
                                        <DicePool {...pool} />
                                    </Btn></TableCell>
                                </TableRow>);
                            })}
                        </TableBody>
                    </Table>
                </TableContainer></Grid>
        ))}
    </Grid>);
});


