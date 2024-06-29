import {Grid} from "@mui/material";
import attributes from "../data/attributes.json";
import Value from "./Value";
import React from "react";


interface AttributesProps {
    onChange: (name: string, value: number) => void;
    stats: {}
}

export default function Attributes({stats, onChange}: AttributesProps) {
    return (<Grid container spacing={2} margin={1}>
        {Object.keys(attributes).map((a: string) => {
            const {name} = attributes[a as keyof typeof attributes];
            const value = stats[a as keyof typeof stats] || 0;

            return (<Grid item>
                <Value key={a} name={a} label={name} value={value} onChange={onChange}/>
            </Grid>);
        })}
    </Grid>);
}