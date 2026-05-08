import React, {useState} from "react";
import {Modal, Paper, Stack, Typography} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import {DiceCounter} from "./Roll";
import {Btn, TextInput} from "./Form";
import {DicePoolType} from "../types/dice";
import {emptyPool} from "../logic/dicePool";
import socket from "../socket";
import dice from "../data/dice.json";

type DiceKey = keyof DicePoolType;

const diceTypes = Object.keys(dice) as DiceKey[];

const emptyState: DicePoolType = {default: 0, aptitude: 0, expertise: 0, injury: 0};

export function ManualRoll() {
    const [open, setOpen] = useState(false);
    const [pool, setPool] = useState<DicePoolType>(emptyState);
    const [label, setLabel] = useState("");

    const close = () => {
        setOpen(false);
        setPool(emptyState);
        setLabel("");
    };

    const adjust = (type: DiceKey, delta: number) =>
        setPool(prev => ({...prev, [type]: Math.max(0, (prev[type] ?? 0) + delta)}));

    const submit = () => {
        const payload: DicePoolType = {};
        diceTypes.forEach(t => {
            const count = pool[t] ?? 0;
            if (count > 0) payload[t] = count;
        });
        socket.emit("roll", payload, {skill: label.trim() || "Custom Roll"});
        close();
    };

    return <>
        <Btn fullWidth className="roll-btn" variant="outlined" onClick={() => setOpen(true)}>
            Custom Roll
        </Btn>

        <Modal open={open} onClose={close}>
            <Paper className="paperSmall">
                <Stack spacing={3}>
                    <Typography variant="h6" textAlign="center">Custom Roll</Typography>

                    <TextInput name="label" label="Roll name" values={{label}} onChange={(_, v) => setLabel(v)} />

                    <Stack direction="row" justifyContent="space-evenly">
                        {diceTypes.map(type => (
                            <Stack key={type} direction="column" alignItems="center" spacing={2}>
                                <Btn variant="outlined" sx={{minWidth: 0, padding: "6px 14px"}}
                                     onClick={() => adjust(type, 1)}>
                                    <AddIcon />
                                </Btn>
                                <DiceCounter type={type} count={pool[type] ?? 0} large />
                                <Btn variant="outlined" sx={{minWidth: 0, padding: "6px 14px"}}
                                     disabled={(pool[type] ?? 0) < 1}
                                     onClick={() => adjust(type, -1)}>
                                    <RemoveIcon />
                                </Btn>
                            </Stack>
                        ))}
                    </Stack>

                    <Btn disabled={emptyPool(pool)} onClick={submit}>Roll!</Btn>
                </Stack>
            </Paper>
        </Modal>
    </>;
}
