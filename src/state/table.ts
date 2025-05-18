import {create} from "zustand";
import {TableType} from "../types/table";
import socket from "../socket";
import {ShipType} from "../types/ship";

const SAVE_DELAY = 2000;

interface TableState extends TableType {
    notes: string;
    ships: ShipType[];
    update: (name: string, value: any) => void;
    updateShip: (id: string, name: string, value: any) => void;
}

let updateTimer: any = null;
function wrapUpdate(state:TableState, change: Partial<TableState>) {
    if(updateTimer) clearTimeout(updateTimer);

    updateTimer = setTimeout(() => {
        socket.emit("table", {...state, ...change});
        updateTimer = null;
    }, SAVE_DELAY);

    return change
}


const useTable = create<TableState>((set) => ({
    notes: "",
    ships: [],
    update: (name, value: any) => set(state => wrapUpdate(state, {[name]: value})),
    updateShip: (id, name, value) => set(state => wrapUpdate(state, {
        ships: state.ships.map(s => (s.id === id ? {...s, [name]: value} : s))
    }))
}));

socket.removeAllListeners("table");
socket.on("table", useTable.setState);

export default useTable;