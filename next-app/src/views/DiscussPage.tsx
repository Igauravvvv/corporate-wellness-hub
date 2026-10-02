"use client";
import Link from "next/link";
import { ConversationFeed } from "@/components/ConversationFeed";
export function DiscussPage() {
  return (
    <div className="hub-page">
      <header className="page-heading">
        <span className="eyebrow">THE COMMUNITY LOUNGE</span>
        <h1>A little less alone.</h1>
        <p>
          Small wins, honest questions, and conversations that make a
          difference.
        </p>
        <div className="page-links">
          <Link href="/groups">Find your group ↗</Link>
          <Link href="/psychologists">Find professional support ↗</Link>
        </div>
      </header>
      <div className="discussion-layout">
        <ConversationFeed />
        <aside className="community-note">
          <img
            src="/images/community-hero.webp"
            alt="A relaxed conversation over tea"
            width="600"
            height="340"
          />
          <h3>There’s room for you here.</h3>
          <p>
            Listen with care. Share what feels comfortable. Report anything that
            makes this space feel less welcoming.
          </p>
          <Link href="/book-activities" className="text-action">
            Take the conversation offline ↗
          </Link>
        </aside>
      </div>
    </div>
  );
}
