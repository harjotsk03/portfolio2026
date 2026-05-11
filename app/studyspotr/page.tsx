"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import Link from "next/link";
import { ChevronRight, ExternalLink } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Footer } from "@/components/footer";
import { CaseImage } from "@/components/studyspotr/case-image";
import { CaseStudySideNav, CaseStudyMobileNav } from "@/components/studyspotr/case-study-nav";
import { SurveyModal } from "@/components/studyspotr/survey-modal";
import { Button } from "@/components/ui/button";

import imgTeam from "@/assets/studyspotrcasestudy/workingwithteam.png";
import imgAbOld from "@/assets/studyspotrcasestudy/abtestold.png";
import imgAbNew from "@/assets/studyspotrcasestudy/abtestnew.png";
import imgMapList from "@/assets/studyspotrcasestudy/maplistview.png";
import imgSpotDetail from "@/assets/studyspotrcasestudy/selectedspot.png";
import imgSpot1 from "@/assets/studyspotrcasestudy/studyspot1mapped.jpeg";
import imgSpot2 from "@/assets/studyspotrcasestudy/studyspot2mapped.jpeg";

gsap.registerPlugin(ScrollTrigger);

const LIVE_SITE_HREF =
  process.env.NEXT_PUBLIC_STUDY_SPOTR_LIVE_URL ?? "https://studyspotr.com";

const SURVEY_SHEET_HREF =
  "https://docs.google.com/spreadsheets/d/1D30Q1ZYDlyrOx_A88_c2iAOTcpfHSh_Docvq8OVz0y8/edit";

// "Study Spotr" split into letter spans — space gets a margin class
const TITLE_LETTERS = [
  { ch: "S" }, { ch: "t" }, { ch: "u" }, { ch: "d" }, { ch: "y" },
  { ch: " ", space: true },
  { ch: "S" }, { ch: "p" }, { ch: "o" }, { ch: "t" }, { ch: "r" },
] as const;

export default function StudySpotrPage() {
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

      // Title letters spin in
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

      // Breadcrumb, subtitle, button — stagger slide up
      gsap.from('[data-hero="sub"]', {
        opacity: 0,
        y: 20,
        duration: 0.55,
        stagger: 0.1,
        ease: "power2.out",
        delay: 0.55,
      });

      // Meta row items stagger up
      gsap.from('[data-hero="meta"]', {
        opacity: 0,
        y: 28,
        duration: 0.5,
        stagger: 0.08,
        ease: "power2.out",
        delay: 0.72,
      });

      // Tech block fades in with blur
      gsap.from('[data-hero="tech"]', {
        opacity: 0,
        y: 20,
        filter: "blur(6px)",
        duration: 0.65,
        ease: "power2.out",
        delay: 0.85,
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
      // Team photo
      gsap.from('[data-anim="team-photo"]', {
        scrollTrigger: { trigger: '[data-anim="team-photo"]', start: "top 85%", once: true },
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

      // Section headings + labels — slide up per section
      gsap.utils.toArray<HTMLElement>('[data-anim="section-head"]').forEach((el) => {
        gsap.from(el, {
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
          opacity: 0,
          y: 24,
          duration: 0.6,
          ease: "power2.out",
        });
      });

      // Body paragraphs — gentle fade up
      gsap.utils.toArray<HTMLElement>('[data-anim="body"]').forEach((el) => {
        gsap.from(el, {
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
          opacity: 0,
          y: 16,
          duration: 0.55,
          ease: "power2.out",
        });
      });

      // Survey trigger button
      gsap.from('[data-anim="survey-btn"]', {
        scrollTrigger: { trigger: '[data-anim="survey-btn"]', start: "top 88%", once: true },
        opacity: 0,
        y: 12,
        duration: 0.4,
        ease: "power2.out",
      });

      // Persona cards — stagger up
      const personaCards = gsap.utils.toArray<HTMLElement>('[data-anim="persona-card"]');
      if (personaCards.length) {
        gsap.from(personaCards, {
          scrollTrigger: { trigger: personaCards[0], start: "top 85%", once: true },
          opacity: 0,
          y: 28,
          scale: 0.96,
          duration: 0.55,
          stagger: 0.1,
          ease: "power2.out",
        });
      }

      // A/B images — slide from their own side
      gsap.from('[data-anim="ab-old"]', {
        scrollTrigger: { trigger: '[data-anim="ab-old"]', start: "top 85%", once: true },
        opacity: 0,
        x: -30,
        scale: 0.97,
        duration: 0.7,
        ease: "power3.out",
      });
      gsap.from('[data-anim="ab-new"]', {
        scrollTrigger: { trigger: '[data-anim="ab-new"]', start: "top 85%", once: true },
        opacity: 0,
        x: 30,
        scale: 0.97,
        duration: 0.7,
        ease: "power3.out",
      });

      // Product screenshots — scale up from slightly below
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

      // Spot photos — stagger
      const spotPhotos = gsap.utils.toArray<HTMLElement>('[data-anim="spot-photo"]');
      if (spotPhotos.length) {
        gsap.from(spotPhotos, {
          scrollTrigger: { trigger: spotPhotos[0], start: "top 87%", once: true },
          opacity: 0,
          y: 32,
          scale: 0.96,
          duration: 0.65,
          stagger: 0.12,
          ease: "power3.out",
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
    }, article);

    return () => ctx.revert();
  }, []);

  return (
    <div className="flex min-h-screen flex-col pt-28 xl:pt-20">
      <CaseStudyMobileNav />
      <CaseStudySideNav />

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
          <span className="googlesans-medium text-foreground">Study Spotr</span>
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
            <span className="border border-orange-300/60 dark:border-orange-700/60 bg-orange-100 dark:bg-orange-950 px-2 py-0.5 googlesans-medium text-[10px] uppercase tracking-wider text-orange-700 dark:text-orange-300">
              Startup
            </span>
          </div>
          <h1
            className="font-modak text-7xl leading-none text-primary"
            style={{ transform: "skewX(-3deg)" }}
            aria-label="Study Spotr"
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
            Students were struggling to find places to study — and even more so,
            people to study with. I designed and built Study Spotr from the
            ground up: research, UI, and full-stack code.
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
            { label: "Role", value: "Founder + Designer + Engineer" },
            { label: "Type", value: "Startup" },
            { label: "Team", value: "Team of 3" },
            { label: "Timeline", value: "Aug 2024 – Present" },
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

        {/* Tech */}
        <div
          data-hero="tech"
          className="mb-10 grid gap-6 text-sm sm:grid-cols-3 border border-dashed border-border bg-muted/20 px-5 py-5"
        >
          <div>
            <p className="googlesans-semibold mb-2 text-foreground">Frontend</p>
            <ul className="googlesans-regular space-y-1 text-muted-foreground">
              <li>React · Next.js</li>
              <li>Tailwind · ShadCN</li>
              <li>Mapbox</li>
            </ul>
          </div>
          <div>
            <p className="googlesans-semibold mb-2 text-foreground">Backend</p>
            <ul className="googlesans-regular space-y-1 text-muted-foreground">
              <li>Java · Spring Boot</li>
              <li>PostgreSQL · AWS RDS</li>
              <li>S3 · EC2 · SendGrid</li>
            </ul>
          </div>
          <div>
            <p className="googlesans-semibold mb-2 text-foreground">Design</p>
            <ul className="googlesans-regular space-y-1 text-muted-foreground">
              <li>Figma</li>
              <li>Design system</li>
              <li>Iterative prototyping</li>
            </ul>
          </div>
        </div>

        <div className="space-y-16">
          {/* Team photo */}
          <div data-anim="team-photo">
            <CaseImage
              slug="team"
              src={imgTeam}
              title="Working on Study Spotr with the team."
              aspectClass="aspect-[16/9]"
              accent="blue"
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
                Students were disconnected — even when surrounded by people.
              </h2>
            </div>
            <p
              data-anim="body"
              className="googlesans-regular leading-relaxed text-muted-foreground"
            >
              Despite being on campus every day, students told us they felt
              isolated. Finding a good place to study meant wandering around or
              asking friends. Finding someone to study with was even harder.
              There was no app for either — just Reddit threads and group chats.
            </p>
            <p
              data-anim="body"
              className="googlesans-regular leading-relaxed text-muted-foreground"
            >
              The question I kept asking: what does it take to make a student
              feel like they actually belong on campus?
            </p>
          </section>

          <hr data-anim="divider" className="border-t border-border" />

          {/* ── Research ── */}
          <section id="research" className="scroll-mt-28 space-y-6">
            <div data-anim="section-head" className="space-y-1">
              <p className="gamja-regular text-lg tracking-tighter text-muted-foreground">
                Research &amp; discovery
              </p>
              <h2 className="googlesans-semibold text-2xl text-foreground lg:text-3xl">
                We talked to real students before designing anything.
              </h2>
            </div>
            <p
              data-anim="body"
              className="googlesans-regular leading-relaxed text-muted-foreground"
            >
              Before touching Figma, we ran a structured discovery phase —
              surveys, user interviews, and Spark Program exercises (problem
              statements, persona mapping, value proposition canvases). The goal
              was to validate the pain before building the cure.
            </p>

            <div data-anim="body" className="space-y-2">
              <SurveyModal>
                <button
                  data-anim="survey-btn"
                  className="googlesans-medium rounded border border-dashed border-border bg-muted/40 px-2.5 py-1 text-xs uppercase tracking-wider text-muted-foreground transition-colors hover:bg-muted/70 hover:text-foreground"
                >
                  Survey — 21 responses across 4 SFU courses ↗
                </button>
              </SurveyModal>
              <p className="googlesans-regular border-l-2 border-border pl-4 text-sm leading-relaxed text-muted-foreground">
                IAT 460 · IAT 359 · CMPT 225 · MATH 151. Strongly positive
                signal. Next phase targeted first and second-year students for
                retention-focused follow-up.
              </p>
            </div>

            <div data-anim="body" className="space-y-2">
              <p className="googlesans-medium text-xs uppercase tracking-wider text-muted-foreground">
                Interviews — 50+ conversations
              </p>
              <p className="googlesans-regular border-l-2 border-border pl-4 text-sm leading-relaxed text-muted-foreground">
                Talked to students across universities to dig into navigation,
                trust, and community — and to avoid building something that was
                just another map app.
              </p>
            </div>

            <div className="grid gap-4 pt-2 sm:grid-cols-3">
              {[
                {
                  name: "Emily",
                  role: "Year 1 · Engineering · Surrey",
                  need: "Needs structured collaboration — the cohort model creates workload, but not community.",
                },
                {
                  name: "John",
                  role: "Year 2 · Transfer to CS",
                  need: "Split across two campuses, navigating a new faculty. Wants spot intel from people who actually know.",
                },
                {
                  name: "Kashfi",
                  role: "Year 2 · SIAT",
                  need: "Extroverted and project-driven. Needs group spaces with the right tools, not just a quiet corner.",
                },
              ].map((p) => (
                <div
                  key={p.name}
                  data-anim="persona-card"
                  className="border border-dashed border-border bg-muted/20 px-4 py-4"
                >
                  <p className="googlesans-semibold text-sm text-foreground">
                    {p.name}
                  </p>
                  <p className="googlesans-medium mb-2 text-[11px] text-muted-foreground/80">
                    {p.role}
                  </p>
                  <p className="googlesans-regular text-sm leading-snug text-muted-foreground">
                    {p.need}
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
                Students don&apos;t just need a spot — they need a reason to
                show up.
              </h2>
            </div>
            <p
              data-anim="body"
              className="googlesans-regular leading-relaxed text-muted-foreground"
            >
              Early research pointed to something deeper than logistics.
              Students who felt connected to a place or a group came back. Those
              who didn&apos;t drifted to their bedroom. The insight that shaped
              everything: the spot is the excuse — the people and the community
              are the actual product.
            </p>
            <p
              data-anim="body"
              className="googlesans-regular leading-relaxed text-muted-foreground"
            >
              This shifted our design north star from{" "}
              <em className="not-italic text-foreground">
                &ldquo;find a study spot&rdquo;
              </em>{" "}
              to{" "}
              <em className="not-italic text-foreground">
                &ldquo;help students build a reason to leave their dorm.&rdquo;
              </em>
            </p>
          </section>

          <hr data-anim="divider" className="border-t border-border" />

          {/* ── A/B testing ── */}
          <section id="ab-testing" className="scroll-mt-28 space-y-6">
            <div data-anim="section-head" className="space-y-1">
              <p className="gamja-regular text-lg tracking-tighter text-muted-foreground">
                Design &amp; A/B testing
              </p>
              <h2 className="googlesans-semibold text-2xl text-foreground lg:text-3xl">
                We A/B tested the landing page — and the data was clear.
              </h2>
            </div>
            <p
              data-anim="body"
              className="googlesans-regular leading-relaxed text-muted-foreground"
            >
              The old landing page worked — but it felt sterile. No personality,
              no warmth, nothing that said &ldquo;this was made by students, for
              students.&rdquo; We rebuilt it with real photos, honest copy, and
              a design that felt lived-in.
            </p>
            <p
              data-anim="body"
              className="googlesans-regular leading-relaxed text-muted-foreground"
            >
              Students who hit the new version felt like the product was real.
              The old one felt like a template. The new landing page drove
              meaningfully more sign-ups and students spent longer on it before
              bouncing.
            </p>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <p
                  data-anim="body"
                  className="googlesans-medium text-xs text-muted-foreground"
                >
                  Old — stale, no personality
                </p>
                <div data-anim="ab-old">
                  <CaseImage
                    slug="ab-screen-a"
                    src={imgAbOld}
                    title="Old landing page — felt generic and uninviting."
                    aspectClass="aspect-[9/16]"
                    accent="blue"
                    objectPosition="right"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <p
                  data-anim="body"
                  className="googlesans-medium text-xs text-orange-600 dark:text-orange-400"
                >
                  New — real, warm, converts better
                </p>
                <div data-anim="ab-new">
                  <CaseImage
                    slug="ab-screen-b"
                    src={imgAbNew}
                    title="New landing page — felt like a real product students made."
                    aspectClass="aspect-[9/16]"
                    accent="orange"
                  />
                </div>
              </div>
            </div>
          </section>

          <hr data-anim="divider" className="border-t border-border" />

          {/* ── The product ── */}
          <section id="product" className="scroll-mt-28 space-y-6">
            <div data-anim="section-head" className="space-y-1">
              <p className="gamja-regular text-lg tracking-tighter text-muted-foreground">
                The product
              </p>
              <h2 className="googlesans-semibold text-2xl text-foreground lg:text-3xl">
                Spots, reviews, and a Mapbox-powered map.
              </h2>
            </div>
            <p
              data-anim="body"
              className="googlesans-regular leading-relaxed text-muted-foreground"
            >
              The final UI is built around reducing friction at every step —
              map-first discovery, real student reviews, and amenity filters so
              you know before you walk over whether there&apos;s a whiteboard,
              outlets, or decent WiFi.
            </p>

            <div data-anim="screenshot">
              <CaseImage
                slug="map-view"
                src={imgMapList}
                title="Live map and list view with pins and spot details."
                aspectClass="aspect-[16/9]"
                accent="blue"
                objectPosition="left"
              />
            </div>

            <div data-anim="screenshot">
              <CaseImage
                slug="spot-detail"
                src={imgSpotDetail}
                title="Spot detail page — amenities, reviews, and directions."
                aspectClass="aspect-[16/9]"
                accent="orange"
                objectPosition="left"
              />
            </div>
          </section>

          <hr data-anim="divider" className="border-t border-border" />

          {/* ── Real spots ── */}
          <section id="spots" className="scroll-mt-28 space-y-4">
            <p
              data-anim="section-head"
              className="gamja-regular text-lg tracking-tighter text-muted-foreground"
            >
              Study spots we&apos;ve mapped
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div data-anim="spot-photo">
                <CaseImage
                  slug="spot-photo-1"
                  src={imgSpot1}
                  title="Ridington Room UBC IKB, Vancouver."
                  aspectClass="aspect-[4/3]"
                  accent="blue"
                />
              </div>
              <div data-anim="spot-photo">
                <CaseImage
                  slug="spot-photo-2"
                  src={imgSpot2}
                  title="Edills Coffee House, Scarborough."
                  aspectClass="aspect-[4/3]"
                  accent="orange"
                />
              </div>
            </div>
          </section>

          <hr data-anim="divider" className="border-t border-border" />

          {/* ── Getting users ── */}
          <section id="getting-users" className="scroll-mt-28 space-y-4">
            <div data-anim="section-head" className="space-y-1">
              <p className="gamja-regular text-lg tracking-tighter text-muted-foreground">
                Getting users
              </p>
              <h2 className="googlesans-semibold text-2xl text-foreground lg:text-3xl">
                The hardest design problem was getting people in the door.
              </h2>
            </div>
            <p
              data-anim="body"
              className="googlesans-regular leading-relaxed text-muted-foreground"
            >
              Cold approached students on campus. Asked professors to announce
              it in class. Tabled at Welcome Week events and tried to get
              first-years to register on the spot. Every conversation was also a
              user interview. We refined messaging based on what made people
              stop scrolling on their phones versus what made them walk away.
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
            <div className="grid gap-6 text-sm sm:grid-cols-2">
              <div>
                <p
                  data-anim="stat"
                  className="font-modak text-5xl text-orange-500"
                >
                  100+
                </p>
                <p
                  data-anim="body"
                  className="googlesans-semibold mt-1 text-foreground"
                >
                  Students onboarded
                </p>
                <p
                  data-anim="body"
                  className="googlesans-regular mt-1 text-muted-foreground"
                >
                  Next milestone is 500, then a first café partnership.
                </p>
              </div>
              <div>
                <p
                  data-anim="stat"
                  className="font-modak text-5xl text-sky-500"
                >
                  29%
                </p>
                <p
                  data-anim="body"
                  className="googlesans-semibold mt-1 text-foreground"
                >
                  Faster load time
                </p>
                <p
                  data-anim="body"
                  className="googlesans-regular mt-1 text-muted-foreground"
                >
                  From SSR, front-end caching, and tighter API patterns.
                </p>
              </div>
            </div>
          </section>
        </div>
      </article>

      <Footer />
    </div>
  );
}
