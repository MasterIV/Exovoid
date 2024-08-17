import React from "react";
import dice from '../data/dice.json';
import {DicePoolType} from "../types/dice";

interface RollProps {

}

export function Roll({}: RollProps) {

}

interface DiceCounterProps {
    type: string;
    count: number;
    large?: boolean;
}

export function DiceCounter({type, count, large=false}: DiceCounterProps) {
    return (<div className={large ? `dice large ${type}` : `dice small ${type}`}>{count}</div>)
}

interface DicePoolProps extends DicePoolType {
    large?: boolean;
}

export function DicePool({large = false, ...props}: DicePoolProps) {
    return (<div className={'dice-pool'}>
        {Object.keys(dice).map(d => {
            const key = d as keyof typeof props;
            return props[key] ? <DiceCounter large={large} type={d} count={props[key] || 0}/> : null;
        })}
    </div>)
}