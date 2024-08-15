import React, {useCallback, useState} from 'react';
import CharacterType from "./types/character";
import Game from "./Game";
import Login from "./Login";
import AccountType from "./types/account";
import Tables from "./Tables";

import {io} from "socket.io-client";
import {ServerSocket} from "./types/server";
const socket: ServerSocket = io();

const characterDefaults: CharacterType = {
    id: "",
    name: "",
    table: "",
    exp: 0,
    currentHealth: 0,
    currentEdge: 0,
    attributes: {INT:3, STR:3, COO:3, CON:3, AGI:3, EDU:3, PER:3},
    skills: {}
};

const accountName = localStorage.getItem('account.name');
const accountToken = localStorage.getItem('account.token');
if(accountName && accountToken)
    socket.on("connect", () => socket.emit("relogin", accountName, accountToken));

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

    socket.removeAllListeners("character");
    socket.on("character", data => setCharacter(data));

    socket.removeAllListeners("account");
    socket.on("account", data => {
        localStorage.setItem('account.name', data.name);
        localStorage.setItem('account.token', data.token);
        setAccount(data)
    });

    socket.removeAllListeners("error");
    socket.on("error", data => setError(data));

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

    return <Game socket={socket} character={character} onChange={changeCharacter} />;
}

export default App;
