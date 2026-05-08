"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
} from "react";
import gsap from "gsap";
import { ProjectCard, type ProjectType } from "../ProjectCard";
import SpotifyCardPhotoLight from "@/assets/spotifyscreenlight.png";
import SpotifyCardPhotoDark from "@/assets/spotifyscreendark.png";
import EAAppLibraryCardPhotoLight from "@/assets/eaapplight.png";
import EAAppLibraryCardPhotoDark from "@/assets/eaappdark.png";
import StudySpotrCardPhotoLight from "@/assets/studyspotrscreenlight.png";
import StudySpotrCardPhotoDark from "@/assets/studyspotrscreendark.png";
import SecondSavourCardPhotoLight from "@/assets/secondsavourlight.png";
import SecondSavourCardPhotoDark from "@/assets/secondsavourdark.png";
import CRMWidgetCardPhotoLight from "@/assets/crmwidgetlight.png";
import CRMWidgetCardPhotoDark from "@/assets/crmwidgetdark.png";
import { Button } from "../ui/button";
import { ArrowRightIcon } from "lucide-react";
import { useRouter } from "next/navigation";

// Match hero letter timing (see hero-desktop.tsx)
export const LETTER_DELAY = 0.2;
export const LETTER_STAGGER = 0.08;
export const LETTER_DUR = 0.45;

/** Project grid cards — scale 0.8→1, opacity 0→1, staggered */
export const CARD_STAGGER = 0.11;
export const CARD_DURATION = 0.5;

const LINE1 = ["F", "E", "A", "T", "U", "R", "E", "D"] as const;
const LINE2 = ["P", "R", "O", "J", "E", "C", "T", "S"] as const;

/** CTA below grid — scroll-triggered: fade + slide up (no scale) */
const VIEW_ALL_DURATION = 0.65;
const VIEW_ALL_DELAY = 1.35;
const VIEW_ALL_SLIDE = 40;

export const PROJECTS: Array<{
  index: number;
  date: string;
  title: string;
  subtitle: string;
  tags: string[];
  lightimage: typeof CRMWidgetCardPhotoLight;
  darkimage: typeof CRMWidgetCardPhotoDark;
  link: string;
  projectType: ProjectType;
}> = [
  {
    index: 0,
    date: "2025",
    title: "CRM AI Widget",
    subtitle:
      "An AI system embedded directly in a CRM. One agent reasons about the deal, one builds the records. 40% less manual data entry.",
    tags: [
      "Design Engineering",
      "AI / Agents",
      "OpenAI",
      "Python",
      "Zoho CRM",
      "UX Design",
    ],
    lightimage: CRMWidgetCardPhotoLight,
    darkimage: CRMWidgetCardPhotoDark,
    link: "/crm-ai-widget",
    projectType: "Work",
  },
  {
    index: 1,
    date: "MAY 6, 2026",
    title: "EA App Library Feature Addition",
    subtitle:
      "Four years of forum threads, one clear gap: no way to hide, filter, or organize your games. I found the pain and built the fix.",
    tags: [
      "Product Design",
      "Feature Design",
      "UI/UX Design",
      "React",
      "Figma",
      "Competitive Audit",
    ],
    lightimage: EAAppLibraryCardPhotoLight,
    darkimage: EAAppLibraryCardPhotoDark,
    link: "/ea-app-library",
    projectType: "Personal",
  },
  {
    index: 2,
    date: "AUG 12, 2024",
    title: "Spotify Jam Feature Addition",
    subtitle:
      "Found a gap in Spotify's Jam through user research, then designed the fix: vote a song out of the queue.",
    tags: [
      "Figma",
      "UX Design",
      "UX Research",
      "Feature Design",
      "Prototyping",
    ],
    lightimage: SpotifyCardPhotoLight,
    darkimage: SpotifyCardPhotoDark,
    link: "/spotify-jam",
    projectType: "Personal",
  },
  {
    index: 3,
    date: "AUG 12, 2024",
    title: "Second Savour Website Redesign",
    subtitle:
      "A website redesign for a zero-waste snack product line with the aim of a sharper story and smoother UX.",
    tags: [
      "UI/UX Design",
      "Figma",
      "UX Research",
      "Prototyping",
      "Design System",
    ],
    lightimage: SecondSavourCardPhotoLight,
    darkimage: SecondSavourCardPhotoDark,
    link: "/second-savour",
    projectType: "Academic",
  },
  {
    index: 4,
    date: "AUG 12, 2024",
    title: "Study Spotr",
    subtitle:
      "A mobile app that helps students find events, communities, and study spaces on campus. Researched, designed, and developed.",
    tags: [
      "UI/UX Design",
      "Product Design",
      "React Native",
      "Node.js",
      "PostgreSQL",
      "AWS",
      "Figma",
    ],
    lightimage: StudySpotrCardPhotoLight,
    darkimage: StudySpotrCardPhotoDark,
    link: "/studyspotr",
    projectType: "Startup",
  },
];

export function ExploreMyWork() {
  const router = useRouter();
  const triggerRef = useRef<HTMLDivElement>(null);
  const exploreRef = useRef<HTMLParagraphElement>(null);
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const playedRef = useRef(false);

  const gridRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const cardsPlayedRef = useRef(false);

  const viewAllRef = useRef<HTMLDivElement>(null);
  const viewAllPlayedRef = useRef(false);

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

  useLayoutEffect(() => {
    const el = viewAllRef.current;
    if (!el) return;
    gsap.set(el, {
      opacity: 0,
      y: VIEW_ALL_SLIDE,
    });
    return () => gsap.killTweensOf(el);
  }, []);

  useEffect(() => {
    const el = viewAllRef.current;
    if (!el) return;

    const play = () => {
      if (viewAllPlayedRef.current) return;
      viewAllPlayedRef.current = true;
      gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: VIEW_ALL_DURATION,
        delay: VIEW_ALL_DELAY,
        ease: "power2.out",
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
      { threshold: 0.25, rootMargin: "0px 0px -6% 0px" },
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section className="flex flex-col items-center w-full py-16">
      <div ref={triggerRef} className="flex flex-col items-center gap-4">
        <p
          ref={exploreRef}
          className="gamja-regular text-2xl lg:text-3xl text-primary tracking-tighter"
        >
          explore my work!
        </p>
        <p
          className="font-modak text-5xl lg:text-7xl text-primary text-center"
          style={{ transform: "skewX(-4deg)" }}
          aria-label="FEATURED PROJECTS"
        >
          <span className="block ">
            {LINE1.map((l, i) => (
              <span
                key={`featured-${i}`}
                ref={(el) => {
                  letterRefs.current[i] = el;
                }}
                className="inline-block"
              >
                {l}
              </span>
            ))}
          </span>
          <span className="block leading-14">
            {LINE2.map((l, i) => (
              <span
                key={`projects-${i}`}
                ref={(el) => {
                  letterRefs.current[LINE1.length + i] = el;
                }}
                className="inline-block"
              >
                {l}
              </span>
            ))}
          </span>
        </p>
      </div>
      <div
        ref={gridRef}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-5xl px-4 pt-10 pb-4"
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
      <div
        ref={viewAllRef}
        className="w-full flex justify-end max-w-5xl px-4 mt-1 will-change-transform"
      >
        <Button
          onClick={() => router.push("/mywork")}
          variant="outline"
          className="group w-full px-3 googlesans-regular text-sm"
        >
          View All Projects{" "}
          <ArrowRightIcon className="ml-0.5 group-hover:translate-x-1 transition-all duration-300 size-3" />
        </Button>
      </div>
    </section>
  );
}
