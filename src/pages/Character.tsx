import React, {useCallback} from "react";
import Attributes from "../components/Attributes";
import {Grid, Paper, Typography} from "@mui/material";
import {Btn, TextInput} from "../components/Form";
import Skills from "../components/Skills";
import Value from "../components/Value";
import {DicePool} from "../components/Roll";
import CharacterType from "../types/character";
import {DicePoolType} from "../types/dice";
import {
    calculateActionPoints,
    calculateEdge,
    calculateHealth,
    calculateHeft,
    calculateImmunity,
    calculateSpeed
} from "../logic/calculateDerived";

interface CharacterPageProps {
    onChange: (name: string, value: any) => void;
    onRoll: (skill: number, attribute: number, modifier?: number, metadata?: Record<string, any>) => void;
    stats: CharacterType;
    locked?: boolean;
}

const derivedStyles: React.CSSProperties = {
    position: "relative",
    top: "-10px",
    margin: "auto",
    width: "80%",
    padding: 5,
};

export default React.memo(function CharacterPage({stats, onChange, onRoll, locked=false}: CharacterPageProps) {
    const {
        attributes,
        skills,
        currentHealth,
        currentEdge,
        exp,
        image = 'img/avatar.png'
    } = stats;

    const {CON = 0, STR = 0, AGI = 0, INT = 0, PER = 0, COO = 0} = attributes;

    const changeAttribute = useCallback(
        (name: string, value: number) => onChange('attributes', {...attributes, [name]: value}),
        [onChange, attributes]
    );

    const changeSkill = useCallback(
        (name: string, value: number) => onChange('skills', {...skills, [name]: value}),
        [onChange, skills]
    );

    const changeImage = useCallback(() => {
        const url = prompt('Image URL', image);
        if (url) onChange('image', url);
    }, [onChange, image]);

    const vigilance = Math.ceil(3 + (INT + COO) / 3);
    const vigilancePool: DicePoolType = {default: 1, aptitude: vigilance};

    return (<Grid container spacing={2} margin={1} direction="column">
        <Grid item container spacing={2}>
            <Grid item container xs={3} spacing={1} direction="column">
                <Grid item><TextInput label="Name" name="name" values={stats} onChange={onChange}/></Grid>
                <Grid item>
                    <div className="avatar" onClick={changeImage} style={{backgroundImage: `url("${image}")`}}></div>
                </Grid>
            </Grid>
            <Grid item xs={7}>
                <TextInput label="Description" name="description" values={stats} onChange={onChange} multiline
                           rows={8}/>
                <Paper style={derivedStyles}>
                    <Typography align={"center"}>
                        Action Points {calculateActionPoints(stats)},
                        Speed {calculateSpeed(stats)},
                        Heft {calculateHeft(stats)},
                        Cyber-Immunity {calculateImmunity(stats)}
                    </Typography>
                </Paper>
            </Grid>
            <Grid item container xs={2} spacing={1} direction="column">
                <Grid item textAlign='right'>
                    <Value name='currentHealth' width={128} label='Health' mask={` / ${calculateHealth(stats)}`}
                           value={currentHealth} onChange={onChange}/>
                </Grid>
                <Grid item textAlign='right'>
                    <Value name='currentEdge' width={128} label='Edge' mask={` / ${calculateEdge(stats)}`} value={currentEdge}
                           onChange={onChange}/>
                </Grid>
                <Grid item textAlign='right'>
                    <Value name='exp' width={128} label='Exp' value={exp} onChange={onChange}/>
                </Grid>
                <Grid item textAlign='right'>
                    <Btn fullWidth className='roll-btn' onClick={() => onRoll(vigilance, 0, 0, {skill: "Vigilance"})}>
                        Vigilance
                        <DicePool {...vigilancePool} />
                    </Btn>
                </Grid>
            </Grid>
        </Grid>

        <Attributes locked={locked} onChange={changeAttribute} values={attributes}/>
        <Skills locked={locked} onChange={changeSkill} attributes={attributes} skills={skills} onRoll={onRoll}/>
    </Grid>);
});