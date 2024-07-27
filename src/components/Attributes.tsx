import {Grid} from "@mui/material";
import attributes from "../data/attributes.json";
import Value from "./Value";
import React from "react";
import AttributeType from "../types/attributes";


interface AttributesProps {
    onChange: (name: string, value: number) => void;
    values: AttributeType
}

export default function Attributes({values, onChange}: AttributesProps) {
    return (<Grid item container spacing={2} justifyContent={"center"}>
        {Object.keys(attributes).map((a: string) => {
            const {name} = attributes[a as keyof typeof attributes];
            const value = values[a as keyof typeof values] || 0;

            return (<Grid item>
                <Value key={a} name={a} label={name} value={value} onChange={onChange}/>
            </Grid>);
        })}
    </Grid>);
}