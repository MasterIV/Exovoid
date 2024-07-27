import {Button, ButtonProps, TextField} from "@mui/material";
import {OutlinedTextFieldProps, TextFieldProps} from "@mui/material/TextField/TextField";

interface TextInputProps extends Omit<OutlinedTextFieldProps, 'onChange' | 'variant'> {
    name: string,
    values: {[key: string]: any},
    onChange: (name: string, value: any) => void;
}

export const TextInput = (props: TextInputProps) => {
    const {name, values, onChange, ...others} = props;
    return <TextField {...others}
                      onChange={e => onChange(name, e.target.value)}
                      value={values[name]}
                      name={name}
                      fullWidth  />;
}



export const Btn = (props: ButtonProps) => <Button {...props} variant="contained" />;