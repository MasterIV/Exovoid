import {DicePoolType} from "../types/dice";

export function emptyPool(pool: DicePoolType) {
    return (pool.default ?? 0) < 1 &&
        (pool.aptitude ?? 0) < 1 &&
        (pool.expertise ?? 0) < 1 &&
        (pool.injury ?? 0) < 1;
}
