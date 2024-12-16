import {ShipSystem} from "../../types/ship";
import Collection, {CollectionItemPros} from "../Collection";
import {
    Checkbox,
    Grid,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from "@mui/material";
import {Btn, Dropdown, RmBtn, TextInput} from "../Form";
import React, {useState} from "react";
import shipSystems from "../../data/ship-modules.json";
import * as uuid from "uuid";

const shipSystemMap: Record<string, typeof shipSystems[0]> = {};
shipSystems.forEach(t => shipSystemMap[t.name] = t);

interface SystemProps extends ShipSystem, CollectionItemPros {
    capacity: number;
}

function System({onChange, onRemove, type, powered, capacity, ...system}: SystemProps) {
    const definition = shipSystemMap[type];
    const Max = capacity;
    const Cap = eval(String(definition.capacity));

    return <TableRow>
        <TableCell>{definition.power !== 0 &&
            <Checkbox onChange={e => onChange('powered', e.target.checked)} checked={powered}/>}</TableCell>
        <TableCell>{type}</TableCell>
        <TableCell><TextInput type="number" name="amount" values={system} onChange={onChange}/></TableCell>
        <TableCell>{Cap * system.amount}</TableCell>
        <TableCell><Typography color={powered ? "white" : "grey"}>{eval(String(definition.power)) * system.amount}</Typography></TableCell>
        <TableCell>{eval(String(definition.cost)) * system.amount}</TableCell>
        <TableCell>{definition.description}</TableCell>
        <TableCell><RmBtn label="System" onRemove={onRemove}/></TableCell>
    </TableRow>;
}

interface SystemsProps {
    systems: ShipSystem[];
    capacity: number;
    onChange: (data: any) => void;
}

export default function Systems({systems, capacity, onChange}: SystemsProps) {
    const [system, setSystem] = useState(shipSystems[0].name);

    const addSystem = () => onChange( [...systems, {
        id: uuid.v4(),
        type: system,
        amount: 1,
        powered: true,
    }]);

    return <>
        <Grid item>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell width="5%"/>
                            <TableCell width="20%">System</TableCell>
                            <TableCell width="10%">Quantity</TableCell>
                            <TableCell width="10%">Capacity</TableCell>
                            <TableCell width="10%">Power</TableCell>
                            <TableCell width="10%">Cost</TableCell>
                            <TableCell width="30%">Description</TableCell>
                            <TableCell width="5%"/>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <Collection values={systems} onChange={onChange} component={System} capacity={capacity} />
                    </TableBody>
                </Table>
            </TableContainer>
        </Grid>

        <Grid item container direction="row" spacing={2} alignItems="center">
            <Grid item xs={8}><Dropdown
                id="add-system"
                label="System Type"
                name="system"
                values={{system}}
                onChange={(k,v) => setSystem(v)}
                options={shipSystems.map(s => ({id: s.name, name: `${s.name} (${s.type})`}))}/></Grid>
            <Grid item xs={4}><Btn fullWidth size="large" onClick={addSystem}>Add System</Btn></Grid>
        </Grid></>;
}