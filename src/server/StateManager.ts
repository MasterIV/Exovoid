import {ClientSocket} from "../types/server";
import AccountService from "./AccountService";
import CharacterService from "./CharacterService";
import TableService from "./TableService";
import CharacterType from "../types/character";
import GameService from "./GameService";

export default class StateManager {
    private accountService: AccountService;
    private characterService: CharacterService;
    private tableService: TableService;
    private gameService: GameService;

    constructor() {
        this.accountService = new AccountService();
        this.characterService = new CharacterService();
        this.tableService = new TableService();
        this.gameService = new GameService();
    }

    private wrapHandler<Args extends any[]>(
        socket: ClientSocket,
        operation: (...params: Args) => void
    ): (...params: Args) => void {
        return (...args: Args) => {
            try {
                operation(...args);
            } catch (e) {
                if (typeof e === "string") {
                    console.log(e);
                    socket.emit("error", e);
                } else if (e instanceof Error) {
                    console.log(e.message);
                    socket.emit("error", e.message);
                }
            }
        }
    }

    registerAuthenticationHandlers(socket: ClientSocket) {
        socket.removeAllListeners();

        socket.on("login", this.wrapHandler(socket, (name, password) => {
            socket.data.account = this.accountService.login(name, password);
            this.registerTableSelectionHandlers(socket);
            socket.emit("account", socket.data.account);
        }));

        socket.on("relogin", this.wrapHandler(socket, (name, token) => {
            socket.data.account = this.accountService.relogin(name, token);
            this.registerTableSelectionHandlers(socket);
            socket.emit("account", socket.data.account);
        }));

        socket.on("register", this.wrapHandler(socket, (name, password) => {
            socket.data.account = this.accountService.register(name, password);
            this.registerTableSelectionHandlers(socket);
            socket.emit("account", socket.data.account);
        }));
    }

    registerTableSelectionHandlers(socket: ClientSocket) {
        socket.removeAllListeners();

        socket.on("join", this.wrapHandler(socket, (id) => {
            if (!socket.data.account) throw new Error("Login required!");
            const character = this.characterService.load(socket.data.account, id);
            this.selectCharacter(socket, character);
        }));

        socket.on("create", this.wrapHandler(socket, (name, table, password) => {
            if (!socket.data.account) throw new Error("Login required!");
            this.tableService.check(table, password);
            const character = this.characterService.create(name, table);
            this.accountService.add(socket.data.account, character);
            this.selectCharacter(socket, character);
        }));
    }

    private selectCharacter(socket: ClientSocket, character: CharacterType) : void {
        socket.data.character = character;
        socket.rooms.forEach(r => socket.leave(r));
        socket.join(socket.data.character.table);
        this.registerGameHandlers(socket);
        socket.emit("character", socket.data.character);
    }

    registerGameHandlers(socket: ClientSocket) {
        socket.removeAllListeners();

        socket.on("roll", this.wrapHandler(socket, (pool, metadata = {}) => {
            if (!socket.data.character) throw new Error("Character required!");
            console.log("Rolling:", socket.data.character.name, pool);
            metadata['player'] = socket.data.character.name;
            const result = this.gameService.roll(pool);
            socket.to(socket.data.character.table).emit("roll", result, metadata);
        }));

        socket.on("save", this.wrapHandler(socket, (data) => {
            if (!socket.data.character || socket.data.character.id !== data.id)
                throw new Error("Invalid character!");
            console.log("Saving changes on: " + data.name);
            this.characterService.save(data);
        }));

        socket.on("combatant", this.wrapHandler(socket, (data) => {
            if (!socket.data.character) throw new Error("Invalid character!");
            socket.to(socket.data.character.table).emit("combatant", data);
        }));

        socket.on("reset", this.wrapHandler(socket, () => {
            if (!socket.data.character) throw new Error("Invalid character!");
            socket.to(socket.data.character.table).emit("reset");
        }));
    }
}