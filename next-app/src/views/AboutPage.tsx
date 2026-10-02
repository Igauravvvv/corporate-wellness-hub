"use client";
import Link from "next/link";
export function AboutPage() {
  return (
    <div className="hub-page">
      <header className="activity-hero">
        <div>
          <span className="eyebrow">THE HUMAN SIDE OF WORK</span>
          <h1>
            A little more
            <br />
            <em>connection.</em>
          </h1>
          <p>
            Wellness is made of small moments: a conversation, a shared
            interest, a reason to step outside.
          </p>
          <Link className="wellness-button" href="/groups">
            Find your people ↗
          </Link>
        </div>
        <img
          src="/images/walk-together.webp"
          alt="Friends making time for a walk"
          width="1200"
          height="675"
        />
      </header>
      <div className="live-groups-grid">
        {[
          [
            "Connect",
            "Find groups that share your interests and make room for honest conversation.",
          ],
          ["Make time", "Create and join activities that fit around your day."],
          [
            "Check in",
            "Notice how you feel with a daily check-in that stays private to your account.",
          ],
        ].map(([title, text]) => (
          <article className="provider-card" key={title}>
            <h2>{title}</h2>
            <p>{text}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
