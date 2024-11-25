import {io} from "socket.io-client";
import {ServerSocket} from "./types/server";
import AccountType from "./types/account";

const socket: ServerSocket = io();

const accountName = localStorage.getItem('account.name');
const accountToken = localStorage.getItem('account.token');
if(accountName && accountToken)
    socket.on("connect", () => socket.emit("relogin", accountName, accountToken));

socket.onAny(console.log);

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
