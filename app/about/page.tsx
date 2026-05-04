"use client";

import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";
import { Footer } from "@/components/footer";
import {
  Carousel,
  CarouselCaption,
  CarouselContent,
  CarouselDots,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import me from "@/assets/me.png";
import imgSnowboard from "@/assets/mesnowboarding.png";
import imgBruno from "@/assets/meandbrunoonhike.png";
import imgCanucksGame from "@/assets/canucksgame7oilers.jpg";
import imgMUFC from "@/assets/mufcgamelondon.png";
import imgFootball from "@/assets/playingmensfootballsurreyunited.png";
import imgCanucksGF from "@/assets/meandgirlfriendcanucksgame.png";
import imgHackWin from "@/assets/hackathonwin2026meandfaaiz.jpg";
import imgUW from "@/assets/uwashingtonhackathon.png";
import imgMLH from "@/assets/talkingtomikemlh.jpg";
import imgEA from "@/assets/eaofficetour.png";
import imgStudySpotr from "@/assets/mefaaizstudyspotr.png";
import imgStormHacks from "@/assets/winningstormhackshackathon.png";

gsap.registerPlugin(ScrollTrigger);

const TITLE = ["A", "b", "o", "u", "t"] as const;

const SKILLS_TIMELINE = [
  { year: "2022", skill: "Golf", emoji: "⛳", note: "Still can't break 90. Still going.", img: null },
  { year: "2023", skill: "How to code", emoji: "💻", note: "Started from zero. Fell completely in love.", img: null },
  { year: "2024", skill: "Snowboarding", emoji: "🏂", note: "Spent a whole season eating snow on the mountain.", img: imgSnowboard },
  { year: "2025", skill: "Ice hockey", emoji: "🏒", note: "Turns out skating is hard. Worth it.", img: null },
  { year: "2026", skill: "Marathon training", emoji: "🏃", note: "26.2 miles. Current status: in progress.", img: null },
] as const;

const CAROUSEL_SLIDES = [
  { label: "Winning a hackathon with Faaiz, 2026.", image: imgHackWin },
  { label: "UW hackathon — University of Washington.", image: imgUW },
  { label: "Talking to Mike from MLH.", image: imgMLH },
  { label: "EA office tour in Burnaby.", image: imgEA },
  { label: "Working on Study Spotr with Faaiz.", image: imgStudySpotr },
  { label: "Winning StormHacks hackathon.", image: imgStormHacks },
] as const;

const GAMES = [
  { name: "EA FC (FIFA)", emoji: "⚽" },
  { name: "NHL Series", emoji: "🏒" },
  { name: "CS2", emoji: "🎯" },
];

export default function AboutPage() {
  const pageRef = useRef<HTMLDivElement>(null);
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);

  const carouselPlugins = useMemo(() => [WheelGesturesPlugin()], []);

  useLayoutEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    letterRefs.current.forEach((el) => {
      if (el) gsap.set(el, { opacity: 0, y: 48, skewX: -10 });
    });
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const page = pageRef.current;
    if (!page) return;

    const ctx = gsap.context(() => {
      // Title letters
      const letters = letterRefs.current.filter(Boolean) as HTMLSpanElement[];
      gsap.to(letters, {
        opacity: 1, y: 0, skewX: 0,
        duration: 0.5, stagger: 0.06, ease: "power3.out", delay: 0.1,
      });

      // Hero sub elements
      gsap.from('[data-hero="sub"]', {
        opacity: 0, y: 22, duration: 0.55, stagger: 0.1, ease: "power2.out", delay: 0.45,
      });

      // Dividers wipe
      gsap.utils.toArray<HTMLElement>('[data-anim="divider"]').forEach((el) => {
        gsap.from(el, {
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
          scaleX: 0, transformOrigin: "left center", duration: 0.7, ease: "power2.out",
        });
      });

      // Section heads
      gsap.utils.toArray<HTMLElement>('[data-anim="section-head"]').forEach((el) => {
        gsap.from(el, {
          scrollTrigger: { trigger: el, start: "top 87%", once: true },
          opacity: 0, y: 20, duration: 0.55, ease: "power2.out",
        });
      });

      // Body text
      gsap.utils.toArray<HTMLElement>('[data-anim="body"]').forEach((el) => {
        gsap.from(el, {
          scrollTrigger: { trigger: el, start: "top 89%", once: true },
          opacity: 0, y: 14, duration: 0.5, ease: "power2.out",
        });
      });

      // Skill cards
      const skillCards = gsap.utils.toArray<HTMLElement>('[data-anim="skill-card"]');
      if (skillCards.length) {
        gsap.from(skillCards, {
          scrollTrigger: { trigger: skillCards[0], start: "top 85%", once: true },
          opacity: 0, y: 32, scale: 0.95,
          duration: 0.55, stagger: 0.1, ease: "power2.out",
        });
      }

      // Bento cards
      const bentoCards = gsap.utils.toArray<HTMLElement>('[data-anim="bento"]');
      if (bentoCards.length) {
        gsap.from(bentoCards, {
          scrollTrigger: { trigger: bentoCards[0], start: "top 85%", once: true },
          opacity: 0, scale: 0.93, y: 20,
          duration: 0.5, stagger: 0.07, ease: "back.out(1.4)",
        });
      }

      // Carousel slide in
      gsap.from('[data-anim="carousel-wrap"]', {
        scrollTrigger: { trigger: '[data-anim="carousel-wrap"]', start: "top 82%", once: true },
        opacity: 0, x: 40, scale: 0.96, rotateY: -4,
        transformOrigin: "center right",
        transformPerspective: 1200,
        duration: 0.85, ease: "power3.out",
      });

      // Philosophy quote
      gsap.from('[data-anim="quote"]', {
        scrollTrigger: { trigger: '[data-anim="quote"]', start: "top 85%", once: true },
        opacity: 0, scale: 0.97, y: 20, duration: 0.7, ease: "power3.out",
      });
    }, page);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={pageRef} className="flex min-h-screen flex-col pt-20">
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 pb-28 md:px-6">

        {/* ── Hero ─────────────────────────────────────────────── */}
        <header className="mt-10 mb-14 space-y-5">
          <h1
            className="font-modak text-7xl leading-none text-primary"
            style={{ transform: "skewX(-3deg)" }}
            aria-label="About"
          >
            {TITLE.map((ch, i) => (
              <span key={i} ref={(el) => { letterRefs.current[i] = el; }} className="inline-block">
                {ch}
              </span>
            ))}
          </h1>

          <div data-hero="sub" className="flex items-start gap-5">
            <div className="relative size-16 shrink-0 overflow-hidden border border-border">
              <Image src={me} alt="Harjot" fill className="object-cover" />
            </div>
            <p className="googlesans-regular max-w-lg text-base leading-relaxed text-muted-foreground md:text-lg">
              Hey — I&apos;m Harjot. A design engineer in Vancouver who builds
              things that feel effortless to use. When I&apos;m not at a
              computer I&apos;m probably on a field, a rink, or a mountain.
            </p>
          </div>

          <p data-hero="sub" className="googlesans-regular max-w-prose text-base leading-relaxed text-muted-foreground">
            I&apos;m obsessed with the messiness of innovation — the part
            where nothing is clean yet and every decision matters. My
            favourite thing to build is the detail nobody notices but
            everyone feels: the interaction that means a user never has to
            think about where they came from or where to go next.
          </p>
        </header>

        {/* ── Learning timeline ────────────────────────────────── */}
        <hr data-anim="divider" className="border-t border-border" />

        <section className="mt-12 space-y-8">
          <div data-anim="section-head" className="space-y-1">
            <p className="gamja-regular text-lg tracking-tighter text-muted-foreground">
              Something new every year
            </p>
            <h2 className="googlesans-semibold text-2xl text-foreground lg:text-3xl">
              I pick one thing I don&apos;t know how to do. Then I learn it.
            </h2>
          </div>

          <div className="relative">
            <div className="absolute left-[22px] top-0 h-full w-px bg-border sm:left-[26px]" />
            <div className="space-y-4">
              {SKILLS_TIMELINE.map((item, i) => (
                <div key={item.year} data-anim="skill-card" className="relative flex items-start gap-5">
                  {/* Dot */}
                  <div className={`relative z-10 flex size-11 shrink-0 items-center justify-center border text-xl sm:size-[52px] ${
                    i === SKILLS_TIMELINE.length - 1
                      ? "border-orange-500/50 bg-orange-500/10"
                      : "border-border bg-background"
                  }`}>
                    {item.emoji}
                  </div>

                  {/* Card */}
                  <div className={`flex-1 border border-dashed overflow-hidden ${
                    i === SKILLS_TIMELINE.length - 1
                      ? "border-orange-500/30 bg-orange-500/4"
                      : "border-border bg-muted/10"
                  }`}>
                    {/* If has photo, show it */}
                    {item.img && (
                      <div className="relative h-40 w-full overflow-hidden">
                        <Image
                          src={item.img}
                          alt={item.skill}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 600px"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent" />
                      </div>
                    )}
                    <div className="px-4 py-3">
                      <div className="flex items-baseline justify-between gap-4">
                        <p className="googlesans-semibold text-sm text-foreground">{item.skill}</p>
                        <p className={`googlesans-medium shrink-0 text-[11px] uppercase tracking-wider ${
                          i === SKILLS_TIMELINE.length - 1
                            ? "text-orange-600 dark:text-orange-400"
                            : "text-muted-foreground"
                        }`}>
                          {item.year}{i === SKILLS_TIMELINE.length - 1 ? " · now" : ""}
                        </p>
                      </div>
                      <p className="googlesans-regular mt-0.5 text-sm text-muted-foreground">{item.note}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── What fills my time ───────────────────────────────── */}
        <hr data-anim="divider" className="mt-14 border-t border-border" />

        <section className="mt-12 space-y-8">
          <div data-anim="section-head" className="space-y-1">
            <p className="gamja-regular text-lg tracking-tighter text-muted-foreground">
              Outside the code
            </p>
            <h2 className="googlesans-semibold text-2xl text-foreground lg:text-3xl">
              What fills the rest of my time.
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">

            {/* Bruno — full width with photo */}
            <div data-anim="bento" className="col-span-2 overflow-hidden border border-dashed border-border sm:col-span-3">
              <div className="relative h-52 w-full">
                <Image
                  src={imgBruno}
                  alt="Me and Bruno on a hike"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 768px"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/10 to-transparent" />
                <div className="absolute bottom-0 left-0 p-4">
                  <p className="googlesans-semibold text-base text-white">🐕 Bruno</p>
                  <p className="googlesans-regular text-sm text-white/80">
                    Best co-worker I&apos;ve ever had. Non-negotiable part of any conversation about me.
                  </p>
                </div>
              </div>
            </div>

            {/* Sports — 4-photo grid, wide card */}
            <div data-anim="bento" className="col-span-2 overflow-hidden border border-dashed border-sky-500/30 bg-sky-500/4 sm:col-span-3">
              <div className="grid grid-cols-2 gap-0.5 sm:grid-cols-4">
                {[
                  { img: imgCanucksGame, label: "Game 7 vs Oilers" },
                  { img: imgMUFC, label: "MUFC in London" },
                  { img: imgFootball, label: "Playing for Surrey United" },
                  { img: imgCanucksGF, label: "Canucks date night" },
                ].map(({ img, label }) => (
                  <div key={label} className="relative h-32 overflow-hidden">
                    <Image
                      src={img}
                      alt={label}
                      fill
                      className="object-cover transition-transform duration-500 hover:scale-105"
                      sizes="(max-width: 640px) 50vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-black/20" />
                  </div>
                ))}
              </div>
              <div className="px-5 py-4">
                <p className="googlesans-semibold text-sm text-foreground">📺 Sports fan</p>
                <p className="googlesans-regular mt-0.5 text-sm text-muted-foreground">
                  Man United · Whitecaps · Canucks · golf · basketball. Watching and playing whenever I can.
                </p>
              </div>
            </div>

            {/* Gaming */}
            <div data-anim="bento" className="border border-dashed border-border bg-muted/15 px-5 py-5">
              <p className="mb-2 text-3xl leading-none">🎮</p>
              <p className="googlesans-semibold text-base text-foreground">Gaming</p>
              <p className="googlesans-regular mt-1 text-sm text-muted-foreground mb-3">Competitive mode, always.</p>
              <div className="space-y-1.5">
                {GAMES.map((g) => (
                  <p key={g.name} className="googlesans-regular text-xs text-muted-foreground">
                    {g.emoji} {g.name}
                  </p>
                ))}
              </div>
            </div>

            {/* Friends & family */}
            <div data-anim="bento" className="border border-dashed border-orange-500/30 bg-orange-500/4 px-5 py-5">
              <p className="mb-2 text-3xl leading-none">🤝</p>
              <p className="googlesans-semibold text-base text-foreground">People</p>
              <p className="googlesans-regular mt-1 text-sm text-muted-foreground">
                Friends and family are everything. Most of my best ideas come from a conversation, not a screen.
              </p>
            </div>

            {/* Always learning */}
            <div data-anim="bento" className="border border-dashed border-border bg-muted/15 px-5 py-5">
              <p className="mb-2 text-3xl leading-none">📚</p>
              <p className="googlesans-semibold text-base text-foreground">Always learning</p>
              <p className="googlesans-regular mt-1 text-sm text-muted-foreground">
                I get genuinely excited by things I don&apos;t understand yet. That&apos;s what keeps me going.
              </p>
            </div>
          </div>
        </section>

        {/* ── Photo carousel ───────────────────────────────────── */}
        <hr data-anim="divider" className="mt-14 border-t border-border" />

        <section className="mt-12 space-y-8">
          <div data-anim="section-head" className="space-y-1">
            <p className="gamja-regular text-lg tracking-tighter text-muted-foreground">
              Moments
            </p>
            <h2 className="googlesans-semibold text-2xl text-foreground lg:text-3xl">
              Hackathons, offices, and everything in between.
            </h2>
          </div>

          <div data-anim="carousel-wrap">
            <Carousel
              plugins={carouselPlugins}
              opts={{
                loop: true,
                align: "center",
                skipSnaps: false,
                dragFree: false,
                watchDrag: true,
                watchResize: true,
                containScroll: false,
              }}
              className="relative w-full outline-none focus-visible:ring-2 focus-visible:ring-ring"
              tabIndex={0}
            >
              <div className="relative isolate">
                <CarouselContent className="ml-0">
                  {CAROUSEL_SLIDES.map((slide) => (
                    <CarouselItem
                      key={slide.label}
                      className="min-w-0 shrink-0 grow-0 basis-[85%] pl-0 mr-3 sm:basis-[80%]"
                    >
                      <div className="relative aspect-4/3 w-full overflow-hidden border border-border">
                        <Image
                          src={slide.image}
                          alt={slide.label}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 85vw, 640px"
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious variant="outline" className="border-border bg-background/95" />
                <CarouselNext variant="outline" className="border-border bg-background/95" />
              </div>
              <CarouselCaption
                captions={CAROUSEL_SLIDES.map((s) => s.label)}
                className="googlesans-regular mt-4 min-h-8 px-3 text-center text-muted-foreground"
              />
              <CarouselDots className="mt-3 md:mt-4" />
            </Carousel>
          </div>
        </section>

        {/* ── Design philosophy ────────────────────────────────── */}
        <hr data-anim="divider" className="mt-14 border-t border-border" />

        <section className="mt-12 space-y-6">
          <div data-anim="section-head" className="space-y-1">
            <p className="gamja-regular text-lg tracking-tighter text-muted-foreground">
              How I think about design
            </p>
            <h2 className="googlesans-semibold text-2xl text-foreground lg:text-3xl">
              The best UX is invisible.
            </h2>
          </div>

          <p data-anim="body" className="googlesans-regular leading-relaxed text-muted-foreground">
            I am obsessed with the messiness of innovation — the phase before
            anything is clean, when the problem is still fuzzy and every
            decision compounds. That&apos;s where I do my best work.
          </p>

          <blockquote
            data-anim="quote"
            className="border border-dashed border-orange-500/35 bg-orange-500/4 px-6 py-6"
          >
            <p className="googlesans-regular text-lg leading-relaxed text-foreground">
              My favourite thing to build is the detail nobody notices. The
              interaction that means a user never has to think about where
              they just came from, where they are, or where to go next.
            </p>
            <footer className="googlesans-medium mt-3 text-xs uppercase tracking-wider text-orange-600 dark:text-orange-400">
              — what I care about
            </footer>
          </blockquote>

          <div data-anim="body" className="grid gap-3 sm:grid-cols-3">
            {[
              {
                label: "Friction is a design failure",
                body: "If a user has to stop and think, something went wrong somewhere earlier in the flow.",
                accent: "orange",
              },
              {
                label: "Messy first, clean later",
                body: "The best products came from someone willing to sit with ambiguity long enough to find the real problem.",
                accent: "blue",
              },
              {
                label: "Ship, learn, repeat",
                body: "I'd rather put something real in front of people and be wrong than design in a vacuum and be confident.",
                accent: "orange",
              },
            ].map((p) => (
              <div
                key={p.label}
                className={`border border-dashed px-4 py-4 ${
                  p.accent === "orange"
                    ? "border-orange-500/25 bg-orange-500/3"
                    : "border-sky-500/25 bg-sky-500/3"
                }`}
              >
                <p className={`googlesans-semibold mb-2 text-sm ${
                  p.accent === "orange"
                    ? "text-orange-600 dark:text-orange-400"
                    : "text-sky-600 dark:text-sky-400"
                }`}>
                  {p.label}
                </p>
                <p className="googlesans-regular text-sm leading-relaxed text-muted-foreground">
                  {p.body}
                </p>
              </div>
            ))}
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
