import {create} from "zustand";
import {TableType} from "../types/table";
import socket from "../socket";

const SAVE_DELAY = 2000;

interface TableState extends TableType {
    update: (name: string, value: any) => void;
}

let updateTimer: any = null;
const useTable = create<TableState>((set) => ({
    update: (name, value) => set(state => {
        if(updateTimer) clearTimeout(updateTimer);
        updateTimer = setTimeout(() => {
            socket.emit("table", {...state, [name]: value});
            updateTimer = null;
        }, SAVE_DELAY);

        return {[name]: value};
    })
}));

socket.removeAllListeners("table");
socket.on("table", useTable.setState);

export default useTable;