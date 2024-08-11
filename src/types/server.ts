import AccountType from "./account";
import CharacterType from "./character";
import {Socket} from "socket.io";
import {DefaultEventsMap} from "socket.io/dist/typed-events";

export interface ClientEvents {
    // Stage: Authentication
    login: (name: string, password: string) => void;
    register: (name: string, password: string) => void;
    // Stage: Table Selection
    join: (id: string) => void;
    create: (name: string, table: string, password: string) => void;
    // Stage Game

}

export interface ServerEvents {
    account: (data: AccountType) => void;
    character: (data: CharacterType) => void;
    error: (message: string) => void;
}

export interface SocketData  {
    account?: AccountType,
    character?: CharacterType,
}

export type ClientSocket = Socket<ClientEvents, ServerEvents, DefaultEventsMap, SocketData>;