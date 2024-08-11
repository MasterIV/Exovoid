import {validateName} from "./validate";
import fs from "node:fs";
import {createSalt, hashPassword} from "./password";

interface TableData {
    name: string;
    hash: string;
    salt: string;
}

export default class TableService {

    check(table: string, password: string) {
        validateName(table);
        const file = `tables/${table}.json`;

        if(fs.existsSync(file)) {
            const content = fs.readFileSync(file);
            const data = JSON.parse(content.toString()) as TableData;
            if(data.hash !== hashPassword(password, data.salt))
                throw new Error("Invalid Credentials!");
        } else {
            const salt = createSalt();
            const data: TableData = {name: table, hash: hashPassword(password, salt), salt};
            fs.writeFileSync(file, JSON.stringify(data, null, 2));
        }
    }
}