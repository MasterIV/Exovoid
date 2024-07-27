import {Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import skillDefinition from "../data/skills.json";
import Value from "./Value";
import {Btn} from "./Form";
import React from "react";
import AttributeType from "../types/attributes";

interface SkillsProps {
    onChange: (name: string, value: number) => void;
    attributes: AttributeType,
    skills: {[key:string]: number},
}
export default function Skills({skills, attributes, onChange} : SkillsProps) {
    return (<Grid item>
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Skill</TableCell>
                        <TableCell>Attribute</TableCell>
                        <TableCell>Value</TableCell>
                        <TableCell>Roll</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {skillDefinition.map(s => (<TableRow>
                        <TableCell>{s.name}</TableCell>
                        <TableCell>{s.attributes.map(a => `${a}: ${attributes[a as keyof typeof attributes]}`).join(", ")}</TableCell>
                        <TableCell><Value key={s.name} name={s.name} label={s.name} value={skills[s.name] || 0} onChange={onChange} /></TableCell>
                        <TableCell><Btn>Roll</Btn></TableCell>
                    </TableRow>))}
                </TableBody>
            </Table>
        </TableContainer>
    </Grid>);
}

