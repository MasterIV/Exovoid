import { StatModifierType } from "./character";

export default interface TalentType {
  talent: string;
  description: string;
  modifier?: StatModifierType;
}
