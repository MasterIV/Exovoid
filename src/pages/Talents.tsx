import React, {useCallback, useState} from "react";
import Career, {getCareerTalents} from "../components/Career";
import careers from "../data/classes.json";
import talents from '../data/talents.json';
import {Grid, Paper, Typography} from "@mui/material";
import {Btn, Dropdown} from "../components/Form";
import useCharacter from "../state/character";

const careerMap: Record<string, any> = {};
careers.forEach(c => careerMap[c.name] = c);

const talentMap: Record<string, string> = {};
talents.forEach(t => talentMap[t.talent] = t.description);

interface TalentPageProps {
    locked?: boolean;
}

interface TalentPageState {
    class: string;
    talent: string;
}

export default function TalentPage({locked}: TalentPageProps) {
    const onChange = useCharacter(state => state.update);
    const classes = useCharacter(state => state.classes);
    const characterTalents = useCharacter(state => state.talents);
    
    const [values, setValues] = useState<TalentPageState>({class: careers[0].name, talent: talents[0].talent});
    const changeValues = useCallback((k: string, v: string) => setValues(old => ({...old, [k]: v})), []);

    const selectTalent = useCallback((t: string[]) => onChange('talents', t), [onChange])
    const classTalents = classes.map(c => getCareerTalents(c, careerMap[c].talents)).flat();
    const freeTalents = characterTalents.filter(t => !classTalents.includes(t));

    const removeClass = useCallback((n: string) => onChange('classes', classes.filter(c => c !== n)), [classes]);
    const removeTalent = useCallback((n: string) => onChange('talents', characterTalents.filter(t => t !== n)), [characterTalents]);
    const addCareer = () => onChange('classes', [...classes, values.class]);
    const addTalent= () => onChange('talents', [...characterTalents, values.talent]);

    return (<Grid container spacing={2} direction="column">
        {freeTalents.length > 0 && <Grid item>
            <Paper className="career"><Grid container spacing={2}>
                {freeTalents.map(t => <Grid xs={3} item key={t}><Paper className={"talent"}>
                    <Btn size="small" style={{float: "right"}}
                         disabled={locked} color="error"
                         onClick={() => window.confirm("Remove talent?") && removeTalent(t)}>Remove</Btn>
                    <Typography fontWeight="bold">{t}</Typography>
                    <Typography variant="body2">{talentMap[t]}</Typography>
                </Paper></Grid>)}
        </Grid></Paper>
        </Grid>}

        <Grid item container spacing={2} alignItems="center">
            <Grid item xs={8}><Dropdown
                id="talent"
                label="Talent"
                name="talent"
                values={values}
                onChange={changeValues}
                options={talents.map(c => ({id: c.talent, name: c.talent}))} /></Grid>
            <Grid item xs={4}><Btn onClick={addTalent} fullWidth>Add Talent</Btn></Grid>
        </Grid>

        {classes.map(c => <Grid key={c} item>
            <Career {...careerMap[c]}
                locked={locked}
                    onChange={selectTalent}
                    onRemove={removeClass}
                    acquiredTalents={characterTalents || []}/>
        </Grid>)}

        <Grid item container spacing={2} alignItems="center">
            <Grid item xs={8}><Dropdown
                id="class"
                label="Class"
                name="class"
                values={values}
                onChange={changeValues}
                options={careers.map(c => ({id: c.name, name: c.name}))} /></Grid>
            <Grid item xs={4}><Btn onClick={addCareer} fullWidth>Add Class</Btn></Grid>
        </Grid>
    </Grid>);
}
