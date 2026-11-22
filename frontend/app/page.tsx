/**
 * Root Landing Page — AdaptiveLearn Project Showcase
 * Dark robotic/monospace engineering theme.
 * No auth gate: publicly accessible.
 */
'use client';

import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Maximize2, X, Terminal, Database, ArrowRight, Zap } from 'lucide-react';

interface ArchitectureCard {
  id: string;
  tag: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  accentClass: string;
  borderHoverClass: string;
  icon: "terminal" | "zap" | "database";
}

const ARCHITECTURE_CARDS: ArchitectureCard[] = [
  {
    id: "client-to-edge",
    tag: "[FLOW: CLIENT_TO_EDGE_PIPELINE]",
    description:
      "Client requests, CDN edge delivery, reverse proxy, and FastAPI routing.",
    imageSrc: "/diagrams/client-to-edge-pipeline.png",
    imageAlt: "AdaptiveLearn Client to Edge Pipeline Architecture Diagram",
    accentClass: "text-emerald-400",
    borderHoverClass: "hover:border-emerald-500/50",
    icon: "terminal",
  },
  {
    id: "time-checkpoints",
    tag: "[RUNTIME: TIME_SYNCHRONIZED_CHECKPOINTS]",
    description:
      "Timestamp-based quiz interception with state synchronization.",
    imageSrc: "/diagrams/time-synchronized-checkpoints.png",
    imageAlt: "AdaptiveLearn Time Synchronized Checkpoints Sequence Diagram",
    accentClass: "text-amber-400",
    borderHoverClass: "hover:border-amber-500/50",
    icon: "zap",
  },
  {
    id: "er-schema",
    tag: "[DATABASE: ER_SCHEMA & EVENT_TRACKING]",
    description:
      "User performance metrics, attempt logs, and role-based data partitioning.",
    imageSrc: "/diagrams/er-schema-event-tracking.png",
    imageAlt: "AdaptiveLearn ER Schema and Event Tracking Database Diagram",
    accentClass: "text-sky-400",
    borderHoverClass: "hover:border-sky-500/50",
    icon: "database",
  },
];

function CardIcon({
  type,
  className,
}: {
  type: ArchitectureCard["icon"];
  className: string;
}) {
  if (type === "terminal") return <Terminal className={className} />;
  if (type === "zap") return <Zap className={className} />;
  return <Database className={className} />;
}

export default function LandingPage() {
  const router = useRouter();
  const [activeDiagram, setActiveDiagram] = useState<ArchitectureCard | null>(
    null
  );

  useEffect(() => {
    if (!activeDiagram) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveDiagram(null);
    };

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeDiagram]);
  return (
    <div className="min-h-screen bg-black text-zinc-100 font-mono selection:bg-emerald-500/30">

      {/* Subtle grid background */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(39,39,42,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(39,39,42,0.35) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6 pb-16">

        {/* ── HEADER ─────────────────────────────────────────────────────── */}
        <header className="flex items-center justify-between py-5 border-b border-zinc-800/80">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold tracking-widest text-zinc-100 uppercase">
              ADAPTIVE_LEARN
            </span>
            <span className="text-zinc-600 text-xs">{`// v1.0`}</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs text-emerald-400 tracking-wider">SYSTEM ONLINE</span>
            </div>
            <button
              onClick={() => router.push('/auth')}
              className="flex items-center gap-1.5 px-4 py-1.5 border border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-white text-xs tracking-widest uppercase transition-all duration-200 hover:bg-zinc-900"
            >
              <span>[</span>
              <span>AUTHENTICATE_</span>
              <span>]</span>
            </button>
          </div>
        </header>

        {/* ── SECTION 01: HERO ───────────────────────────────────────────── */}
        <section className="pt-20 pb-16 border-b border-zinc-800/80">
          {/* Section tag */}
          <p className="text-xs text-zinc-500 tracking-widest mb-6">01 // NEXT-GEN ADAPTIVE LEARNING ENGINE</p>

          {/* Main headline */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-tight text-zinc-50 uppercase mb-8 max-w-4xl">
            Micro-Learning.<br />
            Real-Time Assessment.<br />
            <span className="text-emerald-400">Adaptive Progression.</span>
          </h1>

          {/* Elevator pitch */}
          <p className="text-sm text-zinc-400 leading-relaxed max-w-2xl mb-10">
            An intelligent TikTok-style vertical video learning platform with inline contextual checkpoints,
            real-time knowledge evaluation, and dynamic pedagogical feedback.
          </p>

          {/* Spec bar */}
          <div className="flex flex-wrap gap-0 border border-zinc-800/80 w-fit">
            {[
              { label: 'LATENCY', value: '<50ms' },
              { label: 'ENGINE', value: 'FASTAPI + NEXT.JS' },
              { label: 'MODEL', value: 'ADAPTIVE QUIZ RUNTIME' },
            ].map((spec, i) => (
              <div
                key={spec.label}
                className={`flex items-center gap-3 px-5 py-3 ${i < 2 ? 'border-r border-zinc-800/80' : ''}`}
              >
                <span className="text-zinc-600 text-xs tracking-widest">{spec.label}:</span>
                <span className="text-zinc-200 text-xs font-bold tracking-wider">{spec.value}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── SECTION 02: SYSTEM ARCHITECTURE ───────────────────────────── */}
      <section className="py-16 border-b border-zinc-800/80">
        <div className="mb-10">
          <p className="text-xs text-zinc-500 tracking-widest mb-2">
            02 // SYSTEM_ARCHITECTURE &amp; DESIGN_FLOW
          </p>
          <p className="text-xs text-zinc-600 max-w-xl leading-relaxed">
            High-level architectural breakdown of ingestion, video delivery, and
            interactive evaluation.
          </p>
        </div>

        {/* Bento cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {ARCHITECTURE_CARDS.map((card) => (
            <div
              key={card.id}
              className="border border-zinc-800/80 bg-zinc-950/40 p-5 flex flex-col gap-4"
            >
              <div className="flex items-center gap-2">
                <CardIcon
                  type={card.icon}
                  className={`w-3.5 h-3.5 ${card.accentClass}`}
                />
                <span className="text-xs font-bold text-zinc-300 tracking-wider">
                  {card.tag}
                </span>
              </div>

              {/* Clickable diagram preview */}
              <button
                type="button"
                onClick={() => setActiveDiagram(card)}
                aria-label={`Expand ${card.tag} diagram`}
                className={`group relative border border-zinc-800 bg-zinc-950 rounded-lg overflow-hidden aspect-[4/3] w-full cursor-zoom-in transition-colors ${card.borderHoverClass} focus:outline-none focus:ring-1 focus:ring-zinc-500`}
              >
                <Image
                  src={card.imageSrc}
                  alt={card.imageAlt}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-zinc-950/0 group-hover:bg-zinc-950/30 transition-colors flex items-end justify-end p-2.5">
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity inline-flex items-center gap-1.5 rounded bg-zinc-950/90 border border-zinc-700/80 px-2 py-1 font-mono text-[10px] text-zinc-300">
                    <Maximize2 className={`w-3 h-3 ${card.accentClass}`} />
                    EXPAND
                  </span>
                </div>
              </button>

              <p className="text-xs text-zinc-600 leading-relaxed">
                {card.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── POPUP LIGHTBOX MODAL ──────────────────────────────────────── */}
      {activeDiagram && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={activeDiagram.tag}
          onClick={() => setActiveDiagram(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 sm:p-8"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-5xl border border-zinc-800 bg-zinc-950 rounded-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
          >
            {/* Modal header */}
            <div className="flex items-center justify-between gap-4 border-b border-zinc-800 px-4 py-3 bg-zinc-950/90">
              <div className="flex items-center gap-2 min-w-0">
                <CardIcon
                  type={activeDiagram.icon}
                  className={`w-3.5 h-3.5 shrink-0 ${activeDiagram.accentClass}`}
                />
                <span className="text-xs font-bold font-mono text-zinc-200 tracking-wider truncate">
                  {activeDiagram.tag}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setActiveDiagram(null)}
                aria-label="Close diagram preview"
                className="inline-flex items-center gap-1 rounded border border-zinc-800 bg-zinc-900 px-2 py-1 text-[11px] font-mono text-zinc-400 hover:text-zinc-100 hover:border-zinc-700 transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                ESC
              </button>
            </div>

            {/* Enlarged diagram */}
            <div className="p-3 sm:p-5 overflow-auto flex items-center justify-center bg-zinc-950">
              <Image
                src={activeDiagram.imageSrc}
                alt={activeDiagram.imageAlt}
                width={1200}
                height={800}
                className="max-h-[75vh] w-auto max-w-full object-contain rounded"
              />
            </div>

            {/* Modal footer */}
            <div className="border-t border-zinc-800/80 px-4 py-2.5 bg-zinc-950/90">
              <p className="text-xs text-zinc-500 font-mono">
                {activeDiagram.description}
              </p>
            </div>
          </div>
        </div>
      )}

        {/* ── SECTION 03: DEMO ACCESS ────────────────────────────────────── */}
        <section className="py-16 border-b border-zinc-800/80">
          <div className="mb-10">
            <p className="text-xs text-zinc-500 tracking-widest mb-2">03 // DEPLOYED_ENVIRONMENT_ACCESS</p>
            <p className="text-xs text-zinc-600 max-w-xl leading-relaxed">
              Select an automated sandbox session to test the system with pre-configured credentials:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Student Access Button */}
            <button
              onClick={() =>
                router.push(
                  '/auth?email=student%40example.com&password=Student%40123&role=student'
                )
              }
              className="group text-left border border-zinc-800 hover:border-emerald-500/50 bg-zinc-950/40 hover:bg-emerald-500/5 p-6 transition-all duration-300 relative overflow-hidden"
            >
              {/* Hover glow line */}
              <div className="absolute top-0 left-0 right-0 h-px bg-emerald-500/0 group-hover:bg-emerald-500/50 transition-all duration-300" />

              <div className="flex items-start justify-between mb-5">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500/50 group-hover:bg-emerald-400 transition-colors" />
                  <span className="text-xs text-zinc-500 tracking-widest">STUDENT_PERSONA</span>
                </div>
                <ArrowRight className="w-4 h-4 text-zinc-700 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all duration-200" />
              </div>

              <p className="text-sm font-bold text-zinc-100 tracking-wider uppercase mb-5">
                [ INITIALIZE STUDENT ACCESS ]
              </p>

              <div className="space-y-1.5 border-t border-zinc-800/80 pt-4">
                <p className="text-xs text-zinc-600">
                  <span className="text-zinc-500">EMAIL_</span>{' '}
                  <span className="text-zinc-400">student@example.com</span>
                </p>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  <span className="text-zinc-500">ACCESS_</span>{' '}
                  <span className="text-zinc-400">Video feed, real-time quizzes, attempt history</span>
                </p>
              </div>
            </button>

            {/* Educator Access Button */}
            <button
              onClick={() =>
                router.push(
                  '/auth?email=educator%40example.com&password=Educator%40123&role=educator'
                )
              }
              className="group text-left border border-zinc-800 hover:border-sky-500/50 bg-zinc-950/40 hover:bg-sky-500/5 p-6 transition-all duration-300 relative overflow-hidden"
            >
              {/* Hover glow line */}
              <div className="absolute top-0 left-0 right-0 h-px bg-sky-500/0 group-hover:bg-sky-500/50 transition-all duration-300" />

              <div className="flex items-start justify-between mb-5">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-sky-500/50 group-hover:bg-sky-400 transition-colors" />
                  <span className="text-xs text-zinc-500 tracking-widest">EDUCATOR_PERSONA</span>
                </div>
                <ArrowRight className="w-4 h-4 text-zinc-700 group-hover:text-sky-400 group-hover:translate-x-1 transition-all duration-200" />
              </div>

              <p className="text-sm font-bold text-zinc-100 tracking-wider uppercase mb-5">
                [ INITIALIZE EDUCATOR PORTAL ]
              </p>

              <div className="space-y-1.5 border-t border-zinc-800/80 pt-4">
                <p className="text-xs text-zinc-600">
                  <span className="text-zinc-500">EMAIL_</span>{' '}
                  <span className="text-zinc-400">educator@example.com</span>
                </p>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  <span className="text-zinc-500">ACCESS_</span>{' '}
                  <span className="text-zinc-400">Analytics, video ingestion, quiz creation</span>
                </p>
              </div>
            </button>

          </div>
        </section>

        {/* ── FOOTER ─────────────────────────────────────────────────────── */}
        <footer className="pt-8 flex items-center justify-between">
          <p className="text-xs text-zinc-700 tracking-widest uppercase">
            ADAPTIVE_LEARN ARCHITECTURE // READY FOR BENCHMARKING
          </p>
          <p className="text-xs text-zinc-800 tracking-wider">v1.0</p>
        </footer>

      </div>
    </div>
  );
}
