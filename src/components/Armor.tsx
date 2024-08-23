import React from "react";
import {
    Autocomplete,
    Grid,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
    Typography
} from "@mui/material";
import {Btn} from "./Form";
import armors from '../data/armors.json';


const armorMap: Record<string, any> = {};
armors.forEach(a => armorMap[a.armorType] = a);

interface ArmorProps  {
    type: string;
    mods: string[];

    onRemove: () => void;
    onChange: (name: string, value: any) => void;
    locked?: boolean;
}

export function Armor({type, mods, locked, onChange, onRemove}: ArmorProps) {
    const details = armorMap[type];

    return <Grid item>
        <Paper sx={{p: 2}}>
            <Grid container direction="column" spacing={2}>
                <Grid item container spacing={2}>
                    <Grid item xs={8}>
                        <Typography variant="h6">{type} ({details.type})</Typography>
                    </Grid><Grid item xs={4} textAlign="right">
                        <Btn color={"error"} disabled={locked} onClick={() => (window.confirm("Remove Weapon?") && onRemove())}>Remove</Btn>
                    </Grid>
                </Grid>


                <Grid item><Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Durability</TableCell>
                            <TableCell>Soak</TableCell>
                            <TableCell>Mod Limit</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell>{details.durability}</TableCell>
                            <TableCell>{details.primarySoak} / {details.secondarySoak}</TableCell>
                            <TableCell>{details.modLimit}</TableCell>
                        </TableRow>
                        {details.qualities &&<TableRow><TableCell colSpan={7}><strong>Qualities:</strong> {details.qualities}</TableCell></TableRow>}
                        {details.specialRules && <TableRow><TableCell colSpan={7}><strong>Special Rules:</strong> {details.specialRules}</TableCell></TableRow>}
                    </TableBody>
                </Table></Grid>
                
                <Grid item>
                    <Autocomplete multiple
                                  value={mods}
                                  onChange={(e, v) =>  onChange('mods', v)}
                                  renderInput={(params) => <TextField {...params}  label="Mods" />}
                                  options={details.moddingOptions} />
                </Grid>
            </Grid>
        </Paper>
    </Grid>;
}