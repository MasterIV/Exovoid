import {StatModifierType} from "./character";

export default interface CyberWareType {
    name: string;
    type: string;
    tier: string;
    description: string;
    cyberImmunityCost: number;
    modifier?: StatModifierType;
}