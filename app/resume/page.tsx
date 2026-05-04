"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import Image from "next/image";
import { Download } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";

import aetherLogo from "@/assets/resumeimages/aetherautomation_logo.webp";
import studySpotrLogo from "@/assets/resumeimages/StudySpotrLogoGradient.png";
import lululemonLogo from "@/assets/resumeimages/lululemonlogo.webp";
import sfuLogo from "@/assets/resumeimages/sfulogo.webp";
import sfuRobotLogo from "@/assets/resumeimages/sfurobotsoccer.webp";

gsap.registerPlugin(ScrollTrigger);

const TITLE = ["R", "e", "s", "u", "m", "e"] as const;

const EXPERIENCE = [
  {
    logo: aetherLogo,
    logoAlt: "Aether Automation",
    role: "Product Design & Software Engineer",
    company: "Aether Automation",
    location: "Remote",
    period: "Jul 2025 – Present",
    accent: "orange" as const,
    bullets: [
      "Leading design and research for a $250K direct-to-consumer platform serving internal staff and external homebuyers, owning user discovery, journey mapping, Figma prototypes, and a shared design system.",
      "Designing for the full lifecycle of a real-world transaction — selection to walkthrough booking to document signing to post-sale issues — iterating on UI and flows through user feedback cycles with staff users.",
      "Designed, prototyped, and built an AI tool; owned user interviews and Figma prototypes, enabling natural-language CRM record management and a more seamless CRM user experience, used daily by teams and improving operational efficiency by 44%.",
      "Owned client delivery as the primary contact across product, engineering, and client stakeholders, turning insights into user flows and UI designs, then iterating through user feedback cycles and design reviews.",
    ],
  },
  {
    logo: studySpotrLogo,
    logoAlt: "Study Spotr",
    logoMonogram: "SS",
    role: "Founder & Design Engineer",
    company: "Study Spotr",
    location: "Burnaby, BC",
    period: "Aug 2024 – Present",
    accent: "blue" as const,
    bullets: [
      "Founded and led a location-based consumer platform serving 200+ students across Canada; secured $10K in funding while owning product strategy, user research, and design direction.",
      "Drove product design end-to-end — concept through web and React Native mobile launches — including wireframes, interactive prototypes, usability iteration, and release coordination.",
      "Designed a normalized data model and testing pipeline that reduced post-release defects 3×.",
    ],
  },
  {
    logo: aetherLogo,
    logoAlt: "Aether Automation",
    role: "Software Engineer Co-op",
    company: "Aether Automation",
    location: "Remote",
    period: "Apr 2025 – Jun 2025",
    accent: "orange" as const,
    bullets: [
      "Built backend workflows in Java and Deluge to automate Zoho CRM tasks, saving clients 15–25 hours per week in administrative overhead.",
      "Integrated OpenAI API to auto-generate email drafts, meeting notes, and action item summaries, cutting client data task time by 40%.",
    ],
  },

  {
    logo: sfuRobotLogo,
    logoAlt: "SFU Robot Soccer",
    role: "Director of Web Design & Development",
    company: "SFU Robot Soccer",
    location: "Burnaby, BC",
    period: "Feb 2024 – Mar 2026",
    accent: "orange" as const,
    bullets: [
      "Conducted needs interviews with club leadership, prototyped, and iterated on UX for an internal tool that reduced website update turnaround from days to minutes.",
      "Led the full website redesign end-to-end: scoped requirements, designed the system architecture, and coordinated rollout across multiple teams.",
      "Mentored 2 junior developers and designers through code review and UX best practices.",
    ],
  },
  {
    logo: lululemonLogo,
    logoAlt: "Lululemon Athletica",
    role: "Educator",
    company: "Lululemon Athletica",
    location: "Surrey, BC",
    period: "Sep 2022 – Apr 2025",
    accent: "blue" as const,
    bullets: [],
  },
] as const;

const PROJECTS = [
  {
    title: "Spotify Jam Feature Addition",
    course: "IAT 334 — Interface Design",
    period: "December 2025",
    accent: "orange" as const,
    bullets: [
      'Conducted user research interviews with active Spotify Jam users to surface friction in collaborative listening; synthesized findings into a persona and problem statement identifying "silent disagreement" as the core unmet need.',
      "Designed an upvote/downvote queue feature with 50%-threshold contributor notifications and vote history transparency; delivered 4 interactive high-fidelity Figma prototypes.",
      "Grounded each design decision in Nielsen heuristics, weighing alternatives like notification vs. auto-removal to preserve user agency.",
      "Featured on SFU SIAT Fall 2025 Showcase.",
    ],
  },
  {
    title: "Mastercard Fraud Analysis Dashboard",
    course: "IAT 333 — Interaction Design Methods",
    period: "December 2025",
    accent: "blue" as const,
    bullets: [
      "Partnered with Mastercard's Fraud team to research analyst workflow friction across fraud rules, dashboards, and outdated data; validated decisions through analyst workshops.",
      "Led the design ethnography phase and weekly stakeholder meetings to identify friction across static tables, untestable rules, and metrics disconnected from business outcomes.",
      "Contributed to 3 concept directions and a final dashboard system; ran usability testing sessions with Mastercard fraud analysts and translated findings into design iterations.",
    ],
  },
] as const;

const VOLUNTEERING = [
  {
    role: "Mentor and Sponsor",
    org: "SFU Surge SparkJam (Design Hackathon)",
    period: "May 2026",
  },
  {
    role: "Project Mentor",
    org: "SFU Surge StormForge",
    period: "Jan – Apr 2026",
    note: "Mentored a team of 4 first-to-third-year students to ideate, design, prototype, and ship a fully functional mobile event registration app.",
  },
  { role: "Hackathon Mentor", org: "UBC youCode", period: "Apr 2026" },
  { role: "Hackathon Mentor", org: "UBC nwPlus cmd-f", period: "Jan 2026" },
] as const;

const COURSES = [
  "Interaction Design Methods",
  "Interface Design",
  "HCI and Cognition",
  "Information Design",
  "Foundations of Game Design",
  "Design Evaluation",
  "Web and Mobile Design and Development",
];

const ACHIEVEMENTS = [
  "Dean's Honour Roll — Summer 2024",
  "Dean's Honour Roll — Fall 2024",
  "Dean's Honour Roll — Spring 2024",
  "SIAT Project Showcase ×2 — Summer 2024",
  "SIAT Project Showcase — Spring 2024",
  "SIAT Showcase — Fall 2025",
];

export default function ResumePage() {
  const pageRef = useRef<HTMLDivElement>(null);
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useLayoutEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    letterRefs.current.forEach((el) => {
      if (el) gsap.set(el, { opacity: 0, y: 40, skewX: -8 });
    });
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const page = pageRef.current;
    if (!page) return;

    const ctx = gsap.context(() => {
      // Title letters stagger up
      const letters = letterRefs.current.filter(Boolean) as HTMLSpanElement[];
      gsap.to(letters, {
        opacity: 1,
        y: 0,
        skewX: 0,
        duration: 0.5,
        stagger: 0.055,
        ease: "power3.out",
        delay: 0.1,
      });

      // Subtitle + download buttons
      gsap.from('[data-hero="sub"]', {
        opacity: 0,
        y: 22,
        duration: 0.55,
        stagger: 0.1,
        ease: "power2.out",
        delay: 0.5,
      });

      // Dividers wipe
      gsap.utils.toArray<HTMLElement>('[data-anim="divider"]').forEach((el) => {
        gsap.from(el, {
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
          scaleX: 0,
          transformOrigin: "left center",
          duration: 0.7,
          ease: "power2.out",
        });
      });

      // Section labels + headings
      gsap.utils.toArray<HTMLElement>('[data-anim="section-head"]').forEach((el) => {
        gsap.from(el, {
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
          opacity: 0,
          y: 20,
          duration: 0.55,
          ease: "power2.out",
        });
      });

      // Job entries stagger up per-entry
      gsap.utils.toArray<HTMLElement>('[data-anim="job-entry"]').forEach((el) => {
        gsap.from(el, {
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
          opacity: 0,
          y: 28,
          duration: 0.6,
          ease: "power2.out",
        });
      });

      // Chips (courses + achievements) — batch stagger
      const chipGroups = gsap.utils.toArray<HTMLElement>('[data-anim="chip-group"]');
      chipGroups.forEach((group) => {
        const chips = group.querySelectorAll<HTMLElement>("[data-chip]");
        gsap.from(chips, {
          scrollTrigger: { trigger: group, start: "top 88%", once: true },
          opacity: 0,
          scale: 0.85,
          duration: 0.35,
          stagger: 0.04,
          ease: "back.out(1.6)",
        });
      });
    }, page);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={pageRef} className="flex min-h-screen flex-col pt-20">
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 pb-28 md:px-6">
        {/* ── Hero ─────────────────────────────────────────────── */}
        <header className="mb-14 mt-10 space-y-5">
          <h1
            className="font-modak text-7xl leading-none text-primary"
            style={{ transform: "skewX(-3deg)" }}
            aria-label="Resume"
          >
            {TITLE.map((ch, i) => (
              <span
                key={i}
                ref={(el) => {
                  letterRefs.current[i] = el;
                }}
                className="inline-block"
              >
                {ch}
              </span>
            ))}
          </h1>

          <p
            data-hero="sub"
            className="googlesans-regular max-w-prose text-base leading-relaxed text-muted-foreground md:text-lg"
          >
            Designer engineer who loves making the user experience the best it
            can be — and getting hands-on shipping it. I take products from user
            research to Figma prototypes and wireframes through to production
            code and design systems, and I&apos;m happiest in the bridge between
            design and engineering teams.
          </p>

          {/* Download buttons */}
          <div data-hero="sub" className="flex flex-wrap gap-3 pt-1">
            <Button
              variant="orange"
              size="sm"
              className="gap-2 googlesans-medium text-sm"
              asChild
            >
              <a href="/resume/HarjotSinghResumeUXDesign.pdf" download>
                Download Design Resume as PDF <Download className="size-3" />
              </a>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-2 googlesans-medium text-sm"
              asChild
            >
              <a href="/resume/HarjotSinghResumeSWE.pdf" download>
                Download SWE Resume as PDF
              </a>
            </Button>
          </div>
        </header>

        {/* ── Work Experience ───────────────────────────────────── */}
        <hr data-anim="divider" className="border-t border-border" />

        <section className="mt-12 space-y-12">
          <div data-anim="section-head">
            <p className="gamja-regular text-lg tracking-tighter text-muted-foreground">
              Work experience
            </p>
            <h2 className="googlesans-semibold text-2xl text-foreground lg:text-3xl">
              Where I&apos;ve designed &amp; built things.
            </h2>
          </div>

          {EXPERIENCE.map((job) => (
            <div
              key={job.role + job.company}
              data-anim="job-entry"
              className="flex gap-5"
            >
              {/* Logo column */}
              <div className="mt-0.5 shrink-0">
                {job.logo ? (
                  <div className="size-10 overflow-hidden bg-background">
                    <Image
                      src={job.logo}
                      alt={job.logoAlt}
                      width={32}
                      height={32}
                      className="size-full object-contain"
                    />
                  </div>
                ) : (
                  <div
                    className={`size-10 flex items-center justify-center border border-dashed text-xs font-bold `}
                  >
                    {"logoMonogram" in job ? job.logoMonogram : ""}
                  </div>
                )}
                {/* Vertical connector line */}
                <div
                  className="mx-auto mt-2 w-px flex-1 bg-border"
                  style={{ minHeight: "calc(100% - 44px)" }}
                />
              </div>

              {/* Content column */}
              <div className="flex-1 pb-2 space-y-2">
                <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-0.5">
                  <div>
                    <p className="googlesans-semibold text-base text-foreground leading-snug">
                      {job.role}
                    </p>
                    <p
                      className={`googlesans-medium text-sm ${
                        job.accent === "orange"
                          ? "text-orange-600 dark:text-orange-400"
                          : "text-sky-600 dark:text-sky-400"
                      }`}
                    >
                      {job.company}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="googlesans-medium text-xs text-muted-foreground">
                      {job.period}
                    </p>
                    <p className="googlesans-regular text-xs text-muted-foreground/70">
                      {job.location}
                    </p>
                  </div>
                </div>

                {job.bullets.length > 0 && (
                  <ul className="mt-3 space-y-2">
                    {job.bullets.map((b, bi) => (
                      <li
                        key={bi}
                        className="googlesans-regular flex gap-2.5 text-sm leading-relaxed text-muted-foreground"
                      >
                        <span
                          className={`mt-1.5 size-1.5 shrink-0 rounded-full ${
                            job.accent === "orange"
                              ? "bg-orange-500/60"
                              : "bg-sky-500/60"
                          }`}
                        />
                        {b}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </section>

        {/* ── Education ─────────────────────────────────────────── */}
        <hr data-anim="divider" className="mt-14 border-t border-border" />

        <section className="mt-12 space-y-8">
          <div data-anim="section-head">
            <p className="gamja-regular text-lg tracking-tighter text-muted-foreground">
              Education
            </p>
            <h2 className="googlesans-semibold text-2xl text-foreground lg:text-3xl">
              Simon Fraser University
            </h2>
          </div>

          <div data-anim="job-entry" className="flex gap-5">
            {/* SFU logo */}
            <div className="mt-0.5 shrink-0">
              <div className="size-10 overflow-hidden border border-border bg-background p-1">
                <Image
                  src={sfuLogo}
                  alt="Simon Fraser University"
                  width={32}
                  height={32}
                  className="size-full object-contain"
                />
              </div>
            </div>

            <div className="flex-1 space-y-5">
              <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-0.5">
                <div>
                  <p className="googlesans-semibold text-base text-foreground leading-snug">
                    BSc. Computer Science &amp; Interactive Arts and Technology
                  </p>
                  <p className="googlesans-medium text-sm text-orange-600 dark:text-orange-400">
                    Simon Fraser University
                  </p>
                </div>
                <div className="text-right">
                  <p className="googlesans-medium text-xs text-muted-foreground">
                    Sep 2021 – Apr 2026
                  </p>
                  <p className="googlesans-regular text-xs text-muted-foreground/70">
                    Burnaby, BC
                  </p>
                </div>
              </div>

              {/* Courses */}
              <div>
                <p className="googlesans-medium mb-3 text-xs uppercase tracking-wider text-muted-foreground">
                  Relevant courses
                </p>
                <div data-anim="chip-group" className="flex flex-wrap gap-2">
                  {COURSES.map((c) => (
                    <span
                      key={c}
                      data-chip
                      className="googlesans-regular border border-dashed border-border bg-muted/30 px-2.5 py-1 text-xs text-muted-foreground"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              {/* Achievements */}
              <div>
                <p className="googlesans-medium mb-3 text-xs uppercase tracking-wider text-muted-foreground">
                  Achievements
                </p>
                <div data-anim="chip-group" className="flex flex-wrap gap-2">
                  {ACHIEVEMENTS.map((a) => (
                    <span
                      key={a}
                      data-chip
                      className="googlesans-medium border border-dashed border-orange-500/35 bg-orange-500/5 px-2.5 py-1 text-xs text-orange-700 dark:text-orange-300/90"
                    >
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Projects & UX Case Studies ────────────────────────── */}
        <hr data-anim="divider" className="mt-14 border-t border-border" />

        <section className="mt-12 space-y-10">
          <div data-anim="section-head">
            <p className="gamja-regular text-lg tracking-tighter text-muted-foreground">
              Projects &amp; UX case studies
            </p>
            <h2 className="googlesans-semibold text-2xl text-foreground lg:text-3xl">
              Research-to-prototype work.
            </h2>
          </div>

          {PROJECTS.map((proj) => (
            <div key={proj.title} data-anim="job-entry" className="flex gap-5">
              <div className="mt-1.5 shrink-0">
                <div
                  className={`size-2 rounded-full ${
                    proj.accent === "orange"
                      ? "bg-orange-500/60"
                      : "bg-sky-500/60"
                  }`}
                />
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-0.5">
                  <div>
                    <p className="googlesans-semibold text-base text-foreground leading-snug">
                      {proj.title}
                    </p>
                    <p
                      className={`googlesans-medium text-sm ${
                        proj.accent === "orange"
                          ? "text-orange-600 dark:text-orange-400"
                          : "text-sky-600 dark:text-sky-400"
                      }`}
                    >
                      {proj.course}
                    </p>
                  </div>
                  <p className="googlesans-medium text-xs text-muted-foreground">
                    {proj.period}
                  </p>
                </div>
                <ul className="mt-2 space-y-2">
                  {proj.bullets.map((b, bi) => (
                    <li
                      key={bi}
                      className="googlesans-regular flex gap-2.5 text-sm leading-relaxed text-muted-foreground"
                    >
                      <span
                        className={`mt-1.5 size-1.5 shrink-0 rounded-full ${
                          proj.accent === "orange"
                            ? "bg-orange-500/40"
                            : "bg-sky-500/40"
                        }`}
                      />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </section>

        {/* ── Volunteering / Mentoring ──────────────────────────── */}
        <hr data-anim="divider" className="mt-14 border-t border-border" />

        <section className="mt-12 space-y-6">
          <div data-anim="section-head">
            <p className="gamja-regular text-lg tracking-tighter text-muted-foreground">
              Volunteering &amp; mentoring
            </p>
            <h2 className="googlesans-semibold text-2xl text-foreground lg:text-3xl">
              Giving back to the community.
            </h2>
          </div>

          <div className="space-y-4">
            {VOLUNTEERING.map((v) => (
              <div
                key={v.role + v.org}
                data-anim="job-entry"
                className="flex gap-5"
              >
                <div className="mt-1.5 shrink-0">
                  <div className="size-2 rounded-full bg-sky-500/60" />
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-0.5">
                    <div>
                      <p className="googlesans-semibold text-sm text-foreground leading-snug">
                        {v.role}
                      </p>
                      <p className="googlesans-medium text-sm text-sky-600 dark:text-sky-400">
                        {v.org}
                      </p>
                    </div>
                    <p className="googlesans-medium text-xs text-muted-foreground">
                      {v.period}
                    </p>
                  </div>
                  {"note" in v && v.note && (
                    <p className="googlesans-regular mt-1.5 text-sm leading-relaxed text-muted-foreground">
                      {v.note}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Bottom download CTA ───────────────────────────────── */}
        <hr data-anim="divider" className="mt-14 border-t border-border" />

        <div
          data-anim="section-head"
          className="mt-10 flex flex-wrap items-center justify-between gap-4"
        >
          <p className="googlesans-regular text-sm text-muted-foreground">
            Want a copy?
          </p>
          <div className="flex flex-wrap gap-3">
            <Button
              variant="orange"
              size="xs"
              className="gap-2 googlesans-medium"
              asChild
            >
              <a href="/resume/HarjotSinghResumeUXDesign.pdf" download>
                Download Design Resume as PDF <Download className="size-3" />
              </a>
            </Button>
            <Button
              variant="outline"
              size="xs"
              className="gap-2 googlesans-medium"
              asChild
            >
              <a href="/resume/HarjotSinghResumeSWE.pdf" download>
                Download SWE Resume as PDF
              </a>
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
