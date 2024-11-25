import React from "react";
import CharacterType from "../types/character";
import useTable from "../state/table";
import {Grid} from "@mui/material";
import {TextInput} from "../components/Form";

interface NotesPageProps {
    character: CharacterType;
    onCharacterChange: (name: string, value: any) => void;
}

export default function NotesPage({ character,  onCharacterChange} : NotesPageProps) {
    const tableNotes = useTable(state => state.notes || "");
    const updateTable = useTable(state => state.update);

    return (<Grid container direction="column" spacing={2}>
        <Grid item>
            <TextInput label="Personal Notes" name="notes" values={character} onChange={onCharacterChange} multiline rows={16}/>
        </Grid>
        <Grid item>
            <TextInput label="Shared Table Notes" name="notes" values={{notes: tableNotes}} onChange={updateTable} multiline rows={16}/>
        </Grid>
    </Grid>);
}