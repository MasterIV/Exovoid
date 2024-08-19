import React from "react";
import {Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography} from "@mui/material";

interface CareerProps {
    name: string;
    description: string;
    equipment: string[];
    attributes: string[];
    skills: Record<string, number>;
    talents: Record<string, string[]>;
}

export function Career({name, description, equipment, skills, attributes, talents}: CareerProps) {

    function listTalents(tier: string) {
        switch(tier) {
            case "4": return <Paper className="talent">Special Training: {attributes[0]}</Paper>;
            case "7": return <Paper className="talent">Special Training: {attributes[1]}</Paper>;
            default: return talents[tier].map(t => <Paper className="talent">{t}</Paper>);
        }
    }


    return <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
                <TableRow>
                    <TableCell colSpan={8}>{name}</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                <TableRow>
                    <TableCell colSpan={4}>
                        <Typography variant="subtitle1">Description:</Typography>
                        <Typography>{description}</Typography>
                    </TableCell>
                    <TableCell colSpan={2}>
                        <Typography variant="subtitle1">Starting Skills:</Typography>
                        <ul>{Object.entries(skills).map(s => <li>{s[0]}: {s[1]}</li>)}</ul>
                    </TableCell>
                    <TableCell colSpan={2}>
                        <Typography variant="subtitle1">Starting Equip:</Typography>
                        <ul>{equipment.map(e => <li>{e}</li>)}</ul>
                    </TableCell>
                </TableRow>


                <TableRow>
                    {Array(8).fill(0).map((z,i) => <TableCell width="12.5%">
                        {listTalents(i.toString())}
                    </TableCell>)}
                </TableRow>
            </TableBody>
        </Table>
    </TableContainer>;
}