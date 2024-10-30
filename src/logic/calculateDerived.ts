import CharacterType, { StatModifierType } from "../types/character";
import talents from "../data/talents.json";
import TalentType from "../types/talent";
import cyberware from "../data/cyberware.json";
import CyberWareType from "../types/cyberware";

const talentMap: Record<string, TalentType> = {};
talents.forEach((t) => (talentMap[t.talent] = t));

const cyberMap: Record<string, CyberWareType> = {};
cyberware.forEach((c) => (cyberMap[c.name] = c));

function getTalentModifier(mod: keyof StatModifierType, stats: CharacterType) {
  return stats.talents
    .filter((t) => talentMap[t] && talentMap[t].modifier?.[mod])
    .map((t) => talentMap[t].modifier?.[mod] || 0)
    .reduce((a, b) => a + b, 0);
}

function getCyberWareModifier(
  mod: keyof StatModifierType,
  stats: CharacterType,
) {
  return stats.cyberware
    .filter((c) => c.enabled)
    .filter((c) => cyberMap[c.name] && cyberMap[c.name].modifier?.[mod])
    .map((c) => cyberMap[c.name].modifier?.[mod] || 0)
    .reduce((a, b) => a + b, 0);
}

export function calculateHealth(stats: CharacterType) {
  const CON = stats.attributes.CON || 0;
  let health = 5 + CON;

  health += getTalentModifier("health", stats);
  health += getCyberWareModifier("health", stats);

  return health;
}

export function calculateActionPoints(stats: CharacterType) {
  const AGI = stats.attributes.AGI || 0;
  let ap = Math.ceil(3 + AGI / 2);

  ap += getTalentModifier("ap", stats);
  ap += getCyberWareModifier("ap", stats);

  return ap;
}

export function calculateSpeed(stats: CharacterType) {
  const CON = stats.attributes.CON || 0;
  const AGI = stats.attributes.AGI || 0;
  let speed = Math.ceil(3 + (CON + AGI) / 2);

  speed += getTalentModifier("speed", stats);
  speed += getCyberWareModifier("speed", stats);

  return speed;
}

export function calculateImmunity(stats: CharacterType) {
  const CON = stats.attributes.CON || 0;
  const STR = stats.attributes.STR || 0;
  let immunity = CON + STR;

  immunity += getTalentModifier("immunity", stats);

  return immunity;
}

export function calculateEdge(stats: CharacterType) {
  const COO = stats.attributes.COO || 0;
  const EDU = stats.attributes.EDU || 0;
  let edge = Math.ceil(3 + COO / 4 + EDU / 2);

  edge += getTalentModifier("edge", stats);

  return edge;
}

export function calculateHeft(stats: CharacterType) {
  const STR = stats.attributes.STR || 0;
  let heft = Math.ceil(STR / 2);

  heft += getTalentModifier("heft", stats);

  return heft;
}
