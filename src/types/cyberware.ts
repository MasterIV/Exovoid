import {StatModifierType} from "./character";

export default interface CyberWareType {
    name: string;
    description: string;
    modifier?: StatModifierType;
}