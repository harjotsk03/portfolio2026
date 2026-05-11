"use client";

import { useEffect, useRef, useState } from "react";
import FigmaCursor from "@/components/ui/FigmaCursor";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import gsap from "gsap";

const NAME_KEY  = "cursorUserName";
const COLOR_KEY = "cursorColor";
const SKIP_KEY  = "cursorSkipped";
const ENABLED_KEY = "cursorEnabled";

const PRESETS = [
  { label: "Blue",   value: "#3B82F6" },
  { label: "Purple", value: "#8B5CF6" },
  { label: "Pink",   value: "#EC4899" },
  { label: "Green",  value: "#10B981" },
  { label: "Orange", value: "#F59E0B" },
];

const DEFAULT_COLOR = PRESETS[0].value;

export function CursorSetup() {
  const [name, setName] = useState<string | null>(null);
  const [color, setColor] = useState<string>(DEFAULT_COLOR);
  const [showCard, setShowCard] = useState(true);
  const [draft, setDraft] = useState("");
  const [draftColor, setDraftColor] = useState<string>(DEFAULT_COLOR);
  const [hasMouse, setHasMouse] = useState(false);
  const [shouldRenderCard, setShouldRenderCard] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const cardRef = useRef<HTMLElement>(null);
  const expandedRef = useRef<HTMLDivElement>(null);
  const pickerRef = useRef<HTMLInputElement>(null);

  // Detect fine pointer (mouse) — also listen for changes so plugging in a
  // mouse on a tablet activates the cursor without a page reload.
  useEffect(() => {
    const mq = window.matchMedia("(pointer: fine)");
    const frame = requestAnimationFrame(() => {
      const storedName = localStorage.getItem(NAME_KEY);
      const storedColor = localStorage.getItem(COLOR_KEY) ?? DEFAULT_COLOR;
      const enabled = localStorage.getItem(ENABLED_KEY) === "true";
      setHasMouse(mq.matches);
      setName(enabled ? storedName : null);
      setColor(storedColor);
      setDraft(storedName ?? "");
      setDraftColor(storedColor);
      setShowCard(!storedName && !localStorage.getItem(SKIP_KEY));
    });
    const onChange = (e: MediaQueryListEvent) => setHasMouse(e.matches);
    mq.addEventListener("change", onChange);
    return () => {
      cancelAnimationFrame(frame);
      mq.removeEventListener("change", onChange);
    };
  }, []);

  useEffect(() => {
    const html = document.documentElement;
    if (hasMouse && name) {
      html.setAttribute("data-cursor-active", "");
    } else {
      html.removeAttribute("data-cursor-active");
    }
    return () => html.removeAttribute("data-cursor-active");
  }, [hasMouse, name]);

  useEffect(() => {
    const card = cardRef.current;
    if (!hasMouse) {
      const frame = requestAnimationFrame(() => setShouldRenderCard(false));
      return () => cancelAnimationFrame(frame);
    }

    if (showCard) {
      const frame = requestAnimationFrame(() => setShouldRenderCard(true));
      return () => cancelAnimationFrame(frame);
    }

    if (!card) {
      const frame = requestAnimationFrame(() => setShouldRenderCard(false));
      return () => cancelAnimationFrame(frame);
    }

    gsap.killTweensOf(card);
    const tween = gsap.to(card, {
      autoAlpha: 0,
      y: -10,
      scale: 0.96,
      filter: "blur(6px)",
      transformOrigin: "top right",
      duration: 0.22,
      ease: "power2.in",
      onComplete: () => setShouldRenderCard(false),
    });

    return () => tween.kill();
  }, [hasMouse, showCard]);

  useEffect(() => {
    if (!shouldRenderCard || !showCard) return;

    const card = cardRef.current;
    if (!card) return;

    const items = card.querySelectorAll("[data-cursor-card-item]");
    gsap.killTweensOf([card, items]);

    const tl = gsap.timeline();
    tl.fromTo(
      card,
      {
        autoAlpha: 0,
        y: -14,
        scale: 0.96,
        filter: "blur(8px)",
        transformOrigin: "top right",
      },
      {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        filter: "blur(0px)",
        duration: 0.42,
        ease: "back.out(1.7)",
      },
    ).fromTo(
      items,
      { autoAlpha: 0, y: 8 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.28,
        stagger: 0.04,
        ease: "power2.out",
      },
      "-=0.22",
    );

    return () => {
      tl.kill();
    };
  }, [shouldRenderCard, showCard]);

  // Let the navbar reopen the cursor card from outside.
  useEffect(() => {
    const onEdit = () => {
      setDraft(name ?? localStorage.getItem(NAME_KEY) ?? "");
      setDraftColor(color ?? localStorage.getItem(COLOR_KEY) ?? DEFAULT_COLOR);
      localStorage.removeItem(SKIP_KEY);
      setIsExpanded(false);
      setShowCard(true);
    };
    window.addEventListener("cursor:edit", onEdit);
    return () => window.removeEventListener("cursor:edit", onEdit);
  }, [name, color]);

  useEffect(() => {
    if (!shouldRenderCard || !showCard || !isExpanded) return;

    const content = expandedRef.current;
    if (!content) return;

    const items = content.querySelectorAll("[data-cursor-expanded-item]");
    gsap.killTweensOf([content, items]);

    const tl = gsap.timeline();
    tl.fromTo(
      content,
      { autoAlpha: 0, height: 0, y: -6 },
      {
        autoAlpha: 1,
        height: "auto",
        y: 0,
        duration: 0.34,
        ease: "power2.out",
      },
    ).fromTo(
      items,
      { autoAlpha: 0, y: 8 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.26,
        stagger: 0.035,
        ease: "power2.out",
      },
      "-=0.18",
    );

    return () => {
      tl.kill();
    };
  }, [shouldRenderCard, showCard, isExpanded]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = draft.trim();
    if (!trimmed) return;
    localStorage.setItem(NAME_KEY, trimmed);
    localStorage.setItem(COLOR_KEY, draftColor);
    localStorage.setItem(ENABLED_KEY, "true");
    localStorage.removeItem(SKIP_KEY);
    setName(trimmed);
    setColor(draftColor);
    setIsExpanded(false);
    setShowCard(false);
  }

  function handleDismiss() {
    localStorage.setItem(SKIP_KEY, "true");
    setIsExpanded(false);
    setShowCard(false);
  }

  function handleTurnOff() {
    localStorage.setItem(ENABLED_KEY, "false");
    setName(null);
    setIsExpanded(false);
    setShowCard(false);
  }

  // True if draftColor doesn't match any preset (user picked a custom colour)
  const isCustom = !PRESETS.some((p) => p.value === draftColor);

  return (
    <>
      {hasMouse && shouldRenderCard && (
        <aside
          ref={cardRef}
          className="fixed right-4 top-16 z-40 hidden w-[320px] border border-border bg-background/95 p-4 shadow-sm backdrop-blur-md md:block"
        >
          <div
            data-cursor-card-item
            className="mb-3 flex items-start justify-between gap-4"
          >
            <div>
              <p className="googlesans-semibold text-sm text-foreground">
                {name ? "Custom cursor is on" : "Want a custom cursor?"}
              </p>
              <p className="googlesans-regular mt-1 text-xs leading-relaxed text-muted-foreground">
                {name
                  ? "Your custom cursor will stay on after refresh. You can edit it or switch back to the normal cursor."
                  : "The normal cursor stays on by default. Opt in for a playful name tag that follows your pointer."}
              </p>
            </div>
            <button
              type="button"
              onClick={handleDismiss}
              className="googlesans-medium shrink-0 text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              Hide
            </button>
          </div>

          {!isExpanded ? (
            <div data-cursor-card-item className="flex gap-2">
              <Button
                type="button"
                size="sm"
                className="flex-1"
                onClick={() => setIsExpanded(true)}
              >
                {name ? "Edit" : "Let's do it"}
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="flex-1"
                onClick={name ? handleTurnOff : handleDismiss}
              >
                {name ? "Turn off" : "Maybe later"}
              </Button>
            </div>
          ) : (
            <div ref={expandedRef} className="overflow-hidden">
              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <Input
                  data-cursor-expanded-item
                  placeholder="Your name or a nickname"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  maxLength={32}
                  className="h-9 text-sm"
                />

                <div data-cursor-expanded-item className="flex flex-col gap-2">
                  <p className="text-xs text-muted-foreground font-google-sans">
                    Pick a cursor colour
                  </p>
                  <div className="flex items-center gap-2">
                    {PRESETS.map((preset) => {
                      const selected = draftColor === preset.value;
                      return (
                        <button
                          key={preset.value}
                          type="button"
                          aria-label={preset.label}
                          onClick={() => setDraftColor(preset.value)}
                          className="relative size-7 rounded-full transition-transform duration-150 hover:scale-110 focus-visible:outline-none"
                          style={{ background: preset.value }}
                        >
                          {selected && (
                            <span
                              className="absolute inset-0 rounded-full ring-2 ring-offset-2 ring-offset-background"
                              style={
                                {
                                  "--tw-ring-color": preset.value,
                                } as React.CSSProperties
                              }
                            />
                          )}
                          {selected && (
                            <svg
                              className="absolute inset-0 m-auto w-3.5 h-3.5 text-white drop-shadow"
                              viewBox="0 0 12 12"
                              fill="none"
                            >
                              <path
                                d="M2 6l3 3 5-5"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          )}
                        </button>
                      );
                    })}

                    {/* Custom colour — rainbow swatch that opens native colour map */}
                    <button
                      type="button"
                      aria-label="Custom colour"
                      onClick={() => pickerRef.current?.click()}
                      className="relative size-7 overflow-hidden rounded-full transition-transform duration-150 hover:scale-110 focus-visible:outline-none"
                      style={{
                        background:
                          "conic-gradient(red, yellow, lime, cyan, blue, magenta, red)",
                      }}
                    >
                      {isCustom && (
                        <span
                          className="absolute inset-0 rounded-full ring-2 ring-offset-2 ring-offset-background"
                          style={
                            {
                              "--tw-ring-color": draftColor,
                            } as React.CSSProperties
                          }
                        />
                      )}
                      {isCustom && (
                        <svg
                          className="absolute inset-0 m-auto w-3.5 h-3.5 text-white drop-shadow"
                          viewBox="0 0 12 12"
                          fill="none"
                        >
                          <path
                            d="M2 6l3 3 5-5"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                      <input
                        ref={pickerRef}
                        type="color"
                        value={isCustom ? draftColor : "#ffffff"}
                        onChange={(e) => setDraftColor(e.target.value)}
                        className="absolute opacity-0 w-0 h-0 pointer-events-none"
                        tabIndex={-1}
                        aria-hidden
                      />
                    </button>

                    <div
                      className="ml-auto flex items-center gap-1.5 px-2.5 py-1 rounded-full text-white text-xs font-google-sans whitespace-nowrap transition-colors duration-200"
                      style={{ background: draftColor }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-white/70" />
                      {draft.trim() || "Preview"}
                    </div>
                  </div>
                </div>

                <Button
                  data-cursor-expanded-item
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsExpanded(false)}
                >
                  Back
                </Button>

                <Button
                  data-cursor-expanded-item
                  type="submit"
                  disabled={!draft.trim()}
                  className="w-full"
                >
                  Save custom cursor
                </Button>
              </form>
              <p
                data-cursor-expanded-item
                className="googlesans-regular mt-3 text-[11px] leading-relaxed text-muted-foreground"
              >
                Stored only in this browser. A tiny personal touch, no server
                snack.
              </p>
            </div>
          )}
        </aside>
      )}

      {hasMouse && name && <FigmaCursor name={name} color={color} />}
    </>
  );
}
