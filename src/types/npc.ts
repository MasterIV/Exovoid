import {Combatant} from "./combat";

export interface NpcActionType {
    id: string;
    name: string;
    aptitude: number;
    expertise: number;
    ap: number;
}


export default interface NpcType extends Combatant {
    actions: NpcActionType[];
    expanded?: boolean;
}