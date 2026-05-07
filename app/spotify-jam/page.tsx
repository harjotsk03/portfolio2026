"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import Link from "next/link";
import { ChevronRight, ExternalLink } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Footer } from "@/components/footer";
import { CaseImage } from "@/components/studyspotr/case-image";
import {
  CaseStudySideNav,
  CaseStudyMobileNav,
  type CaseSection,
} from "@/components/studyspotr/case-study-nav";
import { Button } from "@/components/ui/button";
import { FlowVideo } from "@/components/spotify/flow-video";

import imgScreen from "@/assets/spotifycasestudy/screen-light.png";

gsap.registerPlugin(ScrollTrigger);

const SHOWCASE_HREF =
  "https://www.sfu.ca/siat/showcase/fall-2025-project-showcase/iat-334-spotify-jam-feature-addition.html";
const FIGMA_HREF =
  "https://www.figma.com/proto/zP1XWEDFInlQUMCO69O0Jz/Spotify-Feature-Design?node-id=22-600&t=7zLwctZD01HrWVAJ-1&scaling=scale-down&content-scaling=fixed&page-id=0%3A1&starting-point-node-id=22%3A600&show-proto-sidebar=1";
const SLIDE_DECK_HREF =
  "https://www.figma.com/design/zP1XWEDFInlQUMCO69O0Jz/Spotify-Feature-Design?node-id=80-555";

const SPOTIFY_SECTIONS: CaseSection[] = [
  { id: "intro", label: "Intro" },
  { id: "problem", label: "The problem" },
  { id: "research", label: "Research" },
  { id: "insight", label: "Key insight" },
  { id: "design", label: "The design" },
  { id: "flows", label: "User flows" },
  { id: "impact", label: "Impact" },
];

// "Spotify Jam" split into letter spans
const TITLE_LETTERS = [
  { ch: "S" }, { ch: "p" }, { ch: "o" }, { ch: "t" }, { ch: "i" }, { ch: "f" }, { ch: "y" },
  { ch: " ", space: true },
  { ch: "J" }, { ch: "a" }, { ch: "m" },
] as const;

export default function SpotifyJamPage() {
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
        opacity: 1,
        scale: 1,
        rotation: 0,
        duration: 0.45,
        stagger: 0.045,
        ease: "back.out(2.2)",
        delay: 0.1,
      });

      gsap.from('[data-hero="sub"]', {
        opacity: 0,
        y: 20,
        duration: 0.55,
        stagger: 0.1,
        ease: "power2.out",
        delay: 0.65,
      });

      gsap.from('[data-hero="meta"]', {
        opacity: 0,
        y: 28,
        duration: 0.5,
        stagger: 0.08,
        ease: "power2.out",
        delay: 0.82,
      });

      gsap.from('[data-hero="tech"]', {
        opacity: 0,
        y: 20,
        filter: "blur(6px)",
        duration: 0.65,
        ease: "power2.out",
        delay: 0.95,
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
        opacity: 0,
        y: 40,
        scale: 0.97,
        duration: 0.8,
        ease: "power3.out",
      });

      gsap.utils.toArray<HTMLElement>('[data-anim="divider"]').forEach((el) => {
        gsap.from(el, {
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
          scaleX: 0,
          transformOrigin: "left center",
          duration: 0.7,
          ease: "power2.out",
        });
      });

      gsap.utils.toArray<HTMLElement>('[data-anim="section-head"]').forEach((el) => {
        gsap.from(el, {
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
          opacity: 0,
          y: 24,
          duration: 0.6,
          ease: "power2.out",
        });
      });

      gsap.utils.toArray<HTMLElement>('[data-anim="body"]').forEach((el) => {
        gsap.from(el, {
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
          opacity: 0,
          y: 16,
          duration: 0.55,
          ease: "power2.out",
        });
      });

      // Interview quotes — slide up with slight scale
      const quotes = gsap.utils.toArray<HTMLElement>('[data-anim="quote-card"]');
      if (quotes.length) {
        gsap.from(quotes, {
          scrollTrigger: { trigger: quotes[0], start: "top 85%", once: true },
          opacity: 0,
          y: 28,
          scale: 0.96,
          duration: 0.55,
          stagger: 0.12,
          ease: "power2.out",
        });
      }

      // Standout quote — scale in
      gsap.from('[data-anim="standout-quote"]', {
        scrollTrigger: { trigger: '[data-anim="standout-quote"]', start: "top 85%", once: true },
        opacity: 0,
        scale: 0.97,
        y: 20,
        duration: 0.7,
        ease: "power3.out",
      });

      // Before/after cards — stagger up
      const beforeAfter = gsap.utils.toArray<HTMLElement>('[data-anim="before-after"]');
      if (beforeAfter.length) {
        gsap.from(beforeAfter, {
          scrollTrigger: { trigger: beforeAfter[0], start: "top 85%", once: true },
          opacity: 0,
          y: 24,
          duration: 0.5,
          stagger: 0.08,
          ease: "power2.out",
        });
      }

      // Flow cards — stagger up
      const flowCards = gsap.utils.toArray<HTMLElement>('[data-anim="flow-card"]');
      if (flowCards.length) {
        gsap.from(flowCards, {
          scrollTrigger: { trigger: flowCards[0], start: "top 85%", once: true },
          opacity: 0,
          y: 28,
          scale: 0.96,
          duration: 0.55,
          stagger: 0.1,
          ease: "power2.out",
        });
      }

      // Heuristic pills — pop in
      const heuristics = gsap.utils.toArray<HTMLElement>('[data-anim="heuristic"]');
      if (heuristics.length) {
        gsap.from(heuristics, {
          scrollTrigger: { trigger: heuristics[0], start: "top 88%", once: true },
          opacity: 0,
          scale: 0.7,
          duration: 0.4,
          stagger: 0.07,
          ease: "back.out(2)",
        });
      }

      // Impact cards — stagger with pop
      const impactCards = gsap.utils.toArray<HTMLElement>('[data-anim="impact-card"]');
      if (impactCards.length) {
        gsap.from(impactCards, {
          scrollTrigger: { trigger: impactCards[0], start: "top 85%", once: true },
          opacity: 0,
          y: 24,
          scale: 0.97,
          duration: 0.5,
          stagger: 0.1,
          ease: "power2.out",
        });
      }

      // Stats — pop in with bounce
      gsap.utils.toArray<HTMLElement>('[data-anim="stat"]').forEach((el) => {
        gsap.from(el, {
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
          opacity: 0,
          scale: 0.6,
          duration: 0.55,
          ease: "back.out(1.8)",
        });
      });

      gsap.utils.toArray<HTMLElement>('[data-anim="screenshot"]').forEach((el) => {
        gsap.from(el, {
          scrollTrigger: { trigger: el, start: "top 87%", once: true },
          opacity: 0,
          y: 36,
          scale: 0.97,
          duration: 0.75,
          ease: "power3.out",
        });
      });
    }, article);

    return () => ctx.revert();
  }, []);

  return (
    <div className="flex min-h-screen flex-col pt-24 xl:pt-20">
      <CaseStudyMobileNav sections={SPOTIFY_SECTIONS} />
      <CaseStudySideNav sections={SPOTIFY_SECTIONS} />

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
          <span className="googlesans-medium text-foreground">Spotify Jam</span>
        </nav>

        {/* Header */}
        <header id="intro" className="mb-12 scroll-mt-28 space-y-5">
          <p
            data-hero="sub"
            className="gamja-regular text-lg tracking-tighter text-muted-foreground"
          >
            Case study
          </p>
          <h1
            className="font-modak text-7xl leading-none text-primary"
            style={{ transform: "skewX(-3deg)" }}
            aria-label="Spotify Jam"
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
            Spotify Jam lets friends listen together. But there&apos;s no way
            to tell the person who added a bad song that nobody&apos;s feeling
            it. I found that gap through user research, then designed the fix.
          </p>
          <div className="flex gap-2" data-hero="sub">
            <Button variant="outline" size={"xs"} className="gap-1.5 font-google-sans" asChild>
              <a href={SHOWCASE_HREF} target="_blank" rel="noopener noreferrer">
                SFU Showcase <ExternalLink className="size-3 opacity-70" aria-hidden />
              </a>
            </Button>
            <Button variant="outline" size={"xs"} className="gap-1.5 font-google-sans" asChild>
              <a href={SLIDE_DECK_HREF} target="_blank" rel="noopener noreferrer">
                Slide Deck <ExternalLink className="size-3 opacity-70" aria-hidden />
              </a>
            </Button>
            <Button variant="orange" size={"xs"} className="gap-1.5 font-google-sans" asChild>
              <a href={FIGMA_HREF} target="_blank" rel="noopener noreferrer">
                Figma Prototype <ExternalLink className="size-3 opacity-70" aria-hidden />
              </a>
            </Button>
          </div>
        </header>

        {/* Meta row */}
        <div className="my-10 grid grid-cols-3 gap-2">
          {[
            { label: "Role", value: "UX Designer + Researcher" },
            { label: "Type", value: "Course Project · IAT 334" },
            { label: "Timeline", value: "Fall 2025" },
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

        {/* Tools */}
        <div
          data-hero="tech"
          className="mb-10 grid gap-6 text-sm sm:grid-cols-3 border border-dashed border-border bg-muted/20 px-5 py-5"
        >
          <div>
            <p className="googlesans-semibold mb-2 text-foreground">Research</p>
            <ul className="googlesans-regular space-y-1 text-muted-foreground">
              <li>User interviews</li>
              <li>Persona development</li>
              <li>Pain-point mapping</li>
            </ul>
          </div>
          <div>
            <p className="googlesans-semibold mb-2 text-foreground">Design</p>
            <ul className="googlesans-regular space-y-1 text-muted-foreground">
              <li>Figma (hi-fi mockups)</li>
              <li>Interactive prototype</li>
              <li>Wireflows × 5</li>
            </ul>
          </div>
          <div>
            <p className="googlesans-semibold mb-2 text-foreground">Principles</p>
            <ul className="googlesans-regular space-y-1 text-muted-foreground">
              <li>Nielsen&apos;s heuristics</li>
              <li>Nudge theory</li>
              <li>iOS design patterns</li>
            </ul>
          </div>
        </div>

        <div className="space-y-16">
          {/* Hero image */}
          <div data-anim="hero-img">
            <CaseImage
              slug="screen-light"
              src={imgScreen}
              title="Spotify Jam voting feature — hi-fi prototype screens."
              aspectClass="aspect-[16/9]"
              accent="orange"
            />
          </div>

          <hr data-anim="divider" className="border-t border-border" />

          {/* ── The problem ── */}
          <section id="problem" className="scroll-mt-28 space-y-4">
            <div data-anim="section-head" className="space-y-1">
              <p className="gamja-regular text-lg tracking-tighter text-muted-foreground">
                The problem
              </p>
              <h2 className="googlesans-semibold text-2xl text-foreground lg:text-3xl">
                Jam has no feedback loop. You add a song and hope for the best.
              </h2>
            </div>
            <p
              data-anim="body"
              className="googlesans-regular leading-relaxed text-muted-foreground"
            >
              Spotify Jam is a co-listening feature that lets multiple people
              add songs to a shared queue in real time. In theory: a perfect
              way to listen together. In practice: if someone adds a song that
              kills the vibe, nobody says anything. You sit through it. The
              contributor has no idea they whiffed. The listeners get no outlet.
            </p>
            <p
              data-anim="body"
              className="googlesans-regular leading-relaxed text-muted-foreground"
            >
              There&apos;s no mechanism for the group to say &ldquo;this
              doesn&apos;t fit&rdquo; — not anonymously, not at all. Every
              action that could communicate sentiment (skipping, removing) is
              heavy-handed and visible. So people say nothing. That silence
              is the problem.
            </p>

            {/* Before / After */}
            <div className="grid gap-3 pt-2 sm:grid-cols-2">
              <div
                data-anim="before-after"
                className="space-y-2 border border-dashed border-border bg-muted/20 px-4 py-4"
              >
                <p className="googlesans-semibold text-xs uppercase tracking-wider text-muted-foreground">
                  Before — silent disagreement
                </p>
                <ul className="googlesans-regular space-y-1.5 text-sm text-muted-foreground">
                  <li className="flex gap-2"><span className="opacity-40">—</span>No way to know if songs resonate</li>
                  <li className="flex gap-2"><span className="opacity-40">—</span>Queue managed by guesswork</li>
                  <li className="flex gap-2"><span className="opacity-40">—</span>Awkward social moments</li>
                  <li className="flex gap-2"><span className="opacity-40">—</span>Remote participants feel passive</li>
                </ul>
              </div>
              <div
                data-anim="before-after"
                className="space-y-2 border border-dashed border-orange-500/30 bg-orange-500/4 px-4 py-4"
              >
                <p className="googlesans-semibold text-xs uppercase tracking-wider text-orange-600 dark:text-orange-400">
                  After — informed decisions
                </p>
                <ul className="googlesans-regular space-y-1.5 text-sm text-muted-foreground">
                  <li className="flex gap-2"><span className="text-orange-500">+</span>Instant feedback on song choices</li>
                  <li className="flex gap-2"><span className="text-orange-500">+</span>Data-driven queue curation</li>
                  <li className="flex gap-2"><span className="text-orange-500">+</span>Anonymous, respectful mechanism</li>
                  <li className="flex gap-2"><span className="text-orange-500">+</span>Every participant has a voice</li>
                </ul>
              </div>
            </div>
          </section>

          <hr data-anim="divider" className="border-t border-border" />

          {/* ── Research ── */}
          <section id="research" className="scroll-mt-28 space-y-6">
            <div data-anim="section-head" className="space-y-1">
              <p className="gamja-regular text-lg tracking-tighter text-muted-foreground">
                Research
              </p>
              <h2 className="googlesans-semibold text-2xl text-foreground lg:text-3xl">
                Three interviews. One pattern that kept repeating.
              </h2>
            </div>
            <p
              data-anim="body"
              className="googlesans-regular leading-relaxed text-muted-foreground"
            >
              Before designing anything, I talked to active Jam users — one
              frequent host and two frequent participants, ages 18–22. The goal
              was to understand how Jam sessions actually felt, not just how
              they functioned. I used in-person, informal interviews to
              encourage honest, unfiltered answers.
            </p>

            <div className="grid gap-4 sm:grid-cols-3">
              {[
                {
                  name: "Maya, 22",
                  role: "Frequent host",
                  quote:
                    "\"I love hosting Jams at work, but I never know if people actually like the songs I add. Sometimes I see someone skip forward and I'm like... was that my song? Did they hate it?\"",
                  insight: "Lack of feedback creates uncertainty and anxiety for contributors.",
                },
                {
                  name: "Jordan, 21",
                  role: "Frequent participant",
                  quote:
                    "\"I'll be in a Jam with like 6 people, and someone adds a song that clearly doesn't fit the vibe. But nobody says anything. We all just... suffer through it. It's awkward.\"",
                  insight: "Social dynamics prevent honest feedback about misaligned songs.",
                },
                {
                  name: "Priya, 18",
                  role: "Frequent participant",
                  quote:
                    "\"When I'm not physically with my friends during a Jam, I feel so disconnected. I'm just passively listening. I wish I could interact more.\"",
                  insight: "Remote participants feel passive and disengaged.",
                },
              ].map((p) => (
                <div
                  key={p.name}
                  data-anim="quote-card"
                  className="border border-dashed border-border bg-muted/20 px-4 py-4"
                >
                  <p className="googlesans-semibold text-sm text-foreground">{p.name}</p>
                  <p className="googlesans-medium mb-3 text-[11px] text-muted-foreground/80">
                    {p.role}
                  </p>
                  <p className="googlesans-regular mb-3 text-xs italic leading-relaxed text-muted-foreground">
                    {p.quote}
                  </p>
                  <p className="googlesans-medium border-l-2 border-orange-500 dark:border-orange-800 pl-3 text-xs leading-snug text-foreground/80">
                    {p.insight}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <hr data-anim="divider" className="border-t border-border" />

          {/* ── Key insight ── */}
          <section id="insight" className="scroll-mt-28 space-y-5">
            <div data-anim="section-head" className="space-y-1">
              <p className="gamja-regular text-lg tracking-tighter text-muted-foreground">
                Key insight
              </p>
              <h2 className="googlesans-semibold text-2xl text-foreground lg:text-3xl">
                Everyone wanted to say something. Nobody had a way to.
              </h2>
            </div>
            <p
              data-anim="body"
              className="googlesans-regular leading-relaxed text-muted-foreground"
            >
              Every participant in the research expressed the same frustration:
              there was no lightweight, non-confrontational way to communicate
              how they felt about a song. The pattern was immediate. The design
              opportunity was clear.
            </p>

            {/* Standout quote */}
            <blockquote
              data-anim="standout-quote"
              className="border border-dashed border-border bg-muted/20 px-6 py-6"
            >
              <p className="googlesans-regular text-lg leading-relaxed text-foreground">
                &ldquo;If I knew that 6 out of 8 people weren&apos;t feeling my
                song, I&apos;d remove it in a heartbeat. But right now? I have
                no idea. So I just&hellip; hope for the best.&rdquo;
              </p>
              <footer className="googlesans-medium mt-3 text-xs uppercase tracking-wider text-muted-foreground">
                — Jordan, interview participant
              </footer>
            </blockquote>

            {/* Persona card */}
            <div data-anim="body">
              <p className="googlesans-medium mb-3 text-xs uppercase tracking-wider text-muted-foreground">
                Primary persona
              </p>
              <div className="border border-dashed border-border bg-muted/20 px-5 py-5">
                <div className="mb-3 flex items-start justify-between gap-4">
                  <div>
                    <p className="googlesans-semibold text-base text-foreground">Shane Crew</p>
                    <p className="googlesans-medium text-xs text-muted-foreground">
                      26 · Product Designer · Frequent Jam host
                    </p>
                  </div>
                </div>
                <p className="googlesans-regular mb-4 text-sm italic leading-relaxed text-muted-foreground">
                  &ldquo;I use Spotify Jam all the time when at work or hanging
                  out with friends. I wish there was a way to gauge how others
                  in my Jam feel when I queue new songs.&rdquo;
                </p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="googlesans-semibold mb-1.5 text-xs text-foreground">Goals</p>
                    <ul className="googlesans-regular space-y-1 text-sm text-muted-foreground">
                      <li>See how others feel about songs he adds</li>
                      <li>Remove songs quickly if the group doesn&apos;t like them</li>
                    </ul>
                  </div>
                  <div>
                    <p className="googlesans-semibold mb-1.5 text-xs text-foreground">Motivations</p>
                    <ul className="googlesans-regular space-y-1 text-sm text-muted-foreground">
                      <li>Often uses Jam remotely — needs async feedback</li>
                      <li>Wants less guesswork, more listening</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <hr data-anim="divider" className="border-t border-border" />

          {/* ── The design ── */}
          <section id="design" className="scroll-mt-28 space-y-6">
            <div data-anim="section-head" className="space-y-1">
              <p className="gamja-regular text-lg tracking-tighter text-muted-foreground">
                The design
              </p>
              <h2 className="googlesans-semibold text-2xl text-foreground lg:text-3xl">
                A voting system that feels native to Jam — not bolted on.
              </h2>
            </div>
            <p
              data-anim="body"
              className="googlesans-regular leading-relaxed text-muted-foreground"
            >
              The feature lets any participant upvote or downvote queued songs.
              When more than 50% of the Jam downvotes a song, the person who
              added it gets a notification and the option to remove it.
              Crucially: auto-removal was ruled out. The contributor keeps
              control. The system provides information; the human makes the
              call.
            </p>
            <p
              data-anim="body"
              className="googlesans-regular leading-relaxed text-muted-foreground"
            >
              I designed vote history as a transparency layer — any user can
              see who voted what on any song. This resolves the trust question
              (&ldquo;why was my song removed?&rdquo;) before it ever becomes a
              social conflict.
            </p>

            {/* Design decisions */}
            <div data-anim="body" className="space-y-3">
              <p className="googlesans-medium text-xs uppercase tracking-wider text-muted-foreground">
                Key design decisions
              </p>
              <div className="space-y-3">
                {[
                  {
                    title: "Upvote + downvote, not just downvote",
                    detail:
                      "Positive and negative feedback. Research showed users wanted to express enthusiasm for songs they loved, not just flag the ones they hated. Binary sentiment gives the system real signal.",
                  },
                  {
                    title: "50% threshold — not a single vote",
                    detail:
                      "Majority rule ensures the notification is meaningful and represents genuine consensus, not one dissenting voice. Prevents notification fatigue and respects the contributor's choice.",
                  },
                  {
                    title: "Thumbs up/down over custom icons",
                    detail:
                      "I prototyped hearts, arrows, and Spotify logos. Thumbs won — it's universal across real life and software, following Nielsen's consistency and standards heuristic.",
                  },
                  {
                    title: "Modal/drawer matches existing Spotify patterns",
                    detail:
                      "I studied how Spotify handles its own popups and built the modals to match. The goal was for users to feel like this was always part of Jam, not a foreign add-on.",
                  },
                ].map((d) => (
                  <div
                    key={d.title}
                    data-anim="body"
                    className="border-l-2 border-border pl-4"
                  >
                    <p className="googlesans-semibold text-sm text-foreground">{d.title}</p>
                    <p className="googlesans-regular mt-0.5 text-sm leading-relaxed text-muted-foreground">
                      {d.detail}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Heuristics applied */}
            <div data-anim="body" className="space-y-2">
              <p className="googlesans-medium text-xs uppercase tracking-wider text-muted-foreground">
                Nielsen heuristics applied
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  "#1 Visibility of system status",
                  "#3 User control and freedom",
                  "#4 Consistency and standards",
                ].map((h) => (
                  <span
                    key={h}
                    data-anim="heuristic"
                    className="googlesans-medium border border-dashed border-border bg-muted/30 px-2.5 py-1 text-[11px] text-muted-foreground"
                  >
                    {h}
                  </span>
                ))}
                <span
                  data-anim="heuristic"
                  className="googlesans-medium border border-dashed border-orange-500/30 bg-orange-500/4 px-2.5 py-1 text-[11px] text-orange-600 dark:text-orange-400"
                >
                  Nudge theory
                </span>
              </div>
            </div>
          </section>

          <hr data-anim="divider" className="border-t border-border" />

          {/* ── User flows ── */}
          <section id="flows" className="scroll-mt-28 space-y-10">
            <div data-anim="section-head" className="space-y-1">
              <p className="gamja-regular text-lg tracking-tighter text-muted-foreground">
                User flows
              </p>
              <h2 className="googlesans-semibold text-2xl text-foreground lg:text-3xl">
                Five wireflows, five moments in the Jam.
              </h2>
            </div>
            <p
              data-anim="body"
              className="googlesans-regular leading-relaxed text-muted-foreground"
            >
              Each wireflow covers a distinct interaction in the feature.
              Together they complete the full loop: a song gets added, people
              vote, the contributor is notified, a decision is made, and the
              queue keeps moving.
            </p>

            {/* Flow 01 */}
            <div data-anim="flow-card" className="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-8">
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-3">
                  <span className="font-modak text-4xl leading-none text-orange-500/50">01</span>
                  <div>
                    <p className="googlesans-semibold text-base text-foreground">In-app vote prompt</p>
                    <p className="googlesans-medium text-[10px] uppercase tracking-wider text-orange-600 dark:text-orange-400">
                      Recognition over recall
                    </p>
                  </div>
                </div>
                <p className="googlesans-regular text-sm leading-relaxed text-muted-foreground">
                  Users in the Jam get an in-app popup asking them to upvote or downvote
                  the new song just added to the queue.
                </p>
                <div className="space-y-2">
                  <div className="border-l-2 border-border pl-3">
                    <p className="googlesans-semibold text-xs text-foreground">Upvote + downvote (not just downvote)</p>
                    <p className="googlesans-regular mt-0.5 text-xs leading-relaxed text-muted-foreground">
                      Shane wants to &ldquo;see how others feel&rdquo; — that means positive AND
                      negative feedback. A binary system gives clear, actionable sentiment.
                      Upvotes encourage contribution; downvotes signal misalignment without
                      being purely negative.
                    </p>
                  </div>
                  <div className="border-l-2 border-border pl-3">
                    <p className="googlesans-semibold text-xs text-foreground">Real-time voting on queued songs</p>
                    <p className="googlesans-regular mt-0.5 text-xs leading-relaxed text-muted-foreground">
                      Voting happens in context, on the song in the queue — users don&apos;t
                      need to navigate anywhere. Immediate feedback creates a responsive,
                      living queue that adapts to group preferences.
                    </p>
                  </div>
                  <div className="border-l-2 border-border pl-3">
                    <p className="googlesans-semibold text-xs text-foreground">Thumbs up &amp; down</p>
                    <p className="googlesans-regular mt-0.5 text-xs leading-relaxed text-muted-foreground">
                      Tested hearts, arrows, and the Spotify logo. Thumbs won — it&apos;s
                      used both in real life and across software, following Nielsen&apos;s
                      consistency and standards heuristic.
                    </p>
                  </div>
                </div>
              </div>
              <FlowVideo src="/spotifycasestudy/flow-inapp-vote.mp4" caption="In-app vote prompt" />
            </div>

            <hr className="border-t border-dashed border-border" />

            {/* Flow 02 */}
            <div data-anim="flow-card" className="flex flex-col gap-6 sm:flex-row-reverse sm:items-start sm:gap-8">
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-3">
                  <span className="font-modak text-4xl leading-none text-orange-500/50">02</span>
                  <div>
                    <p className="googlesans-semibold text-base text-foreground">Push notification</p>
                    <p className="googlesans-medium text-[10px] uppercase tracking-wider text-orange-600 dark:text-orange-400">
                      Reduce cognitive load
                    </p>
                  </div>
                </div>
                <p className="googlesans-regular text-sm leading-relaxed text-muted-foreground">
                  Users get a lock/home screen notification asking them to vote on a new
                  song — even when Spotify isn&apos;t open.
                </p>
                <div className="space-y-2">
                  <div className="border-l-2 border-border pl-3">
                    <p className="googlesans-semibold text-xs text-foreground">Always in the loop</p>
                    <p className="googlesans-regular mt-0.5 text-xs leading-relaxed text-muted-foreground">
                      Shane&apos;s group may not always have Spotify open but they want to
                      stay engaged with what&apos;s happening in the Jam. Push notifications
                      let them vote immediately or come back later — their choice.
                    </p>
                  </div>
                  <div className="border-l-2 border-border pl-3">
                    <p className="googlesans-semibold text-xs text-foreground">iOS/mobile principles</p>
                    <p className="googlesans-regular mt-0.5 text-xs leading-relaxed text-muted-foreground">
                      Designed to reduce mental load and cognitive memorisation on the
                      user&apos;s end. Once they tap the notification, the rest of the
                      flow is identical to the in-app path.
                    </p>
                  </div>
                </div>
              </div>
              <FlowVideo src="/spotifycasestudy/flow-push-notif.mp4" caption="Push notification flow" />
            </div>

            <hr className="border-t border-dashed border-border" />

            {/* Flow 03 */}
            <div data-anim="flow-card" className="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-8">
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-3">
                  <span className="font-modak text-4xl leading-none text-orange-500/50">03</span>
                  <div>
                    <p className="googlesans-semibold text-base text-foreground">Removal notification</p>
                    <p className="googlesans-medium text-[10px] uppercase tracking-wider text-orange-600 dark:text-orange-400">
                      User control + freedom
                    </p>
                  </div>
                </div>
                <p className="googlesans-regular text-sm leading-relaxed text-muted-foreground">
                  The host or the user who added a song gets an in-app notification when
                  more than half the Jam has downvoted it, with the option to remove.
                </p>
                <div className="space-y-2">
                  <div className="border-l-2 border-border pl-3">
                    <p className="googlesans-semibold text-xs text-foreground">50% threshold — genuine consensus</p>
                    <p className="googlesans-regular mt-0.5 text-xs leading-relaxed text-muted-foreground">
                      Majority rule ensures the notification is meaningful, not triggered by
                      one or two dissenting voices. Prevents notification fatigue and
                      respects the contributor&apos;s choice.
                    </p>
                  </div>
                  <div className="border-l-2 border-border pl-3">
                    <p className="googlesans-semibold text-xs text-foreground">Notification, not auto-removal</p>
                    <p className="googlesans-regular mt-0.5 text-xs leading-relaxed text-muted-foreground">
                      Auto-removal would feel punitive. A notification empowers the
                      contributor with information to make an informed decision — maintaining
                      dignity while providing clarity. The contributor stays in control.
                    </p>
                  </div>
                  <div className="border-l-2 border-border pl-3">
                    <p className="googlesans-semibold text-xs text-foreground">Modal matches Spotify&apos;s existing patterns</p>
                    <p className="googlesans-regular mt-0.5 text-xs leading-relaxed text-muted-foreground">
                      Custom drawer/modal designed to match how Spotify handles popups — so
                      users feel like this was always part of Jam, not a foreign add-on.
                    </p>
                  </div>
                </div>
              </div>
              <FlowVideo src="/spotifycasestudy/flow-remove-song.mp4" caption="Removal notification" />
            </div>

            <hr className="border-t border-dashed border-border" />

            {/* Flow 04 */}
            <div data-anim="flow-card" className="flex flex-col gap-6 sm:flex-row-reverse sm:items-start sm:gap-8">
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-3">
                  <span className="font-modak text-4xl leading-none text-orange-500/50">04</span>
                  <div>
                    <p className="googlesans-semibold text-base text-foreground">Replace removed song</p>
                    <p className="googlesans-medium text-[10px] uppercase tracking-wider text-orange-600 dark:text-orange-400">
                      Nudge theory
                    </p>
                  </div>
                </div>
                <p className="googlesans-regular text-sm leading-relaxed text-muted-foreground">
                  After removing a song, the user is offered a chance to add a new one
                  from songs the group may like — keeping the queue full.
                </p>
                <div className="space-y-2">
                  <div className="border-l-2 border-border pl-3">
                    <p className="googlesans-semibold text-xs text-foreground">Nudge, not force</p>
                    <p className="googlesans-regular mt-0.5 text-xs leading-relaxed text-muted-foreground">
                      Users may want to try again after removing their old song. Using nudge
                      theory, the feature presents a new suggestion right away — low friction,
                      high intent, keeps the Jam alive.
                    </p>
                  </div>
                  <div className="border-l-2 border-border pl-3">
                    <p className="googlesans-semibold text-xs text-foreground">Builds on an existing Spotify feature</p>
                    <p className="googlesans-regular mt-0.5 text-xs leading-relaxed text-muted-foreground">
                      &ldquo;Add song based on Jam group preferences&rdquo; already exists within Jam.
                      This provides a new, contextual entry point — easy to implement,
                      and immediately useful.
                    </p>
                  </div>
                </div>
              </div>
              <FlowVideo src="/spotifycasestudy/flow-replace-song.mp4" caption="Replace removed song" />
            </div>

            <hr className="border-t border-dashed border-border" />

            {/* Flow 05 */}
            <div data-anim="flow-card" className="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-8">
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-3">
                  <span className="font-modak text-4xl leading-none text-orange-500/50">05</span>
                  <div>
                    <p className="googlesans-semibold text-base text-foreground">Vote history viewer</p>
                    <p className="googlesans-medium text-[10px] uppercase tracking-wider text-orange-600 dark:text-orange-400">
                      Transparency + trust
                    </p>
                  </div>
                </div>
                <p className="googlesans-regular text-sm leading-relaxed text-muted-foreground">
                  Any participant can open the vote history on any queued song and see
                  exactly who voted what.
                </p>
                <div className="space-y-2">
                  <div className="border-l-2 border-border pl-3">
                    <p className="googlesans-semibold text-xs text-foreground">Transparency builds trust</p>
                    <p className="googlesans-regular mt-0.5 text-xs leading-relaxed text-muted-foreground">
                      Without visibility into who downvoted, users feel suspicious — &ldquo;why
                      was my song removed?&rdquo; Vote history makes the system feel fair.
                      Users can see it wasn&apos;t personal; it was genuinely 50%+ of the group.
                    </p>
                  </div>
                  <div className="border-l-2 border-border pl-3">
                    <p className="googlesans-semibold text-xs text-foreground">Understanding group dynamics</p>
                    <p className="googlesans-regular mt-0.5 text-xs leading-relaxed text-muted-foreground">
                      Vote history becomes a conversation starter: &ldquo;Oh, you loved that song —
                      I&apos;ll add more like it.&rdquo; Hosts can spot patterns in group taste
                      and curate better queues over time.
                    </p>
                  </div>
                </div>
              </div>
              <FlowVideo src="/spotifycasestudy/flow-vote-history.mp4" caption="Vote history viewer" />
            </div>
          </section>

          <hr data-anim="divider" className="border-t border-border" />

          {/* ── Impact ── */}
          <section id="impact" className="scroll-mt-28 space-y-6">
            <p
              data-anim="section-head"
              className="gamja-regular text-lg tracking-tighter text-muted-foreground"
            >
              Impact &amp; why it matters
            </p>

            <div className="grid gap-4 sm:grid-cols-3">
              {[
                {
                  heading: "For listeners",
                  body: "Passive participants become active. Remote Jam members have the same voice as the people in the room.",
                  accent: "orange",
                },
                {
                  heading: "For contributors",
                  body: "No more guesswork. Real feedback replaces anxiety — and an easy out replaces social pressure to keep a bad song.",
                  accent: "blue",
                },
                {
                  heading: "For Spotify",
                  body: "Better queue satisfaction keeps groups listening longer. Jam becomes genuinely compelling — and no competitor offers democratic queue management.",
                  accent: "orange",
                },
              ].map((c) => (
                <div
                  key={c.heading}
                  data-anim="impact-card"
                  className={
                    c.accent === "orange"
                      ? "border border-dashed border-orange-500/30 bg-orange-500/4 px-4 py-4"
                      : "border border-dashed border-sky-500/30 bg-sky-500/4 px-4 py-4"
                  }
                >
                  <p className={`googlesans-semibold mb-2 text-sm ${c.accent === "orange" ? "text-orange-600 dark:text-orange-400" : "text-sky-600 dark:text-sky-400"}`}>
                    {c.heading}
                  </p>
                  <p className="googlesans-regular text-sm leading-relaxed text-muted-foreground">
                    {c.body}
                  </p>
                </div>
              ))}
            </div>

            <div data-anim="body" className="grid gap-6 text-sm sm:grid-cols-3 pt-2">
              <div>
                <p data-anim="stat" className="font-modak text-5xl text-orange-500">3</p>
                <p data-anim="body" className="googlesans-semibold mt-1 text-foreground">
                  User interviews
                </p>
                <p data-anim="body" className="googlesans-regular mt-1 text-muted-foreground">
                  Each surfaced the same core frustration independently — strong signal before a single pixel was designed.
                </p>
              </div>
              <div>
                <p data-anim="stat" className="font-modak text-5xl text-sky-500">5</p>
                <p data-anim="body" className="googlesans-semibold mt-1 text-foreground">
                  User flows prototyped
                </p>
                <p data-anim="body" className="googlesans-regular mt-1 text-muted-foreground">
                  Each flow covers a distinct moment in the feature — hi-fi and interactive in Figma.
                </p>
              </div>
              <div>
                <p data-anim="stat" className="font-modak text-5xl text-orange-500">0</p>
                <p data-anim="body" className="googlesans-semibold mt-1 text-foreground">
                  Competitors with this
                </p>
                <p data-anim="body" className="googlesans-regular mt-1 text-muted-foreground">
                  No other music platform offers democratic, transparent queue management in shared listening sessions.
                </p>
              </div>
            </div>

            <p
              data-anim="body"
              className="googlesans-regular border-l-2 border-border pl-4 text-sm leading-relaxed text-muted-foreground"
            >
              The bigger takeaway from this project: the best features don&apos;t
              add complexity — they remove friction. Every decision here was
              shaped by one question: what&apos;s the lowest-effort way for
              someone to say &ldquo;I&apos;m not feeling this&rdquo; without
              making it weird?
            </p>
          </section>
        </div>
      </article>

      <Footer />
    </div>
  );
}
