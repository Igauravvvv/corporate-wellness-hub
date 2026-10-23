"use client";

import { useEffect, useRef, useState } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  Sparkles,
  CheckCircle2,
  Flame,
  ArrowRight,
  ShieldCheck,
  Armchair,
  Timer,
  ChevronRight,
  Info,
} from "lucide-react";

export interface StretchStep {
  id: string;
  title: string;
  targetArea: string;
  durationSeconds: number;
  badge: string;
  instructions: string[];
  ergonomicTip: string;
  breathingGuidance: string;
  visualKind: "neck" | "shoulders" | "spine" | "wrists" | "eyes";
}

const FULL_DESK_ROUTINE: StretchStep[] = [
  {
    id: "neck",
    title: "Cervical Neck Release & Lateral Tilt",
    targetArea: "Upper Trapezius & Cervical Spine",
    durationSeconds: 30,
    badge: "30s • Relieves Tech Neck",
    instructions: [
      "Sit upright with your spine tall and shoulders dropped away from ears.",
      "Gently tilt your right ear toward your right shoulder until you feel a soft stretch along the left side of your neck.",
      "Hold for 15 seconds, taking slow belly breaths, then gently repeat on the left side.",
    ],
    ergonomicTip:
      "Avoid pulling your head down with hand pressure. Let gravity and relaxed shoulders do the work.",
    breathingGuidance: "Inhale through your nose (4s) • Exhale tension (4s)",
    visualKind: "neck",
  },
  {
    id: "shoulders",
    title: "Shoulder Blade Retraction & Chest Opener",
    targetArea: "Rhomboids, Pectorals & Posture Align",
    durationSeconds: 30,
    badge: "30s • Counters Rounded Desk Hunch",
    instructions: [
      "Interlace your fingers behind your lower back (or hold the back of your chair).",
      "Roll your shoulders back and gently squeeze your shoulder blades toward each other.",
      "Lift your chest upward while keeping your chin level and jaw relaxed.",
    ],
    ergonomicTip:
      "Desk workers slouch forward an average of 4.2 inches. This counteracts hunching instantly.",
    breathingGuidance: "Deep inhale to expand ribs • Smooth exhale to release",
    visualKind: "shoulders",
  },
  {
    id: "spine",
    title: "Seated Chair Spinal Rotation",
    targetArea: "Thoracic & Lumbar Mobility",
    durationSeconds: 30,
    badge: "30s • Lumbar Decompression",
    instructions: [
      "Plant both feet flat on the floor with knees hip-width apart.",
      "Place your right hand on your left outer knee or chair armrest.",
      "Inhale to lengthen your spine tall, then exhale to gently twist your torso to the left.",
      "Hold for 15 seconds, breathing smoothly, then switch to the right side.",
    ],
    ergonomicTip:
      "Twist from your mid-back (ribcage) rather than wrenching your lower back or neck.",
    breathingGuidance: "Inhale to lengthen tall • Exhale into the gentle twist",
    visualKind: "spine",
  },
  {
    id: "wrists",
    title: "Forearm, Wrist & Keyboard Flexion Release",
    targetArea: "Carpal Tunnel & Flexor Tendons",
    durationSeconds: 15,
    badge: "15s • Prevents Mouse Strain",
    instructions: [
      "Extend your right arm forward with palm facing up.",
      "Use your left hand to gently draw your fingers downward toward your body.",
      "Switch arms at the halfway chime. Shake out both hands loosely.",
    ],
    ergonomicTip:
      "Relieves repetitive strain from typing and continuous trackpad/mouse clutching.",
    breathingGuidance: "Steady, relaxed nasal breathing",
    visualKind: "wrists",
  },
  {
    id: "eyes",
    title: "20-20-20 Ocular Reset & Distance Gaze",
    targetArea: "Ciliary Eye Muscles & Brain Fog",
    durationSeconds: 15,
    badge: "15s • Screen Fatigue Reset",
    instructions: [
      "Shift your gaze away from your monitor completely.",
      "Pick a distant object at least 20 feet (6 meters) away across the room or out a window.",
      "Blink slowly 5 times, then close your eyes gently for the last 5 seconds to re-lubricate.",
    ],
    ergonomicTip:
      "Follows the American Academy of Ophthalmology standard: Every 20 minutes, gaze 20 feet away for 20 seconds.",
    breathingGuidance: "One deep, refreshing breath in and long sigh out",
    visualKind: "eyes",
  },
];

const PRESET_MODES = [
  { id: "full", label: "Full 2-Min Reset", desc: "All 5 desk stretches (120s)", count: 5 },
  { id: "upper", label: "Quick Posture (60s)", desc: "Neck & Shoulders", count: 2 },
  { id: "eyes", label: "Screen Fatigue (45s)", desc: "20-20-20 & Neck", count: 2 },
];

export function ErgonomicDeskStretch() {
  const [activePreset, setActivePreset] = useState<"full" | "upper" | "eyes">("full");
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [stepSecondsLeft, setStepSecondsLeft] = useState(FULL_DESK_ROUTINE[0].durationSeconds);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [completedRoutines, setCompletedRoutines] = useState(0);
  const [justCompleted, setJustCompleted] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Active step list filtered by preset
  const routineSteps: StretchStep[] =
    activePreset === "upper"
      ? FULL_DESK_ROUTINE.slice(0, 2)
      : activePreset === "eyes"
        ? [FULL_DESK_ROUTINE[4], FULL_DESK_ROUTINE[0]]
        : FULL_DESK_ROUTINE;

  const currentStep = routineSteps[activeStepIndex] || routineSteps[0];
  const totalRoutineSeconds = routineSteps.reduce((acc, s) => acc + s.durationSeconds, 0);

  // Calculate elapsed seconds across past completed steps + current step progress
  const pastStepsSeconds = routineSteps
    .slice(0, activeStepIndex)
    .reduce((acc, s) => acc + s.durationSeconds, 0);
  const currentStepElapsed = currentStep.durationSeconds - stepSecondsLeft;
  const totalElapsed = pastStepsSeconds + currentStepElapsed;
  const totalProgressPercent = Math.min(100, Math.round((totalElapsed / totalRoutineSeconds) * 100));

  // Initialize micro-break streak from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("wellness_desk_breaks_today");
        if (stored) {
          const parsed = JSON.parse(stored);
          const today = new Date().toISOString().slice(0, 10);
          if (parsed.date === today) {
            setCompletedRoutines(parsed.count || 0);
          }
        }
      } catch {}
    }
  }, []);

  // Soft Web Audio tone for step transitions
  function playTransitionChime() {
    if (!soundEnabled || typeof window === "undefined") return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.18); // A5
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.85);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.9);
    } catch {}
  }

  // Celebratory gentle chime when routine finishes
  function playCompletionFanfare() {
    if (!soundEnabled || typeof window === "undefined") return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.14);
        gain.gain.setValueAtTime(0.09, ctx.currentTime + idx * 0.14);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.14 + 0.7);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.14);
        osc.stop(ctx.currentTime + idx * 0.14 + 0.75);
      });
    } catch {}
  }

  // Main timer engine
  useEffect(() => {
    if (!isPlaying) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setStepSecondsLeft((prev) => {
        if (prev <= 1) {
          // Current step finished!
          if (activeStepIndex < routineSteps.length - 1) {
            // Advance to next stretch step
            const nextIdx = activeStepIndex + 1;
            setActiveStepIndex(nextIdx);
            playTransitionChime();
            return routineSteps[nextIdx].durationSeconds;
          } else {
            // Entire routine completed!
            setIsPlaying(false);
            setHasStarted(false);
            setJustCompleted(true);
            playCompletionFanfare();
            const newCount = completedRoutines + 1;
            setCompletedRoutines(newCount);
            if (typeof window !== "undefined") {
              try {
                localStorage.setItem(
                  "wellness_desk_breaks_today",
                  JSON.stringify({
                    date: new Date().toISOString().slice(0, 10),
                    count: newCount,
                  }),
                );
              } catch {}
            }
            return 0;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, activeStepIndex, routineSteps, soundEnabled, completedRoutines]);

  function handlePresetChange(preset: "full" | "upper" | "eyes") {
    setActivePreset(preset);
    setIsPlaying(false);
    setHasStarted(false);
    setActiveStepIndex(0);
    setJustCompleted(false);
    const steps =
      preset === "upper"
        ? FULL_DESK_ROUTINE.slice(0, 2)
        : preset === "eyes"
          ? [FULL_DESK_ROUTINE[4], FULL_DESK_ROUTINE[0]]
          : FULL_DESK_ROUTINE;
    setStepSecondsLeft(steps[0].durationSeconds);
  }

  function handleTogglePlay() {
    if (justCompleted) {
      // restart
      setJustCompleted(false);
      setActiveStepIndex(0);
      setStepSecondsLeft(routineSteps[0].durationSeconds);
      setIsPlaying(true);
      setHasStarted(true);
    } else {
      if (!isPlaying) setHasStarted(true);
      setIsPlaying(!isPlaying);
    }
  }

  function handleReset() {
    setIsPlaying(false);
    setHasStarted(false);
    setActiveStepIndex(0);
    setJustCompleted(false);
    setStepSecondsLeft(routineSteps[0].durationSeconds);
  }

  function handleNextStep() {
    if (activeStepIndex < routineSteps.length - 1) {
      const nextIdx = activeStepIndex + 1;
      setActiveStepIndex(nextIdx);
      setStepSecondsLeft(routineSteps[nextIdx].durationSeconds);
      playTransitionChime();
    }
  }

  function handlePrevStep() {
    if (activeStepIndex > 0) {
      const prevIdx = activeStepIndex - 1;
      setActiveStepIndex(prevIdx);
      setStepSecondsLeft(routineSteps[prevIdx].durationSeconds);
    }
  }

  // Format seconds to mm:ss
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <section className="ergonomic-stretch-container" aria-label="Ergonomic Desk Stretch & Micro-Break Station">
      {/* Header with Title and Streak counter */}
      <div className="ergonomic-header">
        <div className="ergonomic-header-info">
          <div className="ergonomic-eyebrow">
            <Armchair size={15} />
            <span>2-MINUTE DESK ERGONOMICS & POSTURE RESET</span>
          </div>
          <h2>Relieve Desk Stiffness & Screen Fatigue</h2>
          <p>
            Targeted micro-stretches designed to relieve tech-neck, rounded shoulders,
            lumbar compression, and eye strain right at your workspace.
          </p>
        </div>

        <div className="ergonomic-header-meta">
          <div className="microbreak-streak-pill" title="Micro-breaks completed today">
            <Flame size={16} className="flame-icon" />
            <div>
              <strong>{completedRoutines}</strong>
              <small>Breaks Today</small>
            </div>
          </div>
          <button
            type="button"
            className="ergonomic-sound-btn"
            onClick={() => setSoundEnabled(!soundEnabled)}
            aria-label={soundEnabled ? "Sound On - Click to mute audio cues" : "Muted - Click to enable audio cues"}
            title={soundEnabled ? "Audio cues active" : "Audio cues muted"}
          >
            {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
            <span>{soundEnabled ? "Sound On" : "Muted"}</span>
          </button>
        </div>
      </div>

      {/* Preset Selector Tabs */}
      <div className="ergonomic-preset-tabs">
        {PRESET_MODES.map((preset) => (
          <button
            key={preset.id}
            type="button"
            className={`ergonomic-preset-btn ${activePreset === preset.id ? "active" : ""}`}
            onClick={() => handlePresetChange(preset.id as "full" | "upper" | "eyes")}
          >
            <strong>{preset.label}</strong>
            <span>{preset.desc}</span>
          </button>
        ))}
      </div>

      {/* Main Interactive Stage */}
      {justCompleted ? (
        <div className="ergonomic-completed-banner">
          <div className="completed-icon-wrapper">
            <CheckCircle2 size={38} />
          </div>
          <div className="completed-copy">
            <h3>Fantastic Desk Reset!</h3>
            <p>
              You relaxed your cervical spine, opened your chest, and relieved
              optical strain. Your body and focus thank you.
            </p>
          </div>
          <button
            type="button"
            className="wellness-button restart-routine-btn"
            onClick={handleReset}
          >
            <RotateCcw size={16} /> Reset Another Break
          </button>
        </div>
      ) : (
        <div className="ergonomic-stage-grid">
          {/* Left Column: Visual Posture & Alignment Graphic */}
          <div className="ergonomic-visual-card">
            <div className="ergonomic-visual-box" data-stretch={currentStep.visualKind}>
              {/* Dynamic Posture SVG Illustration */}
              <div className="posture-svg-wrapper">
                {currentStep.visualKind === "neck" && (
                  <svg viewBox="0 0 160 160" className="posture-svg" aria-hidden="true">
                    <circle cx="80" cy="80" r="70" fill="#e4f4f0" />
                    <circle cx="80" cy="50" r="24" fill="#123c43" />
                    <path
                      d="M50 120 C50 85 110 85 110 120"
                      fill="#1b5e59"
                    />
                    <path
                      d="M80 60 C75 75 75 85 80 95"
                      stroke="#48bb78"
                      strokeWidth="5"
                      strokeLinecap="round"
                    />
                    <path
                      d="M48 45 Q80 25 112 45"
                      stroke="#0d9488"
                      strokeWidth="3"
                      strokeDasharray="4 4"
                      fill="none"
                    />
                    <circle cx="106" cy="46" r="4" fill="#0d9488" />
                  </svg>
                )}

                {currentStep.visualKind === "shoulders" && (
                  <svg viewBox="0 0 160 160" className="posture-svg" aria-hidden="true">
                    <circle cx="80" cy="80" r="70" fill="#e6f0fa" />
                    <circle cx="80" cy="48" r="22" fill="#123c43" />
                    <path
                      d="M40 115 C42 80 118 80 120 115"
                      fill="#1d5ca3"
                    />
                    {/* Chest expansion arrows */}
                    <path
                      d="M60 90 L35 90 M35 90 L45 82 M35 90 L45 98"
                      stroke="#2563eb"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M100 90 L125 90 M125 90 L115 82 M125 90 L115 98"
                      stroke="#2563eb"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}

                {currentStep.visualKind === "spine" && (
                  <svg viewBox="0 0 160 160" className="posture-svg" aria-hidden="true">
                    <circle cx="80" cy="80" r="70" fill="#fef3c7" />
                    <circle cx="80" cy="48" r="22" fill="#123c43" />
                    <path
                      d="M45 120 C48 85 112 85 115 120"
                      fill="#b45309"
                    />
                    {/* Rotational twist arc */}
                    <path
                      d="M52 95 A 32 32 0 0 1 108 95"
                      stroke="#d97706"
                      strokeWidth="4"
                      strokeDasharray="5 4"
                      fill="none"
                    />
                    <polygon points="108,95 100,88 102,102" fill="#d97706" />
                  </svg>
                )}

                {currentStep.visualKind === "wrists" && (
                  <svg viewBox="0 0 160 160" className="posture-svg" aria-hidden="true">
                    <circle cx="80" cy="80" r="70" fill="#f3e8ff" />
                    <rect x="55" y="70" width="50" height="45" rx="8" fill="#7e22ce" />
                    <circle cx="80" cy="46" r="16" fill="#123c43" />
                    <path
                      d="M55 70 L40 50 M105 70 L120 50"
                      stroke="#9333ea"
                      strokeWidth="4"
                      strokeLinecap="round"
                    />
                    <circle cx="40" cy="50" r="6" fill="#a855f7" />
                    <circle cx="120" cy="50" r="6" fill="#a855f7" />
                  </svg>
                )}

                {currentStep.visualKind === "eyes" && (
                  <svg viewBox="0 0 160 160" className="posture-svg" aria-hidden="true">
                    <circle cx="80" cy="80" r="70" fill="#e0f2fe" />
                    {/* Eye illustration */}
                    <path
                      d="M30 80 Q80 40 130 80 Q80 120 30 80 Z"
                      fill="#ffffff"
                      stroke="#0284c7"
                      strokeWidth="3.5"
                    />
                    <circle cx="80" cy="80" r="18" fill="#0369a1" />
                    <circle cx="84" cy="76" r="6" fill="#ffffff" />
                    {/* Distance rays */}
                    <path
                      d="M135 70 L150 65 M135 80 L155 80 M135 90 L150 95"
                      stroke="#38bdf8"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                  </svg>
                )}
              </div>

              {/* Real-time seconds counter badge */}
              <div className="stretch-countdown-chip">
                <Timer size={14} />
                <span>{stepSecondsLeft}s remaining</span>
              </div>
            </div>

            {/* Breathing & Cadence Guidance Pill */}
            <div className="stretch-breathing-pill">
              <Sparkles size={14} className="sparkle-icon" />
              <span>{currentStep.breathingGuidance}</span>
            </div>
          </div>

          {/* Right Column: Step Instructions, Ergonomic Tip & Controls */}
          <div className="ergonomic-details-card">
            <div className="stretch-step-counter">
              <span>
                STEP {activeStepIndex + 1} OF {routineSteps.length}
              </span>
              <span className="stretch-target-tag">{currentStep.targetArea}</span>
            </div>

            <h3 className="stretch-title">{currentStep.title}</h3>

            <div className="stretch-badge-row">
              <span className="stretch-time-badge">{currentStep.badge}</span>
              <span className="stretch-posture-badge">
                <ShieldCheck size={12} /> Posture Certified
              </span>
            </div>

            {/* Step-by-Step Instructions */}
            <ol className="stretch-instruction-list">
              {currentStep.instructions.map((inst, i) => (
                <li key={i}>
                  <span className="step-num">{i + 1}</span>
                  <span>{inst}</span>
                </li>
              ))}
            </ol>

            {/* Ergonomic Insight Note */}
            <div className="ergonomic-tip-callout">
              <Info size={15} />
              <div>
                <strong>Ergonomic Insight:</strong> {currentStep.ergonomicTip}
              </div>
            </div>

            {/* Playback Controls & Progress Bar */}
            <div className="stretch-controls-row">
              <button
                type="button"
                className="stretch-control-btn icon-only"
                onClick={handlePrevStep}
                disabled={activeStepIndex === 0}
                aria-label="Previous stretch"
                title="Previous stretch"
              >
                <SkipBack size={18} />
              </button>

              <button
                type="button"
                className={`wellness-button stretch-play-btn ${isPlaying ? "playing" : ""}`}
                onClick={handleTogglePlay}
              >
                {isPlaying ? (
                  <>
                    <Pause size={17} /> Pause Stretch
                  </>
                ) : (
                  <>
                    <Play size={17} /> {hasStarted ? "Resume Stretch" : "Start Stretch"}
                  </>
                )}
              </button>

              <button
                type="button"
                className="stretch-control-btn icon-only"
                onClick={handleNextStep}
                disabled={activeStepIndex === routineSteps.length - 1}
                aria-label="Next stretch"
                title="Next stretch"
              >
                <SkipForward size={18} />
              </button>

              <button
                type="button"
                className="stretch-control-btn icon-only"
                onClick={handleReset}
                aria-label="Restart routine"
                title="Restart routine"
              >
                <RotateCcw size={17} />
              </button>
            </div>

            {/* Total Routine Progress Bar */}
            <div className="stretch-progress-wrapper">
              <div className="stretch-progress-labels">
                <span>Routine Progress</span>
                <span>
                  {formatTime(totalElapsed)} / {formatTime(totalRoutineSeconds)} ({totalProgressPercent}%)
                </span>
              </div>
              <div className="stretch-progress-track">
                <div
                  className="stretch-progress-fill"
                  style={{ width: `${totalProgressPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Routine Steps Quick Overview Bar */}
      <div className="ergonomic-steps-strip">
        {routineSteps.map((step, idx) => {
          const isDone = idx < activeStepIndex;
          const isCurrent = idx === activeStepIndex;
          return (
            <button
              key={step.id}
              type="button"
              className={`step-strip-item ${isCurrent ? "current" : isDone ? "done" : ""}`}
              onClick={() => {
                setActiveStepIndex(idx);
                setStepSecondsLeft(step.durationSeconds);
                setJustCompleted(false);
              }}
            >
              <div className="step-strip-circle">
                {isDone ? <CheckCircle2 size={13} /> : idx + 1}
              </div>
              <div className="step-strip-text">
                <strong>{step.title.split("&")[0]}</strong>
                <small>{step.durationSeconds}s</small>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
