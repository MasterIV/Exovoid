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
import {InventoryItem} from "../types/character";
import Collection from "../components/Collection";
import items from '../data/items.json';
import {Btn, TextInput} from "../components/Form";
import * as uuid from 'uuid';
import Value from "../components/Value";

const defaults = {name: "", quantity: 1, location: "", notes: ""};

interface ItemProps extends InventoryItem {
    onChange: (name: string, value: any) => void;
    onRemove: () => void;
    locked?: boolean;
}

function Item({onChange, onRemove, locked, ...item}: ItemProps) {
    const removeItem = () => window.confirm("Remove Item?") && onRemove();

    return (
        <TableRow>
            <TableCell>
                <Autocomplete
                    freeSolo
                    value={item.name}
                    options={items.map((i) => `${i.name} (${i.item})`)}
                    onChange={(e, v) => onChange('name', v)}
                    renderInput={(params) => <TextField onChange={e => onChange('name', e.target.value)} {...params} label="Item"/>}
                />
            </TableCell>
            <TableCell><TextInput type="number" name="quantity" values={item} onChange={onChange}/></TableCell>
            <TableCell><TextInput name="location" values={item} onChange={onChange}/></TableCell>
            <TableCell>
                <TextInput name="note" values={item} onChange={onChange}/>
            </TableCell>
            <TableCell>
                <Btn disabled={locked} color="error" variant="outlined" onClick={removeItem}>Remove</Btn>
            </TableCell>
        </TableRow>
    );
}

interface InventoryPageProps {
    onChange: (name: string, value: any) => void;
    locked?: boolean;
    inventory: InventoryItem[];
    currency: {
        assets: number;
        credits: number;
    };
}

export default React.memo(function InventoryPage({inventory, currency, locked, onChange} : InventoryPageProps) {
    const changeInventory = useCallback((value:unknown) => onChange('inventory', value), [onChange]);
    const changeCurrency = (key: string, value: number) => onChange('currency', {...currency, [key]: value});

    return (
        <Grid container spacing={2} direction="column">
            <Grid item container spacing={2} direction="row" justifyContent="end">
                <Grid item>
                    <Value
                        label="Credits"
                        name="credits"
                        value={currency.credits}
                        onChange={changeCurrency}
                    />
                </Grid>
                <Grid item>
                    <Value
                        label="Assets"
                        name="assets"
                        value={currency.assets}
                        onChange={changeCurrency}
                    />
                </Grid>
            </Grid>

            <Grid item>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell width="30%">Item</TableCell>
                                <TableCell width="10%">Quantity</TableCell>
                                <TableCell width="20%">Location</TableCell>
                                <TableCell width="25%">Notes</TableCell>
                                <TableCell width="5%"/>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <Collection locked={locked} values={inventory} onChange={changeInventory} component={Item}/>
                        </TableBody>
                    </Table>
                </TableContainer>
            </Grid>

            <Grid item display="flex" justifyContent="end">
                <Btn onClick={() => changeInventory([...inventory, {...defaults, id: uuid.v4()}])}>Add Item</Btn>
            </Grid>
        </Grid>
    );
});
