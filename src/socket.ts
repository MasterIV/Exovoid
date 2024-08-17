import {io} from "socket.io-client";
import {ServerSocket} from "./types/server";
import AccountType from "./types/account";
import CharacterType from "./types/character";
const socket: ServerSocket = io();

const accountName = localStorage.getItem('account.name');
const accountToken = localStorage.getItem('account.token');
if(accountName && accountToken)
    socket.on("connect", () => socket.emit("relogin", accountName, accountToken));

export const onCharacterChange = (setCharacter: (data: CharacterType) => void) => {
    socket.removeAllListeners("character");
    socket.on("character", data => {
        console.log("character");
        setCharacter(data)
    });
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
    socket.on("error", data => setError(data));
}





export default socket;
