"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import Link from "next/link";
import { ArrowUp, ChevronRight, ExternalLink } from "lucide-react";
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

import imgLandingDesktop from "@/assets/secondsavourcasestudy/landing-desktop.png";
import imgLocations from "@/assets/secondsavourcasestudy/locations-desktop.png";
import imgMobile from "@/assets/secondsavourcasestudy/mobile.png";

gsap.registerPlugin(ScrollTrigger);

const LIVE_SITE_HREF = "https://www.secondsavour.ca";

const SS_SECTIONS: CaseSection[] = [
  { id: "intro", label: "Intro" },
  { id: "problem", label: "The problem" },
  { id: "research", label: "Research" },
  { id: "insight", label: "Key insight" },
  { id: "redesign", label: "Redesign" },
  { id: "testing", label: "User testing" },
  { id: "impact", label: "Impact" },
];

// "Second Savour" split into letter spans
const TITLE_LETTERS = [
  { ch: "S" }, { ch: "e" }, { ch: "c" }, { ch: "o" }, { ch: "n" }, { ch: "d" },
  { ch: " ", space: true },
  { ch: "S" }, { ch: "a" }, { ch: "v" }, { ch: "o" }, { ch: "u" }, { ch: "r" },
] as const;

export default function SecondSavourPage() {
  const articleRef = useRef<HTMLElement>(null);
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);

  // ── Hero: set letters hidden before paint ──────────────────────────────────
  useLayoutEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    letterRefs.current.forEach((el) => {
      if (el) gsap.set(el, { opacity: 0, scale: 0, transformOrigin: "center center" });
    });
  }, []);

  // ── Hero: animate letters + supporting elements immediately ───────────────
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

  // ── Scroll-triggered section animations ───────────────────────────────────
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const article = articleRef.current;
    if (!article) return;

    const ctx = gsap.context(() => {
      // Hero image
      gsap.from('[data-anim="hero-img"]', {
        scrollTrigger: { trigger: '[data-anim="hero-img"]', start: "top 85%", once: true },
        opacity: 0,
        y: 40,
        scale: 0.97,
        duration: 0.8,
        ease: "power3.out",
      });

      // Dividers: scaleX wipe from left
      gsap.utils.toArray<HTMLElement>('[data-anim="divider"]').forEach((el) => {
        gsap.from(el, {
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
          scaleX: 0,
          transformOrigin: "left center",
          duration: 0.7,
          ease: "power2.out",
        });
      });

      // Section headings + labels
      gsap.utils.toArray<HTMLElement>('[data-anim="section-head"]').forEach((el) => {
        gsap.from(el, {
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
          opacity: 0,
          y: 24,
          duration: 0.6,
          ease: "power2.out",
        });
      });

      // Body paragraphs
      gsap.utils.toArray<HTMLElement>('[data-anim="body"]').forEach((el) => {
        gsap.from(el, {
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
          opacity: 0,
          y: 16,
          duration: 0.55,
          ease: "power2.out",
        });
      });

      // Finding cards — stagger up
      const findingCards = gsap.utils.toArray<HTMLElement>('[data-anim="finding-card"]');
      if (findingCards.length) {
        gsap.from(findingCards, {
          scrollTrigger: { trigger: findingCards[0], start: "top 85%", once: true },
          opacity: 0,
          y: 28,
          scale: 0.96,
          duration: 0.55,
          stagger: 0.1,
          ease: "power2.out",
        });
      }

      // Before/after screenshots — slide from their own side
      gsap.from('[data-anim="before-img"]', {
        scrollTrigger: { trigger: '[data-anim="before-img"]', start: "top 85%", once: true },
        opacity: 0,
        x: -30,
        scale: 0.97,
        duration: 0.7,
        ease: "power3.out",
      });
      gsap.from('[data-anim="after-img"]', {
        scrollTrigger: { trigger: '[data-anim="after-img"]', start: "top 85%", once: true },
        opacity: 0,
        x: 30,
        scale: 0.97,
        duration: 0.7,
        ease: "power3.out",
      });

      // Screenshots — scale up from slightly below
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

      // Test participant cards — stagger up
      const testCards = gsap.utils.toArray<HTMLElement>('[data-anim="test-card"]');
      if (testCards.length) {
        gsap.from(testCards, {
          scrollTrigger: { trigger: testCards[0], start: "top 85%", once: true },
          opacity: 0,
          y: 28,
          scale: 0.96,
          duration: 0.55,
          stagger: 0.1,
          ease: "power2.out",
        });
      }
    }, article);

    return () => ctx.revert();
  }, []);

  return (
    <div className="flex min-h-screen flex-col pt-28 xl:pt-20">
      <CaseStudyMobileNav sections={SS_SECTIONS} />
      <CaseStudySideNav sections={SS_SECTIONS} />

      <article
        ref={articleRef}
        className="mx-auto w-full max-w-3xl flex-1 px-4 pb-28 md:px-6"
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
            Second Savour
          </span>
        </nav>

        {/* Header */}
        <header id="intro" className="mb-12 scroll-mt-28 space-y-5">
          <div data-hero="sub" className="flex items-center gap-3">
            <p className="gamja-regular text-lg tracking-tighter text-muted-foreground">
              Case study
            </p>
            <span className="border border-violet-300/60 dark:border-violet-700/60 bg-violet-100 dark:bg-violet-950 px-2 py-0.5 googlesans-medium text-[10px] uppercase tracking-wider text-violet-700 dark:text-violet-300">
              Academic
            </span>
          </div>
          <h1
            className="font-modak text-7xl leading-none text-primary"
            style={{ transform: "skewX(-3deg)" }}
            aria-label="Second Savour"
          >
            {TITLE_LETTERS.map((l, i) => (
              <span
                key={i}
                ref={(el) => {
                  letterRefs.current[i] = el;
                }}
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
            Second Savour rescues imperfect citrus from going to waste and turns
            it into something worth savouring. I redesigned their website
            end-to-end — two rounds of user research, a full visual overhaul,
            and a clearer story.
          </p>
          <div data-hero="sub">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 font-google-sans"
              asChild
            >
              <a
                href={LIVE_SITE_HREF}
                target="_blank"
                rel="noopener noreferrer"
              >
                Live site{" "}
                <ExternalLink className="size-3.5 opacity-70" aria-hidden />
              </a>
            </Button>
          </div>
        </header>

        {/* Meta row */}
        <div className="my-10 grid grid-cols-2 gap-2 lg:grid-cols-4">
          {[
            { label: "Role", value: "UX Designer + Researcher" },
            { label: "Type", value: "Course Project · IAT 432" },
            { label: "Team", value: "Team of 5" },
            { label: "Timeline", value: "Jan – Apr 2025" },
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
              <li>Heuristic evaluation</li>
              <li>User interviews</li>
              <li>Think-aloud testing</li>
            </ul>
          </div>
          <div>
            <p className="googlesans-semibold mb-2 text-foreground">Design</p>
            <ul className="googlesans-regular space-y-1 text-muted-foreground">
              <li>Figma</li>
              <li>Wireframes → hi-fi</li>
              <li>Design system</li>
            </ul>
          </div>
          <div>
            <p className="googlesans-semibold mb-2 text-foreground">
              Measurement
            </p>
            <ul className="googlesans-regular space-y-1 text-muted-foreground">
              <li>SUS scoring</li>
              <li>Task completion rate</li>
              <li>Affinity mapping</li>
            </ul>
          </div>
        </div>

        <div className="space-y-16">
          {/* Hero image */}
          <div data-anim="hero-img">
            <CaseImage
              slug="landing-desktop"
              src={imgLandingDesktop}
              title="Redesigned Second Savour landing page — sustainability-first, conversion-focused."
              aspectClass="aspect-[16/14]"
              accent="orange"
              objectPosition="top"
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
                A product people cared about — a website that didn&apos;t show
                it.
              </h2>
            </div>
            <p
              data-anim="body"
              className="googlesans-regular leading-relaxed text-muted-foreground"
            >
              Second Savour had a genuinely compelling story: a small team
              rescuing imperfect citrus and turning it into something delicious.
              But the original website buried the lead. The hero was
              product-first, the mission was a footnote, and users couldn&apos;t
              easily find where to buy.
            </p>
            <p
              data-anim="body"
              className="googlesans-regular leading-relaxed text-muted-foreground"
            >
              The site felt like a placeholder — not a brand. My job was to find
              out exactly why it wasn&apos;t working, then fix it with data to
              back every decision.
            </p>
          </section>

          <hr data-anim="divider" className="border-t border-border" />

          {/* ── Research ── */}
          <section id="research" className="scroll-mt-28 space-y-6">
            <div data-anim="section-head" className="space-y-1">
              <p className="gamja-regular text-lg tracking-tighter text-muted-foreground">
                Phase 1 — Research &amp; discovery
              </p>
              <h2 className="googlesans-semibold text-2xl text-foreground lg:text-3xl">
                Auditing the existing experience before touching a single frame.
              </h2>
            </div>
            <p
              data-anim="body"
              className="googlesans-regular leading-relaxed text-muted-foreground"
            >
              I started with a structured heuristic evaluation using
              Nielsen&apos;s 10 usability heuristics — cataloguing where the
              original site broke down before any user ever touched it.
              Visibility, consistency, error prevention, aesthetic minimalism:
              most had significant gaps.
            </p>

            <div data-anim="body" className="space-y-2">
              <p className="googlesans-medium text-xs uppercase tracking-wider text-muted-foreground">
                User interviews — 5 participants
              </p>
              <p className="googlesans-regular border-l-2 border-border pl-4 text-sm leading-relaxed text-muted-foreground">
                Think-aloud sessions with sustainability-conscious young adults
                (18–30). Tasks included finding a store location, understanding
                the mission, and adding a product to cart. I recorded what
                tripped them up and what they said out loud — both mattered.
              </p>
            </div>

            <div className="grid gap-4 pt-2 sm:grid-cols-3">
              {[
                {
                  title: "Navigation confusion",
                  detail:
                    'Users couldn\'t find store locations from the homepage. "Where to Find Us" was buried three clicks deep.',
                },
                {
                  title: "Mission invisible",
                  detail:
                    "The sustainability story — the whole reason people cared — wasn't in the hero. Multiple users missed it entirely.",
                },
                {
                  title: "No clear next step",
                  detail:
                    "After learning about the product, users weren't sure whether to shop online or find a store. The CTA was ambiguous.",
                },
              ].map((f) => (
                <div
                  key={f.title}
                  data-anim="finding-card"
                  className="border border-dashed border-border bg-muted/20 px-4 py-4"
                >
                  <p className="googlesans-semibold mb-2 text-sm text-foreground">
                    {f.title}
                  </p>
                  <p className="googlesans-regular text-sm leading-snug text-muted-foreground">
                    {f.detail}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <hr data-anim="divider" className="border-t border-border" />

          {/* ── Key insight ── */}
          <section id="insight" className="scroll-mt-28 space-y-4">
            <div data-anim="section-head" className="space-y-1">
              <p className="gamja-regular text-lg tracking-tighter text-muted-foreground">
                Key insight
              </p>
              <h2 className="googlesans-semibold text-2xl text-foreground lg:text-3xl">
                The brand&apos;s &ldquo;why&rdquo; was the product. The site
                treated it like an afterthought.
              </h2>
            </div>
            <p
              data-anim="body"
              className="googlesans-regular leading-relaxed text-muted-foreground"
            >
              Every interview participant said the same thing once I showed them
              the sustainability stats: &ldquo;Oh, that&apos;s actually really
              cool — I had no idea.&rdquo; The brand&apos;s most compelling hook
              was invisible. Users who found it converted. Users who didn&apos;t
              bounced.
            </p>
            <p
              data-anim="body"
              className="googlesans-regular leading-relaxed text-muted-foreground"
            >
              This gave me a clear redesign north star:{" "}
              <em className="not-italic text-foreground">
                lead with the mission, back it with numbers, and make every path
                to a store or a purchase obvious from the first scroll.
              </em>
            </p>
          </section>

          <hr data-anim="divider" className="border-t border-border" />

          {/* ── Redesign ── */}
          <section id="redesign" className="scroll-mt-28 space-y-6">
            <div data-anim="section-head" className="space-y-1">
              <p className="gamja-regular text-lg tracking-tighter text-muted-foreground">
                The redesign
              </p>
              <h2 className="googlesans-semibold text-2xl text-foreground lg:text-3xl">
                Story first. Then product. Then the map.
              </h2>
            </div>
            <p
              data-anim="body"
              className="googlesans-regular leading-relaxed text-muted-foreground"
            >
              I restructured the entire information architecture around the
              insight. The hero became a direct statement of the brand&apos;s
              purpose: &ldquo;Delicious Treats, Zero Waste.&rdquo; Impact
              statistics — 700&nbsp;KG diverted from landfill, 5,000 oranges
              from the trash — appeared in the first scroll. The product came
              after context.
            </p>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <p
                  data-anim="body"
                  className="googlesans-medium text-xs text-muted-foreground"
                >
                  Before — product-first, mission buried
                </p>
                <div data-anim="before-img">
                  <CaseImage
                    slug="mobile"
                    src={imgMobile}
                    title="Original mobile experience — flat hierarchy, no mission emphasis."
                    aspectClass="aspect-[9/16]"
                    accent="blue"
                    objectPosition="top"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <p
                  data-anim="body"
                  className="googlesans-medium text-xs text-orange-600 dark:text-orange-400"
                >
                  After — story-first, actionable, on-brand
                </p>
                <div data-anim="after-img">
                  <CaseImage
                    slug="landing-desktop"
                    src={imgLandingDesktop}
                    title="Redesigned landing — sustainability headline, impact stats, clear CTA."
                    aspectClass="aspect-[9/16]"
                    accent="orange"
                    objectPosition="top"
                  />
                </div>
              </div>
            </div>

            <p
              data-anim="body"
              className="googlesans-regular leading-relaxed text-muted-foreground"
            >
              Navigation was rebuilt to put &ldquo;Locations&rdquo; at the top
              level. The biggest recurring pain point in Phase 1 was users not
              being able to find a nearby store — so I designed a dedicated
              locations page with an interactive map, search, and a clean
              sidebar list. No more hunting.
            </p>

            <div data-anim="screenshot">
              <CaseImage
                slug="locations-desktop"
                src={imgLocations}
                title="Locations page — interactive map with store list and directions."
                aspectClass="aspect-[16/16]"
                accent="blue"
                objectPosition="top"
              />
            </div>
          </section>

          <hr data-anim="divider" className="border-t border-border" />

          {/* ── User testing ── */}
          <section id="testing" className="scroll-mt-28 space-y-6">
            <div data-anim="section-head" className="space-y-1">
              <p className="gamja-regular text-lg tracking-tighter text-muted-foreground">
                Phase 2 — User testing
              </p>
              <h2 className="googlesans-semibold text-2xl text-foreground lg:text-3xl">
                We tested the redesign with real users. The numbers moved.
              </h2>
            </div>
            <p
              data-anim="body"
              className="googlesans-regular leading-relaxed text-muted-foreground"
            >
              I ran a second round of moderated usability testing with 5
              participants on the redesigned prototype. Same task set, same
              demographic. I measured task completion rates, time-on-task, and
              SUS scores — then compared them to Phase 1 baseline results.
            </p>

            <div className="grid gap-4 pt-2 sm:grid-cols-3">
              {[
                {
                  task: "Find a nearby store",
                  result:
                    "Completed in under 30s by all 5 participants. None needed a second attempt.",
                },
                {
                  task: "Understand the mission",
                  result:
                    "4 of 5 participants correctly described the sustainability mission unprompted after seeing the hero.",
                },
                {
                  task: "Add a product to cart",
                  result:
                    "Zero wrong turns. Clearer product cards and a persistent cart icon eliminated the ambiguity.",
                },
              ].map((t) => (
                <div
                  key={t.task}
                  data-anim="test-card"
                  className="border border-dashed border-border bg-muted/20 px-4 py-4"
                >
                  <p className="googlesans-semibold mb-2 text-sm text-foreground">
                    {t.task}
                  </p>
                  <p className="googlesans-regular text-sm leading-snug text-muted-foreground">
                    {t.result}
                  </p>
                </div>
              ))}
            </div>

            <p
              data-anim="body"
              className="googlesans-regular leading-relaxed text-muted-foreground"
            >
              Qualitatively, the tone shift landed. Participants used words like
              &ldquo;clean,&rdquo; &ldquo;trustworthy,&rdquo; and
              &ldquo;I&apos;d actually buy this&rdquo; — language that
              didn&apos;t come up in Phase 1. The affinity map from Phase 2
              clustered almost entirely around positive first impressions and
              confidence in the brand.
            </p>
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
            <div className="grid gap-6 text-sm sm:grid-cols-3">
              <div>
                <p
                  data-anim="stat"
                  className="font-modak text-5xl text-orange-500"
                >
                  5 of 5
                </p>
                <p
                  data-anim="body"
                  className="googlesans-semibold mt-1 text-foreground"
                >
                  Location task success
                </p>
                <p
                  data-anim="body"
                  className="googlesans-regular mt-1 text-muted-foreground"
                >
                  All 5 test participants found a store without guidance. Zero
                  in Phase 1.
                </p>
              </div>
              <div>
                <p
                  data-anim="stat"
                  className="font-modak text-5xl text-sky-500"
                >
                  4 of 5
                </p>
                <p
                  data-anim="body"
                  className="googlesans-semibold mt-1 text-foreground"
                >
                  Unprompted mission recall
                </p>
                <p
                  data-anim="body"
                  className="googlesans-regular mt-1 text-muted-foreground"
                >
                  4 of 5 participants described the sustainability mission
                  correctly after the hero alone.
                </p>
              </div>
              <div>
                <p
                  data-anim="stat"
                  className="font-modak text-5xl text-orange-500 flex items-start gap-2"
                >
                  <ArrowUp className="size-10" /> SUS
                </p>
                <p
                  data-anim="body"
                  className="googlesans-semibold mt-1 text-foreground"
                >
                  Usability score
                </p>
                <p
                  data-anim="body"
                  className="googlesans-regular mt-1 text-muted-foreground"
                >
                  System Usability Scale scores improved meaningfully from Phase
                  1 to Phase 2 across all participants.
                </p>
              </div>
            </div>

            <p
              data-anim="body"
              className="googlesans-regular border-l-2 border-border pl-4 text-sm leading-relaxed text-muted-foreground"
            >
              The biggest takeaway: you can&apos;t design a great product page
              for a brand until you understand what makes that brand worth
              caring about. Every structural decision in this redesign came from
              listening — not assumption.
            </p>
          </section>
        </div>
      </article>

      <Footer />
    </div>
  );
}
