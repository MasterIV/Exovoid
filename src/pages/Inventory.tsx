import React, {useCallback} from "react";
import {
    Autocomplete,
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
import CharacterType, {InventoryItem} from "../types/character";
import Collection from "../components/Collection";
import items from '../data/items.json';
import {Btn, TextInput} from "../components/Form";
import * as uuid from 'uuid';
import Value from "../components/Value";

const defaults = {name: "", quantity: 1, location: "", notes: ""};

interface ItemProps extends InventoryItem {
    onChange: (name: string, value: any) => void;
    onRemove: () => void;
}

function Item({onChange, onRemove, ...item}: ItemProps) {
    const removeItem = () => window.confirm("Remove Item?") && onRemove();

    return  <TableRow>
        <TableCell><Autocomplete
            freeSolo
            value={item.name}
            options={items.map((i) => i.name)}
            onChange={(e, v) => onChange('name', v)}
            renderInput={(params) => <TextField onChange={e => onChange('name', e.target.value)} {...params} label="Item" />}
        /></TableCell>
        <TableCell><TextInput type="number" name="quantity" values={item} onChange={onChange} /></TableCell>
        <TableCell><TextInput name="location" values={item} onChange={onChange} /></TableCell>
        <TableCell>
            <Stack direction="row" spacing={2}>
                <TextInput name="note" values={item} onChange={onChange} />
                <Btn onClick={removeItem}>Remove</Btn>
            </Stack>
        </TableCell>
    </TableRow>;
}

interface InventoryPageProps {
    onChange: (name: string, value: any) => void;
    stats: CharacterType;
    locked?: boolean;
}

export default function InventoryPage({stats, locked, onChange} : InventoryPageProps) {
    const inventory = stats.inventory || [];
    const currency = stats.currency || {assets:0, credits:0};

    const changeInventory = useCallback((i:any) => onChange('inventory', i), [onChange]);
    const changeCurrency = (k: string, v: number) => onChange('inventory', {...currency, [k]: v});

    return <Grid container spacing={2} margin={1} direction="column">

        <Grid item container spacing={2}>
            <Grid item><Value label="Credits" name="credits" value={currency.credits} onChange={changeCurrency} /></Grid>
            <Grid item><Value label="Assets" name="assets" value={currency.assets} onChange={changeCurrency} /></Grid>
        </Grid>

        <Grid item>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell width="30%">Item</TableCell>
                            <TableCell width="10%">Quantity</TableCell>
                            <TableCell width="20%">Location</TableCell>
                            <TableCell width="30%">Notes</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <Collection values={inventory} onChange={changeInventory} component={Item} />
                    </TableBody>
                </Table>
            </TableContainer>
        </Grid>

        <Grid item>
            <Btn onClick={() => changeInventory([...inventory, {...defaults, id: uuid.v4()}])}>Add Item</Btn>
        </Grid>
    </Grid>;
}