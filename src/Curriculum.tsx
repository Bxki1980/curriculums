// src/Curriculum.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import heroImg from "./assets/teaching.jpg";

/** ------------------------------
 *  Data: three age-aligned paths
 *  ------------------------------ */

type CurriculumBlock = {
  id: string;
  title: string;
  subtitle: string;
  audience: string;
  tools: string;
  outcomes: string[];
  projects: string[];
  outline12: string[];
  capstoneNote?: string;
  fast8: string[];
};

const PATHS: Record<string, CurriculumBlock> = {
  "python-7-10": {
    id: "python-7-10",
    title: "Python Starter",
    subtitle: "Create with Turtle, mini-games, and playful logic",
    audience: "Ages 7–10 • Beginner",
    tools:
      "Thonny or Mu Editor, Python 3.12, Turtle, Pygame Zero, (optional) micro:bit",
    outcomes: [
      "Understand sequences, loops, conditionals, variables",
      "Read/write simple Python; debug with print and editor tools",
      "Use Turtle and Pygame Zero to draw, animate, and build mini-games",
      "Collaborate in pairs; present a short demo",
    ],
    projects: [
      "Name Art with Turtle (shapes, colors, loops)",
      "Magic 8-Ball / Quizzer (random, input, lists)",
      "Click-the-Bug game (sprites, timers) with Pygame Zero",
      "Virtual Pet (state & events)",
      "Optional: micro:bit step counter or reaction timer",
    ],
    outline12: [
      "Start Strong — editor basics, print, input, variables; Turtle drawings",
      "Loops — for/while, range; spiral art",
      "Decisions — if/elif/else; quiz game",
      "Events & Random — dice roller; magic 8-ball",
      "Lists — question banks; shuffle choices",
      "Functions — reuse code; Turtle stamp toolkit",
      "Sprites 1 — Pygame Zero setup, images, coordinates",
      "Sprites 2 — mouse/keyboard events; collisions",
      "Game Polish — score, lives, levels; sounds",
      "Capstone Build (part 1)",
      "Capstone Build (part 2)",
      "Showcase & Reflection — mini-expo for families",
    ],
    capstoneNote: "Capstone ideas: Catch-the-Fruits, Space Dodge, Maze Runner.",
    fast8: [
      "Foundations sprint (Weeks 1–3)",
      "Mini-projects (Weeks 4–5)",
      "Capstone sprint (Weeks 6–7)",
      "Demo day & certificates (Week 8)",
    ],
  },
  "python-11-14": {
    id: "python-11-14",
    title: "Python Foundations",
    subtitle: "From fundamentals to data & arcade games",
    audience: "Ages 11–14 • Beginner → Intermediate",
    tools:
      "VS Code or Thonny, Git (local), Pygame Zero/Pygame, matplotlib, (optional) Flask",
    outcomes: [
      "Confident with functions, lists/dicts, loops, modules, and files",
      "Break problems into algorithms; pseudocode; test and debug",
      "Create 2D games or simple data dashboards",
      "Introduce web apps and APIs",
    ],
    projects: [
      "Password Generator (random, strings)",
      "CSV Data Explorer (read files, plot with matplotlib)",
      "Weather or Trivia App (JSON API or offline dataset)",
      "Arcade Game (Pygame) with menus & levels",
    ],
    outline12: [
      "Pro Dev Setup — Python 3.12, VS Code, Git intro; coding warm-ups",
      "Deep Dive Variables & Types — strings, f-strings, formatting",
      "Control Flow Mastery — loops, intro to comprehensions",
      "Functions & Modules — parameters, standard library tour",
      "Lists & Dicts — nested data; basic searching/sorting",
      "Files & CSV — read/write; data stories with charts",
      "APIs 101 — JSON; trivia/quiz app (or weather with cached JSON)",
      "Game Dev 1 — sprites, collisions, sound",
      "Game Dev 2 — light physics, scoreboards, power-ups",
      "Capstone Plan — spec, wireframe, backlog",
      "Capstone Build",
      "Shipping Day — play-test + parent demo; reflections",
    ],
    capstoneNote:
      "Capstone options: Space Invaders, Platformer, Top-down racer, or Data Story Dashboard.",
    fast8: [
      "Foundations sprint (Weeks 1–3)",
      "Mini-projects (Weeks 4–5)",
      "Capstone sprint (Weeks 6–7)",
      "Demo day & certificates (Week 8)",
    ],
  },
  "python-15-18": {
    id: "python-15-18",
    title: "Python Pro Track",
    subtitle: "Ship a real web, game, or data/AI project",
    audience: "Ages 15–18 • Intermediate/Advanced",
    tools:
      "VS Code, virtualenv, Git/GitHub, pytest, Flask/FastAPI, SQLite, pandas, Pygame, (optional) scikit-learn",
    outcomes: [
      "Write clean, modular Python with functions, classes, and docstrings",
      "Use Git & GitHub (branches, pull requests); read errors and logs",
      "Build and test a small web API or game or data/AI project",
      "Store data in SQLite; analyze with pandas",
    ],
    projects: [
      "Web/API Track — Task Tracker API (FastAPI) + minimal client; auth basics; SQLite; pytest",
      "Game Track — Pygame 2D game with state machine, asset pipeline, save/load",
      "Data & AI Track — Data Story (pandas/matplotlib) + intro ML (k-NN or decision tree)",
    ],
    outline12: [
      "Professional Setup — virtualenv, Git workflow, Black/Ruff, README",
      "Core Python Review — iterables, functions, exceptions",
      "OOP Essentials — classes, dataclasses, composition vs. inheritance",
      "Testing 101 — pytest, fixtures, TDD mini-kata",
      "SQLite & ORM-lite — schema, CRUD; persistence layer",
      "Track Start — choose Web/Game/Data; project plan",
      "Track Build 1",
      "Track Build 2",
      "Track Build 3",
      "Polish & Docs — logging, config, simple UI/CLI",
      "Deployment or Packaging — free host or installable",
      "Capstone Expo & Portfolio review",
    ],
    fast8: [
      "Foundations sprint (Weeks 1–3)",
      "Mini-projects (Weeks 4–5)",
      "Capstone sprint (Weeks 6–7)",
      "Demo day & certificates (Week 8)",
    ],
  },
};

/** ------------------------------
 *  Small UI helpers
 *  ------------------------------ */

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-emerald-500 px-3 py-1 text-xs font-semibold text-white shadow-sm">
      {children}
    </span>
  );
}

function SectionTitle({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  return (
    <h2 id={id} className="scroll-mt-24 text-xl font-semibold text-slate-900">
      {children}
    </h2>
  );
}

function List({ items }: { items: string[] }) {
  return (
    <ul className="mt-3 space-y-2 text-slate-700">
      {items.map((t, i) => (
        <li key={i} className="flex gap-2">
          <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
          <span>{t}</span>
        </li>
      ))}
    </ul>
  );
}

function WeeksAccordion({ weeks }: { weeks: string[] }) {
  return (
    <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200">
      {weeks.map((w, i) => (
        <details key={i} className="group open:bg-slate-50">
          <summary className="flex cursor-pointer list-none items-center justify-between p-4">
            <span className="font-medium text-slate-900">Week {i + 1}</span>
            <span className="ml-4 rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600 group-open:hidden">
              Open
            </span>
            <span className="ml-4 hidden rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600 group-open:block">
              Close
            </span>
          </summary>
          <div className="px-4 pb-4 text-slate-700">{w}</div>
        </details>
      ))}
    </div>
  );
}

/** ------------------------------
 *  Page with scroll-spy + extras
 *  ------------------------------ */

export default function Curriculum() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const data = useMemo<CurriculumBlock>(() => {
    if (id && PATHS[id]) return PATHS[id];
    return PATHS["python-11-14"]; // fallback
  }, [id]);

  // SEO polish
  useEffect(() => {
    const prev = document.title;
    document.title = `${data.title} — Curriculum`;
    return () => { document.title = prev; };
  }, [data.title]);

  // jump to top when route changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  // table of contents anchors
  const TOC = [
    { id: "overview", label: "Overview" },
    { id: "outcomes", label: "Core outcomes" },
    { id: "projects", label: "Signature projects" },
    { id: "outline", label: "12-week outline" },
    { id: "fast8", label: "Fast 8-week" },
    { id: "ops", label: "Operations" },
    { id: "parents", label: "Parent communication" },
    { id: "safety", label: "Safety & responsible tech" },
    { id: "next", label: "Next steps" },
  ];

  /** Scroll progress bar */
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      const p = max > 0 ? (h.scrollTop / max) * 100 : 0;
      setProgress(Math.min(100, Math.max(0, p)));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /** Scroll-spy (highlights current section in TOC) */
  const [active, setActive] = useState<string>("overview");
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();

    const headings = TOC.map((t) =>
      document.getElementById(t.id)
    ).filter(Boolean) as HTMLElement[];

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target?.id) setActive(visible[0].target.id);
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: [0, 0.5, 1] }
    );

    headings.forEach((h) => io.observe(h));
    observerRef.current = io;
    return () => io.disconnect();
  }, [id]);

  /** Smooth anchor click */
  const onAnchorClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    anchor: string
  ) => {
    e.preventDefault();
    document.getElementById(anchor)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  /** Back-to-top visibility */
  const [showTop, setShowTop] = useState(false);
  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /** Copy link */
  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    } catch {
      prompt("Copy this link:", window.location.href);
    }
  };

  /** Quick path switcher order */
  const PATH_ORDER: Array<keyof typeof PATHS> = [
    "python-7-10",
    "python-11-14",
    "python-15-18",
  ];

  return (
    <div className="min-h-screen bg-white text-slate-800">
      {/* Scroll progress */}
      <div
        className="fixed inset-x-0 top-0 z-50 h-0.5 bg-emerald-500/60"
        style={{ width: `${progress}%` }}
        aria-hidden
      />

      {/* Top bar */}
      <header className="bg-[#004670] bg-gradient-to-b from-[#004670] to-[#0b3f5a] text-white print:hidden">
        <div className="container-px mx-auto max-w-6xl py-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <Link
                to="/"
                className="text-sm font-semibold tracking-wide underline decoration-white/30 underline-offset-4"
              >
                ← Back to courses
              </Link>

              {/* Quick path switcher */}
              <label className="ml-1 hidden items-center gap-2 text-xs sm:flex">
                <span className="opacity-70">View:</span>
                <select
                  className="rounded-md bg-white/10 px-2 py-1 text-white outline-none ring-1 ring-white/20"
                  value={data.id}
                  onChange={(e) => navigate(`/curriculum/${e.target.value}`)}
                >
                  {PATH_ORDER.map((pid) => (
                    <option key={pid} value={pid}>
                      {PATHS[pid].title}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="flex gap-2">
              <Pill>{data.audience}</Pill>
              <Pill>Project-based</Pill>
              <Pill>Small classes</Pill>
            </div>
          </div>

          <div className="mt-6 grid items-center gap-8 md:grid-cols-2">
            <div>
              <h1 className="text-3xl font-extrabold sm:text-4xl">
                {data.title}{" "}
                <span className="block text-white/90">{data.subtitle}</span>
              </h1>
              <p className="mt-3 text-white/90">
                Format: After-School & Weekend • Beginner → Advanced • Project-based • Small classes (6–10)
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href="#next"
                  onClick={(e) => onAnchorClick(e, "next")}
                  className="btn btn-primary btn-shine rounded-xl"
                >
                  Enroll / Next steps
                </a>
                <a
                  href="mailto:mehmamadfard04@gmail.com"
                  className="btn btn-ghost btn-shine rounded-xl"
                >
                  Email the instructor
                </a>
                <button
                  onClick={() => window.print()}
                  className="btn btn-ghost rounded-xl"
                >
                  Print / Save PDF
                </button>
                <button onClick={onCopy} className="btn btn-ghost rounded-xl">
                  Copy link
                </button>
              </div>
            </div>
            <div className="relative">
              <img
                src={heroImg}
                alt="Students coding with instructor"
                className="photo-frame w-full"
              />
              <div className="anim-floaty absolute -right-3 -top-3 h-10 w-10 rounded-xl bg-emerald-500/80 blur-[1px]" />
              <div className="anim-floaty absolute -bottom-4 -left-4 h-8 w-8 rounded-xl bg-sky-400/70 [animation-delay:1.2s]" />
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="container-px mx-auto grid max-w-6xl gap-8 py-10 md:grid-cols-[240px,1fr]">
        {/* Sticky TOC (stabilized, no layout shift) */}
        <aside className="top-24 hidden self-start md:sticky md:block print:hidden">
          <nav className="rounded-2xl border border-slate-200 bg-white p-4 pb-5 shadow-sm">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
              Curriculum
            </p>
            <ul className="space-y-1 text-sm">
              {TOC.map((t) => {
                const isActive = active === t.id;
                return (
                  <li key={t.id}>
                    <a
                      href={`#${t.id}`}
                      onClick={(e) => onAnchorClick(e, t.id)}
                      className={`relative block rounded-md px-3 py-2 leading-6 transition ${
                        isActive
                          ? "bg-emerald-50 text-emerald-700"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-800"
                      }`}
                      style={{ minHeight: 32 }} // lock row height
                    >
                      {/* left indicator bar */}
                      <span
                        aria-hidden
                        className={`absolute left-1 top-1/2 h-4 w-1 -translate-y-1/2 rounded-full transition ${
                          isActive ? "bg-emerald-500" : "bg-transparent"
                        }`}
                      />
                      <span className="font-medium">{t.label}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>

        {/* Main column */}
        <main className="space-y-10">
          {/* Overview */}
          <section id="overview">
            <SectionTitle id="overview">Overview</SectionTitle>
            <div className="anim-fade mt-3 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-slate-700">
                Goal: Turn screen time into <i>creative time</i>. Students build real projects and a
                portfolio while learning problem-solving, collaboration, and modern Python.
              </p>
              <div className="mt-4 rounded-xl bg-slate-50 p-4 text-sm text-slate-700">
                <p>
                  <b>Teaching philosophy:</b> Make → Learn → Share (every concept paired with a mini-project and demo).
                  Low floor, high ceiling. Safety & ethics (digital citizenship, teamwork, responsible AI). Mastery over
                  memorization (short lessons, lots of practice, visible progress).
                </p>
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div className="rounded-xl border border-slate-200 bg-white p-4">
                  <p className="text-sm text-slate-500">Tools</p>
                  <p className="mt-1 text-slate-800">{data.tools}</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-4">
                  <p className="text-sm text-slate-500">Tracks & timing</p>
                  <p className="mt-1 text-slate-800">
                    8-week (intro), 12-week (standard), or 24-week (extended). 75–90 minutes per session.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Outcomes */}
          <section id="outcomes">
            <SectionTitle id="outcomes">Core outcomes</SectionTitle>
            <div className="card anim-fade p-6">
              <List items={data.outcomes} />
            </div>
          </section>

          {/* Projects */}
          <section id="projects">
            <SectionTitle id="projects">Signature projects</SectionTitle>
            <div className="card anim-fade p-6">
              <List items={data.projects} />
              {data.capstoneNote && (
                <p className="mt-3 text-sm text-slate-600">{data.capstoneNote}</p>
              )}
            </div>
          </section>

          {/* Outline */}
          <section id="outline">
            <SectionTitle id="outline">12-week outline</SectionTitle>
            <div className="card anim-fade p-6">
              <WeeksAccordion weeks={data.outline12} />
            </div>
          </section>

          {/* Fast 8-week */}
          <section id="fast8">
            <SectionTitle id="fast8">Fast 8-week variant</SectionTitle>
            <div className="card anim-fade p-6">
              <List items={data.fast8} />
            </div>
          </section>

          {/* Operations */}
          <section id="ops">
            <SectionTitle id="ops">Operations</SectionTitle>
            <div className="card anim-fade p-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="font-medium text-slate-900">Assessment & certificates</p>
                  <List
                    items={[
                      "Badges: Loops, Functions, Data, Game Dev, APIs, Testing",
                      "Rubric: correctness, readability, creativity, presentation",
                      "Progress: check-ins at Weeks 4, 8, and 12; written reflection",
                    ]}
                  />
                </div>
                <div>
                  <p className="font-medium text-slate-900">Equipment & setup</p>
                  <List
                    items={[
                      "Laptop (Windows/Mac/Chromebook with Linux container), 8GB RAM preferred",
                      "Install Python 3.12, Thonny or VS Code, Git, pip/virtualenv",
                      "Teacher provides starter code, datasets, and safe assets",
                    ]}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Parent communication */}
          <section id="parents">
            <SectionTitle id="parents">Parent communication</SectionTitle>
            <div className="card anim-fade p-6">
              <List
                items={[
                  "Welcome pack: setup guide, expectations, calendar",
                  "Weekly email: what we learned, screenshots/GIFs, how to encourage at home",
                  "Demo day: 15-minute showcase during the final session",
                ]}
              />
            </div>
          </section>

          {/* Safety */}
          <section id="safety">
            <SectionTitle id="safety">Safety & responsible tech</SectionTitle>
            <div className="card anim-fade p-6">
              <List
                items={[
                  "No collecting personal data",
                  "Offline or teacher-proxied APIs only",
                  "Age-appropriate content and assets",
                  "Discuss bias, privacy, and how to ask the internet for help safely",
                ]}
              />
            </div>
          </section>

          {/* Next steps */}
          <section id="next">
            <SectionTitle id="next">Next steps</SectionTitle>
            <div className="card anim-fade flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-slate-700">
                Choose <b>path</b> and <b>duration</b>, confirm <b>schedule</b>, receive the welcome pack, and
                students start building from Day 1.
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href="mailto:mehmamadfard04@gmail.com"
                  className="rounded-xl bg-emerald-500 px-5 py-3 font-semibold text-white shadow hover:bg-emerald-600"
                >
                  Enroll via Email
                </a>
                <a
                  href="https://wa.me/14168844478"
                  className="rounded-xl border border-emerald-500 px-5 py-3 font-semibold text-emerald-700 hover:bg-emerald-50"
                >
                  Chat on WhatsApp
                </a>
                <Link
                  to="/"
                  className="rounded-xl border border-slate-300 px-5 py-3 font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Back to courses
                </Link>
              </div>
            </div>
            <p className="mt-2 text-xs text-slate-500">
              Pricing & scheduling are customized for schools and families (sibling & early-bird discounts, trial class
              available). Ask us for current rates.
            </p>
          </section>
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-[#004670] py-7 text-center text-sm text-white print:hidden">
        <p>Spots are limited — Book a Trial Class Today</p>
        <p className="opacity-80">Beginner-friendly • Small class sizes • Project-based</p>
      </footer>

      {/* Back-to-top */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={`fixed bottom-6 right-6 z-40 rounded-full bg-emerald-500 px-4 py-3 text-sm font-semibold text-white shadow transition hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-200 sm:bottom-8 sm:right-8 ${
          showTop ? "opacity-100" : "pointer-events-none opacity-0"
        } print:hidden`}
        aria-label="Back to top"
        title="Back to top"
      >
        ↑ Top
      </button>
    </div>
  );
}
