"use client";
import { useEffect, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  ArrowLeft,
  Heart,
  Linkedin,
  Eye,
  EyeOff,
  BriefcaseBusiness,
  GraduationCap,
  ShieldCheck,
  Users,
  Trophy,
  MessageCircle,
  LoaderCircle,
} from "lucide-react";
import { getSupabase, isConfigured } from "@/lib/supabase/client";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
const subscribe = () => () => {};
export function SignInPage() {
  const { user, isInitializing } = useInternetIdentity();
  const router = useRouter();
  const [audience, setAudience] = useState<"professional" | "student">(
    "professional",
  );
  const [mode, setMode] = useState<"signin" | "signup" | "code">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [code, setCode] = useState("");
  const [linkedIn, setLinkedIn] = useState<"loading" | "ready" | "unavailable">(
    "loading",
  );
  const expired = useSyncExternalStore(
    subscribe,
    () => new URLSearchParams(window.location.search).has("error"),
    () => false,
  );
  useEffect(() => {
    if (user && !isInitializing) router.replace("/");
  }, [user, isInitializing, router]);
  useEffect(() => {
    const controller = new AbortController();
    if (!isConfigured()) return;
    fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/settings`, {
      headers: { apikey: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY! },
      signal: controller.signal,
    })
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then((data) =>
        setLinkedIn(data.external?.linkedin_oidc ? "ready" : "unavailable"),
      )
      .catch(() => {
        if (!controller.signal.aborted) setLinkedIn("unavailable");
      });
    return () => controller.abort();
  }, []);
  function changeMode(value: typeof mode) {
    setMode(value);
    setSent(false);
    setCode("");
    setError("");
    setPassword("");
  }
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const auth = getSupabase().auth;
      const address = email.trim().toLowerCase();
      if (mode === "signin") {
        const { error } = await auth.signInWithPassword({
          email: address,
          password,
        });
        if (error) throw error;
        router.replace("/");
      } else if (mode === "signup") {
        const { data, error } = await auth.signUp({
          email: address,
          password,
          options: {
            emailRedirectTo: window.location.origin + "/auth/callback",
            data: { member_type: audience },
          },
        });
        if (error) throw error;
        if (data.session) router.replace("/");
        else setSent(true);
      } else {
        const { error } = await auth.signInWithOtp({
          email: address,
          options: {
            shouldCreateUser: false,
            emailRedirectTo: window.location.origin + "/auth/callback",
          },
        });
        if (error) throw error;
        setSent(true);
      }
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setBusy(false);
    }
  }
  async function verify(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const { error } = await getSupabase().auth.verifyOtp({
        email: email.trim().toLowerCase(),
        token: code.trim(),
        type: "email",
      });
      if (error) throw error;
      router.replace("/");
    } catch {
      setError(
        "That code could not be verified. Use the latest email code or request a new email.",
      );
    } finally {
      setBusy(false);
    }
  }
  async function oauth() {
    setBusy(true);
    setError("");
    try {
      const { error } = await getSupabase().auth.signInWithOAuth({
        provider: "linkedin_oidc",
        options: { redirectTo: window.location.origin + "/auth/callback" },
      });
      if (error) throw error;
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "LinkedIn sign-in is unavailable.",
      );
      setBusy(false);
    }
  }
  return (
    <main className="auth-experience">
      <section className="auth-story">
        <div className="auth-logo">
          <span>
            <Heart size={22} />
          </span>
          wellness<span className="brand-dot">.</span>
        </div>
        <div className="auth-story-copy">
          <span className="auth-kicker">MORE THAN WORK. MORE THAN CLASS.</span>
          <h1>
            Your people.
            <br />
            Your interests.
            <br />
            <em>Your kind of place.</em>
          </h1>
          <p>
            Meet beyond the everyday. Find a team, share an idea, or turn a
            small hello into a real connection.
          </p>
        </div>
        <div className="auth-collage">
          <img
            src="/images/community-hero.webp"
            alt="Friends sharing a relaxed break outdoors"
            width="1000"
            height="560"
          />
          <div className="auth-photo-label">
            <span className="connection-dot" /> A little more together.
          </div>
        </div>
        <div className="auth-benefits">
          <span>
            <Trophy size={18} />
            Find your team
          </span>
          <span>
            <Users size={18} />
            Meet your people
          </span>
          <span>
            <MessageCircle size={18} />
            Start a conversation
          </span>
        </div>
      </section>
      <section className="auth-form-side">
        <div className="auth-top-note">
          A space for professionals & students <span>✦</span>
        </div>
        <div className="auth-card">
          <span className="eyebrow">LET’S MAKE ROOM FOR YOU</span>
          <h2>
            {sent
              ? "Check your inbox."
              : mode === "signup"
                ? "Find where you belong."
                : mode === "code"
                  ? "One code. You’re in."
                  : "Welcome to your hub."}
          </h2>
          <p className="auth-subtitle">
            {sent
              ? `We sent a verification email to ${email}.`
              : mode === "signup"
                ? "Create your account and make your first connection."
                : mode === "code"
                  ? "Use your account email to get a sign-in code or link."
                  : "Good company is just a sign-in away."}
          </p>
          {!isConfigured() ? (
            <p role="status">
              Sign-in is being configured. Please check back shortly.
            </p>
          ) : sent ? (
            <>
              <form onSubmit={verify}>
                <label className="field-label" htmlFor="email-code">
                  Email verification code
                </label>
                <input
                  className="code-input"
                  id="email-code"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  pattern="[0-9]{6,10}"
                  minLength={6}
                  maxLength={10}
                  required
                  placeholder="Enter your code"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                />
                <button className="wellness-button auth-submit" disabled={busy}>
                  {busy ? "Verifying…" : "Verify code and continue"}
                  <ArrowRight size={18} />
                </button>
              </form>
              <p className="auth-help">
                If your email contains a confirmation link instead, open it in
                this browser. New accounts must verify their email once.
              </p>
              <button
                className="text-action"
                onClick={() => {
                  setSent(false);
                  setError("");
                  setCode("");
                }}
              >
                <ArrowLeft size={16} /> Back to sign in
              </button>
            </>
          ) : (
            <>
              <div
                className="audience-switch"
                aria-label="Choose your community"
              >
                <button
                  type="button"
                  aria-pressed={audience === "professional"}
                  onClick={() => setAudience("professional")}
                >
                  <BriefcaseBusiness size={18} /> Professional
                </button>
                <button
                  type="button"
                  aria-pressed={audience === "student"}
                  onClick={() => setAudience("student")}
                >
                  <GraduationCap size={19} /> Student
                </button>
              </div>
              <button
                className="linkedin-button"
                onClick={oauth}
                disabled={busy || linkedIn !== "ready"}
              >
                <Linkedin size={21} />
                {linkedIn === "loading"
                  ? "Checking LinkedIn…"
                  : "Continue with LinkedIn"}
                <ArrowUpRightIcon />
              </button>
              {linkedIn === "unavailable" && (
                <p className="provider-status">
                  LinkedIn sign-in is coming soon. Use your email below.
                </p>
              )}
              <div className="auth-divider">
                <span />
                or use your {audience === "student" ? "college" : "work"} email
                <span />
              </div>
              <form onSubmit={submit}>
                <label className="field-label" htmlFor="email">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder={
                    audience === "student"
                      ? "you@college.edu"
                      : "you@company.com"
                  }
                  required
                  maxLength={254}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {mode !== "code" && (
                  <>
                    <label className="field-label" htmlFor="password">
                      {mode === "signup" ? "Create a password" : "Password"}
                    </label>
                    <div className="password-field">
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete={
                          mode === "signup"
                            ? "new-password"
                            : "current-password"
                        }
                        required
                        minLength={mode === "signup" ? 8 : 1}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder={
                          mode === "signup"
                            ? "At least 8 characters"
                            : "Enter your password"
                        }
                      />
                      <button
                        type="button"
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                        aria-pressed={showPassword}
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                  </>
                )}
                {mode === "signin" && (
                  <button
                    type="button"
                    className="auth-recovery"
                    onClick={() => changeMode("code")}
                  >
                    No password yet? Use email access
                  </button>
                )}
                <button
                  className="wellness-button auth-submit"
                  disabled={busy || isInitializing}
                >
                  {busy ? (
                    <>
                      <LoaderCircle size={18} className="spin" /> Please wait…
                    </>
                  ) : (
                    <>
                      {mode === "signup"
                        ? "Create account"
                        : mode === "code"
                          ? "Send sign-in email"
                          : "Sign in"}
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </form>
              <div className="auth-mode-switch">
                {mode === "signin" ? (
                  <>
                    New here?{" "}
                    <button onClick={() => changeMode("signup")}>
                      Create an account
                    </button>
                  </>
                ) : (
                  <button onClick={() => changeMode("signin")}>
                    <ArrowLeft size={15} /> Back to sign in
                  </button>
                )}
              </div>
              {mode === "signup" && (
                <p className="auth-help">
                  Use an email you can access. Your profile type is
                  self-selected and does not verify your employer or college.
                </p>
              )}
            </>
          )}
          {(error || (expired && !sent)) && (
            <p className="signin-error" role="alert">
              {error ||
                "We couldn’t complete email confirmation. Request a new email here, then use its latest link or verification code."}
            </p>
          )}
          <div className="auth-trust">
            <ShieldCheck size={18} />
            <span>
              Your check-ins stay private. Your connections start with consent.
            </span>
          </div>
        </div>
        <p className="auth-bottom-note">
          A little connection. A lot of possibility.
        </p>
      </section>
    </main>
  );
}
function ArrowUpRightIcon() {
  return <ArrowRight size={18} aria-hidden="true" />;
}
