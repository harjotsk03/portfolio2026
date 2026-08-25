"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";

// ─── Ruler ────────────────────────────────────────────────────────────────────

const RULER_H = 24;

export function Ruler() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const originRef = useRef({ x: -1 });

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const w = container.offsetWidth;

    if (canvas.width !== Math.round(w * dpr)) {
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(RULER_H * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${RULER_H}px`;
    }

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, RULER_H);

    const isDark = document.documentElement.classList.contains("dark");
    const tickColor  = isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.25)";
    const labelColor = isDark ? "rgba(255,255,255,0.22)" : "rgba(0,0,0,0.18)";
    const origin = originRef.current.x < 0 ? w / 2 : originRef.current.x;

    ctx.font = "5px var(--font-google-sans)";
    ctx.textAlign = "center";

    const step = 50;
    const startVal = Math.floor(-origin / step) * step;
    const endVal   = Math.ceil((w - origin) / step) * step;

    for (let val = startVal; val <= endVal; val += step) {
      const x = origin + val;
      if (x < -1 || x > w + 1) continue;
      const tickH = val % 100 === 0 ? 11 : val % 50 === 0 ? 7 : 3;
      ctx.fillStyle = tickColor;
      ctx.fillRect(x - 0.5, 0, 1, tickH);
      if (val % 100 === 0) {
        ctx.fillStyle = labelColor;
        ctx.fillText(String(val), x, RULER_H - 1);
      }
    }
  }, []);

  useEffect(() => {
    draw();
    const ro = new ResizeObserver(draw);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [draw]);

  useEffect(() => {
    const mo = new MutationObserver(draw);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => mo.disconnect();
  }, [draw]);

  useEffect(() => {
    const container = containerRef.current;
    const onMove = (e: MouseEvent) => {
      if (originRef.current.x < 0) originRef.current.x = e.clientX;
      gsap.to(originRef.current, { x: e.clientX, duration: 0.6, ease: "power3.out", overwrite: true, onUpdate: draw });
    };
    const onLeave = () => {
      const w = container?.offsetWidth ?? window.innerWidth;
      gsap.to(originRef.current, { x: w / 2, duration: 0.9, ease: "power3.out", overwrite: true, onUpdate: draw });
    };
    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, [draw]);

  return (
    <div ref={containerRef} className="relative block w-full border-b border-border bg-background/75 overflow-hidden shrink-0" style={{ height: RULER_H }}>
      <canvas ref={canvasRef} className="absolute inset-0" />
    </div>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

const LETTERS = ["H", "A", "R", "J", "O", "T"];
const LETTER_DELAY = 0.2;
const LETTER_STAGGER = 0.08;
const LETTER_DUR = 0.55;
const LETTERS_DONE = LETTER_DELAY + (LETTERS.length - 1) * LETTER_STAGGER + LETTER_DUR;

export function HeroDesktop() {
  const [time, setTime] = useState("");

  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const ghostLetterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const selectionBoxRef = useRef<HTMLDivElement>(null);
  const clockRef = useRef<HTMLParagraphElement>(null);
  const myNameIsRef = useRef<HTMLParagraphElement>(null);
  const orangeStickerRef = useRef<HTMLDivElement>(null);
  const blueStickerRef = useRef<HTMLDivElement>(null);
  const descriptionRef = useRef<HTMLDivElement>(null);

  // Clock
  useEffect(() => {
    const update = () =>
      setTime(new Intl.DateTimeFormat("en-US", {
        timeZone: "America/Los_Angeles",
        hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false,
      }).format(new Date()));
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  // ── Full entrance sequence ────────────────────────────────────────────────
  useEffect(() => {
    const real  = letterRefs.current.filter(Boolean) as HTMLSpanElement[];
    const ghost = ghostLetterRefs.current.filter(Boolean) as HTMLSpanElement[];

    gsap.set(clockRef.current,         { opacity: 0, y: -10 });
    gsap.set(myNameIsRef.current, { opacity: 0, y: -10 });
    gsap.set(orangeStickerRef.current, { opacity: 0, scale: 0.6, rotation: 28 });
    gsap.set(blueStickerRef.current,   { opacity: 0, scale: 0.6, rotation: -26 });
    gsap.set([...real, ...ghost], {
      opacity: 0, scale: 0,
      rotation: () => (Math.random() - 0.5) * 400,
      transformOrigin: "center center",
    });
    gsap.set(selectionBoxRef.current, { clipPath: "inset(0 100% 0 0)" });
    gsap.set(descriptionRef.current,   { opacity: 0, y: 16 });

    gsap.to(clockRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.5,
      ease: "power2.out",
      delay: 0,
    });
    gsap.to(myNameIsRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.5,
      ease: "power2.out",
      delay: 0.1,
    });
    gsap.to(orangeStickerRef.current, {
      opacity: 1,
      scale: 1,
      rotation: 10,
      duration: 0.6,
      ease: "back.out(1.5)",
      delay: 0.12,
    });
    gsap.to(blueStickerRef.current, {
      opacity: 1,
      scale: 1,
      rotation: -8,
      duration: 0.6,
      ease: "back.out(1.5)",
      delay: 0.18,
    });

    const letterShared = { opacity: 1, scale: 1, rotation: 0, duration: LETTER_DUR, stagger: LETTER_STAGGER, ease: "back.out(2.2)", delay: LETTER_DELAY };
    gsap.to(real,  { ...letterShared });
    gsap.to(ghost, { ...letterShared });

    gsap.to(selectionBoxRef.current, {
      clipPath: "inset(0 0% 0 0)",
      duration: 0.6,
      ease: "power3.out",
      delay: LETTERS_DONE + 0.05,
    });
    gsap.to(descriptionRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: "power2.out",
      delay: LETTERS_DONE + 0.6,
    });
  }, []);

  return (
    <div className="flex flex-col items-center pt-6 gap-4 h-[81vh]">
      {/* Clock */}
      <p
        ref={clockRef}
        className="font-google-sans text-xs text-muted-foreground/60 pb-16 tracking-widest tabular-nums"
      >
        {time} PST
      </p>

      {/* Outer layout container */}
      <div
        className="relative flex flex-col items-center"
        style={{ width: 800 }}
      >
        {/* Sticker — currently at */}
        <div
          ref={orangeStickerRef}
          className="absolute z-30 bg-orange-200 dark:bg-orange-800 px-3 py-1.5"
          style={{ top: 20, left: 20, transform: "rotate(10deg)" }}
        >
          <span className="font-google-sans text-sm text-orange-800 dark:text-orange-200 whitespace-nowrap">
            Currently at EA Sports
          </span>
        </div>

        <p
          ref={myNameIsRef}
          className="font-gamja text-4xl tracking-tighter text-primary mb-6 z-10"
        >
          my name is
        </p>

        {/* Sticker — creating */}
        <div
          ref={blueStickerRef}
          className="absolute z-30 bg-blue-100 dark:bg-blue-700 px-3 py-1.5"
          style={{ top: 24, right: 60, transform: "rotate(-8deg)" }}
        >
          <span className="font-google-sans text-sm text-blue-900 dark:text-blue-200 whitespace-nowrap">
            Building Study Spotr
          </span>
        </div>

        {/* ── Name + static blue box ── */}
        <div className="relative">
          {/* Ghost — faint backdrop */}
          <h1
            aria-hidden
            className="text-[12rem] font-modak text-muted-foreground leading-none px-8 pt-6 pointer-events-none"
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

          {/* Full-opacity name */}
          <h1
            className="absolute inset-0 text-[12rem] font-modak text-primary leading-none px-8 pt-6 pointer-events-none"
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

          {/* Static blue selection border */}
          <div
            ref={selectionBoxRef}
            className="absolute inset-0 border-[1.5px] border-[#0D99FF] pointer-events-none"
          />
        </div>

        {/* Description */}
        <div
          ref={descriptionRef}
          className="mt-6 flex flex-col items-center gap-1.5"
        >
          <p className="font-google-sans leading-6 text-xl text-center w-2/3 text-muted-foreground gap-2">
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
