import {Button, ButtonProps, MenuItem, TextField} from "@mui/material";
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

interface DropdownProps extends Omit<OutlinedTextFieldProps, 'onChange' | 'variant'>{
    id: string,
    label: string,
    name: string,
    values: Record<string, any>;
    onChange: (name: string, value: any) => void;
    disabled?: boolean;
    options: {
        id: string;
        name: string;
    }[]
}

export const Dropdown = ({id, values, options, onChange, ...props}: DropdownProps) =>
        <TextField size="small" fullWidth select {...props} value={values[props.name]} onChange={e=>onChange(props.name, e.target.value)}>
            {options.map((option) => <MenuItem key={option.id} value={option.id}>{option.name}</MenuItem>)}
        </TextField>;
