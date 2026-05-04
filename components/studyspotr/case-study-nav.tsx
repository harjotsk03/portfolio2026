"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { getLenis } from "@/components/smooth-scroll";

export const CASE_SECTIONS = [
  { id: "intro", label: "Intro" },
  { id: "problem", label: "The problem" },
  { id: "research", label: "Research" },
  { id: "insight", label: "Key insight" },
  { id: "ab-testing", label: "A/B testing" },
  { id: "product", label: "The product" },
  { id: "spots", label: "Study spots" },
  { id: "getting-users", label: "Getting users" },
  { id: "impact", label: "Impact" },
] as const;

/** Offset from top to account for sticky navbar (px) */
const SCROLL_OFFSET = -20;

function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const lenis = getLenis();
  if (lenis) {
    lenis.scrollTo(el, { offset: -SCROLL_OFFSET });
  } else {
    const top = el.getBoundingClientRect().top + window.scrollY - SCROLL_OFFSET;
    window.scrollTo({ top, behavior: "smooth" });
  }
}

function useActiveSection() {
  const [activeId, setActiveId] = useState<string>(CASE_SECTIONS[0].id);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-15% 0px -70% 0px" },
    );

    CASE_SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return activeId;
}

/** Fixed right-gutter nav — only renders at xl+ where there's space */
export function CaseStudySideNav() {
  const activeId = useActiveSection();

  return (
    <nav className="fixed right-6 top-24 hidden w-36 xl:block 2xl:right-12">
      <p className="googlesans-medium mb-3 text-[10px] uppercase tracking-widest text-muted-foreground/50">
        On this page
      </p>
      {CASE_SECTIONS.map(({ id, label }) => (
        <button
          key={id}
          onClick={() => scrollToSection(id)}
          className={cn(
            "block w-full py-1.5 text-left text-sm transition-colors duration-150",
            activeId === id
              ? "googlesans-semibold text-foreground"
              : "googlesans-regular cursor-pointer text-muted-foreground hover:text-foreground",
          )}
        >
          {label}
        </button>
      ))}
    </nav>
  );
}

/** Mobile sticky horizontal scrollable nav */
export function CaseStudyMobileNav() {
  const activeId = useActiveSection();
  const scrollRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  useEffect(() => {
    const container = scrollRef.current;
    const item = itemRefs.current.get(activeId);
    if (!container || !item) return;
    const containerRect = container.getBoundingClientRect();
    const itemRect = item.getBoundingClientRect();
    const scrollLeft =
      container.scrollLeft +
      (itemRect.left - containerRect.left) -
      containerRect.width / 2 +
      itemRect.width / 2;
    container.scrollTo({ left: scrollLeft, behavior: "smooth" });
  }, [activeId]);

  return (
    <div className="fixed top-14 z-20 border-b border-border bg-background/95 backdrop-blur-sm xl:hidden">
      <div
        ref={scrollRef}
        className="flex gap-1 overflow-x-auto px-4 py-2 [&::-webkit-scrollbar]:hidden"
        style={{ scrollbarWidth: "none" }}
      >
        {CASE_SECTIONS.map(({ id, label }) => (
          <button
            key={id}
            ref={(el) => {
              if (el) itemRefs.current.set(id, el);
              else itemRefs.current.delete(id);
            }}
            onClick={() => scrollToSection(id)}
            className={cn(
              "shrink-0 rounded-full px-3 py-1.5 text-xs transition-colors duration-150",
              activeId === id
                ? "googlesans-semibold bg-foreground text-background"
                : "googlesans-regular text-muted-foreground hover:text-foreground",
            )}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
