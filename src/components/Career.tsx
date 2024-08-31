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
    acquiredTalents: string[];
    onChange: (talents: string[]) => void;
}

export default React.memo(function Career({name, description, equipment, skills, attributes, talents, acquiredTalents, onChange}: CareerProps) {
    const toggleTalent = (t: string) => {
        if(acquiredTalents.includes(t))
            onChange(acquiredTalents.filter(v => v!==t));
        else
            onChange([...acquiredTalents, t]);
    }

    const listTalents = (tier: string, available: boolean) => {
        let talent: string;
        switch (tier) {
            case "4":
                talent = name+":attribute1"
                return <Paper className={acquiredTalents.includes(talent) ? "talent active" : "talent"} onClick={() => available && toggleTalent(talent)}>
                    <Typography fontWeight={"bold"}>Special Training: {attributes[0]}</Typography>
                    <Typography variant={"caption"}>Gain +1 {attributes[0]}</Typography>
                </Paper>;
            case "7":
                talent = name+":attribute2"
                return <Paper className={acquiredTalents.includes(talent) ? "talent active" : "talent"} onClick={() => available && toggleTalent(talent)}>
                    <Typography fontWeight={"bold"}>Special Training: {attributes[1]}</Typography>
                    <Typography variant={"caption"}>Gain +1 {attributes[1]}</Typography>
                </Paper>;
            default:
                return talents[tier].map(t => <Paper key={t} className={acquiredTalents.includes(t) ? "talent active" : "talent"} onClick={() => available && toggleTalent(t)}>
                    <Typography fontWeight={"bold"}>{t}</Typography>
                    <Typography variant={"caption"}>{talentMap[t]}</Typography>
                </Paper>);
        }
    }

    const classTalents = [...Object.values(talents).flat(), name+":attribute1", name+":attribute2"]
        .filter(t => acquiredTalents.includes(t))
        .length;

    return <Paper className="career"><Grid container spacing={2} direction={"column"}>
        <Grid item>
            <Typography variant={"h5"}>{name}</Typography>
        </Grid><Grid container item direction={"row"} spacing={2}>
        <Grid xs={5} item>
            <Typography variant="h6">Description:</Typography>
            <Typography>{description}</Typography>
        </Grid><Grid xs={4} item>
            <Typography variant="h6">Starting Equip:</Typography>
            <ul>{equipment.map(e => <li key={e}>{e}</li>)}</ul>
        </Grid><Grid xs={3} item>
            <Typography variant="h6">Starting Skills:</Typography>
            <ul>{Object.entries(skills).map(s => <li key={s[0]}>{s[0]}: {s[1]}</li>)}</ul>
        </Grid>
    </Grid><Grid item>

        <Table>
            <TableBody>
                <TableRow>
                    {Array(4).fill(0).map((z, i) => <TableCell key={i} width={"25%"}>
                        Tier {i}
                    </TableCell>)}
                </TableRow><TableRow>
                    {Array(4).fill(0).map((z, i) => {
                        const available = i <= classTalents;
                        return <TableCell key={i} className={available ? "talents available" : "talents"}>
                            {listTalents(i.toString(), available)}
                        </TableCell>
                    })}
                </TableRow><TableRow>
                    {Array(4).fill(0).map((z, i) => <TableCell key={i} width={"25%"}>
                        Tier {i + 4}
                    </TableCell>)}
                </TableRow><TableRow>
                    {Array(4).fill(0).map((z, i) => {
                        const available = i+4 <= classTalents;
                        return <TableCell key={i}  className={available ? "talents available" : "talents"}>
                            {listTalents((i + 4).toString(), available)}
                        </TableCell>
                    })}
                </TableRow>
            </TableBody>
        </Table>

    </Grid>
    </Grid></Paper>;
});