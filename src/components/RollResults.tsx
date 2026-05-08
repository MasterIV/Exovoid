import React, {useEffect, useState} from "react";
import {DiceResultType, PersistentRollEntry} from "../types/dice";
import {Modal, Paper, Typography} from "@mui/material";
import socket from "../socket";
import {DiceSymbol} from "./Roll";
import {Btn} from "./Form";
import {relativeTime} from "../utils/relativeTime";

interface RollResultProps {
    onRoll: (skill: number, attribute: number, modifier?: number, metadata?: Record<string, any>) => void;
}

interface RollEntry {
    id: string;
    timestamp: number;
    result: DiceResultType,
    summary: Record<string, number>;
    metadata: Record<string, any>;
}

function useNow(intervalMs = 30000): number {
    const [now, setNow] = useState(Date.now());
    useEffect(() => {
        const id = setInterval(() => setNow(Date.now()), intervalMs);
        return () => clearInterval(id);
    }, [intervalMs]);
    return now;
}

function capitalize(s: string): string {
    return s.length === 0 ? s : s[0].toUpperCase() + s.slice(1);
}

const SYMBOL_ORDER = [
    'botch', 'success', 'complication', 'trigger',
    'wound', 'minion', 'cyberware', 'adrenaline',
    'xp',
];

function orderSymbols(summary: Record<string, number>): string[] {
    return Object.keys(summary).sort((a, b) => {
        const ia = SYMBOL_ORDER.indexOf(a);
        const ib = SYMBOL_ORDER.indexOf(b);
        return (ia === -1 ? SYMBOL_ORDER.length : ia) - (ib === -1 ? SYMBOL_ORDER.length : ib);
    });
}

export function summarize(result: DiceResultType): Record<string, number> {
    const summary: Record<string, number> = {};

    result
        .filter(r => !r.exploded || !r.symbols.includes('botch'))
        .map(r => r.symbols)
        .flat()
        .filter(s => s !== "explosive")
        .forEach(s => summary[s] = 1 + (summary[s] || 0));

    return summary;
}

function toRollEntry(entry: PersistentRollEntry): RollEntry {
    return {
        id: entry.id,
        timestamp: entry.timestamp,
        result: entry.result,
        summary: summarize(entry.result),
        metadata: entry.metadata || {},
    };
}

export function RollResult({onRoll}: RollResultProps) {
    const [rolls, setRolls] = useState<RollEntry[]>([]);
    const [details, setDetails] = useState<RollEntry|null>(null);
    const now = useNow();

    useEffect(() => {
        socket.removeAllListeners("roll");
        socket.removeAllListeners("rollHistory");
        socket.on("rollHistory", history => {
            setRolls(history.slice().reverse().map(toRollEntry));
        });
        socket.on("roll", entry => {
            setRolls(old => [toRollEntry(entry), ...old]);
        });
    }, []);

    const reRoll = () => {
        const aptitude = details?.result.filter(d => d.type === "aptitude").length ?? 0
        const expertise = details?.result.filter(d => d.type === "expertise").length ?? 0
        onRoll(expertise, aptitude + expertise, 0, {skill: "Re-Roll"})
        setDetails(null)
    }

    return <div className="resultArea">
        {rolls.map(roll => <Paper key={roll.id} className="rollResult" onClick={() => setDetails(roll)}>
            <strong>{roll.metadata['npc'] || roll.metadata['player']} · {roll.metadata['skill']}</strong>
            <span className="rollResultTime" title={new Date(roll.timestamp).toLocaleString()}>
                {relativeTime(roll.timestamp, now)}
            </span>
            {Object.keys(roll.summary).length === 0
                ? <div className="rollResultEmpty">No symbols</div>
                : orderSymbols(roll.summary).map(s => <div key={roll.id+"-"+s} className="rollResultSymbol">
                    <img src={`/img/symbols/${s}.png`} alt={s} width={16} height={16} />
                    <span className="symbolName">{capitalize(s)}</span>
                    <span className="symbolCount">×{roll.summary[s]}</span>
                </div>)}
        </Paper>)}

        <Modal open={details !== null} onClose={() => setDetails(null)}>
            <Paper className="paperLarge">
                <Typography variant={"h4"} textAlign={"center"}>
                    {details?.metadata['npc'] || details?.metadata['player']}: {details?.metadata['skill']}
                </Typography>

                <div className="rollDetails">
                    {details?.result.map((r, i) => <DiceSymbol key={i} type={r.type} symbols={r.symbols} exploded={r.exploded} />)}
                </div>

                {details?.result[0].type === "default" && <div className="reRoll">
                    <Btn onClick={reRoll}>Re-Roll</Btn>
                </div>}
            </Paper>
        </Modal>
    </div>;
}
