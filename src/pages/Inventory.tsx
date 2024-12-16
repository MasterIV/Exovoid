import React, {useCallback} from "react";
import {Grid} from "@mui/material";
import Value from "../components/Value";
import useCharacter from "../state/character";
import Inventory from "../components/Inventory";

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

            <Inventory inventory={inventory} onChange={changeInventory} />
        </Grid>
    );
});
