import AttributeType from "./attributes";

export default interface CharacterType {
    id: string,
    name: string;
    table: string;
    description?: string;
    image?: string;
    attributes: AttributeType;
    skills: {[key:string]: number};
    currentHealth: number;
    currentEdge: number;
    exp: number;
}