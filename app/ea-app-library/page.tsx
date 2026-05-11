"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import Link from "next/link";
import { ChevronRight, ExternalLink } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { CaseImage } from "@/components/studyspotr/case-image";
import {
  CaseStudySideNav,
  CaseStudyMobileNav,
  type CaseSection,
} from "@/components/studyspotr/case-study-nav";

import imgOfficeTour from "@/assets/eaofficetour.png";
import imgOldScreen from "@/assets/eaappcasestudy/oldscreen.png";
import imgFullscreen from "@/assets/eaappcasestudy/fullscreenview.png";
import imgMenuHide from "@/assets/eaappcasestudy/menuandhide.png";
import imgToastUndo from "@/assets/eaappcasestudy/toastundo.png";
import imgSideNavHidden from "@/assets/eaappcasestudy/sidenavhiddengames.png";

gsap.registerPlugin(ScrollTrigger);

const LIVE_SITE_HREF = "https://eaappuxproject.vercel.app/";

const EA_SECTIONS: CaseSection[] = [
  { id: "intro", label: "Intro" },
  { id: "discovery", label: "Discovery" },
  { id: "problem", label: "The problem" },
  { id: "prototype", label: "Prototype" },
  { id: "research", label: "Research" },
  { id: "audit", label: "Competitive audit" },
  { id: "design", label: "Design decisions" },
  { id: "impact", label: "Impact" },
];

const TITLE_LETTERS = [
  { ch: "E" },
  { ch: "A" },
  { ch: " ", space: true },
  { ch: "A" },
  { ch: "p" },
  { ch: "p" },
  { ch: " ", space: true },
  { ch: "L" },
  { ch: "i" },
  { ch: "b" },
  { ch: "r" },
  { ch: "a" },
  { ch: "r" },
  { ch: "y" },
] as const;

export default function EAAppLibraryPage() {
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

      const quoteCards = gsap.utils.toArray<HTMLElement>('[data-anim="quote-card"]');
      if (quoteCards.length) {
        gsap.from(quoteCards, {
          scrollTrigger: { trigger: quoteCards[0], start: "top 85%", once: true },
          opacity: 0,
          y: 28,
          scale: 0.96,
          duration: 0.55,
          stagger: 0.12,
          ease: "power2.out",
        });
      }

      gsap.from('[data-anim="standout-quote"]', {
        scrollTrigger: { trigger: '[data-anim="standout-quote"]', start: "top 85%", once: true },
        opacity: 0,
        scale: 0.97,
        y: 20,
        duration: 0.7,
        ease: "power3.out",
      });

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

      const auditCards = gsap.utils.toArray<HTMLElement>('[data-anim="audit-card"]');
      if (auditCards.length) {
        gsap.from(auditCards, {
          scrollTrigger: { trigger: auditCards[0], start: "top 85%", once: true },
          opacity: 0,
          y: 28,
          scale: 0.96,
          duration: 0.55,
          stagger: 0.1,
          ease: "power2.out",
        });
      }

      const designCards = gsap.utils.toArray<HTMLElement>('[data-anim="design-card"]');
      if (designCards.length) {
        gsap.from(designCards, {
          scrollTrigger: { trigger: designCards[0], start: "top 85%", once: true },
          opacity: 0,
          y: 28,
          scale: 0.96,
          duration: 0.55,
          stagger: 0.1,
          ease: "power2.out",
        });
      }

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

      gsap.utils.toArray<HTMLElement>('[data-anim="stat"]').forEach((el) => {
        gsap.from(el, {
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
          opacity: 0,
          scale: 0.6,
          duration: 0.55,
          ease: "back.out(1.8)",
        });
      });

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
    }, article);

    return () => ctx.revert();
  }, []);

  return (
    <div className="flex min-h-screen flex-col pt-28 xl:pt-20">
      <CaseStudyMobileNav sections={EA_SECTIONS} />
      <CaseStudySideNav sections={EA_SECTIONS} />

      <article
        ref={articleRef}
        className="mx-auto w-full max-w-3xl flex-1 px-4 pb-10 lg:pb-28 md:px-6"
      >
        {/* Breadcrumb */}
        <nav
          data-hero="sub"
          className="mb-10 flex items-center gap-1.5 text-xs text-muted-foreground"
        >
          <Link
            href="/"
            className="googlesans-regular transition-colors hover:text-foreground"
          >
            Home
          </Link>
          <ChevronRight className="size-3 shrink-0 opacity-50" aria-hidden />
          <Link
            href="/mywork"
            className="googlesans-regular transition-colors hover:text-foreground"
          >
            Projects
          </Link>
          <ChevronRight className="size-3 shrink-0 opacity-50" aria-hidden />
          <span className="googlesans-medium text-foreground">
            EA App Library
          </span>
        </nav>

        {/* Header */}
        <header
          id="intro"
          className="mb-12 scroll-mt-10 lg:scroll-mt-28 space-y-5"
        >
          <div data-hero="sub" className="flex items-center gap-3">
            <p className="gamja-regular text-lg tracking-tighter text-muted-foreground">
              Case study
            </p>
            <span className="border border-sky-300/60 dark:border-sky-700/60 bg-sky-100 dark:bg-sky-950 px-2 py-0.5 googlesans-medium text-[10px] uppercase tracking-wider text-sky-700 dark:text-sky-300">
              Personal
            </span>
          </div>
          <h1
            className="font-modak text-7xl leading-none text-primary"
            style={{ transform: "skewX(-3deg)" }}
            aria-label="EA App Library"
          >
            {TITLE_LETTERS.map((l, i) => (
              <span
                key={i}
                ref={(el) => {
                  letterRefs.current[i] = el;
                }}
                className={
                  "space" in l && l.space ? "inline-block" : "inline-block"
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
            EA App users wanted the same control that already exists in Steam:
            hide unwanted titles, find games faster, and keep their library
            clean. In the feedback forums, 12 users repeated the same need
            across 4+ years of discussion.
          </p>
          <div data-hero="sub">
            <Button
              variant="orange"
              size={"xs"}
              className="gap-1.5 font-google-sans"
              asChild
            >
              <a
                href={LIVE_SITE_HREF}
                target="_blank"
                rel="noopener noreferrer"
              >
                Live prototype{" "}
                <ExternalLink className="size-3 opacity-70" aria-hidden />
              </a>
            </Button>
          </div>
        </header>

        {/* Meta row */}
        <div className="my-10 grid grid-cols-2 gap-2 lg:grid-cols-4">
          {[
            { label: "Role", value: "UX Designer + Frontend Engineer" },
            { label: "Type", value: "Feature Design & Prototyping" },
            { label: "Team", value: "Solo" },
            { label: "Timeline", value: "May 2026" },
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
              <li>Forum thread analysis</li>
              <li>Competitive audit</li>
              <li>User pain-point mapping</li>
            </ul>
          </div>
          <div>
            <p className="googlesans-semibold mb-2 text-foreground">Design</p>
            <ul className="googlesans-regular space-y-1 text-muted-foreground">
              <li>Figma (hi-fi mockups)</li>
              <li>Next.js prototype</li>
              <li>Interaction patterns</li>
            </ul>
          </div>
          <div>
            <p className="googlesans-semibold mb-2 text-foreground">
              Principles
            </p>
            <ul className="googlesans-regular space-y-1 text-muted-foreground">
              <li>Nielsen&apos;s heuristics</li>
              <li>Steam design patterns</li>
              <li>Context menus + toasts</li>
            </ul>
          </div>
        </div>

        <div className="space-y-16">
          {/* Hero image — new library view */}
          <div data-anim="hero-img">
            <CaseImage
              slug="fullscreenview"
              src={imgFullscreen}
              title="Redesigned EA App library — search, filter, sort, and a clean game grid."
              aspectClass="aspect-[16/8.45]"
              accent="blue"
              objectPosition="top"
            />
          </div>

          <hr data-anim="divider" className="border-t border-border" />

          {/* ── Discovery ── */}
          <section id="discovery" className="scroll-mt-28 space-y-4">
            <div data-anim="section-head" className="space-y-1">
              <p className="gamja-regular text-lg tracking-tighter text-muted-foreground">
                Where it started
              </p>
              <h2 className="googlesans-semibold text-2xl text-foreground lg:text-3xl">
                I turned an EA campus visit into a product audit.
              </h2>
            </div>
            <p
              data-anim="body"
              className="googlesans-regular leading-relaxed text-muted-foreground"
            >
              After touring EA Burnaby, I wanted to study the product like
              someone already on the team. I went into the EA App feedback
              forums looking for a real, documented user problem I could scope
              and prototype.
            </p>
            <div data-anim="screenshot" className="pt-2">
              <CaseImage
                slug="eaofficetour"
                src={imgOfficeTour}
                title="EA Burnaby campus tour — the visit that pushed me to apply."
                aspectClass="aspect-[16/14]"
                accent="blue"
                objectPosition="bottom"
              />
            </div>

            <p
              data-anim="body"
              className="googlesans-regular leading-relaxed text-muted-foreground"
            >
              The clearest gap was the library. Steam lets players hide games,
              create collections, filter by status, and sort in useful ways. EA
              App shows everything: betas, trials, EA Play titles, and games the
              user may never touch.
            </p>
            <p
              data-anim="body"
              className="googlesans-regular leading-relaxed text-muted-foreground"
            >
              Instead of writing a critique, I built the missing interaction
              model in React and TypeScript.
            </p>
          </section>

          <hr data-anim="divider" className="border-t border-border" />

          {/* ── The problem ── */}
          <section id="problem" className="scroll-mt-28 space-y-4">
            <div data-anim="section-head" className="space-y-1">
              <p className="gamja-regular text-lg tracking-tighter text-muted-foreground">
                The problem
              </p>
              <h2 className="googlesans-semibold text-2xl text-foreground lg:text-3xl">
                Users collected clutter they couldn&apos;t remove.
              </h2>
            </div>
            <p
              data-anim="body"
              className="googlesans-regular leading-relaxed text-muted-foreground"
            >
              Free trials, old betas, and inactive EA Play titles stay mixed
              with the games users actually want to play. With no hide, filter,
              or sort controls, a library with 30+ titles becomes slower to use
              every time it grows.
            </p>

            {/* Before / After */}
            <div className="grid gap-3 pt-2 sm:grid-cols-2">
              <div
                data-anim="before-after"
                className="space-y-2 border border-dashed border-border bg-muted/20 px-4 py-4"
              >
                <p className="googlesans-semibold text-xs uppercase tracking-wider text-muted-foreground">
                  Before — no control
                </p>
                <ul className="googlesans-regular space-y-1.5 text-sm text-muted-foreground">
                  <li className="flex gap-2">
                    <span className="opacity-40">—</span>No way to hide unwanted
                    titles
                  </li>
                  <li className="flex gap-2">
                    <span className="opacity-40">—</span>No filter by status or
                    category
                  </li>
                  <li className="flex gap-2">
                    <span className="opacity-40">—</span>No sort controls
                  </li>
                  <li className="flex gap-2">
                    <span className="opacity-40">—</span>Betas and trials mixed
                    with real games
                  </li>
                </ul>
              </div>
              <div
                data-anim="before-after"
                className="space-y-2 border border-dashed border-sky-500/30 bg-sky-500/4 px-4 py-4"
              >
                <p className="googlesans-semibold text-xs uppercase tracking-wider text-sky-600 dark:text-sky-400">
                  After — your library, your rules
                </p>
                <ul className="googlesans-regular space-y-1.5 text-sm text-muted-foreground">
                  <li className="flex gap-2">
                    <span className="text-sky-500">+</span>Right-click to hide
                    any game instantly
                  </li>
                  <li className="flex gap-2">
                    <span className="text-sky-500">+</span>Filter by installed,
                    EA Play, hidden
                  </li>
                  <li className="flex gap-2">
                    <span className="text-sky-500">+</span>Sort alphabetically,
                    by play time, install size
                  </li>
                  <li className="flex gap-2">
                    <span className="text-sky-500">+</span>Hidden games tucked
                    away — never lost
                  </li>
                </ul>
              </div>
            </div>
          </section>

          <hr data-anim="divider" className="border-t border-border" />

          {/* ── Prototype ── */}
          <section id="prototype" className="scroll-mt-28 space-y-10">
            <div data-anim="section-head" className="space-y-1">
              <p className="gamja-regular text-lg tracking-tighter text-muted-foreground">
                The prototype
              </p>
              <h2 className="googlesans-semibold text-2xl text-foreground lg:text-3xl">
                The redesign makes the fix visible in the UI.
              </h2>
            </div>
            <p
              data-anim="body"
              className="googlesans-regular leading-relaxed text-muted-foreground"
            >
              I built the library panel as a working front-end prototype, not a
              static mockup. Search, filters, sorting, hide actions, and toast
              undo are all interactive.
            </p>

            <div className="grid gap-6 md:grid-cols-2 md:items-start">
              {/* Before */}
              <div className="space-y-3">
                <p
                  data-anim="body"
                  className="googlesans-medium text-xs text-muted-foreground"
                >
                  Before — the old library view
                </p>
                <div data-anim="screenshot">
                  <CaseImage
                    slug="oldscreen"
                    src={imgOldScreen}
                    title="The original EA App library — no filter, no sort, no hide. Every title ever added, always visible."
                    aspectClass="aspect-[16/9.4]"
                    accent="blue"
                    objectPosition="top"
                  />
                </div>
              </div>

              {/* Fullscreen view */}
              <div className="space-y-3">
                <p
                  data-anim="body"
                  className="googlesans-medium text-xs text-sky-600 dark:text-sky-400"
                >
                  After — redesigned library with search, filter, and sort
                </p>
                <div data-anim="screenshot">
                  <CaseImage
                    slug="fullscreenview"
                    src={imgFullscreen}
                    title="Redesigned library — search bar, filter chips (All / Installed / EA Play / Hidden), sort controls, clean game grid."
                    aspectClass="aspect-[16/9.4]"
                    accent="blue"
                    objectPosition="left"
                  />
                </div>
              </div>
            </div>

            {/* Right-click menu */}
            <div className="space-y-3">
              <p
                data-anim="body"
                className="googlesans-medium text-xs text-muted-foreground"
              >
                Right-click context menu — hide game
              </p>
              <div data-anim="screenshot">
                <CaseImage
                  slug="menuandhide"
                  src={imgMenuHide}
                  title="Right-click context menu — 'Hide Game' lives exactly where the user already is. No navigation required."
                  aspectClass="aspect-[16/9.3]"
                  accent="blue"
                  objectPosition="center"
                />
              </div>
            </div>

            {/* Toast undo */}
            <div className="space-y-3">
              <p
                data-anim="body"
                className="googlesans-medium text-xs text-muted-foreground"
              >
                Toast notification with 5-second undo
              </p>
              <div data-anim="screenshot">
                <CaseImage
                  slug="toastundo"
                  src={imgToastUndo}
                  title="Toast + undo — the action is instant and reversible. No confirmation dialog needed."
                  aspectClass="aspect-[16/9]"
                  accent="blue"
                  objectPosition="bottom"
                />
              </div>
            </div>

            {/* Side nav hidden games */}
            <div className="space-y-3">
              <p
                data-anim="body"
                className="googlesans-medium text-xs text-muted-foreground"
              >
                Hidden games section in the side nav
              </p>
              <div data-anim="screenshot">
                <CaseImage
                  slug="sidenavhiddengames"
                  fit="contain"
                  src={imgSideNavHidden}
                  title="Hidden games in the side nav — tucked away but always accessible. Nothing is permanently lost."
                  aspectClass="aspect-[10/8]"
                  accent="blue"
                  objectPosition="center"
                />
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
                Four years of forum threads made the problem impossible to
                dismiss.
              </h2>
            </div>
            <p
              data-anim="body"
              className="googlesans-regular leading-relaxed text-muted-foreground"
            >
              EA&apos;s own forums had already documented the pain: one thread
              titled &ldquo;Filter, Hide or Remove Games From Library&rdquo; ran
              for years, after an earlier thread on the same topic was closed.
              The requests came from Sims, FIFA, Battlefield, and Apex players —
              not one niche community.
            </p>

            {/* Standout quote */}
            <blockquote
              data-anim="standout-quote"
              className="border border-dashed border-border bg-muted/20 px-6 py-6"
            >
              <p className="googlesans-regular text-base leading-relaxed text-foreground">
                &ldquo;Why do I have to watch Bejeweled 3 every time I want to
                find Battlefield in my library? Why do I have to watch EA Sports
                Madden NFL just because I clicked on the wrong tile while I had
                EA Play&hellip; I want to hide all these ugly mistakes and keep
                my library clean.&rdquo;
              </p>
              <footer className="googlesans-medium mt-3 text-xs uppercase tracking-wider text-muted-foreground">
                — Piter-0803, EA Community Forums
              </footer>
            </blockquote>

            {/* Supporting voices */}
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                {
                  name: "9047609",
                  role: "EA Community member",
                  quote:
                    '"Absolutely agree with you. It is disrespectful from EA to lack this basic functionality."',
                  insight:
                    "Users framed this as a baseline expectation, not a feature request.",
                },
                {
                  name: "ApoIIoHeIios",
                  role: "EA Community member",
                  quote:
                    '"This should be added as bare minimum basic function for any game storefront app!"',
                  insight:
                    "The benchmark isn't innovation — it's parity with every other launcher.",
                },
                {
                  name: "Multiple users",
                  role: "EA Forums thread",
                  quote:
                    '"This is basic function! Add it!" — Direct quote from the locked thread. A new one was immediately opened.',
                  insight:
                    "Closing feedback threads doesn't make the pain go away.",
                },
              ].map((p) => (
                <div
                  key={p.name}
                  data-anim="quote-card"
                  className="border border-dashed border-border bg-muted/20 px-4 py-4"
                >
                  <p className="googlesans-semibold text-sm text-foreground">
                    {p.name}
                  </p>
                  <p className="googlesans-medium mb-3 text-[11px] text-muted-foreground/80">
                    {p.role}
                  </p>
                  <p className="googlesans-regular mb-3 text-xs italic leading-relaxed text-muted-foreground">
                    {p.quote}
                  </p>
                  <p className="googlesans-medium border-l-2 border-sky-500 dark:border-sky-800 pl-3 text-xs leading-snug text-foreground/80">
                    {p.insight}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <hr data-anim="divider" className="border-t border-border" />

          {/* ── Competitive audit ── */}
          <section id="audit" className="scroll-mt-28 space-y-6">
            <div data-anim="section-head" className="space-y-1">
              <p className="gamja-regular text-lg tracking-tighter text-muted-foreground">
                Competitive audit
              </p>
              <h2 className="googlesans-semibold text-2xl text-foreground lg:text-3xl">
                Steam showed the baseline EA App was missing.
              </h2>
            </div>
            <p
              data-anim="body"
              className="googlesans-regular leading-relaxed text-muted-foreground"
            >
              I used Steam as the benchmark because it sets the expectation for
              game library control. The goal was not novelty. It was parity with
              patterns players already understand.
            </p>

            <div className="grid gap-4 sm:grid-cols-2">
              <div
                data-anim="audit-card"
                className="space-y-3 border border-dashed border-border bg-muted/20 px-5 py-5"
              >
                <p className="googlesans-semibold text-sm text-foreground">
                  Steam
                </p>
                <ul className="googlesans-regular space-y-2 text-sm text-muted-foreground">
                  {[
                    "Hide game — right-click, gone from view",
                    "Collections — custom folders per game",
                    "Filter by installed, not installed, category",
                    "Sort by name, hours played, last played, size",
                    "Hidden games shelf — always recoverable",
                    "Search across full library",
                  ].map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="text-emerald-500 shrink-0">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div
                data-anim="audit-card"
                className="space-y-3 border border-dashed border-border bg-muted/20 px-5 py-5"
              >
                <p className="googlesans-semibold text-sm text-foreground">
                  EA App (before)
                </p>
                <ul className="googlesans-regular space-y-2 text-sm text-muted-foreground">
                  {[
                    "Hide game — not available",
                    "Collections — not available",
                    "Filter by status — not available",
                    "Sort controls — not available",
                    "Hidden games — not available",
                    "Search — not available",
                  ].map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="text-red-500/70 shrink-0">✗</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <p
              data-anim="body"
              className="googlesans-regular leading-relaxed text-muted-foreground"
            >
              The comparison turned the problem into a scoped design brief:
              documented demand on one side, proven interaction patterns on the
              other.
            </p>
          </section>

          <hr data-anim="divider" className="border-t border-border" />

          {/* ── Design decisions ── */}
          <section id="design" className="scroll-mt-28 space-y-6">
            <div data-anim="section-head" className="space-y-1">
              <p className="gamja-regular text-lg tracking-tighter text-muted-foreground">
                Design decisions
              </p>
              <h2 className="googlesans-semibold text-2xl text-foreground lg:text-3xl">
                Each interaction removes a specific user risk.
              </h2>
            </div>
            <p
              data-anim="body"
              className="googlesans-regular leading-relaxed text-muted-foreground"
            >
              I kept the feature set small, but each decision had to answer the
              same question: how does this give users control without adding new
              friction?
            </p>

            <div className="space-y-3">
              {[
                {
                  title: "Right-click context menu — not a settings page",
                  detail:
                    "Hiding is an action on one specific game. Putting it in the right-click menu keeps the action where the user already is, matching file managers, launchers, and OS patterns.",
                },
                {
                  title: "Toast + 5-second undo — not a confirmation dialog",
                  detail:
                    "Users worried about hiding something by mistake. A toast with undo makes the action reversible without interrupting every hide action with a confirmation dialog.",
                },
                {
                  title:
                    "Hidden games in the side nav — never permanently gone",
                  detail:
                    'Multiple forum posts asked: "What if I want to play it again?" A dedicated side nav section keeps hidden games recoverable without letting them clutter the main view.',
                },
                {
                  title: "Filter bar — not a dropdown, not a modal",
                  detail:
                    "Library filters need to be visible at a glance. Inline chips keep the available views obvious and reduce the cost of switching between them.",
                },
                {
                  title: "Search — integrated, not a separate screen",
                  detail:
                    "As the library grows, typing beats scrolling. Search stays in the library header so results narrow in place without moving users to another screen.",
                },
              ].map((d) => (
                <div
                  key={d.title}
                  data-anim="design-card"
                  className="border-l-2 border-border pl-4"
                >
                  <p className="googlesans-semibold text-sm text-foreground">
                    {d.title}
                  </p>
                  <p className="googlesans-regular mt-0.5 text-sm leading-relaxed text-muted-foreground">
                    {d.detail}
                  </p>
                </div>
              ))}
            </div>

            <div data-anim="body" className="space-y-2 pt-2">
              <p className="googlesans-medium text-xs uppercase tracking-wider text-muted-foreground">
                Nielsen heuristics applied
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  "#3 User control and freedom",
                  "#5 Error prevention",
                  "#6 Recognition over recall",
                  "#4 Consistency and standards",
                  "#8 Aesthetic and minimalist design",
                ].map((h) => (
                  <span
                    key={h}
                    className="googlesans-medium border border-dashed border-border bg-muted/30 px-2.5 py-1 text-[11px] text-muted-foreground"
                  >
                    {h}
                  </span>
                ))}
              </div>
            </div>
          </section>

          <hr data-anim="divider" className="border-t border-border" />

          {/* ── Impact ── */}
          <section id="impact" className="scroll-mt-28 space-y-6">
            <div data-anim="section-head" className="space-y-1">
              <p className="gamja-regular text-lg tracking-tighter text-muted-foreground">
                Impact &amp; why it matters
              </p>
              <h2 className="googlesans-semibold text-2xl text-foreground lg:text-3xl">
                The result is a scoped feature set with visible user demand.
              </h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {[
                {
                  heading: "For users",
                  body: "The library becomes manageable again, especially for players with large backlogs or inactive EA Play titles they no longer want in view.",
                  accent: "blue",
                },
                {
                  heading: "For EA",
                  body: "A launcher gets more valuable when users can quickly find what they came to play. Less library friction means fewer reasons to switch back to Steam.",
                  accent: "orange",
                },
                {
                  heading: "For the platform",
                  body: "The prototype proves the interaction model before backend work begins: what gets hidden, how it is recovered, and how undo behaves.",
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
                  <p
                    className={`googlesans-semibold mb-2 text-sm ${c.accent === "blue" ? "text-sky-600 dark:text-sky-400" : "text-orange-600 dark:text-orange-400"}`}
                  >
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
                <p
                  data-anim="stat"
                  className="font-modak text-5xl text-sky-500"
                >
                  4+
                </p>
                <p
                  data-anim="body"
                  className="googlesans-semibold mt-1 text-foreground"
                >
                  Years of forum threads
                </p>
                <p
                  data-anim="body"
                  className="googlesans-regular mt-1 text-muted-foreground"
                >
                  The request predates the EA App — it started in Origin. Users
                  have been asking since the beginning.
                </p>
              </div>
              <div>
                <p
                  data-anim="stat"
                  className="font-modak text-5xl text-orange-500"
                >
                  5
                </p>
                <p
                  data-anim="body"
                  className="googlesans-semibold mt-1 text-foreground"
                >
                  Features prototyped
                </p>
                <p
                  data-anim="body"
                  className="googlesans-regular mt-1 text-muted-foreground"
                >
                  Hide, search, filter, sort, toast + undo. Each one is a
                  documented user request, not an assumption.
                </p>
              </div>
              <div>
                <p
                  data-anim="stat"
                  className="font-modak text-5xl text-sky-500"
                >
                  1
                </p>
                <p
                  data-anim="body"
                  className="googlesans-semibold mt-1 text-foreground"
                >
                  Working prototype
                </p>
                <p
                  data-anim="body"
                  className="googlesans-regular mt-1 text-muted-foreground"
                >
                  A fully interactive front-end prototype — the foundation for
                  speccing out the API layer, data model, and engineering scope.
                </p>
              </div>
            </div>

            <p
              data-anim="body"
              className="googlesans-regular border-l-2 border-border pl-4 text-sm leading-relaxed text-muted-foreground"
            >
              The gap was already documented by users. My job was to turn that
              feedback into a clear product direction and a prototype that makes
              the answer easy to evaluate.
            </p>
          </section>
        </div>
      </article>

      <Footer />
    </div>
  );
}
