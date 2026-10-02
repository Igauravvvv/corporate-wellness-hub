"use client";
import Link from "next/link";
export function ComingSoonPage() {
  return (
    <div className="hub-page">
      <header className="page-heading">
        <span className="eyebrow">ROOM TO GROW</span>
        <h1>
          What would make
          <br />
          your workday better?
        </h1>
        <p>
          Co-working spaces are not available for booking yet. Tell us what
          you’d like to see, or organize a gathering with your community today.
        </p>
      </header>
      <div className="hero-photo-wrap">
        <img
          className="hero-photo"
          src="/images/community-hero.webp"
          alt="A welcoming courtyard gathering"
          width="1440"
          height="810"
        />
      </div>
      <div className="page-links">
        <Link href="/contact" className="wellness-button">
          Share an idea ↗
        </Link>
        <Link href="/book-activities" className="text-action">
          Explore activities ↗
        </Link>
      </div>
    </div>
  );
}
