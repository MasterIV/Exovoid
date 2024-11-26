import {create} from "zustand";

export const useLock = create<boolean>(set => false);
export const setLock = useLock.setState;