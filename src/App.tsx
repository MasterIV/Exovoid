import React, {useCallback, useEffect, useState} from 'react';
import CharacterType from "./types/character";
import Game from "./Game";
import Login from "./Login";
import AccountType from "./types/account";
import Tables from "./Tables";
import characterDefaults from "./data/character.json";

import socket, {onAccountChange, onCharacterChange, onError, onTableChange, saveCharacter} from "./socket";
import InitiativeProvider from "./provider/InitiativeProvider";
import {TableType} from "./types/table";

function App() {
    const [character, setCharacter] = useState<CharacterType|null>(null);
    const [table, setTable] = useState<TableType|null>(null);

    const changeCharacter = useCallback((name: string, value: any) => setCharacter(old => {
        if(!old) return old;
        const updated = {...old, [name]: value};
        saveCharacter(updated);
        return updated;
    }), []);

    const [account, setAccount] = useState<AccountType|null>(null);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        onCharacterChange(c => setCharacter({...characterDefaults, ...c}));
        onTableChange(setTable)
        onAccountChange(setAccount);
        onError(setError);
    }, []);

    if (character && table)
        return <InitiativeProvider stats={character}>
            <Game error={error} table={table} character={character} onChange={changeCharacter}/>
        </InitiativeProvider>;

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
