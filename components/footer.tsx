"use client";

import { useLayoutEffect, useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { cn } from "@/lib/utils";

function IconInstagram({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function IconLinkedIn({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function IconGitHub({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} fill="currentColor">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

gsap.registerPlugin(ScrollTrigger);

/** Replace with your profiles */
const SOCIAL = {
  instagram: "https://www.instagram.com/",
  linkedin: "https://www.linkedin.com/in/",
  github: "https://github.com/",
} as const;

export function Footer() {
  const rootRef = useRef<HTMLElement>(null);
  const [timeLine, setTimeLine] = useState("");

  useEffect(() => {
    const tick = () =>
      setTimeLine(
        new Intl.DateTimeFormat("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
          timeZone: "America/Vancouver",
        }).format(new Date()),
      );
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      const blocks = gsap.utils.toArray<HTMLElement>(
        root.querySelectorAll(".js-footer-reveal"),
      );
      gsap.to(blocks, {
        opacity: 1,
        filter: "blur(0px)",
        y: 0,
        duration: 0.85,
        stagger: 0.085,
        ease: "power2.out",
        scrollTrigger: {
          trigger: root,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <footer
      ref={rootRef}
      className={cn(
        "relative z-10 mt-24 mx-auto mb-6 w-[97%] border border-border bg-accent px-6 py-6 text-foreground",
      )}
    >
      {/* Top bar */}
      <div className="js-footer-reveal flex flex-col gap-4 border-b border-border pb-8 opacity-50 blur-[10px] translate-y-5 will-change-[transform,filter,opacity] md:flex-row md:items-center md:justify-between">
        <p className="font-google-sans text-sm text-muted-foreground">
          © {new Date().getFullYear()} Harjot Singh. All Rights Reserved.
        </p>
        <nav className="flex flex-wrap gap-x-6 gap-y-2 font-google-sans text-sm">
          <Link href="#" className="transition-colors hover:text-foreground">
            Privacy Policy
          </Link>
          <Link href="#" className="transition-colors hover:text-foreground">
            Terms &amp; Conditions
          </Link>
          <Link href="#" className="transition-colors hover:text-foreground">
            Site Map
          </Link>
        </nav>
      </div>

      {/* Middle */}
      <div className="grid gap-10 py-10 md:grid-cols-2 md:gap-4">
        <div className="js-footer-reveal space-y-3 font-google-sans text-sm leading-relaxed opacity-50 blur-[10px] translate-y-5 will-change-[transform,filter,opacity]">
          <p className="tabular-nums text-muted-foreground">
            <span className="text-muted-foreground/80">(Offline)</span> Now,{" "}
            {timeLine} PST
          </p>
          <p className="max-w-md text-muted-foreground">
            Based in Vancouver, British Columbia, Canada
          </p>
        </div>

        <div className="js-footer-reveal flex flex-col items-start gap-3 opacity-50 blur-[10px] translate-y-5 will-change-[transform,filter,opacity] md:items-end md:justify-self-end">
          <span className="font-google-sans text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Social
          </span>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <Link
              href={SOCIAL.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="inline-flex items-center gap-2 font-google-sans text-sm text-foreground transition-opacity hover:opacity-70"
            >
              <IconInstagram className="size-5 shrink-0" />
              Instagram
            </Link>
            <Link
              href={SOCIAL.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="inline-flex items-center gap-2 font-google-sans text-sm text-foreground transition-opacity hover:opacity-70"
            >
              <IconLinkedIn className="size-5 shrink-0" />
              LinkedIn
            </Link>
            <Link
              href={SOCIAL.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="inline-flex items-center gap-2 font-google-sans text-sm text-foreground transition-opacity hover:opacity-70"
            >
              <IconGitHub className="size-5 shrink-0" />
              GitHub
            </Link>
          </div>
        </div>
      </div>

      {/* Big name — clipped; uses foreground so it stays visible on accent in light & dark */}
      <div
        className={cn(
          "js-footer-reveal relative isolate overflow-hidden pb-2 opacity-50 blur-[10px] translate-y-5 will-change-[transform,filter,opacity]",
        )}
        style={{ height: "clamp(5rem, 16vw, 10rem)" }}
      >
        <h2
          className="googlesans-bold pointer-events-none absolute left-0 right-0 text-[clamp(3.75rem,16vw,11.5rem)] leading-none tracking-tight text-foreground"
          style={{
            bottom: 0,
            transform: "translateY(40%)",
            transformOrigin: "50% 100%",
          }}
        >
          HARJOT SINGH
        </h2>
      </div>
    </footer>
  );
}
