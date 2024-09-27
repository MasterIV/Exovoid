import React, {createContext, useCallback, useEffect, useState} from "react";
import {Combatant} from "../types/combat";
import socket from "../socket";
import {randomIni} from "../logic/randomIni";
import CharacterType from "../types/character";
import charToCombatant from "../logic/charToCombatant";
import npcToCombatant from "../logic/npcToCombatant";

export interface InitiativeCorrection {
    currentHealth: number;
}

const UPDATE_DELAY = 2000;
const timers: Record<string, number> = {};

function updateCombatant(updated: Combatant) {
    if (timers[updated.id]) window.clearTimeout(timers[updated.id]);
    timers[updated.id] = window.setTimeout(() => socket.emit("combatant", updated), UPDATE_DELAY);
}

interface InitiativeContextType {
    combatants: Record<string, Combatant>;
    update: (c: Combatant) => void;
    spendAp: (id: string, spend: number) => void;
    reset: () => void;
    round: () => void;
}

export const InitiativeContext = createContext<InitiativeContextType>({
    combatants: {},
    update: c => {},
    spendAp: (id, spend) => {},
    reset: () => {},
    round: () => {},
});

interface InitiativeProviderProps {
    stats: CharacterType;
    children: any;
}

export default function InitiativeProvider({ children, stats }: InitiativeProviderProps) {
    const [combatants, setCombatants] = useState<Record<string, Combatant>>({});

    const update = useCallback((c: Combatant) => {
        setCombatants(old => {
            updateCombatant(c);
            return {...old, [c.id]: c};
        })
    }, []);

    const reset = () => window.confirm("Reset Combat?") && socket.emit("reset");

    const round = () => {
        Object.values(combatants).forEach(c => {
            c.currentAp += c.maxAp + randomIni(c);
            socket.emit("combatant", c);
        });
    }

    const spendAp = useCallback((id: string, spend: number) => {
        setCombatants(old => {
            if(!old[id]) return old;
            const c =  {...old[id], currentAp: old[id].currentAp-spend};
            console.log(c);
            updateCombatant(c);
            return {...old, [id]: c};
        })
    }, []);

    useEffect(() => {
        socket.on('combatant', data => setCombatants(old => ({...old, [data.id]: data})));
        socket.on('reset', () => setCombatants({}));
    }, []);

    // check that health is in sync
    useEffect(() => {
        if(combatants[stats.id] && combatants[stats.id].currentHealth !== stats.currentHealth)
            update(charToCombatant(stats, combatants[stats.id].currentAp));
        stats.npcs?.forEach(npc => {
            if(combatants[npc.id] && combatants[npc.id].currentHealth !== npc.currentHealth)
                update(npcToCombatant(npc, combatants[npc.id].currentAp));
        })
    }, [stats]);

    return <InitiativeContext.Provider value={{combatants, reset, round, update, spendAp}}>
        {children}
    </InitiativeContext.Provider>;
}