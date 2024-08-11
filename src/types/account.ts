


export default interface AccountType {
    name: string;
    hash: string;
    salt: string;
    tables: {
        name: string;
        character: string;
        id: string;
    }[];
}