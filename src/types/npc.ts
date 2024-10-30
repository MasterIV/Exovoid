import { Combatant } from "./combat";

export interface NpcActionType {
  id: string;
  name: string;
  aptitude: number;
  expertise: number;
  ap: number;
  note?: string;
}

export default interface NpcType extends Combatant {
  actions: NpcActionType[];
  expanded?: boolean;
  minion: boolean;
}
