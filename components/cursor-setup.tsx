"use client";

import { useEffect, useRef, useState } from "react";
import FigmaCursor from "@/components/ui/FigmaCursor";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const NAME_KEY  = "cursorUserName";
const COLOR_KEY = "cursorColor";
const SKIP_KEY  = "cursorSkipped";

const PRESETS = [
  { label: "Blue",   value: "#3B82F6" },
  { label: "Purple", value: "#8B5CF6" },
  { label: "Pink",   value: "#EC4899" },
  { label: "Green",  value: "#10B981" },
  { label: "Orange", value: "#F59E0B" },
];

const DEFAULT_COLOR = PRESETS[0].value;

export function CursorSetup() {
  const [name, setName]           = useState<string | null>(null);
  const [color, setColor]         = useState<string>(DEFAULT_COLOR);
  const [skipped, setSkipped]     = useState(false);
  const [open, setOpen]           = useState(false);
  const [draft, setDraft]         = useState("");
  const [draftColor, setDraftColor] = useState<string>(DEFAULT_COLOR);
  const [hasMouse, setHasMouse]   = useState(false);
  const inputRef  = useRef<HTMLInputElement>(null);
  const pickerRef = useRef<HTMLInputElement>(null);

  // Detect fine pointer (mouse) — also listen for changes so plugging in a
  // mouse on a tablet activates the cursor without a page reload.
  useEffect(() => {
    const mq = window.matchMedia("(pointer: fine)");
    setHasMouse(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setHasMouse(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (!hasMouse) return;
    const storedName    = localStorage.getItem(NAME_KEY);
    const storedColor   = localStorage.getItem(COLOR_KEY);
    const storedSkipped = localStorage.getItem(SKIP_KEY);
    if (storedSkipped) {
      setSkipped(true);
      if (storedName) {
        setName(storedName);
        setColor(storedColor ?? DEFAULT_COLOR);
      }
    } else if (storedName) {
      setName(storedName);
      setColor(storedColor ?? DEFAULT_COLOR);
    } else {
      setOpen(true);
    }
  }, [hasMouse]);

  useEffect(() => {
    const html = document.documentElement;
    if (hasMouse && name && !skipped) {
      html.setAttribute("data-cursor-active", "");
    } else {
      html.removeAttribute("data-cursor-active");
    }
    return () => html.removeAttribute("data-cursor-active");
  }, [hasMouse, name, skipped]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
  }, [open]);

  // Let the navbar trigger the edit dialog from outside
  useEffect(() => {
    const onEdit = () => {
      setDraft(name ?? "");
      setDraftColor(color);
      setOpen(true);
    };
    window.addEventListener("cursor:edit", onEdit);
    return () => window.removeEventListener("cursor:edit", onEdit);
  }, [name, color]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = draft.trim();
    if (!trimmed) return;
    localStorage.setItem(NAME_KEY, trimmed);
    localStorage.setItem(COLOR_KEY, draftColor);
    localStorage.removeItem(SKIP_KEY);
    setName(trimmed);
    setColor(draftColor);
    setSkipped(false);
    setOpen(false);
  }

  function handleSkip() {
    localStorage.setItem(SKIP_KEY, "true");
    setSkipped(true);
    setOpen(false);
  }

  // True if draftColor doesn't match any preset (user picked a custom colour)
  const isCustom = !PRESETS.some((p) => p.value === draftColor);

  return (
    <>
      <Dialog open={open} onOpenChange={() => {}}>
        <DialogContent
          showCloseButton={false}
          className="sm:max-w-sm p-6"
          onPointerDownOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => { if (!name) e.preventDefault(); else setOpen(false); }}
        >
          <DialogHeader>
            <DialogTitle className="text-2xl">
              {name ? "Edit your cursor" : "Hey there! What is your name?"}
            </DialogTitle>
            <DialogDescription asChild>
              <div className="flex flex-col gap-3 text-sm text-muted-foreground">
                <p className="font-google-sans">
                  {name
                    ? "Update your name or pick a new cursor colour."
                    : "Your name shows up on your cursor as you move around the site, it\u2019s a small personal touch that makes the experience feel a little more alive."}
                </p>
              </div>
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="mt-2 flex flex-col gap-4">
            <Input
              ref={inputRef}
              placeholder="Your name or a nickname"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              maxLength={32}
            />

            {/* Colour picker */}
            <div className="flex flex-col gap-2">
              <p className="text-xs text-muted-foreground font-google-sans">
                Pick your cursor colour
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
                      className="relative w-7 h-7 rounded-full transition-transform duration-150 hover:scale-110 focus-visible:outline-none"
                      style={{ background: preset.value }}
                    >
                      {selected && (
                        <span className="absolute inset-0 rounded-full ring-2 ring-offset-2 ring-offset-background"
                          style={{ "--tw-ring-color": preset.value } as React.CSSProperties}
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
                  className="relative w-7 h-7 rounded-full transition-transform duration-150 hover:scale-110 focus-visible:outline-none overflow-hidden"
                  style={{
                    background:
                      "conic-gradient(red, yellow, lime, cyan, blue, magenta, red)",
                  }}
                >
                  {isCustom && (
                    <span
                      className="absolute inset-0 rounded-full ring-2 ring-offset-2 ring-offset-background"
                      style={{ "--tw-ring-color": draftColor } as React.CSSProperties}
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

                {/* Live preview swatch */}
                <div
                  className="ml-auto flex items-center gap-1.5 px-2.5 py-1 rounded-full text-white text-xs font-google-sans whitespace-nowrap transition-colors duration-200"
                  style={{ background: draftColor }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-white/70" />
                  {draft.trim() || "Preview"}
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              {name && (
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>
              )}
              <Button type="submit" disabled={!draft.trim()} className="flex-1">
                {name ? "Save changes" : "Let\u2019s go \u2192"}
              </Button>
            </div>
          </form>

          <div className="flex items-center flex-col gap-4">
            <p className="font-google-sans text-xs text-muted-foreground">
              It&apos;s saved only in <span className="italic">your</span>{" "}
              browser. Nothing is ever sent to a server.
            </p>
            <button
              type="button"
              onClick={handleSkip}
              className="font-google-sans text-xs text-primary hover:text-muted-foreground underline underline-offset-2 transition-colors shrink-0 ml-4"
            >
              Use default cursor
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {hasMouse && name && !skipped && <FigmaCursor name={name} color={color} />}
    </>
  );
}
