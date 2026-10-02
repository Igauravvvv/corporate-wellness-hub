"use client";
import { usePathname, useRouter } from "../components/AuthNavigation";
import { useEffect, type ReactNode } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useLocalProfile } from "../hooks/useLocalProfile";

/** UI gate only: backend methods must independently authorize the caller. */
export function AuthGate({ children }: { children: ReactNode }) {
  const { identity, isInitializing } = useInternetIdentity();
  const profile = useLocalProfile();
  const path = usePathname();
  const router = useRouter();
  const publicPage = path === "/signin";
  const needsProfile = !!identity && !profile && path !== "/onboarding";
  useEffect(() => {
    if (isInitializing || publicPage) return;
    if (!identity) router.replace("/signin");
    else if (needsProfile) router.replace("/onboarding");
  }, [identity, isInitializing, needsProfile, publicPage, router]);
  if (publicPage) return children;
  if (isInitializing || !identity || needsProfile) return <div className="auth-loading" role="status">{isInitializing ? "Checking your session…" : "Taking you to your account…"}</div>;
  return children;
}
