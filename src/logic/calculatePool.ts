import { DicePoolType } from "../types/dice";
import skills from "../data/skills.json";
import AttributeType from "../types/attributes";

const skillMap: Record<string, (typeof skills)[0]> = {};
skills.forEach((s) => (skillMap[s.name] = s));

export function attributeAverage(skill: string, attributes: AttributeType) {
  const sum = skillMap[skill].attributes
    .map((a) => attributes[a as keyof typeof attributes] || 0)
    .reduce((a, b) => a + b, 0);
  return Math.ceil(sum / skillMap[skill].attributes.length);
}

export default function calculatePool(
  a: number,
  s: number,
  m = 0,
): DicePoolType {
  const values = [a, s];
  values.sort((a, b) => a - b);

  values[1] += m;
  if (values[1] < 0) {
    values[0] = Math.max(0, values[0] + values[1]);
    values[1] = 0;
  }

  if (m) values.sort((a, b) => a - b);

  return {
    default: 1,
    aptitude: values[1] - values[0],
    expertise: values[0],
  };
}
