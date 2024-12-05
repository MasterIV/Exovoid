import {Button, ButtonProps, FormControl, InputLabel, MenuItem, Select, SelectProps, TextField} from "@mui/material";
import {OutlinedTextFieldProps} from "@mui/material/TextField/TextField";
import React from "react";
import {useLock} from "../state/lock";

interface TextInputProps extends Omit<OutlinedTextFieldProps, 'onChange' | 'variant'> {
    name: string,
    values: {[key: string]: any},
    onChange: (name: string, value: any) => void;
}

export const TextInput = (props: TextInputProps) => {
    const {name, values, onChange, ...others} = props;
    return <TextField {...others}
                      onChange={e => onChange(name, e.target.value)}
                      value={values[name]||""}
                      name={name}
                      fullWidth  />;
}



export const Btn = (props: ButtonProps) => <Button variant="contained" {...props} />;

interface RmBtnProps extends ButtonProps {
    label: string;
    onRemove: () => void;
}

export const RmBtn = ({label, onRemove, ...props} : RmBtnProps) => {
    const removeCallback = (e: any) => {
        e.stopPropagation();
        if(window.confirm(`Remove ${label}?`)) onRemove();
    }

    const locked = useLock();
    return <Btn {...props} disabled={locked} color="error" variant="outlined" onClick={removeCallback}>Remove</Btn>;
}

interface DropdownProps extends Omit<SelectProps, 'onChange' | 'variant'>{
    id: string,
    label: string,
    name: string,
    values: Record<string, any>;
    onChange: (name: string, value: any) => void;
    options: {
        id: string;
        name: string;
    }[]
}

export const Dropdown = ({id, label, name, values, options, onChange}: DropdownProps) =>
    <FormControl fullWidth>
        <InputLabel id={id}>{label}</InputLabel>
        <Select labelId={id} label={label} value={values[name]} name={name} onChange={e=>onChange(name, e.target.value)}>
            {options.map((option) => <MenuItem key={option.id} value={option.id}>{option.name}</MenuItem>)}
        </Select>
    </FormControl>;
