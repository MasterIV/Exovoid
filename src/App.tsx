import React, {useEffect, useState} from 'react';
import Game from "./Game";
import Login from "./Login";
import AccountType from "./types/account";
import Tables from "./Tables";

import socket, {onAccountChange, onError, onDisconnect} from "./socket";
import useCharacter from "./state/character";
import {Paper} from "@mui/material";

function App() {
    const character = useCharacter(state => state.id);

    const [account, setAccount] = useState<AccountType|null>(null);
    const [error, setError] = useState<string>("");
    const [connected, setConnected] = useState(true)

    const disconnectHandler = () => setConnected(false)
    const accountHandler = (account: AccountType) => {
        setAccount(account)
        setConnected(true)

        // client was already connected to a table that we need to re-join
        const table = useCharacter.getState().table
        if (table) socket.emit('join', account.tables.find(t => t.name == table)?.id!)
    }

    useEffect(() => {
        onDisconnect(disconnectHandler)
        onAccountChange(accountHandler);
        onError(setError);
    }, []);

    if(!connected)
        return <Paper className="paperSmall">
            Connection lost, attempting to reconnect...
        </Paper>;

    if (character)
        return <Game error={error}/>;

    if(account)
        return <Tables
            error={error}
            account={account}
            onJoin={(id) => {setError(""); socket.emit("join", id);}}
            onCreate={(name, table, pw) => {setError(""); socket.emit("create", name, table, pw);}} />;

    return <Login
            error={error}
            onLogin={(name, pw) => {setError(""); socket.emit("login", name, pw);}}
            onRegister={(name, pw) => {setError(""); socket.emit("register", name, pw);}} />;
}

export default App;
