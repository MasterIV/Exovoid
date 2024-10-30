import { DicePoolType, DiceResultType } from "../types/dice";
import dice from "../data/dice.json";

export default class GameService {
  roll(pool: DicePoolType): DiceResultType {
    const result: DiceResultType = [];

    Object.keys(dice).forEach((type) => {
      for (
        let amount = pool[type as keyof typeof pool] || 0;
        amount > 0;
        amount--
      ) {
        const d = dice[type as keyof typeof dice];
        let symbols: string[];
        let exploded = false;

        do {
          const rnd = Math.floor(Math.random() * d.sides);
          const r = rnd < d.symbols.length ? d.symbols[rnd] : [];

          symbols = Array.isArray(r) ? r : [r];
          result.push({ type, symbols, exploded });
          exploded = true;
        } while (symbols.includes("explosive"));
      }
    });

    return result;
  }
}
