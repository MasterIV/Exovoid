import {Autocomplete, TableCell, TableRow, TextField} from "@mui/material";
import items from "../data/items.json";
import {RmBtn, TextInput} from "./Form";
import React from "react";
import {InventoryItem} from "../types/character";
import {CollectionItemPros} from "./Collection";

interface ItemProps extends InventoryItem, CollectionItemPros {}

export default function Item({onChange, onRemove, ...item}: ItemProps) {
    return (
        <TableRow>
            <TableCell>
                <Autocomplete
                    freeSolo
                    value={item.name}
                    options={items.map((i) => `${i.name} (${i.item})`)}
                    onChange={(e, v) => onChange('name', v)}
                    renderInput={(params) => <TextField onChange={e => onChange('name', e.target.value)} {...params}
                                                        label="Item"/>}
                />
            </TableCell>
            <TableCell><TextInput type="number" name="quantity" values={item} onChange={onChange}/></TableCell>
            <TableCell><TextInput name="location" values={item} onChange={onChange}/></TableCell>
            <TableCell><TextInput name="note" values={item} onChange={onChange}/></TableCell>
            <TableCell><RmBtn label="Item" onRemove={onRemove} /></TableCell>
        </TableRow>
    );
}