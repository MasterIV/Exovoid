import React from "react";
import {Career} from "../components/Career";
import careers  from "../data/classes.json";
import {Grid} from "@mui/material";
import CharacterType from "../types/character";

interface TalentPageProps {
    onChange: (name: string, value: any) => void;
    stats: CharacterType
}

export default function TalentPage({} : TalentPageProps) {
    return (<Grid container spacing={2} margin={1} direction="column">
        {careers.map(c => <Grid key={c.name} item><Career {...c}/></Grid>)}
    </Grid>);
}