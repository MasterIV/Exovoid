import React, {useState} from "react";
import {WeaponModType} from "../../types/weapon";
import {Button, Menu, MenuItem} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

interface ModSlotProps {
    slot: string;
    available: WeaponModType[];
    installed: WeaponModType | null;
    position: {left: number; top: number};
    disabled: boolean;
    onChange: (slot: string, mod: WeaponModType | null) => void;
}

export default function ModSlot({available, installed, position, disabled, slot, onChange}: ModSlotProps) {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => { setAnchorEl(event.currentTarget); };
    const handleClose = (m: WeaponModType | null) => {
        onChange(slot, m)
        setAnchorEl(null);
    };

    return <>
        {installed ? <Button onClick={handleOpen} variant="outlined" className="mod-slot" style={position}>
            {installed.name}
        </Button> : <Button onClick={handleOpen} variant="outlined" disabled={disabled} className="mod-slot open" style={position}>
            <AddIcon/> {slot}
        </Button>}

        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)} >
            <MenuItem onClick={() => handleClose(null)}>None</MenuItem>
            {available.map(m => <MenuItem key={m.name} onClick={() => handleClose(m)}>{m.name}</MenuItem>)}
        </Menu>
    </>
}