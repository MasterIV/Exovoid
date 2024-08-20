import React from "react";
import {Grid, Paper, Table, TableBody, TableCell, TableRow, Typography} from "@mui/material";
import talents from '../data/talents.json';


const talentMap: Record<string, string> = {};
talents.forEach(t => talentMap[t.talent] = t.description);

interface CareerProps {
    name: string;
    description: string;
    equipment: string[];
    attributes: string[];
    skills: Record<string, any>;
    talents: Record<string, string[]>;
}

export function Career({name, description, equipment, skills, attributes, talents}: CareerProps) {

    function listTalents(tier: string) {
        switch (tier) {
            case "4":
                return <Paper className="talent">
                    <Typography fontWeight={"bold"}>Special Training: {attributes[0]}</Typography>
                    <Typography variant={"caption"}>Gain +1 {attributes[0]}</Typography>
                </Paper>;
            case "7":
                return <Paper className="talent">
                    <Typography fontWeight={"bold"}>Special Training: {attributes[1]}</Typography>
                    <Typography variant={"caption"}>Gain +1 {attributes[1]}</Typography>
                </Paper>;
            default:
                return talents[tier].map(t => <Paper className="talent">
                    <Typography fontWeight={"bold"}>{t}</Typography>
                    <Typography variant={"caption"}>{talentMap[t]}</Typography>
                </Paper>);
        }
    }


    return <Paper className="career"><Grid container spacing={2} direction={"column"}>
        <Grid item>
            <Typography variant={"h5"}>{name}</Typography>
        </Grid><Grid container item direction={"row"} spacing={2}>
        <Grid xs={5} item>
            <Typography variant="h6">Description:</Typography>
            <Typography>{description}</Typography>
        </Grid><Grid xs={4} item>
            <Typography variant="h6">Starting Equip:</Typography>
            <ul>{equipment.map(e => <li>{e}</li>)}</ul>
        </Grid><Grid xs={3} item>
            <Typography variant="h6">Starting Skills:</Typography>
            <ul>{Object.entries(skills).map(s => <li>{s[0]}: {s[1]}</li>)}</ul>
        </Grid>
    </Grid><Grid item>

        <Table>
            <TableBody>
                <TableRow>
                    {Array(4).fill(0).map((z, i) => <TableCell width={"25%"}>
                        Tier {i}
                    </TableCell>)}
                </TableRow><TableRow>
                    {Array(4).fill(0).map((z, i) => <TableCell className="talents">
                        {listTalents(i.toString())}
                    </TableCell>)}
                </TableRow><TableRow>
                    {Array(4).fill(0).map((z, i) => <TableCell width={"25%"}>
                        Tier {i + 4}
                    </TableCell>)}
                </TableRow> <TableRow>
                    {Array(4).fill(0).map((z, i) => <TableCell className="talents">
                        {listTalents((i + 4).toString())}
                    </TableCell>)}
                </TableRow>
            </TableBody>
        </Table>

    </Grid>
    </Grid></Paper>;
}