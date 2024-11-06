import React, {useEffect, useState} from "react";
import {DiceResultType} from "../types/dice";
import * as uuid from 'uuid';
import {Button, Drawer, Modal, Paper, Stack, Typography} from "@mui/material";
import socket from "../socket";
import {DiceSymbol} from "./Roll";
import {useSnackbar} from "notistack";

interface RollResultProps {

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
        .map(r => r.symbols)
        .flat()
        .filter(s => s !== "explosive")
        .forEach(s => summary[s] = 1 + (summary[s] || 0));

    return summary;
}

const RollResultDescription = ({roll}: { roll: RollEntry }) => {
    const noResults = roll.result.every(r => r.symbols.length === 0);

    return (
        <div>
            <strong>{roll.metadata['npc'] || roll.metadata['player']}: {roll.metadata['skill']}</strong>
            {noResults && <div>-</div>}

            {Object.keys(roll.summary).map(((s) => (
                <div key={roll.id + "-" + s}>
                    <span style={{textTransform: 'capitalize'}}>{s}</span>: {roll.summary[s]}
                </div>
            )))}
        </div>
    );
}

export function RollResult({}: RollResultProps) {
    const [rolls, setRolls] = useState<RollEntry[]>([]);
    const [details, setDetails] = useState<RollEntry | null>(null);
    const [drawerOpen, setDrawerDrawerOpen] = useState(false);

    const {enqueueSnackbar} = useSnackbar();

    useEffect(() => {
        socket.on("roll", (result, metadata) => {
            const newRoll = {
                id: uuid.v4(),
                summary: summarize(result),
                result,
                metadata: metadata || {},
            }

            enqueueSnackbar(<RollResultDescription roll={newRoll}/>, {
                variant: 'default',
                action: <Button onClick={() => setDetails(newRoll)}>View</Button>
            });

            setRolls(old => [newRoll, ...old])
        });

        return () => {
            socket.removeAllListeners("roll");
        }
    }, [enqueueSnackbar]);


    return (
        <div className="resultArea">
            <Drawer anchor="right"
                    variant="temporary"
                    ModalProps={{
                        keepMounted: true,
                    }}
                    sx={{
                        width: '300px',
                        flexShrink: 0,
                        '& .MuiDrawer-paper': {
                            width: '300px',
                        },
                    }}
                    open={drawerOpen}
                    onClose={() => setDrawerDrawerOpen(false)}
            >
                <Stack spacing={2} direction="column" margin={2}>
                    {rolls.map(roll => {
                        return (
                            <Paper
                                key={roll.id}
                                onClick={() => setDetails(roll)}
                                sx={{padding: '8px', cursor: 'pointer'}}
                            >
                                <RollResultDescription roll={roll}/>
                            </Paper>
                        )
                    })}
                </Stack>
            </Drawer>

            <Button onClick={() => setDrawerDrawerOpen(true)}>View Dice Rolls</Button>

            <Modal open={details !== null} onClose={() => setDetails(null)}>
                <Paper className="paperLarge">
                    <Typography variant="h5" textAlign="center">
                        {details?.metadata['npc'] || details?.metadata['player']}: {details?.metadata['skill']}
                    </Typography>

                    <div className="rollDetails">
                        {details?.result.map((r, i) => <DiceSymbol key={i} type={r.type} symbols={r.symbols} exploded={r.exploded}/>)}
                    </div>
                </Paper>
            </Modal>
        </div>
    );
}
