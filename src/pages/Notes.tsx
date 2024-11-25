import React from "react";
import {TableType} from "../types/table";
import CharacterType from "../types/character";

interface NotesPageProps {
    table: TableType;
    character: CharacterType;
    onCharacterChange: (name: string, value: any) => void;
    onTableChange: (name: string, value: any) => void;
}

export default function NotesPage({table, character, onTableChange, onCharacterChange} : NotesPageProps) {
    return (<React.Fragment>
        Notes here!
    </React.Fragment>);
}