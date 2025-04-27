import DataTable from "../components/Content/DataTable";
import weapons from "../data/weapons.json";
import weaponMods from "../data/weapon-mods.json";
import armor from "../data/armors.json";
import armorMods from "../data/armor-mods.json";
import cyberware from "../data/cyberware.json";
import talents from "../data/talents.json";
import injuries from "../data/injuries.json";
import malfunctions from "../data/malfunctions.json";
import {Chip, IconButton, Stack, Tooltip} from "@mui/material";
import React from "react";
import InfoIcon from '@mui/icons-material/Info';

interface ContentPageProps {

}

function createChips(data: any) {
    return <Stack spacing={1}>
        {Object.entries(data).map(q => {
            const label = Number(q[1]) > 0 ? `${q[0]}: ${q[1]}` : q[0];
            return <Chip key={q[0]} size="small" label={label} />;
        })}
    </Stack>
}

function tooltip(data: any) {
    return data ? <Tooltip title={data}>
        <IconButton>
            <InfoIcon />
        </IconButton>
    </Tooltip>: "";
}

const renderers = {
    qualities: createChips,
    triggerOptions: createChips,
    specialRules: tooltip,
}

export default function ContentPage({}: ContentPageProps) {
    return <>
        <DataTable title="Weapons" data={weapons} hide={["type", "image", "name", "skill", "damageType"]} renderers={renderers} />
        <DataTable title="Weapons Mods" data={weaponMods} hide={["compatible"]} />
        <DataTable title="Armor" data={armor} hide={["moddingOptions", "name", "type"]} renderers={renderers} />
        <DataTable title="Armor Mods" data={armorMods} />
        <DataTable title="Cyberware" data={cyberware} hide={["modifier", "name"]}/>
        <DataTable title="Talents" data={talents} hide={["representation"]} />
        <DataTable title="Injuries" data={injuries} />
        <DataTable title="Malfunctions" data={malfunctions} />
    </>
}