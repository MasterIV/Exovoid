import React, {useCallback, useEffect, useState} from 'react';
import CharacterType from "./types/character";
import Game from "./Game";
import Login from "./Login";
import AccountType from "./types/account";
import Tables from "./Tables";

import socket, {onAccountChange, onCharacterChange, onError} from "./socket";

let updateTimer: any = null;

function App() {
    const [character, setCharacter] = useState<CharacterType|null>(null);
    const changeCharacter = useCallback((name: string, value: any) => {
        if(character) {
            const updated = {...character, [name]: value};
            setCharacter(updated);

            if(updateTimer) clearTimeout(updateTimer);
            updateTimer = setTimeout(() => socket.emit("save", updated), 5000);
        }
    }, [character]);

    const [account, setAccount] = useState<AccountType|null>(null);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        onCharacterChange(setCharacter);
        onAccountChange(setAccount);
        onError(setError);
    }, []);

    if(!account)
        return <Login
            error={error}
            onLogin={(name, pw) => {setError(""); socket.emit("login", name, pw);}}
            onRegister={(name, pw) => {setError(""); socket.emit("register", name, pw);}} />;

    if(!character)
        return <Tables
            error={error}
            account={account}
            onJoin={(id) => {setError(""); socket.emit("join", id);}}
            onCreate={(name, table, pw) => {setError(""); socket.emit("create", name, table, pw);}} />;

    return <Game character={character} onChange={changeCharacter} />;
}

export default App;
