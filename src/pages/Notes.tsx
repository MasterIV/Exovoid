import React from "react";
import useTable from "../state/table";
import {Grid} from "@mui/material";
import {TextInput} from "../components/Form";
import useCharacter from "../state/character";

interface NotesPageProps {

}

export default function NotesPage({} : NotesPageProps) {
    const tableNotes = useTable(state => state.notes || "");
    const updateTable = useTable(state => state.update);
    const characterNotes = useCharacter(state => state.notes || "");
    const updateCharacter = useCharacter(state => state.update)

    return (<Grid container direction="column" spacing={2}>
        <Grid item>
            <TextInput label="Personal Notes" name="notes" values={{notes: characterNotes}} onChange={updateCharacter} multiline rows={16}/>
        </Grid>
        <Grid item>
            <TextInput label="Shared Table Notes" name="notes" values={{notes: tableNotes}} onChange={updateTable} multiline rows={16}/>
        </Grid>
    </Grid>);
}