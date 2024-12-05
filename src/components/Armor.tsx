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
import {RmBtn} from "./Form";
import armors from '../data/armors.json';
import {CharacterArmor} from "../types/character";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Value from "./Value";
import {CollectionItemPros} from "./Collection";

const armorMap: Record<string, any> = {};
armors.forEach(a => armorMap[a.type] = a);

interface ArmorProps extends CharacterArmor, CollectionItemPros {}

export function Armor({expanded, onChange, onRemove, ...armor}: ArmorProps) {
    const details = armorMap[armor.type];

    return <Accordion expanded={Boolean(expanded)} onChange={(x, e) => onChange('expanded', e)}>
        <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
            <Typography variant="h6" marginRight={2}>{details.name} ({details.type})</Typography>
            <RmBtn size="small" label="Armor" onRemove={onRemove} />
        </AccordionSummary>

        <AccordionDetails>
            <Autocomplete multiple disableClearable
                          value={armor.mods}
                          onChange={(e, v) => onChange('mods', v)}
                          renderInput={(params) => <TextField {...params} label="Mods"/>}
                          options={details.moddingOptions}/>

            <Table style={{}}>
                <TableBody>
                    <TableRow>
                        <TableCell><Value label="Durability" mask={`/ ${details.durability}`} name="durability" value={armor.durability} onChange={onChange} /></TableCell>
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