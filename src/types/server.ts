import AccountType from "./account";
import CharacterType from "./character";
import {Socket as ServerSideSocket} from "socket.io";
import {Socket as ClientSideSocket} from "socket.io-client";
import {DefaultEventsMap} from "socket.io/dist/typed-events";
import {DicePoolType, DiceResultType} from "./dice";

type Metadata = Record<string, any>

export interface ClientEvents {
    // Stage: Authentication
    login: (name: string, password: string) => void;
    relogin: (name: string, token: string) => void;
    register: (name: string, password: string) => void;
    // Stage: Table Selection
    join: (id: string) => void;
    create: (name: string, table: string, password: string) => void;
    // Stage Game
    roll: (pool:DicePoolType, metadata?: Metadata) => void;
    save: (data: CharacterType) => void;
}

export interface ServerEvents {
    account: (data: AccountType) => void;
    character: (data: CharacterType) => void;
    roll: (result: DiceResultType, metadata?: Metadata) => void;
    error: (message: string) => void;
}

export interface SocketData {
    account?: AccountType,
    character?: CharacterType,
}

export type ClientSocket = ServerSideSocket<ClientEvents, ServerEvents, DefaultEventsMap, SocketData>;
export type ServerSocket = ClientSideSocket<ServerEvents, ClientEvents>;