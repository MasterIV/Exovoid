import React, {useEffect, useState} from "react";
import {DiceResultType} from "../types/dice";
import * as uuid from 'uuid';
import {Modal, Paper, Typography} from "@mui/material";
import socket from "../socket";
import {DiceSymbol} from "./Roll";
import {Btn} from "./Form";

interface RollResultProps {
    onRoll: (skill: number, attribute: number, modifier?: number, metadata?: Record<string, any>) => void;
}

interface RollEntry {
    id: string;
    result: DiceResultType,
    summary: Record<string, number>;
    metadata: Record<string, any>;
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

export function RollResult({onRoll}: RollResultProps) {
    const [rolls, setRolls] = useState<RollEntry[]>([]);
    const [details, setDetails] = useState<RollEntry|null>(null);

    useEffect(() => {
        socket.removeAllListeners("roll");
        socket.on("roll", (result, metadata) => {
            setRolls(old => [{
                id: uuid.v4(),
                summary: summarize(result),
                result,
                metadata: metadata || {},
            }, ...old])
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
            <strong>{roll.metadata['npc'] || roll.metadata['player']}: {roll.metadata['skill']}</strong>
            {Object.keys(roll.summary).map(((s) => <div key={roll.id+"-"+s}>{s}: {roll.summary[s]}</div>))}
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
