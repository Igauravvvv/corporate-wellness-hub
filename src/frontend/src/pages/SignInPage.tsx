"use client";
import { useRouter } from "../components/AuthNavigation";
import { ArrowRight, Heart, Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useLocalProfile } from "../hooks/useLocalProfile";
import { Mascot } from "../components/Mascot";
export function SignInPage() {
  const { identity, login, loginError, isLoggingIn, isInitializing } = useInternetIdentity();
  const profile = useLocalProfile();
  const router = useRouter();
  useEffect(() => { if (identity && !isInitializing) router.replace(profile ? "/" : "/onboarding"); }, [identity, isInitializing, profile, router]);
  return <div className="signin-page"><div className="signin-brand"><Heart size={25} /> wellness.</div>
    <div className="signin-grid"><section className="signin-welcome"><h1>Your people.<br /><em>Your space.</em></h1><p>Sign in to find your groups, join activities, and make this space yours.</p><div className="signin-characters"><Mascot variant={1} /><Mascot variant={0} /></div></section>
    <section className="signin-card"><h2>Welcome to the hub.</h2><p>Everyone signs in before entering. New here? You can create an Internet Identity through the same button.</p>
      <button type="button" className="wellness-button" onClick={login} disabled={isInitializing || isLoggingIn || !!identity}>{isInitializing || isLoggingIn ? <><Loader2 className="animate-spin" size={20} />{isInitializing ? "Preparing sign-in…" : "Complete sign-in in the popup…"}</> : <>Sign in or create an account <ArrowRight size={20} /></>}</button>
      {loginError && <div className="signin-error" role="alert"><p>{loginError.message}</p><button type="button" onClick={() => window.location.reload()}>Reload sign-in</button></div>}
      <p className="signin-help">Internet Identity opens in a separate window. Finish signing in there to continue.</p><p className="signin-note">Login is connected. Groups, discussions, and bookings still use demo data; profile preferences are saved on this device.</p>
    </section></div></div>;
}
