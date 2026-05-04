"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";
import { type StaticImageData } from "next/image";

const EXT_TRIES = ["webp", "jpg", "jpeg", "png"] as const;

export function CaseImage({
  slug,
  src: srcProp,
  title,
  aspectClass = "aspect-[16/10]",
  accent,
  fit = "cover",
  objectPosition = "center",
}: {
  slug: string;
  src?: string | StaticImageData;
  title: string;
  aspectClass?: string;
  accent: "orange" | "blue";
  fit?: "cover" | "contain";
  objectPosition?: "left" | "center" | "right" | "top" | "bottom";
}) {
  const [extIndex, setExtIndex] = useState(0);
  const [missing, setMissing] = useState(false);
  const ext = EXT_TRIES[Math.min(extIndex, EXT_TRIES.length - 1)];
  const fallbackSrc = `/studyspotr/${slug}.${ext}`;

  // Resolve StaticImageData → plain URL string
  const resolvedSrc: string | null =
    srcProp == null
      ? null
      : typeof srcProp === "string"
        ? srcProp
        : (srcProp as StaticImageData).src;

  const borderGlow =
    accent === "orange"
      ? "border-orange-500/35 bg-orange-500/[0.06] shadow-[0_0_48px_-14px_rgba(249,115,22,0.38)] dark:border-orange-400/25 dark:bg-orange-500/[0.05]"
      : "border-sky-500/35 bg-sky-500/[0.06] shadow-[0_0_48px_-14px_rgba(14,165,233,0.32)] dark:border-sky-400/25 dark:bg-sky-500/[0.05]";

  const positionClass = {
    left: "object-left",
    center: "object-center",
    right: "object-right",
    top: "object-top",
    bottom: "object-bottom",
  }[objectPosition];

  const imgClass = cn(
    "size-full transition-opacity duration-500",
    fit === "contain" ? "object-contain p-6" : "object-cover",
    positionClass,
    "opacity-[0.97] group-hover:opacity-100",
  );

  function onImgError() {
    if (extIndex < EXT_TRIES.length - 1) setExtIndex((i) => i + 1);
    else setMissing(true);
  }

  const activeSrc = resolvedSrc ?? fallbackSrc;
  const showPlaceholder = resolvedSrc == null && missing;

  return (
    <figure className={cn("group w-full", aspectClass)}>
      <div
        className={cn(
          "h-full min-h-40 w-full overflow-hidden border border-dashed p-1",
        )}
      >
        <div
          className={cn(
            "size-full overflow-hidden bg-muted/25",
            aspectClass,
          )}
          style={{
            backgroundImage:
              "radial-gradient(oklch(0.55 0 0 / 0.09) 1px, transparent 1px)",
            backgroundSize: "14px 14px",
          }}
        >
          {!showPlaceholder ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={activeSrc}
              src={activeSrc}
              alt={title}
              className={imgClass}
              loading="lazy"
              onError={resolvedSrc == null ? onImgError : undefined}
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center">
              <span
                className={cn(
                  "border border-dotted px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest opacity-85",
                  accent === "orange"
                    ? "border-orange-500/45 text-orange-700 dark:text-orange-300/85"
                    : "border-sky-500/45 text-sky-800 dark:text-sky-300/85",
                )}
              >
                Image slot
              </span>
              <p className="googlesans-regular max-w-76 text-xs leading-snug text-muted-foreground">
                Drop file as{" "}
                <code className="border border-border/60 bg-background/80 px-1.5 py-0.5 font-mono text-[11px] text-foreground/90">
                  public/studyspotr/{slug}.webp
                </code>
                <span className="mt-1.5 block text-[11px] text-muted-foreground/80">
                  or same name with .jpg / .jpeg / .png
                </span>
              </p>
            </div>
          )}
        </div>
      </div>
      <figcaption className="googlesans-regular mt-3 max-w-prose px-1 text-[11px] leading-snug text-muted-foreground">
        <span className="googlesans-medium text-foreground/88">{title}</span>
      </figcaption>
    </figure>
  );
}
