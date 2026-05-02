"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
} from "react";
import Image from "next/image";
import gsap from "gsap";
import me from "@/assets/me.png";
import { cn } from "@/lib/utils";

const REVEAL_DURATION = 0.78;
const REVEAL_STAGGER = 0.16;

/** Rounded “four-petal” burst — reference yellow accent */
function YellowBurst({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(
        "inline-block shrink-0 align-middle text-[#EAB308]",
        className,
      )}
      aria-hidden
    >
      <g transform="translate(24 24)">
        <ellipse
          cx="0"
          cy="0"
          rx="20"
          ry="9"
          fill="currentColor"
        />
        <ellipse
          cx="0"
          cy="0"
          rx="20"
          ry="9"
          fill="currentColor"
          transform="rotate(90)"
        />
      </g>
    </svg>
  );
}

/** Rounded hourglass — reference pink accent */
function PinkHourglass({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(
        "inline-block shrink-0 align-middle text-[#EC4899]",
        className,
      )}
      aria-hidden
    >
      <path
        fill="currentColor"
        d="M8 6.5C8 4.57 9.57 3 11.5 3h25c1.93 0 3.5 1.57 3.5 3.5 0 4.38-1.78 8.56-4.94 11.56L26.5 24l8.56 9.94A16.9 16.9 0 0 1 40 45.5c0 1.93-1.57 3.5-3.5 3.5h-25c-1.93 0-3.5-1.57-3.5-3.5a16.9 16.9 0 0 1 4.94-11.56L21.5 24l-8.56-9.94A16.4 16.4 0 0 1 8 6.5Z"
      />
    </svg>
  );
}

const lineClass =
  "googlesans-medium text-balance text-center text-3xl leading-snug tracking-tight text-foreground sm:text-3xl md:text-4xl lg:text-6xl lg:leading-[1.22]";

const imageInnerClass =
  "relative inline-block size-12 shrink-0 align-middle overflow-hidden ring-1 ring-black/10 md:size-14 lg:size-14 dark:ring-white/15 mb-3";

/** Sketch callout above avatar — arrow curves down toward photo */
function ClickHereSketch({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "pointer-events-none select-none flex flex-col items-center text-center",
        className,
      )}
      aria-hidden
    >
      <p className="font-gamja text-xs text-muted-foreground/55 leading-none whitespace-nowrap sm:text-sm">
        click here!
      </p>
      <svg
        width="56"
        height="40"
        viewBox="0 0 56 40"
        fill="none"
        className="text-muted-foreground/40 mx-auto -mb-0.5"
      >
        <path
          d="M 12 4 C 38 6, 46 16, 28 32"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          fill="none"
        />
        {/* Arrowhead — tip points down at the image */}
        <path d="M 28 32 L 22 24" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M 28 32 L 34 24" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    </div>
  );
}

const yellowIconClass =
  "mx-2 inline-block size-7 translate-y-0.5 md:size-8";
const pinkIconClass =
  "mx-2 inline-block h-7 w-6 translate-y-0.5 md:h-8 md:w-7";

export function AboutMe() {
  const sectionRef = useRef<HTMLElement>(null);
  const innerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const aboutMeRef = useRef<HTMLParagraphElement>(null);
  const playedRef = useRef(false);

  useLayoutEffect(() => {
    const aboutMe = aboutMeRef.current;
    if (aboutMe) {
      gsap.set(aboutMe, { opacity: 0, y: -16 });
      gsap.to(aboutMe, {
        opacity: 1,
        y: 0,
        duration: 0.55,
        ease: "power2.out",
      });
    }
    innerRefs.current.forEach((el) => {
      if (!el) return;
      gsap.set(el, { yPercent: 100 });
    });
    return () => {
      innerRefs.current.forEach((el) => {
        if (el) gsap.killTweensOf(el);
      });
    };
  }, []);

  useEffect(() => {
    const root = sectionRef.current;
    if (!root) return;

    const play = () => {
      if (playedRef.current) return;
      playedRef.current = true;

      const layers: HTMLDivElement[] = [];
      innerRefs.current.forEach((el) => {
        if (el) layers.push(el);
      });
      if (layers.length === 0) return;

      gsap.to(layers, {
        yPercent: 0,
        duration: REVEAL_DURATION,
        stagger: REVEAL_STAGGER,
        ease: "power3.out",
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
      { threshold: 0.18, rootMargin: "0px 0px -8% 0px" },
    );

    io.observe(root);
    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full px-4 py-16 md:py-28"
      aria-labelledby="about-me-heading"
    >
      {/* <p ref={aboutMeRef} className="gamja-regular text-2xl lg:text-3xl text-primary tracking-tighter text-center mb-6">
        about me!
      </p> */}
      <div className="mx-auto flex max-w-3xl flex-col gap-1 md:max-w-4xl md:gap-0.5 lg:max-w-7xl">
        {/* Each row: clip mask + inner layer slides up */}
        {/* First row only: compensated pt so sketch sits above avatar without clipping reveal */}
        <div className="w-full overflow-hidden pb-px pt-14 -mt-14">
          <div
            ref={(el) => {
              innerRefs.current[0] = el;
            }}
            className={lineClass}
          >
            I&apos;m Harjot{" "}
            <span className="relative mx-2 inline-block align-middle shrink-0">
              <div
                className="pointer-events-none absolute bottom-full left-1/2 z-10"
                style={{ transform: "translate(-50%, -6px)" }}
              >
                {/* <div style={{ transform: "rotate(-6deg)" }}>
                  <ClickHereSketch />
                </div> */}
              </div>
              <span className={imageInnerClass}>
                <Image
                  src={me}
                  alt="Harjot"
                  fill
                  sizes="(max-width: 768px) 64px, 80px"
                  className="object-cover"
                />
              </span>
            </span>{" "}
            a design engineer
          </div>
        </div>

        <div className="w-full overflow-hidden">
          <div
            ref={(el) => {
              innerRefs.current[1] = el;
            }}
            className={lineClass}
          >
            in Vancouver who is passionate{" "}
            <YellowBurst className={yellowIconClass} /> about{" "}
          </div>
        </div>

        <div className="w-full overflow-hidden">
          <div
            ref={(el) => {
              innerRefs.current[2] = el;
            }}
            className={lineClass}
          >
            creating software and products with a
          </div>
        </div>

        <div className="w-full overflow-hidden">
          <div
            ref={(el) => {
              innerRefs.current[3] = el;
            }}
            className={lineClass}
          >
            focus on <PinkHourglass className={pinkIconClass} /> user experience
            and efficiency.
          </div>
        </div>
      </div>
    </section>
  );
}
