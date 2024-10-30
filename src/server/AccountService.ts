import AccountType from "../types/account";
import * as fs from "fs";
import { validateName } from "./validate";
import CharacterType from "../types/character";
import { createSalt, hashPassword } from "./password";

const dir = "data/accounts";

export default class AccountService {
  login(name: string, password: string): AccountType {
    validateName(name);

    const content = fs.readFileSync(`${dir}/${name}.json`);
    if (!content) throw new Error("Account not found!");

    const account = JSON.parse(content.toString()) as AccountType;
    if (account.hash !== hashPassword(password, account.salt))
      throw new Error("Invalid Credentials!");

    account.token = createSalt();
    this.saveAccount(account);

    return account;
  }

  relogin(name: string, token: string): AccountType {
    validateName(name);

    const content = fs.readFileSync(`${dir}/${name}.json`);
    if (!content) throw new Error("Account not found!");

    const account = JSON.parse(content.toString()) as AccountType;
    if (account.token !== token) throw new Error("Invalid Token!");

    return account;
  }

  register(name: string, password: string): AccountType {
    validateName(name);

    if (fs.existsSync(`${dir}/${name}.json`))
      throw new Error("Name not available!");

    const salt = createSalt();
    const token = createSalt();
    const account: AccountType = {
      name,
      salt,
      token,
      hash: hashPassword(password, salt),
      tables: [],
    };
    this.saveAccount(account);

    return account;
  }

  add(account: AccountType, character: CharacterType): void {
    account.tables.push({
      name: character.table,
      character: character.name,
      id: character.id,
    });

    this.saveAccount(account);
  }

  private saveAccount(account: AccountType) {
    fs.writeFileSync(
      `${dir}/${account.name}.json`,
      JSON.stringify(account, null, 2),
    );
  }
}
