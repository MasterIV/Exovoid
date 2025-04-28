import React from "react";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Autocomplete,
    Chip,
    Grid,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableRow,
    TextField,
    Typography
} from "@mui/material";
import {Dropdown, RmBtn} from "../Form";
import armors from '../../data/armors.json';
import {CharacterArmor} from "../../types/character";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Value from "../Value";
import {CollectionItemPros} from "../Collection";
import manufacturers from '../../data/manufacturer.json';
import applyArmorMods from "../../logic/applyArmorMods";

const armorMap: Record<string, any> = {};
armors.forEach(a => armorMap[a.type] = a);

const leveledQualities = ["Speed", "Defensive", "Battery"]

interface ArmorProps extends CharacterArmor, CollectionItemPros {
}

function createChips(data: Record<string, number | undefined>) {
    return <Stack direction="row" spacing={1} marginX={1} display={"inline-block"}>
        {Object.entries(data)
            .filter(q => !leveledQualities.includes(q[0]) || q[1] !== 0)
            .map(q => {
                const label = Number(q[1]) !== 0 ? `${q[0]}: ${q[1]}` : q[0];
                return <Chip key={q[0]} size="small" label={label}/>;
            })}
    </Stack>
}

export function Armor({expanded, onChange, onRemove, index, ...armor}: ArmorProps) {
    const details = applyArmorMods(armor);

    const availableManufacturers = manufacturers
        .filter(m => m.compatible.includes(details.type))
        .map(m => ({id: m.name, name: m.name}));

    return <Accordion expanded={Boolean(expanded)} onChange={(x, e) => onChange('expanded', e)}>
        <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
            <Typography variant="h6" marginRight={2}>{details.name} ({details.type})</Typography>
            <RmBtn size="small" label="Armor" onRemove={onRemove}/>
        </AccordionSummary>

        <AccordionDetails>
            <Grid container direction="column" spacing={2}>
                {availableManufacturers.length > 0 &&
                    <Grid item><Dropdown
                        size="small"
                        id={"manufacturer"}
                        label={"Manufacturer"}
                        name={"manufacturer"}
                        values={armor}
                        onChange={onChange}
                        defaultValue={"No-Name"}
                        options={availableManufacturers}/></Grid>}

                <Grid item>
                    <Autocomplete multiple disableClearable
                                  value={armor.mods}
                                  onChange={(e, v) => onChange('mods', v)}
                                  renderInput={(params) => <TextField {...params} label="Mods"/>}
                                  options={details.moddingOptions}/>
                </Grid>

                <Grid item>
                    <Table>
                        <TableBody>
                            <TableRow>
                                <TableCell><Value label="Durability" mask={`/ ${details.durability}`} name="durability" value={armor.durability} onChange={onChange} /></TableCell>
                                <TableCell>Soak: {details.primarySoak} / {details.secondarySoak}</TableCell>
                                <TableCell>Mod Limit: {details.modLimit}</TableCell>
                            </TableRow>

                            {Object.keys(details.qualities).length > 0 && <TableRow>
                                <TableCell colSpan={7}>
                                    <strong>Qualities:</strong>
                                    {createChips(details.qualities)}
                                </TableCell>
                            </TableRow>}

                            {details.specialRules && <TableRow>
                                <TableCell colSpan={7}>
                                    <strong>Special Rules:</strong> {details.specialRules}
                                </TableCell>
                            </TableRow>}
                        </TableBody>
                    </Table>
                </Grid>
            </Grid>
        </AccordionDetails>
    </Accordion>;
}