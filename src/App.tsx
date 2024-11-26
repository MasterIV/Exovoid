import React, {useEffect, useState} from 'react';
import Game from "./Game";
import Login from "./Login";
import AccountType from "./types/account";
import Tables from "./Tables";

import socket, {onAccountChange, onError} from "./socket";
import useCharacter from "./state/character";

function App() {
    const character = useCharacter(state => state.id);

    const [account, setAccount] = useState<AccountType|null>(null);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        onAccountChange(setAccount);
        onError(setError);
    }, []);

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
