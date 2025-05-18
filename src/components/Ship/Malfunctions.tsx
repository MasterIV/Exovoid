import Collection from "../Collection";
import {Grid, Modal, Paper, Stack} from "@mui/material";
import {Btn, Dropdown, TextInput} from "../Form";
import React, {useCallback, useState} from "react";
import allMalfunctions from '../../data/malfunctions.json';
import {DicePool} from "../Roll";
import socket from "../../socket";
import {DiceResultType} from "../../types/dice";
import {summarize} from "../RollResults";
import * as uuid from 'uuid';

const malfunctionMap: Record<string, MalfunctionType> = {};
const malfunctionBuckets: Record<number, MalfunctionType[]> = {};

allMalfunctions.forEach(i => {
    malfunctionMap[i.name] = i;
    if (!malfunctionBuckets[i.severity])
        malfunctionBuckets[i.severity] = [];
    malfunctionBuckets[i.severity].push(i);
});

interface MalfunctionType {
    severity: number;
    modifier: number;
    name: string;
    description: string;
}

interface MalfunctionProps extends MalfunctionType {
    onRemove: () => void;
}

function Malfunction({name, description, modifier, severity, onRemove}: MalfunctionProps) {
    return <Grid item><Paper className="injury" style={{minHeight: 40, background: '#311'}}>
        <Btn onClick={onRemove} color="error" style={{float: "right", marginLeft: 10}}>Remove</Btn>
        <strong>{name}:</strong> {description} (Sev: {severity}, Mod: {modifier})
    </Paper></Grid>
}

interface MalfunctionRoll {
    show: boolean;
    damage: number;
    modifier: number;
    malfunction: string;
}

interface MalfunctionsProps {
    id: string;
    malfunctions: string[];
    hull: number;
    changeHull: (hull: number) => void;
    changeMalfunctions: (malfunctions: string[]) => void;
}

const rollDefaults: MalfunctionRoll = {show: false, damage: 1, modifier: 0, malfunction: allMalfunctions[0].name};

export default function Malfunctions({id, malfunctions, hull, changeHull, changeMalfunctions}: MalfunctionsProps) {
    const [roll, setRoll] = useState<MalfunctionRoll>(rollDefaults);
    const resetRoll = useCallback(() => setRoll(rollDefaults), []);
    const changeRoll = (k: string, v: any) => setRoll({...roll, [k]: v});

    const damage = roll.damage|0;
    const modifier = roll.modifier|0;

    const rollId = uuid.v4();
    const mapped = malfunctions.map((i: string, k: number) => ({...malfunctionMap[i], id: i+k}));
    const diceCount = (damage-Math.max(hull,0)) + modifier + mapped.reduce((v, i) => v + i.modifier, 0);

    const rollCallback = (result: DiceResultType, metadata: any) => {
        if (metadata.id !== rollId) return;
        const summary = summarize(result);
        const wounds = summary.wound|0;
        const severity = Math.min(wounds, 7);

        if(severity > 0 ) {
            const bucket = malfunctionBuckets[severity];
            changeMalfunctions([...malfunctions, bucket[(Math.random()*bucket.length)|0].name]);
        }

        socket.off('roll', rollCallback);
    }

    const takeMalfunction = () => {
        changeMalfunctions([...malfunctions, roll.malfunction]);
        resetRoll();
    }

    const takeDamage = () => {
        if (damage)
            changeHull(hull - damage);

        if(damage > hull && diceCount > 0) {
            socket.on('roll', rollCallback);
            socket.emit('roll', {injury: diceCount}, {id: rollId});
        }

        resetRoll();
    }

    return <>
        <Collection
            id={id}
            values={mapped}
            onChange={data => changeMalfunctions(data.map((i) => (i as MalfunctionType).name))}
            component={Malfunction}/>

        <Modal open={roll.show} onClose={resetRoll}>
            <Paper className="paperSmall">
                <Stack spacing={3} textAlign="center">
                    <TextInput label="Damage" type="number" name="damage" values={roll} onChange={changeRoll}/>
                    {damage > hull && diceCount > 0 && <TextInput label="Modifier" type="number" name="modifier" values={roll} onChange={changeRoll}/>}
                    {damage > hull && diceCount > 0 && <DicePool injury={diceCount} large/>}
                    <Btn onClick={takeDamage}>Take Damage!</Btn>
                    <Dropdown id={"add-malfunction"} label={"Add Malfunction"} name={"malfunction"} values={roll} onChange={changeRoll}
                              options={allMalfunctions.map(i=> ({id: i.name, name: i.name}))} />
                    <Btn onClick={takeMalfunction}>Add Malfunction!</Btn>
                </Stack>
            </Paper>
        </Modal>

        <Grid item>
            <Btn onClick={() => changeRoll("show", true)} fullWidth>Take Damage</Btn>
        </Grid>
    </>;
}
