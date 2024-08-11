import CharacterType from "../types/character";
import AccountType from "../types/account";
import uuid from 'uuid';
import fs from "node:fs";

export default class CharacterService {
    load(account: AccountType, id: string) : CharacterType {
        if(!uuid.validate(id))
            throw new Error("Invalid Id!");
        if(!account.tables.map(t => t.id).includes(id))
            throw new Error("Character not found!");

        const content = fs.readFileSync(`accounts/${id}.json`);
        if(!content) throw new Error("Character not found!");

        return JSON.parse(content.toString()) as CharacterType;
    }

    create(name: string, table: string) : CharacterType  {
        const character: CharacterType = {
            id: uuid.v4(),
            name: name,
            table: table,
            attributes: {},
            skills: {},
            currentEdge: 0,
            currentHealth: 0,
            exp: 0,
        }

        this.save(character);

        return character;
    }

    save(character: CharacterType) {
        fs.writeFileSync(
            `accounts/${character.id}.json`,
            JSON.stringify(character, null, 2));
    }
}