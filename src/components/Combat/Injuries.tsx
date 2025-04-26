import Collection from "../Collection";
import {Grid, Modal, Paper, Stack} from "@mui/material";
import {Btn, Dropdown, TextInput} from "../Form";
import React, {useCallback, useState} from "react";
import allInjuries from '../../data/injuries.json';
import {DicePool} from "../Roll";
import socket from "../../socket";
import {DiceResultType} from "../../types/dice";
import {summarize} from "../RollResults";
import * as uuid from 'uuid';

const injuryMap: Record<string, InjuryType> = {};
const injuryBuckets: Record<number, InjuryType[]> = {};

allInjuries.forEach(i => {
    injuryMap[i.name] = i;
    if (!injuryBuckets[i.severity])
        injuryBuckets[i.severity] = [];
    injuryBuckets[i.severity].push(i);
});

interface InjuryType {
    severity: number;
    modifier: number;
    name: string;
    description: string;
}

interface InjuryProps extends InjuryType {
    npc?: boolean;
    onRemove: () => void;
}

function Injury({name, description, modifier, severity, onRemove, npc}: InjuryProps) {
    return <Grid item xs={npc ? 12 : 'auto'}><Paper className="injury" style={{minHeight: 40, background: '#311'}}>
        <Btn onClick={onRemove} color="error" style={{float: "right", marginLeft: 10}}>Remove</Btn>
        <strong>{name}:</strong> {description} (Sev: {severity}, Mod: {modifier})
    </Paper></Grid>
}

interface InjuryRoll {
    show: boolean;
    damage: number;
    modifier: number;
    injury: string;
}

interface InjuriesProps {
    id: string;
    minion?: boolean;
    npc?: boolean;
    injuries: string[];
    health: number;
    changeHealth: (hp: number) => void;
    changeInjuries: (injuries: string[]) => void;
}

const rollDefaults: InjuryRoll = {show: false, damage: 1, modifier: 0, injury: allInjuries[0].name};

export default function Injuries({id, injuries, health, changeHealth, changeInjuries, npc = false, minion = false}: InjuriesProps) {
    const [roll, setRoll] = useState<InjuryRoll>(rollDefaults);
    const resetRoll = useCallback(() => setRoll(rollDefaults), []);
    const changeRoll = (k: string, v: any) => setRoll({...roll, [k]: v});

    const damage = roll.damage|0;
    const modifier = roll.modifier|0;

    const rollId = uuid.v4();
    const mapped = injuries.map((i: string, k: number) => ({...injuryMap[i], id: i+k}));
    const diceCount = (damage-Math.max(health,0)) + modifier + mapped.reduce((v, i) => v + i.modifier, 0);

    const rollCallback = (result: DiceResultType, metadata: any) => {
        if (metadata.id !== rollId) return;
        const summary = summarize(result);
        const wounds = minion ? (summary.wound|0) + (summary.minion|0) : (summary.wound|0)
        const severity = Math.min(wounds, 7);

        if(severity > 0 ) {
            const bucket = injuryBuckets[severity];
            changeInjuries([...injuries, bucket[(Math.random()*bucket.length)|0].name]);
        }

        socket.off('roll', rollCallback);
    }

    const takeInjury = () => {
        changeInjuries([...injuries, roll.injury]);
        resetRoll();
    }

    const takeDamage = () => {
        if (damage)
            changeHealth(health - damage);

        if(damage > health && diceCount > 0) {
            socket.on('roll', rollCallback);
            socket.emit('roll', {injury: diceCount}, {id: rollId});
        }

        resetRoll();
    }

    return <>
        <Collection
            id={id}
            npc={npc}
            values={mapped}
            onChange={data => changeInjuries(data.map((i) => (i as InjuryType).name))}
            component={Injury}/>

        <Modal open={roll.show} onClose={resetRoll}>
            <Paper className="paperSmall">
                <Stack spacing={3} textAlign="center">
                    <TextInput label="Damage" type="number" name="damage" values={roll} onChange={changeRoll}/>
                    {damage > health && diceCount > 0 && <TextInput label="Modifier" type="number" name="modifier" values={roll} onChange={changeRoll}/>}
                    {damage > health && diceCount > 0 && <DicePool injury={diceCount} large/>}
                    <Btn onClick={takeDamage}>Take Damage!</Btn>
                    <Dropdown id={"add-injury"} label={"Add Injury"} name={"injury"} values={roll} onChange={changeRoll}
                              options={allInjuries.map(i=> ({id: i.name, name: i.name}))} />
                    <Btn onClick={takeInjury}>Add Injury!</Btn>
                </Stack>
            </Paper>
        </Modal>

        <Grid item>
            <Btn onClick={() => changeRoll("show", true)} fullWidth>Take Damage</Btn>
        </Grid>
    </>;
}
