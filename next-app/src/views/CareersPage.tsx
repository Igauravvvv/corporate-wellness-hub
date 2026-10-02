"use client";
import Link from "next/link";
export function CareersPage() {
  return (
    <div className="hub-page">
      <header className="page-heading">
        <span className="eyebrow">GROW WITH US</span>
        <h1>Good work. Good people.</h1>
        <p>
          Interested in helping build a healthier workday? Send the team an
          introduction and the kind of work you’d like to do.
        </p>
      </header>
      <div className="empty-state">
        <h2>Start a conversation.</h2>
        <p>There are no published job openings at the moment.</p>
        <Link href="/contact" className="wellness-button">
          Introduce yourself ↗
        </Link>
      </div>
    </div>
  );
}
