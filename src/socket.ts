import {io} from "socket.io-client";
import {ServerSocket} from "./types/server";
import AccountType from "./types/account";
import CharacterType from "./types/character";
import defaults from "./data/character.json";

const socket: ServerSocket = io();

const accountName = localStorage.getItem('account.name');
const accountToken = localStorage.getItem('account.token');
if(accountName && accountToken)
    socket.on("connect", () => socket.emit("relogin", accountName, accountToken));

socket.onAny(console.log);

export const onCharacterChange = (setCharacter: (data: CharacterType) => void) => {
    socket.removeAllListeners("character");
    socket.on("character", setCharacter);
    // Load some dummy data if we don't have a backend running
    socket.on("connect_error", () => setCharacter(defaults));
}

export const onAccountChange = (setAccount: (data: AccountType) => void) => {
    socket.removeAllListeners("account");
    socket.on("account", data => {
        localStorage.setItem('account.name', data.name);
        localStorage.setItem('account.token', data.token);
        setAccount(data)
    });
}

export const onError = (setError: (data: string) => void) => {
    socket.removeAllListeners("error");
    socket.on("error", setError);
}





export default socket;
