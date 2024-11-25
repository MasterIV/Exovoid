import {create} from "zustand";
import socket from "../socket";
import CharacterType from "../types/character";
import characterDefaults from "../data/character.json";

const SAVE_DELAY = 5000;

interface CharacterState extends CharacterType {
    update: (name: string, value: any) => void;
}

let updateTimer: any = null;
const useCharacter = create<CharacterState>((set) => ({
    ...characterDefaults,
    update: (name, value) => set(state => {
        if(updateTimer) clearTimeout(updateTimer);
        updateTimer = setTimeout(() => {
            socket.emit("save", {...state, [name]: value});
            updateTimer = null;
        }, SAVE_DELAY);

        return {[name]: value};
    })
}));

socket.removeAllListeners("character");
socket.on("character", useCharacter.setState);

window.addEventListener("beforeunload",  (e) => {
    if (!updateTimer) return;
    const confirmationMessage = 'There as still unsaved changes on your character, du you really want to leave?';
    (e || window.event).returnValue = confirmationMessage; //Gecko + IE
    return confirmationMessage; //Gecko + Webkit, Safari, Chrome etc.
});

export default useCharacter;