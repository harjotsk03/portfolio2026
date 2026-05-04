"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import Image from "next/image";
import { Download } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";

import aetherLogo from "@/assets/resumeimages/aetherautomation_logo.webp";
import lululemonLogo from "@/assets/resumeimages/lululemonlogo.webp";
import sfuLogo from "@/assets/resumeimages/sfulogo.webp";
import sfuRobotLogo from "@/assets/resumeimages/sfurobotsoccer.webp";

gsap.registerPlugin(ScrollTrigger);

const TITLE = ["R", "e", "s", "u", "m", "e"] as const;

const EXPERIENCE = [
  {
    logo: aetherLogo,
    logoAlt: "Aether Automation",
    role: "Software Engineer (Co-op)",
    company: "Aether Automation",
    location: "Remote",
    period: "April 2025 – Present",
    accent: "orange" as const,
    bullets: [
      "Designed and implemented backend workflows in Java and Deluge to automate tasks in Zoho CRM, improving efficiency and reducing human error for clients saving 15–25 hours per week in administrative tasks.",
      "Developed secure application using Firebase and OAuth, and integrated backend logic for syncing with EHR systems like Tebra, improving patient onboarding speed by 20+ hours.",
      "Integrated OpenAI API into Zoho CRM to auto-generate email drafts, meeting notes, and action item summaries, reducing client data task times by 40% and improving response accuracy.",
      "Collaborated directly with clients to identify business needs and designed tailored automation solutions, utilizing Java and Deluge to automate repetitive tasks in order to reduce operational costs and time.",
    ],
  },
  {
    logo: null,
    logoAlt: "Study Spotr",
    logoMonogram: "SS",
    role: "Founder & Software Engineer",
    company: "Study Spotr",
    location: "Burnaby, BC",
    period: "August 2024 – Present",
    accent: "blue" as const,
    bullets: [
      "Built and optimized RESTful APIs using Node.js and AWS, powering a study-finding web application that helped 200+ students discover ideal study spaces based on real-time data and user preferences.",
      "Designed and optimized relational schemas in PostgreSQL to support study spot listings and real-time feedback; deployed backend services to Render, ensuring seamless data flow and integration with the frontend.",
      "Comprehensive unit and integration tests using Postman, reducing post-release bug reports by over 3×.",
      "Deployed core backend features to production and maintained post-launch stability by monitoring performance, conducting regular updates, and responding to user-reported issues.",
    ],
  },
  {
    logo: sfuRobotLogo,
    logoAlt: "SFU Robot Soccer",
    role: "Front-end Engineer / Web Development Director",
    company: "SFU Robot Soccer",
    location: "Burnaby, BC",
    period: "February 2024 – Present",
    accent: "orange" as const,
    bullets: [
      "Led a team in developing a responsive web platform using React.js, improving accessibility across mobile and desktop devices, which resulted in a 15% increase in traffic and doubled user engagement on mobile.",
      "Optimized accessibility through UX design, improving user engagement, and reducing bounce rates by 25%.",
      "Collaborated with cross-functional teams to translate business requirements into technical solutions, ensuring a usable and cross-browser compatible website, enhancing the user experience for students and developers.",
    ],
  },
  {
    logo: lululemonLogo,
    logoAlt: "Lululemon Athletica",
    role: "Educator (Retail Store)",
    company: "Lululemon Athletica",
    location: "Surrey, BC",
    period: "September 2022 – April 2025",
    accent: "blue" as const,
    bullets: [],
  },
] as const;

const COURSES = [
  "Mobile Computing",
  "Data Structures & Algorithms",
  "Web Design and Development",
  "Intro to AI",
  "Generative AI",
  "Human-Computer Interactions",
  "Interaction Design",
];

const ACHIEVEMENTS = [
  "Dean's Honour Roll — Summer 2024",
  "Dean's Honour Roll — Fall 2024",
  "Dean's Honour Roll — Spring 2024",
  "SIAT Project Showcase ×2 — Summer 2024",
  "SIAT Project Showcase — Spring 2024",
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
            I have just graduated from university with a BSc. in Interactive
            Arts and Technology + Computer Science, I want to use my skills to
            design and build apps, features, and products that make an impact
            and provide a seamless user&#8209;experience. I seek a role that
            challenges me and lets me contribute to exciting projects, nurturing
            my growth as a user experience designer, researcher and software
            engineer.
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
              Where I&apos;ve built things.
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
                  <div className="size-10 overflow-hidden border border-border bg-background p-1">
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
                    2022 – Present
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
