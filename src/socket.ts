import { io } from "socket.io-client";
import { ServerSocket } from "./types/server";
import AccountType from "./types/account";
import CharacterType from "./types/character";

const socket: ServerSocket = io();
let updateTimer: any = null;

const accountName = localStorage.getItem("account.name");
const accountToken = localStorage.getItem("account.token");
if (accountName && accountToken)
  socket.on("connect", () => socket.emit("relogin", accountName, accountToken));

socket.onAny(console.log);

window.onload = function () {
  window.addEventListener("beforeunload", function (e) {
    if (!updateTimer) return;
    const confirmationMessage =
      "There as still unsaved changes on your character, du you really want to leave?";
    (e || window.event).returnValue = confirmationMessage; //Gecko + IE
    return confirmationMessage; //Gecko + Webkit, Safari, Chrome etc.
  });
};

export const saveCharacter = (data: CharacterType) => {
  if (updateTimer) clearTimeout(updateTimer);
  updateTimer = setTimeout(() => {
    socket.emit("save", data);
    updateTimer = null;
  }, 5000);
};

export const onCharacterChange = (
  setCharacter: (data: CharacterType) => void,
) => {
  socket.removeAllListeners("character");
  socket.on("character", setCharacter);
};

export const onAccountChange = (setAccount: (data: AccountType) => void) => {
  socket.removeAllListeners("account");
  socket.on("account", (data) => {
    localStorage.setItem("account.name", data.name);
    localStorage.setItem("account.token", data.token);
    setAccount(data);
  });
};

export const onError = (setError: (data: string) => void) => {
  socket.removeAllListeners("error");
  socket.on("error", setError);
};

export default socket;
