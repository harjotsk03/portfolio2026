"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { Footer } from "@/components/footer";
import {
  PROJECTS,
  LETTER_DELAY,
  LETTER_STAGGER,
  LETTER_DUR,
  CARD_STAGGER,
  CARD_DURATION,
} from "@/components/landingpage/exploremywork";
import { ProjectCard } from "@/components/ProjectCard";

const TITLE = ["M", "Y", "W", "O", "R", "K"] as const;

export default function MyWorkPage() {
  const triggerRef = useRef<HTMLDivElement>(null);
  const exploreRef = useRef<HTMLParagraphElement>(null);
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const playedRef = useRef(false);

  const gridRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const cardsPlayedRef = useRef(false);

  useLayoutEffect(() => {
    const explore = exploreRef.current;
    if (explore) {
      gsap.set(explore, { opacity: 0, y: -16 });
      gsap.to(explore, {
        opacity: 1,
        y: 0,
        duration: 0.55,
        ease: "power2.out",
      });
    }

    return () => {
      if (explore) gsap.killTweensOf(explore);
    };
  }, []);

  useLayoutEffect(() => {
    letterRefs.current.forEach((span) => {
      if (!span) return;
      gsap.set(span, {
        opacity: 0,
        scale: 0,
        transformOrigin: "center center",
      });
    });
  }, []);

  useEffect(() => {
    const root = triggerRef.current;
    if (!root) return;

    const play = () => {
      if (playedRef.current) return;
      playedRef.current = true;

      letterRefs.current.forEach((span) => {
        if (!span) return;
        gsap.set(span, {
          opacity: 0,
          scale: 0,
          rotation: (Math.random() - 0.5) * 400,
          transformOrigin: "center center",
        });
      });

      const letters = letterRefs.current.filter(Boolean) as HTMLSpanElement[];
      gsap.to(letters, {
        opacity: 1,
        scale: 1,
        rotation: 0,
        duration: LETTER_DUR,
        stagger: LETTER_STAGGER,
        ease: "back.out(2.2)",
        delay: LETTER_DELAY,
      });
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            play();
            io.disconnect();
            break;
          }
        }
      },
      { threshold: 0.35, rootMargin: "0px 0px -8% 0px" },
    );

    io.observe(root);
    return () => io.disconnect();
  }, []);

  useLayoutEffect(() => {
    cardRefs.current.forEach((el) => {
      if (!el) return;
      gsap.set(el, {
        opacity: 0,
        scale: 0.8,
        transformOrigin: "center center",
      });
    });
  }, []);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const playCards = () => {
      if (cardsPlayedRef.current) return;
      cardsPlayedRef.current = true;

      const cards = cardRefs.current.filter(Boolean) as HTMLDivElement[];
      if (cards.length === 0) return;

      gsap.to(cards, {
        opacity: 1,
        scale: 1,
        duration: CARD_DURATION,
        stagger: CARD_STAGGER,
        ease: "power2.out",
      });
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            playCards();
            io.disconnect();
            break;
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -5% 0px" },
    );

    io.observe(grid);
    return () => io.disconnect();
  }, []);

  return (
    <div className="flex min-h-screen flex-col pt-20">
      <main className="flex w-full flex-1 flex-col items-center">
        <section className="flex w-full flex-col items-center">
          <div ref={triggerRef} className="flex flex-col items-center gap-4">
            <p
              ref={exploreRef}
              className="gamja-regular text-2xl tracking-tighter text-primary lg:text-3xl"
            >
              what i&apos;ve worked on!
            </p>
            <p
              className="font-modak text-center text-5xl text-primary lg:text-7xl"
              style={{ transform: "skewX(-4deg)" }}
              aria-label="MY WORK"
            >
              <span className="block whitespace-nowrap">
                {TITLE.map((l, i) => (
                  <span
                    key={`title-${i}`}
                    ref={(el) => {
                      letterRefs.current[i] = el;
                    }}
                    className={
                      i === 1
                        ? "inline-block mr-[0.45em] md:mr-[0.5em]"
                        : "inline-block"
                    }
                  >
                    {l}
                  </span>
                ))}
              </span>
            </p>
          </div>

          <div
            ref={gridRef}
            className="grid w-full max-w-5xl grid-cols-1 gap-4 px-4 pb-4 pt-10 md:grid-cols-2 lg:grid-cols-3"
          >
            {PROJECTS.map((project, i) => (
              <ProjectCard
                key={`${project.index}-${i}`}
                ref={(el) => {
                  cardRefs.current[i] = el;
                }}
                project={project}
              />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
