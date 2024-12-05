import React, {useCallback} from "react";
import {Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import Collection from "../components/Collection";
import {Btn} from "../components/Form";
import * as uuid from 'uuid';
import Value from "../components/Value";
import useCharacter from "../state/character";
import Item from "../components/Item";

const defaults = {name: "", quantity: 1, location: "", notes: ""};

interface InventoryPageProps {

}

export default React.memo(function InventoryPage({} : InventoryPageProps) {
    const onChange = useCharacter(state => state.update);
    const currency = useCharacter(state => state.currency);
    const inventory = useCharacter(state => state.inventory);

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
                            <Collection values={inventory} onChange={changeInventory} component={Item}/>
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
