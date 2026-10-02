"use client";
import { Toaster } from "@/components/ui/sonner";
import { WellnessLink as Link } from "../components/WellnessLink";
import { AuthGate } from "./AuthGate";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useQueryClient } from "@tanstack/react-query";
import { usePathname } from "../components/AuthNavigation";
import { ArrowUpRight, CalendarDays, Compass, Heart, House, MessageCircle, Users } from "lucide-react";
import { MotionConfig } from "motion/react";
import { Mascot } from "./Mascot";
import { useLocalProfile } from "../hooks/useLocalProfile";
const nav = [{ label: "Overview", href: "/", icon: House }, { label: "Community", href: "/discuss", icon: MessageCircle }, { label: "Groups", href: "/groups", icon: Users }, { label: "Activities", href: "/book-activities", icon: Compass }, { label: "My calendar", href: "/my-sessions", icon: CalendarDays }];
export function Layout({ children }: { children: React.ReactNode }) {
 const path = usePathname() || "/";
 const profile = useLocalProfile();
 const { clear } = useInternetIdentity();
 const queryClient = useQueryClient();
 if (path === "/signin") return <MotionConfig reducedMotion="user"><div className="wellness-shell"><AuthGate>{children}</AuthGate></div></MotionConfig>;
 return <MotionConfig reducedMotion="user"><AuthGate><div className="wellness-shell"><a className="skip-link" href="#main-content">Skip to content</a>
 <aside className="wellness-sidebar"><Link href="/" className="wellness-logo"><span><Heart size={23} /></span>wellness<span className="logo-dot">.</span></Link>
 <nav aria-label="Main navigation">{nav.map(item => <Link key={item.href} href={item.href} aria-current={path === item.href ? "page" : undefined} className={`side-link ${path === item.href ? "active" : ""}`}><item.icon size={19} />{item.label}{path === item.href && <span className="nav-dot" />}</Link>)}</nav>
 
 <Link href="/onboarding" className="sidebar-profile"><Mascot variant={profile?.avatar ?? 0} /><span><strong>{profile?.name || "Your space awaits"}</strong><small>{profile ? "Edit your profile" : "Create your profile"}</small></span><ArrowUpRight size={17} /></Link></aside>
 <div className="wellness-content"><header className="wellness-topbar"><span className="topbar-label">Your wellness hub</span><div className="account-actions"><button className="signout-button" type="button" onClick={() => { clear(); queryClient.clear(); }}>Sign out</button><Link href="/onboarding" className="topbar-account">{profile ? `Hey, ${profile.name}` : "Create an account"}<Mascot variant={profile?.avatar ?? 0} /></Link></div></header><main id="main-content" key={path}>{children}</main><footer className="wellness-footer"><span>Make time for yourself.</span></footer></div>
 <nav className="wellness-mobile-nav" aria-label="Mobile navigation">{nav.slice(0, 4).map(item => <Link key={item.href} href={item.href} aria-current={path === item.href ? "page" : undefined}><item.icon size={20} /><span>{item.label === "Find your people" ? "Groups" : item.label === "Explore activities" ? "Explore" : item.label}</span></Link>)}<Link href="/onboarding"><Mascot variant={profile?.avatar ?? 0} /><span>Profile</span></Link></nav><Toaster richColors position="top-center" /></div></AuthGate></MotionConfig>;
}
