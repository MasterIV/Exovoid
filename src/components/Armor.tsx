import React from "react";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Autocomplete,
    Table,
    TableBody,
    TableCell,
    TableRow,
    TextField,
    Typography
} from "@mui/material";
import {Btn} from "./Form";
import armors from '../data/armors.json';
import {CharacterWeapon} from "../types/character";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const armorMap: Record<string, any> = {};
armors.forEach(a => armorMap[a.type] = a);

interface ArmorProps extends CharacterWeapon {
    onRemove: () => void;
    onChange: (name: string, value: any) => void;
    locked?: boolean;
}

export function Armor({type, mods, locked, expanded, onChange, onRemove}: ArmorProps) {
    const details = armorMap[type];

    const removeArmor = (e: any) => {
        e.stopPropagation();
        if (window.confirm("Remove Armor?"))
            onRemove();
    }

    return <Accordion expanded={Boolean(expanded)} onChange={(x, e) => onChange('expanded', e)}>
        <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
            <Typography variant="h6" marginRight={2}>{details.name} ({details.type})</Typography>
            <Btn size="small" color={"error"} disabled={locked} onClick={removeArmor}>Remove</Btn>
        </AccordionSummary>

        <AccordionDetails>
            <Autocomplete multiple disableClearable
                          value={mods}
                          onChange={(e, v) => onChange('mods', v)}
                          renderInput={(params) => <TextField {...params} label="Mods"/>}
                          options={details.moddingOptions}/>

            <Table style={{}}>
                <TableBody>
                    <TableRow>
                        <TableCell>Durability: {details.durability}</TableCell>
                        <TableCell>Soak: {details.primarySoak} / {details.secondarySoak}</TableCell>
                        <TableCell>Mod Limit: {details.modLimit}</TableCell>
                    </TableRow>
                    {details.qualities &&
                        <TableRow><TableCell colSpan={7}><strong>Qualities:</strong> {details.qualities}
                        </TableCell></TableRow>}
                    {details.specialRules &&
                        <TableRow><TableCell colSpan={7}><strong>Special Rules:</strong> {details.specialRules}
                        </TableCell></TableRow>}
                </TableBody>
            </Table>
        </AccordionDetails>
    </Accordion>;
}