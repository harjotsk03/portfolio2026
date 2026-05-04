"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUp } from "lucide-react";
import gsap from "gsap";
import { getLenis } from "@/components/smooth-scroll";

export function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  // Show after scrolling 300px
  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > 300);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // GSAP fade + scale in/out
  useEffect(() => {
    const btn = btnRef.current;
    if (!btn) return;
    tweenRef.current?.kill();
    if (visible) {
      gsap.set(btn, { pointerEvents: "auto" });
      tweenRef.current = gsap.to(btn, {
        opacity: 1,
        scale: 1,
        duration: 0.22,
        ease: "power2.out",
      });
    } else {
      gsap.set(btn, { pointerEvents: "none" });
      tweenRef.current = gsap.to(btn, {
        opacity: 0,
        scale: 0.8,
        duration: 0.18,
        ease: "power2.in",
      });
    }
  }, [visible]);

  function handleClick() {
    const lenis = getLenis();
    if (lenis) {
      lenis.scrollTo(0, { duration: 1.2, easing: (t) => 1 - Math.pow(1 - t, 4) });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  return (
    <button
      ref={btnRef}
      onClick={handleClick}
      aria-label="Scroll to top"
      style={{ opacity: 0, scale: "0.8" }}
      className="fixed bottom-5 right-5 z-40 flex size-10 items-center justify-center border border-border bg-background/90 shadow-md backdrop-blur-sm transition-colors hover:border-orange-500/50 hover:bg-muted md:hidden"
    >
      <ArrowUp className="size-4 text-foreground" />
    </button>
  );
}
