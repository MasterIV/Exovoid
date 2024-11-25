import {create} from "zustand";
import {TableType} from "../types/table";
import socket from "../socket";

const SAVE_DELAY = 2000;

interface TableState extends TableType {
    update: (name: string, value: any) => void;
}

let tableUpdateTimer: any = null;
const useTable = create<TableState>((set) => ({
    update: (name, value) => set(state => {
        if(tableUpdateTimer) clearTimeout(tableUpdateTimer);
        tableUpdateTimer = setTimeout(() => {
            socket.emit("table", {...state, [name]: value});
            tableUpdateTimer = null;
        }, SAVE_DELAY);

        return {[name]: value};
    })
}));

socket.removeAllListeners("table");
socket.on("table", useTable.setState);

export default useTable;