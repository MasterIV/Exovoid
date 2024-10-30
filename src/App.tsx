import React, {useCallback, useEffect, useState} from 'react';
import CharacterType from "./types/character";
import Game from "./Game";
import Login from "./Login";
import AccountType from "./types/account";
import Tables from "./Tables";
import characterDefaults from "./data/character.json";

import socket, {onAccountChange, onCharacterChange, onError, saveCharacter} from "./socket";
import InitiativeProvider from "./provider/InitiativeProvider";
import {Alert, Box, Stack} from "@mui/material";

function App() {
    const [character, setCharacter] = useState<CharacterType|null>(null);
    const changeCharacter = useCallback((name: string, value: any) => setCharacter(old => {
        if(!old) return old;
        const updated = {...old, [name]: value};
        saveCharacter(updated);
        return updated;
    }), []);

    const [account, setAccount] = useState<AccountType|null>(null);
    const [socketError, setSocketError] = useState<string>();

    useEffect(() => {
        onCharacterChange(c => setCharacter({...characterDefaults, ...c}));
        onAccountChange(setAccount);
        onError(setSocketError);
    }, []);

    if (socketError) {
        return (
            <Box margin={4}>
                <Alert severity="error">{socketError}</Alert>
            </Box>
        );
    }

    if (character)
        return <InitiativeProvider stats={character}>
            <Game character={character} onChange={changeCharacter}/>
        </InitiativeProvider>;

    if(account)
        return <Tables
            account={account}
            onJoin={(id) => {setSocketError(""); socket.emit("join", id);}}
            onCreate={(name, table, pw) => {setSocketError(""); socket.emit("create", name, table, pw);}} />;

    return <Login
            onLogin={(name, pw) => {setSocketError(""); socket.emit("login", name, pw);}}
            onRegister={(name, pw) => {setSocketError(""); socket.emit("register", name, pw);}} />;
}

export default App;
