import React from "react";
import {Button, ButtonGroup, InputAdornment, InputProps, TextField} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

interface ValueProps {
    name: string;
    value: number;
    onChange: (name: string, value: number) => void;
    label?: string;
    width?: number;
    mask?: string;
}

export default function Value({
    name,
    value,
    onChange,
    mask,
    label = "Value",
    width = 90
}: ValueProps) {
    const inputProps: InputProps = {};

    if(mask) {
        inputProps['endAdornment'] = <InputAdornment position="start">{mask}</InputAdornment>;
    }

    return <ButtonGroup variant="contained">
        <Button onClick={() => onChange(name, value - 1)}><RemoveIcon fontSize="small"/></Button>
        <TextField
            id={name}
            label={label}
            value={value}
            onChange={e => onChange(name, Number(e.target.value))}
            variant="filled"
            sx={{width}}
            InputProps={inputProps}
            size="small"/>
        <Button onClick={() => onChange(name, value + 1)}><AddIcon fontSize="small"/></Button>
    </ButtonGroup>;
}
