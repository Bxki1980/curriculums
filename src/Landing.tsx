import { useEffect, useMemo, useRef, useState } from "react";
import heroImg from "./assets/teaching.jpg";

/**
 * Premium single-page landing (QR friendly)
 * - Tailwind v4 (see App.css for @import "tailwindcss")
 * - No extra libraries
 * - Course cards link to /curriculum/<id>
 */

const SITE_URL = "https://mohammad-ahmadi-fard.com"; // your QR URL
const CONTACT = {
  instructor: "Mohammad Ahmadi Fard",
  email: "mehmamadfard04@gmail.com",
  phoneE164: "+14168844778",
  phoneHuman: "(416) 884-4778",
  whatsapp: "https://wa.me/14168844478",
};

const COURSES = [
  {
    id: "python-7-10",
    title: "Python Starter (Ages 7–10)",
    level: "Beginner",
    color: "from-emerald-50 to-sky-50",
    blurb:
      "Turtle art, quiz games, and Pygame Zero mini-games. Fun first, concepts second.",
    bullets: [
      "Loops & decisions by making things move",
      "Turtle art + simple animations",
      "Click-the-Bug & Catch-the-Fruits mini-games",
    ],
    duration: "8 / 12 / 24 weeks • 75–90 min",
  },
  {
    id: "python-11-14",
    title: "Python Foundations (Ages 11–14)",
    level: "Beginner → Intermediate",
    color: "from-amber-50 to-rose-50",
    blurb:
      "Functions, lists & dictionaries, files/CSV → charts, APIs (JSON), and an arcade game.",
    bullets: [
      "Build a password generator & quiz app",
      "Plot real data with charts",
      "Pygame arcade capstone",
    ],
    duration: "8 / 12 / 24 weeks • 75–90 min",
  },
  {
    id: "python-15-18",
    title: "Python Pro Track (Ages 15–18)",
    level: "Intermediate",
    color: "from-violet-50 to-indigo-50",
    blurb:
      "Clean Python, Git/GitHub, pytest, FastAPI + SQLite, pandas (intro ML) — ship a real project.",
    bullets: [
      "Publish a tiny API or data story",
      "Testing & docs for confidence",
      "Portfolio-ready capstone",
    ],
    duration: "8 / 12 / 24 weeks • 90 min",
  },
];

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="badge anim-floaty shadow">
      {children}
    </span>
  );
}

function PrimaryBtn({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      className="btn-shine inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 font-semibold text-slate-900 shadow hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-white/60"
      aria-label="Primary action"
    >
      {children}
    </a>
  );
}

function GhostBtn({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      className="btn-shine inline-flex items-center justify-center rounded-xl border border-white/35 px-5 py-3 font-semibold text-white/95 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/30"
    >
      {children}
    </a>
  );
}

/** intersection-observer reveal (typed, no `any`) */
function useReveal(): { ref: React.RefObject<HTMLDivElement | null>; show: boolean } {
  const ref = useRef<HTMLDivElement | null>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        entries.forEach((e) => e.isIntersecting && setShow(true));
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return { ref, show };
}

function CourseCard({ course }: { course: (typeof COURSES)[number] }) {
  const { ref, show } = useReveal();
  const curriculumHref = `/curriculum/${course.id}`;

  return (
    <article
      ref={ref}
      className={`group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition
        ${show ? "anim-fade" : "opacity-0"} hover:-translate-y-1 hover:shadow-md`}
    >
      {/* soft gradient wash */}
      <div
        className={`pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br ${course.color}`}
      />
      {/* level pill */}
      <div className="absolute right-4 top-4 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-500/20">
        {course.level}
      </div>

      <h3 className="text-lg font-semibold text-slate-900">{course.title}</h3>
      <p className="mt-2 text-sm text-slate-700">{course.blurb}</p>
      <ul className="mt-3 space-y-1 text-sm text-slate-700">
        {course.bullets.map((b, i) => (
          <li key={i} className="flex gap-2">
            <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
            <span>{b}</span>
          </li>
        ))}
      </ul>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <span className="text-xs text-slate-500">{course.duration}</span>
        <div className="flex gap-2">
          <a
            href={curriculumHref}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            View curriculum
          </a>
          <a
            href="#contact"
            className="rounded-lg bg-emerald-500 px-3 py-2 text-sm font-semibold text-white shadow transition hover:bg-emerald-600"
          >
            Book a trial
          </a>
        </div>
      </div>

      {/* subtle gloss on hover */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-12 translate-y-[-100%] bg-gradient-to-b from-white/60 to-transparent opacity-0 transition group-hover:translate-y-0 group-hover:opacity-100" />
    </article>
  );
}

export default function Landing() {
  const faq = useMemo(
    () => [
      {
        q: "Is prior experience required?",
        a: "No. We meet students where they are and level up with hands-on projects.",
      },
      {
        q: "What do students need?",
        a: "A laptop (Windows/Mac/Chromebook). We provide all starter files and safe guidance.",
      },
      {
        q: "How big are classes?",
        a: "Small groups (6–10) for personalized support and feedback.",
      },
      {
        q: "How do you assess progress?",
        a: "Weekly mini-demos, skill badges (Loops, Functions, Data, Game Dev, APIs, Testing), and a final showcase.",
      },
    ],
    []
  );

  return (
    <div className="min-h-screen">
      {/* NAV */}
      <nav className="sticky top-0 z-40 bg-[#004670]/90 backdrop-blur">
        <div className="container-px mx-auto flex max-w-6xl items-center justify-between py-3">
          <a href="#" className="text-sm font-semibold tracking-wide">
            Code the Future
          </a>
          <div className="hidden gap-4 sm:flex">
            <a className="text-sm hover:underline" href="#courses">
              Courses
            </a>
            <a className="text-sm hover:underline" href="#why">
              Why Us
            </a>
            <a className="text-sm hover:underline" href="#faq">
              FAQ
            </a>
            <a className="text-sm hover:underline" href="#contact">
              Contact
            </a>
          </div>
          <a
            href="#contact"
            className="rounded-lg bg-emerald-500 px-3 py-2 text-sm font-semibold text-white shadow hover:bg-emerald-600"
          >
            Book a Trial
          </a>
        </div>
      </nav>

      {/* HERO */}
      <header className="container-px mx-auto max-w-6xl py-10">
        <div className="grid items-center gap-8 md:grid-cols-2">
          {/* Left copy */}
          <div>
            <p className="text-sm/6 opacity-90">
              Ages 7–18 • Beginner to Advanced • After-School & Weekend Programs
            </p>

            {/* gradient headline with subtle shimmer */}
            <h1 className="anim-fade mt-2 bg-gradient-to-br from-white to-white/70 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent sm:text-5xl">
              Code the Future. <span className="block">Start Today.</span>
            </h1>

            <div className="mt-6 flex flex-wrap gap-2">
              <Badge>Beginner-Friendly</Badge>
              <Badge>Small Class Sizes</Badge>
              <Badge>Project-Based</Badge>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <PrimaryBtn href="#courses">View courses</PrimaryBtn>
              <GhostBtn href="#contact">Message on WhatsApp</GhostBtn>
              <GhostBtn href={SITE_URL}>Open QR link</GhostBtn>
            </div>
          </div>

          {/* Right image */}
          <div className="anim-fade-delayed relative">
            <img
              src={heroImg}
              alt="Instructor guiding a student while coding a game"
              className="photo-frame w-full"
            />
            {/* floating accents */}
            <div className="anim-floaty absolute -right-3 -top-3 h-10 w-10 rounded-xl bg-emerald-500/80 blur-[1px]" />
            <div className="anim-floaty absolute -bottom-4 -left-4 h-8 w-8 rounded-xl bg-sky-400/70 [animation-delay:1.2s]" />
          </div>
        </div>

        {/* Hero CTA to all curriculums */}
        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href="/curriculum/python-7-10"
            className="rounded-xl border border-white/35 px-4 py-2 font-semibold text-white/95 transition hover:bg-white/10"
          >
            View Python 7–10 curriculum
          </a>
          <a
            href="/curriculum/python-11-14"
            className="rounded-xl border border-white/35 px-4 py-2 font-semibold text-white/95 transition hover:bg-white/10"
          >
            View Python 11–14 curriculum
          </a>
          <a
            href="/curriculum/python-15-18"
            className="rounded-xl border border-white/35 px-4 py-2 font-semibold text-white/95 transition hover:bg-white/10"
          >
            View Python 15–18 curriculum
          </a>
        </div>
      </header>

      {/* WHITE BODY */}
      <main className="rounded-t-3xl bg-white text-slate-800">
        {/* Courses */}
        <section id="courses" className="container-px mx-auto max-w-6xl py-12">
          <div className="flex items-end justify-between gap-4">
            <h2 className="text-xl font-semibold">Courses</h2>
            <p className="text-sm text-slate-600">
              8 / 12 / 24-week options • 75–90 minutes per session
            </p>
          </div>

        <div className="mt-6 grid gap-5 md:grid-cols-3">
            {COURSES.map((c) => (
              <CourseCard key={c.id} course={c} />
            ))}
            {/* space reserved for future courses */}
            <article className="group relative flex items-center justify-center rounded-2xl border border-dashed border-slate-300 p-6 text-center text-slate-500 transition hover:-translate-y-1 hover:border-slate-400 hover:shadow-sm">
              More courses coming soon (Robotics, Web, Game Jam)…
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-emerald-100/40 to-transparent opacity-0 transition group-hover:opacity-100" />
            </article>
          </div>
        </section>

        {/* Why us */}
        <section id="why" className="container-px mx-auto max-w-6xl py-8">
          <div className="glass p-6 text-slate-900">
            <h2 className="text-xl font-semibold">Why families choose us</h2>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-slate-700">
                  • Hands-on from day one — students make, learn, and share.
                </p>
                <p className="mt-1 text-slate-700">
                  • Small groups for real feedback and confidence.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-slate-700">
                  • Demo day + portfolio pieces parents can see.
                </p>
                <p className="mt-1 text-slate-700">
                  • Responsible tech: privacy, safe search, and kindness online.
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="hr mx-auto max-w-6xl" />

        {/* FAQ */}
        <section id="faq" className="container-px mx-auto max-w-6xl py-12">
          <h2 className="text-xl font-semibold">FAQ</h2>
          <div className="mt-4 divide-y divide-slate-200 overflow-hidden rounded-2xl border border-slate-200">
            {faq.map((f, i) => (
              <details key={i} className="group open:bg-slate-50">
                <summary className="flex cursor-pointer list-none items-center justify-between p-5">
                  <span className="font-medium text-slate-900">{f.q}</span>
                  <span className="ml-4 rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600 group-open:hidden">
                    Open
                  </span>
                  <span className="ml-4 hidden rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600 group-open:block">
                    Close
                  </span>
                </summary>
                <p className="px-5 pb-5 text-slate-700">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="container-px mx-auto max-w-6xl pb-14">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-slate-900">
                Contact & Booking
              </h2>
              <p className="mt-2 text-slate-700">
                Instructor: <b>{CONTACT.instructor}</b>
              </p>
              <p className="text-slate-700">
                Email:{" "}
                <a className="underline" href={`mailto:${CONTACT.email}`}>
                  {CONTACT.email}
                </a>
              </p>
              <p className="text-slate-700">
                Phone/WhatsApp:{" "}
                <a className="underline" href={`tel:${CONTACT.phoneE164}`}>
                  {CONTACT.phoneHuman}
                </a>
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <a
                  href={`mailto:${CONTACT.email}`}
                  className="rounded-xl bg-emerald-500 px-5 py-3 font-semibold text-white shadow hover:bg-emerald-600"
                >
                  Email us
                </a>
                <a
                  href={CONTACT.whatsapp}
                  className="rounded-xl border border-emerald-500 px-5 py-3 font-semibold text-emerald-700 hover:bg-emerald-50"
                >
                  WhatsApp
                </a>
                <a
                  href={SITE_URL}
                  className="rounded-xl border border-slate-300 px-5 py-3 font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Open QR Link
                </a>
              </div>
              <p className="mt-3 text-xs text-slate-500">
                Use the same URL in your printed poster’s QR code for a seamless
                experience.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="font-medium text-slate-900">Schedule & Format</p>
              <p className="mt-1 text-slate-700">
                After-school & weekends • 8 / 12 / 24-week tracks • 75–90 min
                per session
              </p>
              <p className="mt-3 font-medium text-slate-900">What to expect</p>
              <ul className="mt-1 space-y-1 text-slate-700">
                <li>• Friendly, focused environment</li>
                <li>• Make → Learn → Share each week</li>
                <li>• Parent updates & final demo day</li>
              </ul>
            </div>
          </div>
        </section>
      </main>

      {/* Footer CTA */}
      <footer className="bg-[#004670] py-7 text-center text-sm">
        <p>Spots are limited — Book a Trial Class Today</p>
        <p className="opacity-80">
          Beginner-friendly • Small class sizes • Project-based
        </p>
      </footer>

      {/* Sticky mobile CTA */}
      <div className="fixed inset-x-0 bottom-0 z-40 bg-white/95 p-3 shadow backdrop-blur sm:hidden">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
          <span className="text-sm font-medium text-slate-800">
            Ready to start?
          </span>
          <a
            href="#contact"
            className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-emerald-600"
          >
            Book a trial
          </a>
        </div>
      </div>
    </div>
  );
}
