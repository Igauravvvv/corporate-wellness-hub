"use client";
import Link from "next/link";
export function MembershipPage() {
  return (
    <div className="hub-page">
      <header className="page-heading">
        <span className="eyebrow">YOUR COMMUNITY</span>
        <h1>Belonging starts here.</h1>
        <p>
          Your account gives you access to groups, conversations, activity
          planning, and private daily check-ins.
        </p>
      </header>
      <div className="composer">
        <h2>Looking for a hub for your team?</h2>
        <p>
          Tell us about your organization and the experience you want to create.
          The team can discuss access and setup with you.
        </p>
        <div className="composer-actions">
          <Link href="/contact" className="wellness-button">
            Contact the team ↗
          </Link>
          <Link href="/groups" className="text-action">
            Explore your groups
          </Link>
        </div>
      </div>
    </div>
  );
}
