import {create} from "zustand";
import {Combatant} from "../types/combat";
import useCharacter from "./character";
import charToCombatant from "../logic/charToCombatant";
import npcToCombatant from "../logic/npcToCombatant";
import socket from "../socket";
import {randomIni} from "../logic/randomIni";

interface CombatState {
    combatants: Record<string, Combatant>;
    update: (combatant: Combatant) => void;
    reset: () => void;
    round: () => void;
    spendAp: (id: string, ap: number) => void;
}

const UPDATE_DELAY = 2000;
const timers: Record<string, number> = {};

const useCombat = create<CombatState>((set, get) => ({
    combatants: {},
    update: (c: Combatant) => set(state => {
        if (timers[c.id]) window.clearTimeout(timers[c.id]);
        timers[c.id] = window.setTimeout(() => socket.emit("combatant", c), UPDATE_DELAY);
        return {combatants: {...state.combatants, [c.id]: c}};
    }),
    reset: () => window.confirm("Reset Combat?") && socket.emit("reset"),
    round: () => {
        Object.values(get().combatants).forEach(c => {
            c.currentAp += c.maxAp + randomIni(c);
            socket.emit("combatant", c);
        });
    },
    spendAp: (id: string, ap: number) => {
        const combatant = get().combatants[id];
        if(!combatant) return;
        get().update({...combatant, currentAp: combatant.currentAp-ap});
    },
}));

const setCombatants = (func: (old: Record<string, Combatant>) => Record<string, Combatant>) => {
    useCombat.setState((state) => ({combatants: func(state.combatants)}));
}

socket.on('combatant', data => setCombatants(old => ({...old, [data.id]: data})));
socket.on('reset', () => setCombatants(() => ({})));
socket.on('remove', (id) => setCombatants(old => {
    const updated = {...old};
    delete updated[id];
    return updated;
}));

// check that health is in sync
useCharacter.subscribe(stats => {
    const {combatants, update} = useCombat.getState();
    // sync character
    if(combatants[stats.id] && combatants[stats.id].currentHealth !== stats.currentHealth)
        update(charToCombatant(stats, combatants[stats.id].currentAp));
    // sync npcs
    stats.npcs?.forEach(npc => {
        if(combatants[npc.id] && combatants[npc.id].currentHealth !== npc.currentHealth)
            update(npcToCombatant(npc, combatants[npc.id].currentAp));
    });
})

export default useCombat;