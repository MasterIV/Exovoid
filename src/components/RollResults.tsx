import React, {useState} from "react";
import dice from '../data/dice.json';
import {DicePoolType, DiceResultType} from "../types/dice";
import {ServerSocket} from "../types/server";
import * as uuid from 'uuid';
import {Paper} from "@mui/material";
import socket from "../socket";

interface RollResultProps {

}

interface RollEntry {
    id: string;
    result: DiceResultType,
    summary: Record<string, number>;
    metadata: Record<string, any>;
}

function summarize(result: DiceResultType): Record<string, number> {
    const summary: Record<string, number> = {};

    result
        .map(r => r.symbols)
        .flat()
        .filter(s => s !== "explosive")
        .forEach(s => summary[s] = 1 + (summary[s] || 0));

    return summary;
}

export function RollResult({}: RollResultProps) {
    const [rolls, setRolls] = useState<RollEntry[]>([]);

    socket.removeAllListeners("roll")
    socket.on("roll", (result, metadata) => {
        setRolls([{
            id: uuid.v4(),
            summary: summarize(result),
            result,
            metadata: metadata || {},
        }, ...rolls])
    });

    return <div className="resultArea">
        {rolls.map(roll => <Paper className="rollResult">
            <strong>{roll.metadata['player']}</strong>
            {Object.keys(roll.summary).map(s => <div>{s}: {roll.summary[s]}</div>)}
        </Paper>)}
    </div>;
}
