import React, {useCallback, useState} from 'react';
import AccountType from "./types/account";
import {Alert, Paper, Stack} from "@mui/material";
import {Btn, TextInput} from "./components/Form";

const styles= {
    margin: 'auto',
    padding: 3,
    marginTop: 10,
    width: 600
}

interface TablesProps {
    error?: string;
    account: AccountType;
    onJoin: (id: string) => void;
    onCreate: (name: string, table: string, pw: string) => void;
}

interface TableData {
    table?: string;
    character?: string;
    pw?: string;
    error?: string;
}

function Tables({account, onJoin, onCreate, error}: TablesProps) {
    const [data, setData] = useState<TableData>({});
    const onChange = (name: string, value: string) => setData({...data, [name]: value});

    const handleCreate = () => {
        if(!data.table || !data.character || !data.pw) return setData({...data, error: "Name or Password Missing!"});
        onCreate(data.character, data.table, data.pw);
    }

    return <React.Fragment>
        {account.tables.length > 0 && <Paper sx={styles}>
            <Stack spacing={2}>
                {account.tables.map(table => <Btn key={table.id} onClick={() => onJoin(table.id)}>{table.name}: {table.character}</Btn>)}
            </Stack>
        </Paper>}

        <Paper sx={styles}>
            <Stack spacing={2}>
                {(data.error || error) && <Alert severity="error">{error || data.error}</Alert>}
                <TextInput label="Table Name" name="table" values={data} onChange={onChange} />
                <TextInput label="Character Name" name="character" values={data} onChange={onChange} />
                <TextInput type="password" label="Password" name="pw" values={data} onChange={onChange} />
                <Btn onClick={handleCreate}>Create or Join Table</Btn>
            </Stack>
        </Paper>
    </React.Fragment>;
}

export default Tables;
