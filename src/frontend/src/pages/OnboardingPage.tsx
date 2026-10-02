"use client";
import { WellnessLink as Link } from "../components/WellnessLink";
import { ArrowLeft, ArrowRight, Check, Sparkles } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { Mascot, mascotNames } from "../components/Mascot";
import { saveLocalProfile, useLocalProfile, type LocalProfile } from "../hooks/useLocalProfile";
const interests = ["Music", "Sports", "Coffee", "Yoga", "Books", "Gaming", "Travel", "Food", "Photography", "Mindfulness", "Movies", "Learning"];
const availability = ["Early mornings", "Lunch breaks", "After work", "Weekends"];
const goals = ["Meet my people", "Feel more balanced", "Try something new", "Build a good habit"];
export function OnboardingPage() {
 const existing = useLocalProfile();
 const { identity } = useInternetIdentity();
 const [ready, setReady] = useState(false);
 useEffect(() => setReady(true), []);
 return ready ? <ProfileBuilder key={identity?.getPrincipal().toText()} existing={existing} /> : <div className="profile-page" aria-busy="true">Loading your space…</div>;
}
function ProfileBuilder({ existing }: { existing: LocalProfile | null }) {
 const { identity } = useInternetIdentity();
 const [profile, setProfile] = useState<LocalProfile>(existing || { name: "", avatar: 0, bio: "", interests: [], availability: [], goal: "" });
 const [step, setStep] = useState(0); const [done, setDone] = useState(false); const [error, setError] = useState("");
 function toggle(field: "interests" | "availability", value: string) { setProfile(p => ({ ...p, [field]: p[field].includes(value) ? p[field].filter(v => v !== value) : [...p[field], value] })); }
 function next() {
  setError("");
  if (step === 0 && profile.name.trim().length < 2) { setError("Choose a name with at least 2 characters."); return; }
  if (step < 2) { setStep(step + 1); return; }
  try { saveLocalProfile({ ...profile, name: profile.name.trim(), bio: profile.bio.trim() }, identity?.getPrincipal().toText() || ""); setDone(true); } catch { setError("Your browser could not save this profile. Please enable local storage and try again."); }
 }
 return <div className="profile-page"><div className="profile-intro"><span className="eyebrow">YOUR SPACE, YOUR WAY</span><h1>{existing ? "A little more you." : "Good to meet you."}</h1><p>Make yourself at home. Start with a name and a little personality.</p></div><div className="profile-grid"><section className="profile-form"><div className="step-track">{["The basics", "Your interests", "Your rhythm"].map((label, i) => <button type="button" key={label} disabled={i > step} onClick={() => { setStep(i); setError(""); }} aria-current={step === i ? "step" : undefined}><span>{i < step ? <Check size={14} /> : `0${i + 1}`}</span>{label}</button>)}</div>
 {done ? <div className="profile-success" role="status"><Sparkles size={36} /><h2>You’re right where you belong.</h2><p>Your profile is saved on this device. Your next good thing is waiting.</p><Link href="/" className="wellness-button">Explore my hub <ArrowRight size={18} /></Link></div> : <form onSubmit={e => { e.preventDefault(); next(); }}><AnimatePresence mode="wait"><motion.div key={step} initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -15 }} transition={{ duration: 0.2 }}>
 {step === 0 && <><h2>How should we know you?</h2><p>A first name or a nickname. Whatever feels like you.</p><label className="field-label" htmlFor="profile-name">Your display name <span>*</span></label><input autoComplete="nickname" id="profile-name" maxLength={30} value={profile.name} onChange={e => setProfile({ ...profile, name: e.target.value })} placeholder="e.g. Alex, or your alter ego" aria-invalid={!!error} aria-describedby={error ? "profile-error" : undefined} /><fieldset><legend>Choose your avatar</legend><div className="avatar-picker">{mascotNames.map((name, i) => <button type="button" key={name} aria-pressed={profile.avatar === i} onClick={() => setProfile({ ...profile, avatar: i })} className={profile.avatar === i ? "selected" : ""}><Mascot variant={i} /><span>{name}</span>{profile.avatar === i && <Check className="avatar-check" size={16} />}</button>)}</div></fieldset><label className="field-label" htmlFor="profile-bio">A little about you <small>optional</small></label><textarea id="profile-bio" maxLength={160} value={profile.bio} onChange={e => setProfile({ ...profile, bio: e.target.value })} placeholder="Coffee enthusiast. Weekend wanderer. Here for the good vibes." rows={3} /><small className="character-count">{profile.bio.length}/160</small></>}
 {step === 1 && <><h2>What lights you up?</h2><p>Pick a few things you love. There’s no wrong combination.</p><div className="interest-picker">{interests.map(item => <button type="button" key={item} aria-pressed={profile.interests.includes(item)} className={profile.interests.includes(item) ? "selected" : ""} onClick={() => toggle("interests", item)}>{item}{profile.interests.includes(item) && <Check size={15} />}</button>)}</div><p className="form-hint">These are optional. You can always change them later.</p></>}
 {step === 2 && <><h2>Find your own rhythm.</h2><p>Make space for good things, when it works for you.</p><fieldset><legend>When are you usually free?</legend><div className="interest-picker">{availability.map(item => <button type="button" key={item} aria-pressed={profile.availability.includes(item)} className={profile.availability.includes(item) ? "selected" : ""} onClick={() => toggle("availability", item)}>{item}{profile.availability.includes(item) && <Check size={15} />}</button>)}</div></fieldset><fieldset><legend>What brings you here?</legend><div className="goal-picker">{goals.map(item => <button type="button" key={item} aria-pressed={profile.goal === item} className={profile.goal === item ? "selected" : ""} onClick={() => setProfile({ ...profile, goal: profile.goal === item ? "" : item })}>{item}<span>{profile.goal === item ? <Check size={16} /> : "+"}</span></button>)}</div></fieldset></>}
 </motion.div></AnimatePresence>{error && <p className="form-error" id="profile-error" role="alert">{error}</p>}<div className="form-actions">{step > 0 ? <button type="button" className="text-action" onClick={() => { setStep(step - 1); setError(""); }}><ArrowLeft size={16} />Back</button> : <Link href="/" className="text-action">Back to the hub</Link>}<button type="submit" className="wellness-button">{step === 2 ? "Save my profile" : "Continue"}<ArrowRight size={17} /></button></div><p className="local-notice">Your preferences are saved for this signed-in account on this device. They do not sync across devices yet.</p></form>}</section>
 <aside className="profile-preview"><span className="eyebrow">YOUR PROFILE</span><div className="preview-mascot"><Mascot variant={profile.avatar} /></div><h2>{profile.name.trim() || "Your name here"}</h2><p>{profile.bio || "A new face. A fresh start. Good things ahead."}</p><div className="preview-interests">{profile.interests.map(item => <span key={item}>{item}</span>)}</div><div className="preview-bottom"><span className="status-dot" />{profile.goal || "Here for a little more good"}</div><small>Be yourself. You’ll fit right in.</small></aside></div></div>;
}
