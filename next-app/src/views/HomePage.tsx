"use client";
import Link from "next/link";
import { StressBanner } from "@/components/StressBanner";
import { DailyCheckIn } from "@/components/DailyCheckIn";
import { MindfulResetSanctuary } from "@/components/MindfulResetSanctuary";
import {
  ArrowUpRight,
  ArrowRight,
  Users,
  CalendarDays,
  MessageCircle,
  Sparkles,
  Compass,
} from "lucide-react";
import { useLocalProfile } from "@/hooks/useLocalProfile";
import { useGroups } from "@/hooks/useCommunity";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import { groupCategories, getCategory } from "@/lib/groupCategories";

export function HomePage() {
  const profile = useLocalProfile();
  const groups = useGroups();
  const { user } = useInternetIdentity();
  const joined =
    groups.data?.filter((g) =>
      g.group_members.some((m) => m.user_id === user?.id),
    ) ?? [];

  return (
    <div className="member-home">
      {/* Top Global Stress Statistics & Reality */}
      <div className="mb-6 -mx-4 sm:mx-0 rounded-2xl overflow-hidden border border-border/60 shadow-sm" data-ocid="home.stress_banner">
        <StressBanner />
      </div>

      <header className="member-greeting">
        <div>
          <span className="eyebrow">YOUR DAILY DOSE OF CONNECTION</span>
          <h1>
            Good to see you
            {profile?.name ? `, ${profile.name}` : ", Smash Scorer"}.
          </h1>
          <p>Make a little time for the things—and people—you enjoy.</p>
        </div>
        <span className="greeting-mark">
          <Sparkles size={27} />
        </span>
      </header>
      <section className="member-hero">
        <div>
          <span className="hero-pill">
            <span /> YOUR NEXT GOOD THING
          </span>
          <h2>
            Less scrolling.
            <br />
            <em>More belonging.</em>
          </h2>
          <p>
            Find your weekend team, your study circle, or someone who gets your
            favourite hobby.
          </p>
          <Link className="wellness-button" href="/groups">
            Explore your interests <ArrowUpRight size={18} />
          </Link>
        </div>
        <div className="member-hero-image">
          <img
            src="/images/corporate-wellness.jpg"
            alt="Colleagues and friends taking a mindful wellness break together outdoors"
            width="1000"
            height="560"
          />
          <span>
            <Users size={18} /> Better with good company.
          </span>
        </div>
      </section>

      <div className="quick-actions">
        <Link href="/people">
          <span className="mint">
            <Users size={22} />
          </span>
          <div>
            <h3>Meet people</h3>
            <p>Connect, then start a chat</p>
          </div>
          <ArrowUpRight size={18} />
        </Link>
        <Link href="/book-activities">
          <span className="peach">
            <CalendarDays size={22} />
          </span>
          <div>
            <h3>Make a plan</h3>
            <p>Discover or host an activity</p>
          </div>
          <ArrowUpRight size={18} />
        </Link>
        <Link href="/discuss">
          <span className="lilac">
            <MessageCircle size={22} />
          </span>
          <div>
            <h3>Join the conversation</h3>
            <p>Share a thought with the hub</p>
          </div>
          <ArrowUpRight size={18} />
        </Link>
      </div>

      {/* Interactive 60-Second Breathing Reset & Ambient Soundscape Sanctuary */}
      <MindfulResetSanctuary />

      <section className="home-interests">
        <div className="section-title">
          <div>
            <span className="eyebrow">FOLLOW YOUR CURIOSITY</span>
            <h2>What’s your kind of good?</h2>
          </div>
          <Link className="text-action" href="/groups">
            View all groups <ArrowRight size={17} />
          </Link>
        </div>
        <div className="home-category-grid">
          {groupCategories.map((c) => (
            <Link
              key={c.id}
              href={`/groups?category=${c.id}`}
              className={`home-category ${c.color}`}
            >
              <c.icon size={25} />
              <h3>{c.name}</h3>
              <p>{c.examples}</p>
              <ArrowUpRight size={18} />
            </Link>
          ))}
        </div>
      </section>
      <div className="home-bottom-grid">
        <section className="your-groups">
          <div className="section-title">
            <h2>Your groups</h2>
            <Link href="/groups" aria-label="Explore your groups">
              <ArrowUpRight size={20} />
            </Link>
          </div>
          {groups.isPending ? (
            <p>Loading your groups…</p>
          ) : groups.error ? (
            <div>
              <p>Couldn’t load your groups.</p>
              <button className="text-action" onClick={() => groups.refetch()}>
                Try again
              </button>
            </div>
          ) : joined.length ? (
            joined.slice(0, 4).map((g) => {
              const c = getCategory(g.category);
              return (
                <Link
                  className="your-group-row"
                  href={`/groups/${g.slug}`}
                  key={g.id}
                >
                  <span className={c.color}>
                    <c.icon size={20} />
                  </span>
                  <div>
                    <strong>{g.name}</strong>
                    <small>{c.name}</small>
                  </div>
                  <ArrowRight size={17} />
                </Link>
              );
            })
          ) : (
            <div className="small-empty">
              <Compass size={30} />
              <h3>Find a place to start.</h3>
              <p>Join a subgroup and it will appear here for easy access.</p>
              <Link href="/groups" className="text-action">
                Find your first group <ArrowRight size={16} />
              </Link>
            </div>
          )}
        </section>
        <DailyCheckIn />
      </div>
    </div>
  );
}
