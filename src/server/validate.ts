export function validateName(name: string) {
    if(!name.match(/^\w+$/g))
        throw new Error("Invalid Name!");
}