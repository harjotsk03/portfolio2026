"use client";

import { useEffect, useRef, useState } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { getLenis } from "@/components/smooth-scroll";
import gsap from "gsap";
import { X } from "lucide-react";

const NAV_LINKS = [
  { label: "My Work", href: "/mywork" },
  { label: "About", href: "/about" },
  { label: "Resume", href: "/resume" },
] as const;

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Refs for GSAP targets
  const overlayRef = useRef<HTMLDivElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLElement | null)[]>([]);

  function scrollToContact() {
    if (pathname === "/") {
      const el = document.getElementById("contact");
      if (!el) return;
      const lenis = getLenis();
      if (lenis) {
        lenis.scrollTo(el, { offset: -20 });
      } else {
        el.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      router.push("/#contact");
    }
  }

  // Mobile version: close drawer first, then scroll once Lenis has restarted
  function mobileScrollToContact() {
    setOpen(false);
    // Start Lenis immediately so scroll works right after the drawer closes
    getLenis()?.start();
    if (pathname === "/") {
      setTimeout(() => {
        const el = document.getElementById("contact");
        if (!el) return;
        const lenis = getLenis();
        if (lenis) {
          lenis.scrollTo(el, { offset: -20 });
        } else {
          el.scrollIntoView({ behavior: "smooth" });
        }
      }, 380); // matches drawer close duration
    } else {
      router.push("/#contact");
    }
  }

  // ── Open animation ─────────────────────────────────────────────
  useEffect(() => {
    const overlay = overlayRef.current;
    const drawer = drawerRef.current;
    const items = itemRefs.current.filter(Boolean) as HTMLElement[];
    if (!overlay || !drawer) return;

    if (open) {
      getLenis()?.stop();

      // Make visible before animating
      overlay.style.display = "block";
      drawer.style.display = "flex";

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(overlay, { opacity: 0 }, { opacity: 1, duration: 0.25 }, 0)
        .fromTo(drawer, { x: "100%" }, { x: "0%", duration: 0.38 }, 0)
        .fromTo(
          items,
          { opacity: 0, x: 20 },
          { opacity: 1, x: 0, duration: 0.3, stagger: 0.055 },
          0.18,
        );
    } else {
      getLenis()?.start();

      const tl = gsap.timeline({
        defaults: { ease: "power3.in" },
        onComplete: () => {
          overlay.style.display = "none";
          drawer.style.display = "none";
        },
      });
      tl.to(items, { opacity: 0, x: 14, duration: 0.18, stagger: 0.03 }, 0)
        .to(drawer, { x: "100%", duration: 0.3 }, 0.06)
        .to(overlay, { opacity: 0, duration: 0.25 }, 0.1);
    }
  }, [open]);

  // Close on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 h-14 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-full items-center justify-between pl-6 pr-3">
          {/* Left: logo + desktop links */}
          <div className="flex items-center gap-2">
            <Link href="/">
              <Image
                src="/logo.svg"
                alt="Logo"
                width={20}
                height={20}
                className="invert transition-all duration-500 ease-in-out hover:rotate-360 dark:invert-0"
                priority
              />
            </Link>
            {NAV_LINKS.map((l) => (
              <Button
                key={l.href}
                variant="ghost"
                size="sm"
                onClick={() => router.push(l.href)}
                className="ml-1 hidden gap-2 font-google-sans text-xs first:ml-4 md:flex"
              >
                {l.label}
              </Button>
            ))}
          </div>

          {/* Right: theme toggle + desktop CTAs + hamburger */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button
              variant="outline"
              size="sm"
              className="hidden gap-1.5 font-google-sans text-xs md:flex"
              onClick={() =>
                window.dispatchEvent(new CustomEvent("cursor:edit"))
              }
            >
              Change name &amp; colour
            </Button>
            <Button
              variant="blue"
              size="sm"
              className="hidden gap-1.5 font-google-sans text-xs md:flex"
              onClick={scrollToContact}
            >
              Let&apos;s Chat
            </Button>

            {/* Hamburger — mobile only */}
            <button
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((v) => !v)}
              className="relative flex size-9 flex-col items-center justify-center gap-[5px] md:hidden"
            >
              <span
                className={`h-px w-5 bg-foreground transition-all duration-300 ${
                  open ? "translate-y-[6.5px] rotate-45" : ""
                }`}
              />
              <span
                className={`h-px w-5 bg-foreground transition-all duration-300 ${
                  open ? "opacity-0" : ""
                }`}
              />
              <span
                className={`h-px w-5 bg-foreground transition-all duration-300 ${
                  open ? "translate-y-[-6.5px] -rotate-45" : ""
                }`}
              />
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile drawer ──────────────────────────────────────────── */}

      {/* Backdrop */}
      <div
        ref={overlayRef}
        style={{ display: "none" }}
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
        onClick={() => setOpen(false)}
        aria-hidden
      />

      {/* Drawer panel */}
      <div
        ref={drawerRef}
        style={{ display: "none" }}
        className="fixed right-0 top-0 z-50 flex h-full w-72 max-w-[85vw] flex-col border-l border-border bg-background"
      >
        {/* Drawer header */}
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-border px-5">
          <Link href="/" onClick={() => setOpen(false)}>
            <Image
              src="/logo.svg"
              alt="Logo"
              width={18}
              height={18}
              className="invert dark:invert-0"
            />
          </Link>
          <button
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="flex size-8 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-4 py-6">
          {NAV_LINKS.map((l, i) => (
            <button
              key={l.href}
              ref={(el) => {
                itemRefs.current[i] = el;
              }}
              onClick={() => {
                router.push(l.href);
                setOpen(false);
              }}
              className="googlesans-medium flex w-full items-center py-3 text-left text-base text-foreground transition-colors hover:text-orange-600 dark:hover:text-orange-400"
            >
              {l.label}
            </button>
          ))}
        </nav>

        {/* Bottom CTA */}
        <div
          ref={(el) => {
            itemRefs.current[NAV_LINKS.length + 2] = el;
          }}
          className="shrink-0 border-t border-border px-4 py-5"
        >
          <Button
            variant="blue"
            size="sm"
            className="w-full gap-1.5 font-google-sans text-xs"
            onClick={mobileScrollToContact}
          >
            Let&apos;s Chat
          </Button>
        </div>
      </div>
    </>
  );
}
