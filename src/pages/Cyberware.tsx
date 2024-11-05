import React, {useCallback, useState} from "react";
import {
    Autocomplete,
    Checkbox,
    Chip,
    FormControlLabel,
    Grid,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField
} from "@mui/material";
import CharacterType, {CharacterCyberMalfunction, CharacterCyberWare} from "../types/character";
import Collection from "../components/Collection";

import cyberWares from '../data/cyberware.json';
import cyberMalfunctions from '../data/cyberware-malfunction.json';

import {Btn, TextInput} from "../components/Form";
import * as uuid from 'uuid';
import CyberWareType from "../types/cyberware";
import {calculateImmunity} from "../logic/calculateDerived";

const defaults: CharacterCyberWare = {id: "", name: "", enabled: true};
const cyberMap: Record<string, CyberWareType> = {};
cyberWares.forEach(c => cyberMap[c.name] = c);

const defaultMalfunction: CharacterCyberMalfunction = {active: false, slots: []};

interface CyberWareProps extends CharacterCyberWare {
    locked?: boolean;
    onChange: (name: string, value: any) => void;
    onRemove: () => void;
}

function CyberWare({onChange, onRemove, locked, name, enabled, ...data}: CyberWareProps) {
    const removeItem = () => window.confirm("Remove Item?") && onRemove();
    const details = cyberMap[name];

    return  (
        <TableRow>
            <TableCell>
                <Stack spacing={1} direction="column">
                    <b>{name}</b>
                    <div>{details.description}</div>
                </Stack>
            </TableCell>
            <TableCell><Checkbox onChange={e => onChange('enabled', e.target.checked)} checked={enabled}/></TableCell>
            <TableCell>{details.cyberImmunityCost}</TableCell>
            <TableCell>
                <TextInput name="note" values={data} onChange={onChange}/>
            </TableCell>
            <TableCell>
                <Btn color="error" disabled={locked} variant="outlined" onClick={removeItem}>Remove</Btn>
            </TableCell>
        </TableRow>
    );
}

interface CyberWarePageProps {
    onChange: (name: string, value: any) => void;
    locked?: boolean;
    stats: CharacterType;
}

export default React.memo(function CyberWarePage({stats, locked, onChange} : CyberWarePageProps) {
    const changeCyberWare = useCallback((i:any) => onChange('cyberware', i), [onChange]);
    const changeMalfunction =  useCallback((n: string, d: CharacterCyberMalfunction) => onChange('malfunctions', {...stats.malfunctions, [n]: d}), [stats.malfunctions]);
    const [data,setData] = useState(cyberWares[0].name);

    return <Grid container spacing={2} direction="column">
        <Grid item>
            <h2>Installed Cyberware</h2>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell width="40%">Name</TableCell>
                            <TableCell width="5%">Enabled</TableCell>
                            <TableCell width="10%">Immunity</TableCell>
                            <TableCell width="40%">Notes</TableCell>
                            <TableCell width="5%"/>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <Collection locked={locked} values={stats.cyberware} onChange={changeCyberWare}
                                    component={CyberWare}/>
                    </TableBody>
                </Table>
            </TableContainer>
        </Grid>

        <Grid item container spacing={2} alignItems="center">
            <Grid item xs={6}><Autocomplete
                size="small"
                value={data}
                options={cyberWares.map((i) => i.name)}
                onChange={(e, v) => setData(v||cyberWares[0].name)}
                renderInput={(params) => <TextField {...params} label="Cyberware" />}/></Grid>
            <Grid item xs={2}><Btn fullWidth onClick={() => data && changeCyberWare([...stats.cyberware, {...defaults, id: uuid.v4(), name: data}])}>Add Cyberware</Btn></Grid>
            <Grid item container xs={4} spacing={1} justifyContent="end" direction="row">
                <Grid item>
                    <Chip
                        label={`Occupied: ${stats.cyberware.map(c => cyberMap[c.name].cyberImmunityCost).reduce((a, b) => a + b, 0)}`}/>
                </Grid>
                <Grid item>
                    <Chip label={`Immunity: ${calculateImmunity(stats)}`}/>
                </Grid>
            </Grid>
        </Grid>

        <Grid item>
            <h2>Cyberware Malfunctions</h2>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell width="10%">Slot</TableCell>
                            <TableCell width="10%">Active</TableCell>
                            <TableCell width="20%">Name</TableCell>
                            <TableCell width="30%">Description</TableCell>
                            <TableCell width="30%">Repair</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {cyberMalfunctions.map(m => {
                            const length = 1 + m.range[1] - m.range[0];
                            const slots = Array.from({length}, (x, i) => i);

                            const status = stats.malfunctions[m.name] || defaultMalfunction;

                            const changeSlot = (s: number, v: boolean) => changeMalfunction(m.name, {...status, slots: slots.map(( i) => i === s ? v : Boolean(status.slots[i]))});
                            const changeActive = (v: boolean) => changeMalfunction(m.name, {...status, active: v});

                            return (<TableRow key={m.name} style={{background: status.active ? '#400' : 'none'}}>
                                <TableCell width="10%"><Stack>
                                    {slots.map(s => <FormControlLabel key={s} control={<Checkbox onChange={e => changeSlot(s, e.target.checked)} checked={Boolean(status.slots[s])} />} label={s + m.range[0]} />)}
                                </Stack></TableCell>
                                <TableCell width="10%"><Checkbox onChange={e => changeActive(e.target.checked)} checked={status.active} /></TableCell>
                                <TableCell width="20%">{m.name}</TableCell>
                                <TableCell width="30%">{m.description}</TableCell>
                                <TableCell width="30%">{m.repair}</TableCell>
                            </TableRow>);
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </Grid>
    </Grid>;
});
