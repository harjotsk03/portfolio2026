"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
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

// ─── Interactive clip box ─────────────────────────────────────────────────────

type Inset = { top: number; right: number; bottom: number; left: number };
type HandleId = "tl" | "tr" | "bl" | "br" | "tm" | "bm" | "lm" | "rm";

const HANDLE_CURSOR: Record<HandleId, string> = {
  tl: "nwse-resize", tr: "nesw-resize", bl: "nesw-resize", br: "nwse-resize",
  tm: "ns-resize",   bm: "ns-resize",   lm: "ew-resize",   rm: "ew-resize",
};

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}

function applyDrag(id: HandleId, inset: Inset, dx: number, dy: number, W: number, H: number): Inset {
  let { top, right, bottom, left } = inset;
  if (id === "tl" || id === "tm" || id === "tr") top    = clamp(top    + dy, 0, H - bottom - 8);
  if (id === "bl" || id === "bm" || id === "br") bottom = clamp(bottom - dy, 0, H - top    - 8);
  if (id === "tl" || id === "lm" || id === "bl") left   = clamp(left   + dx, 0, W - right  - 8);
  if (id === "tr" || id === "rm" || id === "br") right  = clamp(right  - dx, 0, W - left   - 8);
  return { top, right, bottom, left };
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

const LETTERS = ["H", "A", "R", "J", "O", "T"];
// letter stagger timing constants — keep in sync with animation effects
const LETTER_DELAY   = 0.2;  // initial delay before first letter
const LETTER_STAGGER = 0.08; // gap between each letter
const LETTER_DUR     = 0.55; // duration of each letter's tween
// total time until last letter finishes
const LETTERS_DONE = LETTER_DELAY + (LETTERS.length - 1) * LETTER_STAGGER + LETTER_DUR;

export function HeroDesktop() {
  const [time,    setTime]    = useState("");
  const [inset,   setInset]   = useState<Inset>({ top: 0, right: 0, bottom: 0, left: 0 });
  const [size,    setSize]    = useState({ w: 0, h: 0 });
  const [touched, setTouched] = useState(false);

  const wrapperRef      = useRef<HTMLDivElement>(null);
  const dragging        = useRef<{ id: HandleId; sx: number; sy: number; si: Inset } | null>(null);
  const liveInset       = useRef<Inset>({ top: 0, right: 0, bottom: 0, left: 0 });
  const hintTextRef     = useRef<HTMLParagraphElement>(null);
  const [hintLabel,  setHintLabel]  = useState("drag the handles");

  const letterRefs      = useRef<(HTMLSpanElement | null)[]>([]);
  const ghostLetterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const selectionBoxRef = useRef<HTMLDivElement>(null);
  const handlesRef      = useRef<(HTMLDivElement | null)[]>([]);
  const clockRef        = useRef<HTMLParagraphElement>(null);
  const myNameIsRef     = useRef<HTMLParagraphElement>(null);
  const orangeStickerRef = useRef<HTMLDivElement>(null);
  const blueStickerRef  = useRef<HTMLDivElement>(null);
  const hintContainerRef = useRef<HTMLDivElement>(null);
  const descriptionRef  = useRef<HTMLDivElement>(null);

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

  // Measure wrapper after mount
  useEffect(() => {
    if (!wrapperRef.current) return;
    const { width, height } = wrapperRef.current.getBoundingClientRect();
    setSize({ w: width, h: height });
  }, []);

  // Global drag handlers
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!dragging.current) return;
      const { id, sx, sy, si } = dragging.current;
      const next = applyDrag(id, si, e.clientX - sx, e.clientY - sy, size.w, size.h);
      liveInset.current = next;
      setInset(next);
    };
    const onUp = () => { dragging.current = null; };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup",   onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup",   onUp);
    };
  }, [size]);

  // Crossfade hint text on first interaction
  useEffect(() => {
    if (!touched) return;
    const el = hintTextRef.current;
    if (!el) return;
    gsap.to(el, {
      opacity: 0, duration: 0.2, ease: "power2.in",
      onComplete: () => {
        setHintLabel("double-click to reset");
        gsap.to(el, { opacity: 1, rotate: 28, duration: 0.35, ease: "power2.out" });
      },
    });
  }, [touched]);

  // ── Full entrance sequence ────────────────────────────────────────────────
  useEffect(() => {
    const real  = letterRefs.current.filter(Boolean) as HTMLSpanElement[];
    const ghost = ghostLetterRefs.current.filter(Boolean) as HTMLSpanElement[];

    // ── Initial hidden states ──
    gsap.set(clockRef.current,         { opacity: 0, y: -10 });
    gsap.set(myNameIsRef.current,      { opacity: 0, y: -10 });
    // Stickers start from their final rotation + extra spin so they "land"
    gsap.set(orangeStickerRef.current, { opacity: 0, scale: 0.6, rotation: 28 });
    gsap.set(blueStickerRef.current,   { opacity: 0, scale: 0.6, rotation: -26 });
    gsap.set([...real, ...ghost], {
      opacity: 0, scale: 0,
      rotation: () => (Math.random() - 0.5) * 400,
      transformOrigin: "center center",
    });
    gsap.set(hintContainerRef.current, { opacity: 0 });
    gsap.set(descriptionRef.current,   { opacity: 0, y: 16 });

    // ── Staggered reveal ──
    gsap.to(clockRef.current,    { opacity: 1, y: 0,  duration: 0.5, ease: "power2.out", delay: 0 });
    gsap.to(myNameIsRef.current, { opacity: 1, y: 0,  duration: 0.5, ease: "power2.out", delay: 0.1 });
    // Stickers spin into their final rotation naturally
    gsap.to(orangeStickerRef.current, { opacity: 1, scale: 1, rotation: 10,  duration: 0.6, ease: "back.out(1.5)", delay: 0.12 });
    gsap.to(blueStickerRef.current,   { opacity: 1, scale: 1, rotation: -8,  duration: 0.6, ease: "back.out(1.5)", delay: 0.18 });

    const letterShared = { opacity: 1, scale: 1, rotation: 0, duration: LETTER_DUR, stagger: LETTER_STAGGER, ease: "back.out(2.2)", delay: LETTER_DELAY };
    gsap.to(real,  { ...letterShared });
    gsap.to(ghost, { ...letterShared });

    // After letters: hint arrow, then description slide up
    gsap.to(hintContainerRef.current, { opacity: 1, duration: 0.5, ease: "power2.out", delay: LETTERS_DONE + 0.75 });
    gsap.to(descriptionRef.current,   { opacity: 1, y: 0, duration: 0.6, ease: "power2.out", delay: LETTERS_DONE + 0.6 });
  }, []);

  // ── Selection box + handles (need measured size) ──────────────────────────
  useEffect(() => {
    if (!size.w) return;

    gsap.fromTo(
      selectionBoxRef.current,
      { clipPath: "inset(0 100% 0 0)" },
      { clipPath: "inset(0 0% 0 0)", duration: 0.6, ease: "power3.out", delay: LETTERS_DONE + 0.05 },
    );

    const hs = handlesRef.current.filter(Boolean) as HTMLDivElement[];
    gsap.fromTo(
      hs,
      { opacity: 0, scale: 0 },
      { opacity: 1, scale: 1, duration: 0.3, stagger: 0.04, ease: "back.out(2)", delay: LETTERS_DONE + 0.65 },
    );
  }, [size.w]);

  const startDrag = (id: HandleId) => (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Kill any in-progress reset tween before dragging
    gsap.killTweensOf(liveInset.current);
    setTouched(true);
    dragging.current = { id, sx: e.clientX, sy: e.clientY, si: { ...inset } };
  };

  const reset = () => {
    gsap.killTweensOf(liveInset.current);
    gsap.to(liveInset.current, {
      top: 0, right: 0, bottom: 0, left: 0,
      duration: 0.55,
      ease: "expo.out",
      onUpdate: () => setInset({ ...liveInset.current }),
    });
  };

  // Handle positions from current box geometry
  const HS  = 9;
  const bx  = inset.left;
  const by  = inset.top;
  const bw  = size.w - inset.left - inset.right;
  const bh  = size.h - inset.top  - inset.bottom;

  const handles: Array<{ id: HandleId; style: React.CSSProperties }> = [
    { id: "tl", style: { left: bx - HS / 2,            top: by - HS / 2 } },
    { id: "tr", style: { left: bx + bw - HS / 2,       top: by - HS / 2 } },
    { id: "bl", style: { left: bx - HS / 2,            top: by + bh - HS / 2 } },
    { id: "br", style: { left: bx + bw - HS / 2,       top: by + bh - HS / 2 } },
    { id: "tm", style: { left: bx + bw / 2 - HS / 2,  top: by - HS / 2 } },
    { id: "bm", style: { left: bx + bw / 2 - HS / 2,  top: by + bh - HS / 2 } },
    { id: "lm", style: { left: bx - HS / 2,            top: by + bh / 2 - HS / 2 } },
    { id: "rm", style: { left: bx + bw - HS / 2,       top: by + bh / 2 - HS / 2 } },
  ];

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
            Currently at Aether Automation
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

        {/* ── Interactive clip zone ── */}
        <div
          ref={wrapperRef}
          className="relative select-none"
          onDoubleClick={reset}
        >
          {/* Ghost — always visible at very low opacity */}
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

          {/* Clipped full-opacity name */}
          <h1
            className="absolute inset-0 text-[12rem] font-modak text-primary leading-none px-8 pt-6 pointer-events-none"
            style={{
              transform: "skewX(-4deg)",
              clipPath: `inset(${inset.top}px ${inset.right}px ${inset.bottom}px ${inset.left}px)`,
            }}
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

          {/* Selection border */}
          {size.w > 0 && (
            <div
              ref={selectionBoxRef}
              className="absolute border-[1.5px] border-[#0D99FF] pointer-events-none"
              style={{
                top: inset.top,
                left: inset.left,
                right: inset.right,
                bottom: inset.bottom,
              }}
            />
          )}

          {/* Resize handles */}
          {size.w > 0 &&
            handles.map(({ id, style }, i) => (
              <div
                key={id}
                ref={(el) => {
                  handlesRef.current[i] = el;
                }}
                data-resize={HANDLE_CURSOR[id]}
                className="absolute w-[9px] h-[9px] bg-background border-[1.5px] border-[#0D99FF] z-20"
                style={{ ...style, cursor: HANDLE_CURSOR[id] }}
                onMouseDown={startDrag(id)}
              />
            ))}

          {/* Painted arrow hint + reset text — same anchor point */}
          <div
            ref={hintContainerRef}
            className="absolute pointer-events-none z-30"
            style={{ right: -110, bottom: 40, transform: "rotate(-30deg)" }}
          >
            {/* Arrow hint: rotated, arrow points upper-left toward br handle */}
            <div className="relative" style={{ transform: "rotate(10deg)" }}>
              <svg
                width="80"
                height="56"
                viewBox="0 0 80 56"
                fill="none"
                className={`text-muted-foreground/70 mt-0.5 ${touched ? "opacity-0" : "opacity-100"}`}
              >
                {/* Curves from lower-right (below text) up to upper-left (br handle) */}
                <path
                  d="M 122 0 C 55 40, 25 20, 6 5"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  fill="none"
                />
                {/* Arrowhead at upper-left tip */}
                <path
                  d="M 6 5 L 16 10"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                />
                <path
                  d="M 6 5 L 10 16"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                />
              </svg>
              <p
                ref={hintTextRef}
                className="font-gamja -mt-5 text-sm text-muted-foreground/50 leading-none whitespace-nowrap"
              >
                {hintLabel}
              </p>
            </div>
          </div>
        </div>

        {/* Availability */}
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
