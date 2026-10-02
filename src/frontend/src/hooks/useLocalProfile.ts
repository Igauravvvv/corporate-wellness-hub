"use client";
import { useCallback, useSyncExternalStore } from "react";
import { useInternetIdentity } from "./useInternetIdentity";
export type LocalProfile = { name: string; avatar: number; bio: string; interests: string[]; availability: string[]; goal: string };
function subscribe(callback: () => void) {
 window.addEventListener("storage", callback); window.addEventListener("wellness-profile", callback);
 return () => { window.removeEventListener("storage", callback); window.removeEventListener("wellness-profile", callback); };
}
export function profileKey(principal: string) { return `wellness-profile-v2:${principal}`; }
export function useLocalProfile(): LocalProfile | null {
 const { identity } = useInternetIdentity();
 const principal = identity?.getPrincipal().toText();
 const snapshot = useCallback(() => {
   try { return principal ? localStorage.getItem(profileKey(principal)) : null; } catch { return null; }
 }, [principal]);
 const value = useSyncExternalStore(subscribe, snapshot, () => null);
 try { const p = value ? JSON.parse(value) : null; return p && typeof p.name === "string" && p.name.trim().length >= 2 && Number.isInteger(p.avatar) && p.avatar >= 0 && p.avatar < 6 && typeof p.bio === "string" && typeof p.goal === "string" && Array.isArray(p.interests) && p.interests.every((v: unknown) => typeof v === "string") && Array.isArray(p.availability) && p.availability.every((v: unknown) => typeof v === "string") ? p : null; } catch { return null; }
}
export function saveLocalProfile(profile: LocalProfile, principal: string) {
 if (!principal || principal === "2vxsx-fae") throw new Error("Please sign in before saving a profile.");
 localStorage.setItem(profileKey(principal), JSON.stringify(profile)); window.dispatchEvent(new Event("wellness-profile"));
}
