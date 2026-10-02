"use client";
import { useState } from "react";
import { Search } from "lucide-react";
import { useAllSessions, ProgramType } from "@/hooks/useQueries";
import { CreateSessionModal } from "@/components/CreateSessionModal";
import { SessionCard } from "@/components/SessionCard";
import { PROGRAM_CONFIGS, PROGRAM_ORDER } from "@/lib/programConfig";
export function BookActivitiesPage() {
  const sessions = useAllSessions();
  const [now] = useState(() => Date.now());
  const [search, setSearch] = useState("");
  const [type, setType] = useState("all");
  const [available, setAvailable] = useState(false);
  const upcoming =
    sessions.data?.filter(
      (s) =>
        Number(s.dateTime / 1_000_000n) > now &&
        (type === "all" || s.programType === type) &&
        (!available || s.participants.length < Number(s.maxParticipants)) &&
        (s.title + " " + s.description + " " + s.location)
          .toLowerCase()
          .includes(search.toLowerCase()),
    ) ?? [];
  return (
    <div className="hub-page">
      <header className="activity-hero">
        <div>
          <span className="eyebrow">STEP OUT OF WORK MODE</span>
          <h1>
            Make time for
            <br />
            <em>something good.</em>
          </h1>
          <p>A walk, a game, a conversation. Find a little joy in your week.</p>
          <CreateSessionModal />
        </div>
        <img
          src="/images/walk-together.webp"
          width="700"
          height="440"
          alt="Friends walking along a sunny park path"
        />
      </header>
      <div className="group-toolbar">
        <label className="search-field">
          <Search size={18} />
          <input
            type="search"
            aria-label="Search activities"
            placeholder="Search activities or locations…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>
        <select
          className="activity-filter"
          aria-label="Activity type"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="all">All activities</option>
          {PROGRAM_ORDER.map((t) => (
            <option key={t} value={t}>
              {PROGRAM_CONFIGS[t].label}
            </option>
          ))}
        </select>
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={available}
            onChange={(e) => setAvailable(e.target.checked)}
          />
          Spaces available
        </label>
      </div>
      {sessions.isPending ? (
        <div className="empty-state" role="status">
          Loading activities…
        </div>
      ) : sessions.error ? (
        <div className="error-box" role="alert">
          <p>{sessions.error.message}</p>
          <button onClick={() => sessions.refetch()}>Retry</button>
        </div>
      ) : !upcoming.length ? (
        <div className="empty-state">
          <h2>Make the first move.</h2>
          <p>
            No upcoming activities match yet. Start something you’d love to
            join.
          </p>
          <div className="mt-5">
            <CreateSessionModal defaultType={ProgramType.meetup} />
          </div>
        </div>
      ) : (
        <div className="live-groups-grid">
          {upcoming.map((s, i) => (
            <SessionCard key={s.id.toString()} session={s} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
