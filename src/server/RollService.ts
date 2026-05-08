import * as fs from "fs";
import {PersistentRollEntry} from "../types/dice";

const dir = "data/rolls";
const MAX_ROLLS = 50;

export default class RollService {
    private file(tableId: string) {
        return `${dir}/${tableId}.json`;
    }

    load(tableId: string): PersistentRollEntry[] {
        const file = this.file(tableId);
        if (!fs.existsSync(file)) return [];
        const content = fs.readFileSync(file);
        return JSON.parse(content.toString()) as PersistentRollEntry[];
    }

    append(tableId: string, entry: PersistentRollEntry) {
        const entries = this.load(tableId);
        entries.push(entry);
        const trimmed = entries.slice(-MAX_ROLLS);
        fs.writeFileSync(this.file(tableId), JSON.stringify(trimmed));
    }
}
