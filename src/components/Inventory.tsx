import {InventoryItem} from "../types/character";
import * as uuid from "uuid";
import {Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import Collection from "./Collection";
import Item from "./Item";
import {Btn} from "./Form";
import React from "react";

const defaults = {name: "", quantity: 1, location: "", notes: ""};

interface InventoryProps {
    id: string;
    inventory: InventoryItem[];
    onChange: (data: any) => void;
}

export default function Inventory({id, inventory, onChange}: InventoryProps ) {
    const addItem = () => onChange([...inventory, {...defaults, id: uuid.v4()}]);

    return <>
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
                        <Collection id={id} values={inventory} onChange={onChange} component={Item}/>
                    </TableBody>
                </Table>
            </TableContainer>
        </Grid>

        <Grid item display="flex" justifyContent="end">
            <Btn onClick={addItem}>Add Item</Btn>
        </Grid>
    </>;
}