export interface WeaponType {
  name: string;
  weapon: string;
  skill: string;
  type: string;

  hands: number;
  magazine: number;
  reload?: number;
  speed: number;
  damage: number;

  range: string;
  damageType: string;
  specialRules: string;
  triggerOptions: Record<string, number | undefined>;
  qualities: Record<string, number | undefined>;

  modLimit: number;
  cost: number;
  ammoCost?: number;
  rarity: number;
}
