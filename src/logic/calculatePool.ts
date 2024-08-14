import {DicePoolType} from "../types/dice";

export default function calculatePool(a: number, s: number, m=0) : DicePoolType {
    const values = [a, s];
    values.sort((a,b) => a-b);

    values[1] += m;
    if (values[1] < 0) {
        values[0] = Math.max(0, values[0] + values[1]);
        values[1] = 0;
    }

    if(m) values.sort((a,b) => a-b);

    return {
        default: 1,
        aptitude: values[1]-values[0],
        expertise: values[0]
    };
}