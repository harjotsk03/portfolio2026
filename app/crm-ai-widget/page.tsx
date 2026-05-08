"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { type StaticImageData } from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Footer } from "@/components/footer";
import { CaseImage } from "@/components/studyspotr/case-image";
import {
  CaseStudySideNav,
  CaseStudyMobileNav,
  type CaseSection,
} from "@/components/studyspotr/case-study-nav";

import imgWholeWidget from "@/assets/crmaiwidgetcasestudy/wholewidgetview.png";
import imgInputHint from "@/assets/crmaiwidgetcasestudy/inputandhint.png";
import imgLiveStream from "@/assets/crmaiwidgetcasestudy/livechatstream.png";
import imgQuickHelp from "@/assets/crmaiwidgetcasestudy/quickhelponnewchat.png";
import imgRecordGen from "@/assets/crmaiwidgetcasestudy/recordgeneration.png";
import imgSearchNav from "@/assets/crmaiwidgetcasestudy/searchandnav.png";

gsap.registerPlugin(ScrollTrigger);

const CRM_SECTIONS: CaseSection[] = [
  { id: "intro", label: "Intro" },
  { id: "problem", label: "The problem" },
  { id: "process", label: "Process" },
  { id: "architecture", label: "Architecture" },
  { id: "agent1", label: "Agent 1 — Analysis" },
  { id: "agent2", label: "Agent 2 — Execution" },
  { id: "design", label: "Design decisions" },
  { id: "prototype", label: "Prototype" },
  { id: "impact", label: "Impact" },
];

const TITLE_LETTERS = [
  { ch: "C" }, { ch: "R" }, { ch: "M" },
  { ch: " ", space: true },
  { ch: "A" }, { ch: "I" },
  { ch: " ", space: true },
  { ch: "W" }, { ch: "i" }, { ch: "d" }, { ch: "g" }, { ch: "e" }, { ch: "t" },
] as const;

type DesignDecision = {
  title: string;
  detail: string;
  img: StaticImageData | null;
  aspectClass: string;
  slug: string | null;
  caption: string | null;
};

const DESIGN_DECISIONS: DesignDecision[] = [
  {
    title: "Familiar patterns — designed like Claude and ChatGPT",
    detail: "The reps already knew how to use AI — they'd been copy-pasting into ChatGPT and Claude every day. So rather than designing a novel interface they'd have to learn, I followed the same conventions: chat input at the bottom, streamed responses above, conversation history on the side. The widget feels like the tools they already use, just inside their CRM and aware of their deal. The context-aware hint below the input — which surfaces a relevant prompt based on the current deal stage — was the one addition that didn't exist in Claude or ChatGPT. It handled the blank-box paralysis that shows up when you move a familiar pattern into an unfamiliar context.",
    img: imgInputHint,
    aspectClass: "aspect-[16/0]",
    slug: "inputandhint",
    caption: "Familiar chat layout with a context-aware hint — designed so the learning curve is nearly zero.",
  },
  {
    title: "Quick-help prompts on new chat",
    detail: "When a new conversation starts (or the deal has no prior chat history), the widget surfaces three suggested prompts relevant to the current deal stage. These are not generic — they're derived from the deal record in real time. A deal in Negotiation gets different suggestions than a deal in Prospecting. This handles the cold-start problem: users who don't know what to ask get started immediately, and users who do know can ignore the suggestions entirely.",
    img: imgQuickHelp,
    aspectClass: "aspect-[16/16]",
      slug: "quickhelponnewchat",
    caption: "Stage-aware quick-help prompts on new chat — derived from the deal record, not generic placeholders.",
  },
  {
    title: "Per-deal chat threads + search",
    detail: "The initial build had a single continuous thread — every conversation for every deal in one long scroll. It worked, but it became unmanageable fast. I pushed for splitting conversations by deal record, so each deal has its own isolated history. Combined with search, reps can find a specific email draft, summary, or decision from weeks ago without scrolling. This was one of the most impactful structural changes across the whole project — something that came from observing how reps actually used the tool in early testing, not from the original brief.",
    img: imgSearchNav,
    aspectClass: "aspect-[14/12]",
    slug: "searchandnav",
    caption: "Per-deal threads with search — each deal record has its own conversation history, fully searchable.",
  },
  {
    title: "In-widget record creation confirmation",
    detail: "When Agent 2 creates a record, the confirmation appears inline in the chat — not as a system modal, not as a toast that disappears. The rep can see exactly what was created, with the record name and type, without navigating away. This was a deliberate choice to keep the rep in the conversation flow rather than pulling their attention to a different part of the UI.",
    img: null,
    aspectClass: "aspect-[16/9]",
    slug: null,
    caption: null,
  },
];

export default function CRMAIWidgetPage() {
  const articleRef = useRef<HTMLElement>(null);
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useLayoutEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    letterRefs.current.forEach((el) => {
      if (el) gsap.set(el, { opacity: 0, scale: 0, transformOrigin: "center center" });
    });
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const article = articleRef.current;
    if (!article) return;

    const ctx = gsap.context(() => {
      const letters = letterRefs.current.filter(Boolean) as HTMLSpanElement[];
      letters.forEach((el) => {
        gsap.set(el, {
          opacity: 0,
          scale: 0,
          rotation: (Math.random() - 0.5) * 360,
          transformOrigin: "center center",
        });
      });
      gsap.to(letters, {
        opacity: 1, scale: 1, rotation: 0,
        duration: 0.45, stagger: 0.045,
        ease: "back.out(2.2)", delay: 0.1,
      });

      gsap.from('[data-hero="sub"]', {
        opacity: 0, y: 20, duration: 0.55, stagger: 0.1,
        ease: "power2.out", delay: 0.65,
      });
      gsap.from('[data-hero="meta"]', {
        opacity: 0, y: 28, duration: 0.5, stagger: 0.08,
        ease: "power2.out", delay: 0.82,
      });
      gsap.from('[data-hero="tech"]', {
        opacity: 0, y: 20, filter: "blur(6px)",
        duration: 0.65, ease: "power2.out", delay: 0.95,
      });
    }, article);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const article = articleRef.current;
    if (!article) return;

    const ctx = gsap.context(() => {
      gsap.from('[data-anim="hero-img"]', {
        scrollTrigger: { trigger: '[data-anim="hero-img"]', start: "top 85%", once: true },
        opacity: 0, y: 40, scale: 0.97, duration: 0.8, ease: "power3.out",
      });

      gsap.utils.toArray<HTMLElement>('[data-anim="divider"]').forEach((el) => {
        gsap.from(el, {
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
          scaleX: 0, transformOrigin: "left center", duration: 0.7, ease: "power2.out",
        });
      });

      gsap.utils.toArray<HTMLElement>('[data-anim="section-head"]').forEach((el) => {
        gsap.from(el, {
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
          opacity: 0, y: 24, duration: 0.6, ease: "power2.out",
        });
      });

      gsap.utils.toArray<HTMLElement>('[data-anim="body"]').forEach((el) => {
        gsap.from(el, {
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
          opacity: 0, y: 16, duration: 0.55, ease: "power2.out",
        });
      });

      gsap.utils.toArray<HTMLElement>('[data-anim="screenshot"]').forEach((el) => {
        gsap.from(el, {
          scrollTrigger: { trigger: el, start: "top 87%", once: true },
          opacity: 0, y: 36, scale: 0.97, duration: 0.75, ease: "power3.out",
        });
      });

      const cards = gsap.utils.toArray<HTMLElement>('[data-anim="card"]');
      if (cards.length) {
        gsap.from(cards, {
          scrollTrigger: { trigger: cards[0], start: "top 85%", once: true },
          opacity: 0, y: 28, scale: 0.96, duration: 0.55,
          stagger: 0.1, ease: "power2.out",
        });
      }

      gsap.utils.toArray<HTMLElement>('[data-anim="stat"]').forEach((el) => {
        gsap.from(el, {
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
          opacity: 0, scale: 0.6, duration: 0.55, ease: "back.out(1.8)",
        });
      });

      const impactCards = gsap.utils.toArray<HTMLElement>('[data-anim="impact-card"]');
      if (impactCards.length) {
        gsap.from(impactCards, {
          scrollTrigger: { trigger: impactCards[0], start: "top 85%", once: true },
          opacity: 0, y: 24, scale: 0.97, duration: 0.5,
          stagger: 0.1, ease: "power2.out",
        });
      }
    }, article);

    return () => ctx.revert();
  }, []);

  return (
    <div className="flex min-h-screen flex-col pt-24 xl:pt-20">
      <CaseStudyMobileNav sections={CRM_SECTIONS} />
      <CaseStudySideNav sections={CRM_SECTIONS} />

      <article
        ref={articleRef}
        className="mx-auto w-full max-w-3xl flex-1 px-4 pb-28 md:px-6"
      >
        {/* Breadcrumb */}
        <nav
          data-hero="sub"
          className="mb-10 flex items-center gap-1.5 text-xs text-muted-foreground"
        >
          <Link href="/" className="googlesans-regular transition-colors hover:text-foreground">
            Home
          </Link>
          <ChevronRight className="size-3 shrink-0 opacity-50" aria-hidden />
          <Link href="/mywork" className="googlesans-regular transition-colors hover:text-foreground">
            Projects
          </Link>
          <ChevronRight className="size-3 shrink-0 opacity-50" aria-hidden />
          <span className="googlesans-medium text-foreground">CRM AI Widget</span>
        </nav>

        {/* Header */}
        <header id="intro" className="mb-12 scroll-mt-28 space-y-5">
          <div data-hero="sub" className="flex items-center gap-3">
            <p className="gamja-regular text-lg tracking-tighter text-muted-foreground">
              Case study
            </p>
            <span className="border border-emerald-300/60 dark:border-emerald-700/60 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 googlesans-medium text-[10px] uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
              Work
            </span>
          </div>
          <h1
            className="font-modak text-7xl leading-none text-primary"
            style={{ transform: "skewX(-3deg)" }}
            aria-label="CRM AI Widget"
          >
            {TITLE_LETTERS.map((l, i) => (
              <span
                key={i}
                ref={(el) => { letterRefs.current[i] = el; }}
                className={
                  "space" in l && l.space
                    ? "inline-block mr-[0.25em]"
                    : "inline-block"
                }
              >
                {"space" in l && l.space ? "\u00A0" : l.ch}
              </span>
            ))}
          </h1>
          <p
            data-hero="sub"
            className="googlesans-regular max-w-prose text-base leading-relaxed text-muted-foreground md:text-lg"
          >
            A client needed AI built directly into their CRM — not a
            separate tool, not a tab to switch to. A two-agent system that
            understands their deal data, figures out what needs to happen next,
            and then creates the records to make it happen.
          </p>
        </header>

        {/* Meta row */}
        <div className="my-10 grid grid-cols-3 gap-2">
          {[
            { label: "Role", value: "UX Designer and Software Engineer" },
            { label: "Type", value: "Client Work · Aether Automation" },
            { label: "Timeline", value: "June 2025 – December 2025" },
          ].map((m) => (
            <div
              key={m.label}
              data-hero="meta"
              className="flex flex-col gap-1 border border-border bg-muted/30 px-4 py-3"
            >
              <span className="googlesans-medium text-[10px] uppercase tracking-wider text-muted-foreground">
                {m.label}
              </span>
              <span className="googlesans-medium text-sm text-foreground">
                {m.value}
              </span>
            </div>
          ))}
        </div>

        {/* Stack */}
        <div
          data-hero="tech"
          className="mb-10 grid gap-6 text-sm sm:grid-cols-3 border border-dashed border-border bg-muted/20 px-5 py-5"
        >
          <div>
            <p className="googlesans-semibold mb-2 text-foreground">Frontend</p>
            <ul className="googlesans-regular space-y-1 text-muted-foreground">
              <li>React.js</li>
              <li>TypeScript</li>
              <li>Tailwind CSS</li>
            </ul>
          </div>
          <div>
            <p className="googlesans-semibold mb-2 text-foreground">Backend</p>
            <ul className="googlesans-regular space-y-1 text-muted-foreground">
              <li>Python</li>
              <li>Deluge (CRM)</li>
              <li>OpenAI API</li>
            </ul>
          </div>
          <div>
            <p className="googlesans-semibold mb-2 text-foreground">Design</p>
            <ul className="googlesans-regular space-y-1 text-muted-foreground">
              <li>Figma</li>
              <li>Interaction design</li>
              <li>UX research</li>
            </ul>
          </div>
        </div>

        <div className="space-y-16">

          {/* Hero image */}
          <div data-anim="hero-img">
            <CaseImage
              slug="wholewidgetview"
              src={imgWholeWidget}
              title="The AI widget embedded inside the CRM — accessible from any deal record, scoped to that deal's data."
              aspectClass="aspect-[16/10.5]"
              accent="blue"
              objectPosition="top"
            />
          </div>

          <hr data-anim="divider" className="border-t border-border" />

          {/* ── The problem ── */}
          <section id="problem" className="scroll-mt-28 space-y-5">
            <div data-anim="section-head" className="space-y-1">
              <p className="gamja-regular text-lg tracking-tighter text-muted-foreground">
                The problem
              </p>
              <h2 className="googlesans-semibold text-2xl text-foreground lg:text-3xl">
                Reps were leaving the CRM to use AI. Every single time.
              </h2>
            </div>
            <p
              data-anim="body"
              className="googlesans-regular leading-relaxed text-muted-foreground"
            >
              The client&apos;s sales team had already adopted AI — but not in
              the way anyone wanted. Their workflow was: open the deal in the CRM,
              manually copy the relevant notes, emails, and context, paste it
              all into ChatGPT or Claude, generate an email or summary, then
              come back to the CRM to actually use it. Every time. For every
              deal. The data was in the CRM. The AI was somewhere else.
            </p>
            <p
              data-anim="body"
              className="googlesans-regular leading-relaxed text-muted-foreground"
            >
              The client&apos;s ask was direct: bring AI into the CRM itself so
              reps never have to leave. And once we were building it, integrating
              record creation — tasks, contacts, notes, meetings — directly from
              the same interface became an obvious extension of the same idea.
            </p>

            <div className="grid gap-3 pt-2 sm:grid-cols-3">
              {[
                {
                  title: "Copy-pasting to ChatGPT",
                  detail: "Reps manually gathered deal context, copied it out of the CRM, and pasted it into an external AI tool — then came back to action the output. Slow, error-prone, and repetitive.",
                },
                {
                  title: "Manual record creation",
                  detail: "Every follow-up task, new contact, meeting, and note was created by hand. The rep had already done the cognitive work of figuring out what was needed — they just had to click through it all.",
                },
                {
                  title: "No deal memory",
                  detail: "Every session in ChatGPT or Claude started blank. No awareness of what had already been discussed, decided, or sent on that deal. Context had to be re-pasted every time.",
                },
              ].map((f) => (
                <div
                  key={f.title}
                  data-anim="card"
                  className="border border-dashed border-border bg-muted/20 px-4 py-4"
                >
                  <p className="googlesans-semibold mb-2 text-sm text-foreground">{f.title}</p>
                  <p className="googlesans-regular text-sm leading-snug text-muted-foreground">{f.detail}</p>
                </div>
              ))}
            </div>
          </section>

          <hr data-anim="divider" className="border-t border-border" />

          {/* ── Process ── */}
          <section id="process" className="scroll-mt-28 space-y-5">
            <div data-anim="section-head" className="space-y-1">
              <p className="gamja-regular text-lg tracking-tighter text-muted-foreground">
                Process
              </p>
              <h2 className="googlesans-semibold text-2xl text-foreground lg:text-3xl">
                Heavy iteration — on the UI, the logic, and the workflow.
              </h2>
            </div>
            <p
              data-anim="body"
              className="googlesans-regular leading-relaxed text-muted-foreground"
            >
              This wasn&apos;t a one-shot build. The client was deeply involved
              throughout — reviewing designs in Figma, testing working builds,
              and giving feedback on both the UI and the underlying logic.
              Multiple rounds of iteration shaped everything from the agent
              architecture to individual interaction patterns.
            </p>

            <div className="grid gap-3 pt-2 sm:grid-cols-3">
              {[
                {
                  title: "UI iterations",
                  detail: "The widget layout went through several rounds based on client feedback — input placement, how conversations were surfaced, how record confirmations appeared inline. Each round sharpened clarity.",
                },
                {
                  title: "Logic iterations",
                  detail: "The agent responsibilities were refined through testing. Early versions had too much overlap between analysis and execution. Client feedback on incorrect or unexpected record creation drove the clean separation that became the final architecture.",
                },
                {
                  title: "Workflow iterations",
                  detail: "The per-deal chat split wasn&apos;t in the original spec. Observing how reps used the tool in early sessions surfaced it as a pain point. The client signed off on the change after seeing the difference in a working prototype.",
                },
              ].map((f) => (
                <div
                  key={f.title}
                  data-anim="card"
                  className="border border-dashed border-border bg-muted/20 px-4 py-4"
                >
                  <p className="googlesans-semibold mb-2 text-sm text-foreground">{f.title}</p>
                  <p className="googlesans-regular text-sm leading-snug text-muted-foreground">{f.detail}</p>
                </div>
              ))}
            </div>
          </section>

          <hr data-anim="divider" className="border-t border-border" />

          {/* ── Architecture ── */}
          <section id="architecture" className="scroll-mt-28 space-y-5">
            <div data-anim="section-head" className="space-y-1">
              <p className="gamja-regular text-lg tracking-tighter text-muted-foreground">
                System architecture
              </p>
              <h2 className="googlesans-semibold text-2xl text-foreground lg:text-3xl">
                Why two agents — and why not one.
              </h2>
            </div>
            <p
              data-anim="body"
              className="googlesans-regular leading-relaxed text-muted-foreground"
            >
              The first instinct might be to build one agent that does
              everything: reads the deal, reasons about it, and creates records.
              That approach breaks down fast. A single agent trying to both
              understand complex deal context and execute structured CRM
              operations ends up doing neither well. The reasoning gets
              polluted by the execution logic; the execution gets confused by
              open-ended analysis.
            </p>
            <p
              data-anim="body"
              className="googlesans-regular leading-relaxed text-muted-foreground"
            >
              The solution was separation of concerns — two agents with distinct
              responsibilities and a clean handoff between them.
            </p>

            {/* Architecture diagram as text */}
            <div data-anim="body" className="border border-dashed border-border bg-muted/20 px-5 py-5 space-y-4">
              <p className="googlesans-medium text-xs uppercase tracking-wider text-muted-foreground">
                System flow
              </p>
              <div className="space-y-2">
                {[
                  { step: "01", label: "User opens deal record in the CRM", note: "Widget loads with deal ID and conversation history scoped to that record" },
                  { step: "02", label: "User sends a message or prompt", note: "Input hits the Python backend via CRM Functions" },
                  { step: "03", label: "Agent 1 — Analysis", note: "Reads deal data, notes, and prior conversation. Determines what needs to happen. Produces structured intent output." },
                  { step: "04", label: "Agent 2 — Execution", note: "Receives intent from Agent 1. Calls the appropriate CRM API operations to create or update contacts, deals, tasks, notes, and meetings." },
                  { step: "05", label: "Response streams back to widget", note: "User sees the AI reply in real time. Any records created are confirmed inline." },
                ].map((s) => (
                  <div key={s.step} className="flex gap-4">
                    <span className="font-modak text-2xl leading-none text-muted-foreground/30 shrink-0 w-7">{s.step}</span>
                    <div>
                      <p className="googlesans-semibold text-sm text-foreground">{s.label}</p>
                      <p className="googlesans-regular text-xs leading-relaxed text-muted-foreground mt-0.5">{s.note}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div data-anim="body" className="space-y-2">
              <p className="googlesans-medium text-xs uppercase tracking-wider text-muted-foreground">
                Key architectural decisions
              </p>
              <div className="space-y-3">
                {[
                  {
                    title: "Per-deal conversation scoping",
                    detail: "Each deal record has its own isolated chat history. The agents always have full context of everything that's been discussed about that specific deal — and nothing from other deals bleeds in. This was the single most important architectural decision: it's what gives the system genuine deal memory.",
                  },
                  {
                    title: "GPT function calling for structured execution",
                    detail: "Rather than parsing free-text output to determine what records to create, Agent 2 uses OpenAI function calling. The model outputs structured JSON that maps directly to CRM API calls. This eliminates a whole class of parsing errors and makes the execution layer deterministic.",
                  },
                  {
                    title: "Python orchestration layer over Deluge",
                    detail: "Deluge (the CRM's in-house scripting language) handles the CRM-native operations — reading records, calling internal APIs, managing the widget context. Python sits above it, handling the OpenAI calls, agent routing, and streaming logic. Each layer does what it's best at.",
                  },
                ].map((d) => (
                  <div key={d.title} data-anim="body" className="border-l-2 border-border pl-4">
                    <p className="googlesans-semibold text-sm text-foreground">{d.title}</p>
                    <p className="googlesans-regular mt-0.5 text-sm leading-relaxed text-muted-foreground">{d.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <hr data-anim="divider" className="border-t border-border" />

          {/* ── Agent 1 ── */}
          <section id="agent1" className="scroll-mt-28 space-y-5">
            <div data-anim="section-head" className="space-y-1">
              <p className="gamja-regular text-lg tracking-tighter text-muted-foreground">
                Agent 1 — Analysis
              </p>
              <h2 className="googlesans-semibold text-2xl text-foreground lg:text-3xl">
                Understands the deal. Decides what needs to happen next.
              </h2>
            </div>
            <p
              data-anim="body"
              className="googlesans-regular leading-relaxed text-muted-foreground"
            >
              Agent 1 is a reasoning agent. It reads the full deal record —
              stage, associated contacts, recent notes, activity history, and
              the current conversation — and builds a picture of where the deal
              stands. When a user asks a question or gives a prompt, Agent 1
              determines the intent and produces a structured output describing
              what action, if any, Agent 2 should take.
            </p>
            <p
              data-anim="body"
              className="googlesans-regular leading-relaxed text-muted-foreground"
            >
              This agent is GPT-4o with a system prompt that emphasizes
              interpretive accuracy over speed. It has access to the full deal
              context window and the conversation history for that record. It
              does not call any CRM APIs directly — its only output is analysis
              and intent.
            </p>

            <div className="grid gap-4 sm:grid-cols-2 pt-2">
              {[
                {
                  title: "Deal summary on demand",
                  detail: "Synthesises the entire deal thread into a plain-language summary: where things stand, what was last discussed, what blockers exist.",
                  accent: "blue",
                },
                {
                  title: "Next-step reasoning",
                  detail: "Based on the deal stage and recent activity, identifies what the natural next action is — follow-up email, schedule a meeting, update a field — and surfaces it as a suggestion.",
                  accent: "blue",
                },
                {
                  title: "Email drafting",
                  detail: "Drafts context-aware follow-up emails using the deal data. Not a generic template — it knows the deal name, the contact, the last touchpoint, and writes accordingly.",
                  accent: "blue",
                },
                {
                  title: "Intent classification for Agent 2",
                  detail: "When an action is needed (create a task, log a note, add a contact), Agent 1 classifies the intent and passes a structured signal to Agent 2. It does not execute — that's Agent 2's job.",
                  accent: "blue",
                },
              ].map((c) => (
                <div
                  key={c.title}
                  data-anim="card"
                  className="border border-dashed border-sky-500/30 bg-sky-500/4 px-4 py-4"
                >
                  <p className="googlesans-semibold mb-2 text-sm text-sky-600 dark:text-sky-400">{c.title}</p>
                  <p className="googlesans-regular text-sm leading-snug text-muted-foreground">{c.detail}</p>
                </div>
              ))}
            </div>
          </section>

          <hr data-anim="divider" className="border-t border-border" />

          {/* ── Agent 2 ── */}
          <section id="agent2" className="scroll-mt-28 space-y-5">
            <div data-anim="section-head" className="space-y-1">
              <p className="gamja-regular text-lg tracking-tighter text-muted-foreground">
                Agent 2 — Execution
              </p>
              <h2 className="googlesans-semibold text-2xl text-foreground lg:text-3xl">
                Takes the intent. Builds the records.
              </h2>
            </div>
            <p
              data-anim="body"
              className="googlesans-regular leading-relaxed text-muted-foreground"
            >
              Agent 2 is an execution agent. It receives a structured intent
              from Agent 1 and translates it into real CRM operations.
              Where Agent 1 is open-ended and interpretive, Agent 2 is precise
              and deterministic — it uses GPT function calling to output
              structured JSON, which maps directly to CRM API calls handled
              by the Deluge layer.
            </p>
            <p
              data-anim="body"
              className="googlesans-regular leading-relaxed text-muted-foreground"
            >
              Agent 2 handles five record types, each mapped to a distinct
              function call schema. The agent decides which schema applies,
              populates it from the deal context, and executes. The user gets a
              confirmation in the chat stream as each record is created.
            </p>

            <div className="grid gap-3 sm:grid-cols-3 pt-2">
              {[
                { record: "Contacts", detail: "Creates a new CRM contact from deal participants, populated with name, email, company, and role inferred from deal notes." },
                { record: "Deals", detail: "Creates or updates a deal record — stage, amount, close date, and associated contacts set from the conversation context." },
                { record: "Tasks", detail: "Schedules follow-up tasks with due dates, assignees, and priority derived from Agent 1's next-step output." },
                { record: "Notes", detail: "Logs structured notes against the deal record — meeting summaries, key decisions, blockers — without the rep having to type anything." },
                { record: "Meetings", detail: "Creates a meeting record with attendees, date, and agenda pre-filled from the context. Syncs with the CRM calendar." },
              ].map((r) => (
                <div
                  key={r.record}
                  data-anim="card"
                  className="border border-dashed border-orange-500/30 bg-orange-500/4 px-4 py-4"
                >
                  <p className="googlesans-semibold mb-1.5 text-sm text-orange-600 dark:text-orange-400">{r.record}</p>
                  <p className="googlesans-regular text-xs leading-snug text-muted-foreground">{r.detail}</p>
                </div>
              ))}
            </div>

            <div data-anim="screenshot" className="pt-2">
              <CaseImage
                slug="recordgeneration"
                src={imgRecordGen}
                title="Agent 2 in action — records being created inline, confirmed in the chat stream."
                aspectClass="aspect-[16/8]"
                accent="orange"
                objectPosition="top"
              />
            </div>
          </section>

          <hr data-anim="divider" className="border-t border-border" />

          {/* ── Design decisions ── */}
          <section id="design" className="scroll-mt-28 space-y-6">
            <div data-anim="section-head" className="space-y-1">
              <p className="gamja-regular text-lg tracking-tighter text-muted-foreground">
                Design decisions
              </p>
              <h2 className="googlesans-semibold text-2xl text-foreground lg:text-3xl">
                Every UI choice had to earn its place in a CRM context.
              </h2>
            </div>
            <p
              data-anim="body"
              className="googlesans-regular leading-relaxed text-muted-foreground"
            >
              This wasn&apos;t a consumer product with forgiving margins for
              confusion. The users are sales reps mid-deal — high cognitive
              load, zero patience for friction. Every design decision was
              evaluated against one question: does this make the rep faster,
              or does it add a step?
            </p>

            <div className="space-y-4">
              {DESIGN_DECISIONS.map((d) => (
                <div key={d.title} className="space-y-3">
                  <div data-anim="body" className="border-l-2 border-border pl-4">
                    <p className="googlesans-semibold text-sm text-foreground">{d.title}</p>
                    <p className="googlesans-regular mt-0.5 text-sm leading-relaxed text-muted-foreground">{d.detail}</p>
                  </div>
                  {d.img && d.slug && (
                    <div data-anim="screenshot">
                      <CaseImage
                        slug={d.slug}
                        src={d.img}
                        title={d.caption ?? d.title}
                        aspectClass={d.aspectClass}
                        accent="blue"
                        objectPosition="top"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          <hr data-anim="divider" className="border-t border-border" />

          {/* ── Prototype ── */}
          <section id="prototype" className="scroll-mt-28 space-y-8">
            <div data-anim="section-head" className="space-y-1">
              <p className="gamja-regular text-lg tracking-tighter text-muted-foreground">
                The build
              </p>
              <h2 className="googlesans-semibold text-2xl text-foreground lg:text-3xl">
                Deployed inside the CRM. Live on real deal data.
              </h2>
            </div>
            <p
              data-anim="body"
              className="googlesans-regular leading-relaxed text-muted-foreground"
            >
              The widget is embedded directly in the CRM using CRM Canvas —
              it lives on the deal record page and is scoped to that record
              from the moment it loads. There&apos;s no separate app to open,
              no copy-paste of deal context, no tab switching. The rep is
              already looking at the deal; the AI is right there with them.
            </p>

            <div data-anim="screenshot">
              <CaseImage
                slug="wholewidgetview"
                src={imgWholeWidget}
                title="Full widget view — embedded in the CRM deal record, chat history scoped to this deal."
                aspectClass="aspect-[16/10.5]"
                accent="blue"
                objectPosition="top"
              />
            </div>
          </section>

          <hr data-anim="divider" className="border-t border-border" />

          {/* ── Impact ── */}
          <section id="impact" className="scroll-mt-28 space-y-6">
            <p
              data-anim="section-head"
              className="gamja-regular text-lg tracking-tighter text-muted-foreground"
            >
              Impact
            </p>

            <div className="grid gap-4 sm:grid-cols-3">
              {[
                {
                  heading: "For sales reps",
                  body: "Deal summaries, follow-up drafts, and record creation happen in seconds — from the same page they're already on. The cognitive overhead of context-switching is gone.",
                  accent: "blue",
                },
                {
                  heading: "For the CRM",
                  body: "Record quality improved. Notes are longer and more structured. Tasks are created consistently. Contacts are added at the right time. The data that was always supposed to be in the CRM is actually there.",
                  accent: "orange",
                },
                {
                  heading: "For the client",
                  body: "A measurable reduction in time spent on administrative work — captured in the metrics below. The system paid for itself in the first month.",
                  accent: "blue",
                },
              ].map((c) => (
                <div
                  key={c.heading}
                  data-anim="impact-card"
                  className={
                    c.accent === "blue"
                      ? "border border-dashed border-sky-500/30 bg-sky-500/4 px-4 py-4"
                      : "border border-dashed border-orange-500/30 bg-orange-500/4 px-4 py-4"
                  }
                >
                  <p className={`googlesans-semibold mb-2 text-sm ${c.accent === "blue" ? "text-sky-600 dark:text-sky-400" : "text-orange-600 dark:text-orange-400"}`}>
                    {c.heading}
                  </p>
                  <p className="googlesans-regular text-sm leading-relaxed text-muted-foreground">
                    {c.body}
                  </p>
                </div>
              ))}
            </div>

            <div className="grid gap-6 pt-2 text-sm sm:grid-cols-3">
              <div>
                <p data-anim="stat" className="font-modak text-5xl text-sky-500">40%</p>
                <p data-anim="body" className="googlesans-semibold mt-1 text-foreground">
                  Less manual data entry
                </p>
                <p data-anim="body" className="googlesans-regular mt-1 text-muted-foreground">
                  Record creation — contacts, tasks, notes, meetings — handled by Agent 2 without the rep typing a field.
                </p>
              </div>
              <div>
                <p data-anim="stat" className="font-modak text-5xl text-orange-500">20+</p>
                <p data-anim="body" className="googlesans-semibold mt-1 text-foreground">
                  Hours saved per week
                </p>
                <p data-anim="body" className="googlesans-regular mt-1 text-muted-foreground">
                  Across initial email drafting, deal summarisation, and follow-up record creation.
                </p>
              </div>
              <div>
                <p data-anim="stat" className="font-modak text-5xl text-sky-500">2</p>
                <p data-anim="body" className="googlesans-semibold mt-1 text-foreground">
                  Specialised agents
                </p>
                <p data-anim="body" className="googlesans-regular mt-1 text-muted-foreground">
                  One to reason, one to execute. Clean separation of concerns that scales as new record types and operations are added.
                </p>
              </div>
            </div>

            <p
              data-anim="body"
              className="googlesans-regular border-l-2 border-border pl-4 text-sm leading-relaxed text-muted-foreground"
            >
              The biggest lesson from this build: AI in a CRM is only useful if
              it knows which deal it&apos;s talking about. Generic AI assistants
              fail here because they lack the specific context that makes an
              answer actionable. Every architectural and design decision in this
              system traces back to that single constraint — make the AI
              deal-aware, and everything else follows.
            </p>
          </section>

        </div>
      </article>

      <Footer />
    </div>
  );
}
