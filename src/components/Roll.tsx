import React from "react";
import dice from '../data/dice.json';

interface RollProps {

}
export function Roll({} : RollProps) {

}

interface DiceCounterProps {
    type: string;
    count: number;
}

export function DiceCounter({type, count}: DiceCounterProps) {
    return (<div className={`dice small ${type}`}>{count}</div>)
}

interface DicePoolProps {
    default?: number;
    aptitude?: number;
    expertise?: number;
    injury?: number;
}

export function DicePool(props: DicePoolProps) {
    return (<React.Fragment>
        {Object.keys(dice).map(d => {
            const key = d as keyof typeof props;
            return props[key] ? <DiceCounter type={d} count={props[key]} /> : null;
        })}
    </React.Fragment>)
}