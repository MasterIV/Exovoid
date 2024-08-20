import React, {useState} from "react";
import {
    FormControl,
    InputLabel,
    MenuItem,
    Paper,
    Select, Stack,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow
} from "@mui/material";
import * as uuid from 'uuid';
import {Btn, Dropdown} from "./Form";
interface WeaponProps {

}

const weapons = [
    {id: "w1", name: "Cool laser gun"},
    {id: "w2", name: "Cool plasma gun"},
    {id: "w3", name: "Cool projectile gun"},
    {id: "w4", name: "Cool boom gun"},
]

const actions = [
    {id: "a1", name: "Fire"},
    {id: "a2", name: "Cover"},
    {id: "a3", name: "Suppress"},
    {id: "a4", name: "Reload"},
]

export function Weapon({}: WeaponProps) {
    const id = uuid.v4();
    const [data, setData] = useState({
        weapon: 'w1',
        action: 'a1',
    });

    const onChange = (name: string, value: string) => {
        console.log(name, value);
        setData({...data, [name]: value});
    }

    return <Paper sx={{ p: 2 }}><Stack spacing={2}>
        <Stack direction="row" spacing={2}>
            <Dropdown id={"weapon-"+id} label="Weapon Type" name="weapon" values={data} onChange={onChange} options={weapons} />
            <Btn color={"error"}>Remove</Btn>
        </Stack>

        <Table>
            <TableHead>
                <TableRow>
                    <TableCell>Hands</TableCell>
                    <TableCell>Magazine</TableCell>
                    <TableCell>Reload</TableCell>
                    <TableCell>Speed</TableCell>
                    <TableCell>Damage</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Range</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                <TableRow>
                    <TableCell>1</TableCell>
                    <TableCell>22</TableCell>
                    <TableCell>3</TableCell>
                    <TableCell>7</TableCell>
                    <TableCell>4</TableCell>
                    <TableCell>Laser</TableCell>
                    <TableCell>2-25-120</TableCell>
                </TableRow>
            </TableBody>
        </Table>

        <Stack direction="row" spacing={2}>

            <Dropdown id={"action-"+id} label="Action" name="action" values={data} onChange={onChange} options={actions} />
            <Btn>Execute</Btn>
        </Stack>
    </Stack></Paper>;
}