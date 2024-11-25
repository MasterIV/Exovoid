import {validateName} from "./validate";
import * as fs from "fs";
import {createSalt, hashPassword} from "./password";
import {TableType} from "../types/table";

const dir = "data/tables"

interface TableData {
    name: string;
    hash: string;
    salt: string;
    data: TableType;
}

export default class TableService {
    save(id: string, data: TableType) {
        const file = `${dir}/${id}.json`;
        const content = fs.readFileSync(file);
        const old = JSON.parse(content.toString()) as TableData;
        fs.writeFileSync(file, JSON.stringify({...old, data}));
    }

    load(id: string): TableType {
        const file = `${dir}/${id}.json`;
        const content = fs.readFileSync(file);
        const table = JSON.parse(content.toString()) as TableData;
        return table.data;
    }

    check(table: string, password: string) {
        validateName(table);
        const file = `${dir}/${table}.json`;

        if(fs.existsSync(file)) {
            const content = fs.readFileSync(file);
            const data = JSON.parse(content.toString()) as TableData;
            if(data.hash !== hashPassword(password, data.salt))
                throw new Error("Invalid Credentials!");
        } else {
            const salt = createSalt();
            const data: TableData = {name: table, hash: hashPassword(password, salt), salt, data: {}};
            fs.writeFileSync(file, JSON.stringify(data, null, 2));
        }
    }
}