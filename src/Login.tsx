import React, {useState} from 'react';
import {Alert, Paper, Stack} from "@mui/material";
import {Btn, TextInput} from "./components/Form";

const styles= {
    margin: 'auto',
    padding: 3,
    marginTop: 10,
    width: 400
}

interface LoginData {
    name?: string;
    pw?: string;
    pwr?: string;
    error?: string;
}

interface LoginProps {
    error?: string;
    onLogin: (name: string, pw: string) => void;
    onRegister: (name: string, pw: string) => void;
}

function Login({onLogin, onRegister, error}: LoginProps) {
    const [data, setData] = useState<LoginData>({});
    const onChange = (name: string, value: string) => setData({...data, [name]: value});;

    const handleLogin = () => {
        if(!data.name || !data.pw) return setData({...data, error: "Name or Password Missing!"});
        onLogin(data.name, data.pw);
    }

    const handleRegistration = () => {
        if(!data.name || !data.pw) return setData({...data, error: "Name or Password Missing!"});
        if(data.pw !== data.pwr) return setData({...data, error: "Password and Repeat Password don't match!"});
        onRegister(data.name, data.pw);
    }

    return <Paper sx={styles}>
        <Stack spacing={2}>
            {(data.error || error) && <Alert severity="error">{error || data.error}</Alert>}
            <TextInput label="Name" name="name" values={data} onChange={onChange} />
            <TextInput type="password" label="Password" name="pw" values={data} onChange={onChange} />
            <TextInput type="password" label="Repeat Password" name="pwr" values={data} onChange={onChange} />
            <Btn onClick={handleRegistration}>Register</Btn>
            <Btn onClick={handleLogin}>Login</Btn>
        </Stack>
    </Paper>;
}

export default Login;
