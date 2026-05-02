"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const LETTERS = ["H", "A", "R", "J", "O", "T"];

const LETTER_DELAY   = 0.2;
const LETTER_STAGGER = 0.08;
const LETTER_DUR     = 0.55;
const LETTERS_DONE   = LETTER_DELAY + (LETTERS.length - 1) * LETTER_STAGGER + LETTER_DUR;

export function HeroMobile() {
  const [time, setTime] = useState("");

  const clockRef         = useRef<HTMLParagraphElement>(null);
  const myNameIsRef      = useRef<HTMLParagraphElement>(null);
  const orangeStickerRef = useRef<HTMLDivElement>(null);
  const blueStickerRef   = useRef<HTMLDivElement>(null);
  const letterRefs       = useRef<(HTMLSpanElement | null)[]>([]);
  const ghostLetterRefs  = useRef<(HTMLSpanElement | null)[]>([]);
  const descriptionRef   = useRef<HTMLDivElement>(null);

  // Clock
  useEffect(() => {
    const update = () =>
      setTime(
        new Intl.DateTimeFormat("en-US", {
          timeZone: "America/Los_Angeles",
          hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false,
        }).format(new Date())
      );
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  // Entrance animations
  useEffect(() => {
    const real  = letterRefs.current.filter(Boolean)      as HTMLSpanElement[];
    const ghost = ghostLetterRefs.current.filter(Boolean) as HTMLSpanElement[];

    gsap.set(clockRef.current,         { opacity: 0, y: -8 });
    gsap.set(myNameIsRef.current,      { opacity: 0, y: -20 });
    gsap.set([...real, ...ghost], {
      opacity: 0, scale: 0,
      rotation: () => (Math.random() - 0.5) * 400,
      transformOrigin: "center center",
    });
    gsap.set(descriptionRef.current, { opacity: 0, y: 14 });

    gsap.to(clockRef.current,         { opacity: 1, y: 0, duration: 0.5, ease: "power2.out", delay: 0 });
    gsap.to(myNameIsRef.current,      { opacity: 1, y: 0, duration: 0.8, ease: "power2.out", delay: 0.1 });
    gsap.to(orangeStickerRef.current, { opacity: 1, scale: 1,  duration: 0.6, ease: "back.out(1.5)", delay: LETTERS_DONE + 0.12 });
    gsap.to(blueStickerRef.current,   { opacity: 1, scale: 1, duration: 0.6, ease: "back.out(1.5)", delay: LETTERS_DONE + 0.18 });

    gsap.set(orangeStickerRef.current, { opacity: 0, scale: 0.6});
    gsap.set(blueStickerRef.current,   { opacity: 0, scale: 0.6});

    const shared = { opacity: 1, scale: 1, rotation: 0, duration: LETTER_DUR, stagger: LETTER_STAGGER, ease: "back.out(2.2)", delay: LETTER_DELAY };
    gsap.to(real,  { ...shared });
    gsap.to(ghost, { ...shared });

    gsap.to(descriptionRef.current, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out", delay: LETTERS_DONE });
  }, []);

  return (
    <div className="flex flex-col items-center pt-5 gap-3 min-h-[75vh]">
      {/* Clock */}
      <p
        ref={clockRef}
        className="googlesans text-sm text-muted-foreground/60 pb-20 tracking-widest tabular-nums"
      >
        {time} PST
      </p>

      {/* Main container */}
      <div className="relative flex flex-col items-center w-full px-4">
        {/* Orange sticker */}
        <div
          ref={orangeStickerRef}
          className="absolute z-30 bg-orange-200 dark:bg-orange-900 px-2 py-1"
          style={{ bottom: -80 }}
        >
          <span className="googlesans text-xs text-orange-800 dark:text-orange-200 whitespace-nowrap">
            Currently at Aether Automation
          </span>
        </div>

        {/* "my name is" */}
        <p
          ref={myNameIsRef}
          className="gamja text-3xl tracking-tighter text-primary mb-0 z-10"
        >
          my name is
        </p>

        {/* Blue sticker */}
        <div
          ref={blueStickerRef}
          className="absolute z-30 bg-blue-100 dark:bg-blue-700 px-2 py-1"
          style={{ bottom: -124 }}
        >
          <span className="googlesans text-xs text-blue-900 dark:text-blue-200 whitespace-nowrap">
            Building Study Spotr
          </span>
        </div>

        {/* HARJOT name — ghost + full opacity stacked */}
        <div className="relative select-none">
          {/* Ghost */}
          <h1
            aria-hidden
            className="text-[5.55rem] font-modak text-primary leading-none px-4 pt-3 pointer-events-none"
            style={{ transform: "skewX(-4deg)", opacity: 0.07 }}
          >
            {LETTERS.map((l, i) => (
              <span
                key={i}
                ref={(el) => {
                  ghostLetterRefs.current[i] = el;
                }}
                className="inline-block"
              >
                {l}
              </span>
            ))}
          </h1>

          {/* Full opacity */}
          <h1
            className="absolute inset-0 text-[5.55rem] font-modak text-primary leading-none px-4 pt-3 pointer-events-none"
            style={{ transform: "skewX(-4deg)" }}
          >
            {LETTERS.map((l, i) => (
              <span
                key={i}
                ref={(el) => {
                  letterRefs.current[i] = el;
                }}
                className="inline-block"
              >
                {l}
              </span>
            ))}
          </h1>
        </div>

        {/* Description */}
        <div
          ref={descriptionRef}
          className="mt-5 flex flex-col items-center gap-1.5"
        >
          <p className="googlesans leading-6 text-base text-center text-muted-foreground">
            a{" "}
            <span className="text-orange-500 dark:text-orange-400">
              design engineer
            </span>{" "}
            creating intuitive and scalable digital products with a{" "}
            <span className="text-blue-500 dark:text-blue-400">
              focus on user experience
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
