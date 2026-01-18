import { createContext } from 'svelte';

export const [getDidContext, setDidContext] = createContext<string>();
export const [getHandleContext, setHandleContext] = createContext<string>();
export const [getIsMobile, setIsMobile] = createContext<() => boolean>();
export const [getCanEdit, setCanEdit] = createContext<() => boolean>();
export const [getAdditionalUserData, setAdditionalUserData] =
	createContext<Record<string, unknown>>();
