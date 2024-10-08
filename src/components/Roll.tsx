import React from "react";
import dice from '../data/dice.json';
import {DicePoolType} from "../types/dice";

interface RollProps {

}

export function Roll({}: RollProps) {

}

interface DiceSymbolProps {
    type: string;
    symbols: string[];
    exploded?: boolean;
}

export function DiceSymbol({type, symbols, exploded}: DiceSymbolProps) {
    return (<div style={{backgroundImage: `url("/img/dice/${type}.png")`}}  className={`dice large ${exploded && 'exploded'}`}>
        {symbols.length > 0 && <img alt={symbols.join("_")} src={`/img/symbols/${symbols.join("_")}.png`} width={24} />}
    </div>)
}

interface DiceCounterProps {
    type: string;
    count: number;
    large?: boolean;
}

export function DiceCounter({type, count, large=false}: DiceCounterProps) {
    return (<div style={{backgroundImage: `url("/img/dice/${type}.png")`}} className={large ? `dice large` : `dice small`}>{count}</div>)
}

interface DicePoolProps extends DicePoolType {
    large?: boolean;
}

export function DicePool({large = false, ...props}: DicePoolProps) {
    return (<div className={'dice-pool'}>
        {Object.keys(dice).map(d => {
            const key = d as keyof typeof props;
            return props[key] ? <DiceCounter key={d} large={large} type={d} count={props[key] || 0}/> : null;
        })}
    </div>)
}