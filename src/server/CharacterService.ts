import CharacterType from "../types/character";
import AccountType from "../types/account";
import * as uuid from 'uuid';
import * as fs from "fs";
import defaults from "../data/character.json";

const dir = "data/chars";

export default class CharacterService {
    load(account: AccountType, id: string) : CharacterType {
        if(!uuid.validate(id))
            throw new Error("Invalid Id!");
        if(!account.tables.map(t => t.id).includes(id))
            throw new Error("Character not found!");

        const content = fs.readFileSync(`${dir}/${id}.json`);
        if(!content) throw new Error("Character not found!");

        return JSON.parse(content.toString()) as CharacterType;
    }

    create(name: string, table: string) : CharacterType  {
        const character: CharacterType = {
            ...defaults,
            id: uuid.v4(),
            name: name,
            table: table,
        }

        this.save(character);

        return character;
    }

    save(character: CharacterType) {
        fs.writeFileSync(
            `${dir}/${character.id}.json`,
            JSON.stringify(character, null, 2));
    }
}