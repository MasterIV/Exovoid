import {Grid} from "@mui/material";
import Value from "../Value";
import React from "react";
import {ShipType} from "../../types/ship";


interface ShipPoolsProps {
    maxHull: number;
    maxArmor: number;
    maxShield: number;
    ship: ShipType;
    onChange: (n: string, v: any) => void;
}

export function ShipPools({ship, onChange, maxArmor, maxHull, maxShield}: ShipPoolsProps) {
    return <>
        <Grid item display="flex" justifyContent="center">
            <Value fullWidth name="currentHull" value={ship.currentHull} onChange={onChange} label="Hull" mask={`/ ${maxHull}`} />
        </Grid>

        <Grid item display="flex" justifyContent="center">
            <Value fullWidth name="currentArmor" value={ship.currentArmor} onChange={onChange} label="Armor" mask={`/ ${maxArmor}`} />
        </Grid>

        <Grid item display="flex" justifyContent="center">
            <Value fullWidth name="currentShield" value={ship.currentShield} onChange={onChange} label="Shield" mask={`/ ${maxShield}`}/>
        </Grid>
    </>;
}