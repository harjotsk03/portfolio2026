"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";

// data-resize attribute values → rotation for the double-headed arrow
const RESIZE_ROTATION: Record<string, number> = {
  "ew-resize":   0,   "col-resize":  0,
  "e-resize":    0,   "w-resize":    0,
  "ns-resize":   90,  "row-resize":  90,
  "n-resize":    90,  "s-resize":    90,
  "nwse-resize": 45,  "se-resize":   45,  "nw-resize":  45,
  "nesw-resize": -45, "ne-resize":   -45, "sw-resize": -45,
};

function isResizeCursor(el: Element | null): number | null {
  if (!el) return null;
  // Read from data-resize attribute (set on handles so computed cursor: none doesn't break detection)
  const val = (el as HTMLElement).dataset?.resize
    ?? el.closest("[data-resize]")?.getAttribute("data-resize")
    ?? null;
  return val && val in RESIZE_ROTATION ? RESIZE_ROTATION[val] : null;
}

export default function FigmaCursor({
  name = "You",
  color = "#3B82F6",
}: {
  name: string;
  color: string;
}) {
  const arrowContainerRef = useRef<HTMLDivElement>(null);
  const labelContainerRef = useRef<HTMLDivElement>(null);
  const arrowRef          = useRef<SVGSVGElement>(null);
  const resizeRef         = useRef<SVGSVGElement>(null);
  const labelRef          = useRef<HTMLDivElement>(null);
  const beamRef           = useRef<HTMLDivElement>(null);
  const hoverState = useRef<"none" | "button" | "input" | "resize">("none");

  useEffect(() => {
    const arrowContainer = arrowContainerRef.current;
    const labelContainer = labelContainerRef.current;
    const arrow = arrowRef.current;
    const resize = resizeRef.current;
    const label = labelRef.current;
    const beam = beamRef.current;
    if (
      !arrowContainer ||
      !labelContainer ||
      !arrow ||
      !resize ||
      !label ||
      !beam
    )
      return;

    let pointerButtons = 0;
    let entered = false;

    const LX = 18,
      LY = 26;

    const isPrimaryHeld = () => (pointerButtons & 1) !== 0;

    // ── helpers ──────────────────────────────────────────────────────────────

    const kill = () => gsap.killTweensOf([arrow, resize, label, beam]);

    const toIdle = () => {
      kill();
      gsap.to(arrow, {
        scale: 1,
        rotate: 0,
        opacity: 1,
        duration: 0.3,
        ease: "power3.out",
      });
      gsap.to(resize, {
        opacity: 0,
        scale: 0.5,
        duration: 0.15,
        ease: "power2.in",
      });
      gsap.to(label, { opacity: 1, duration: 0.25, ease: "power2.out" });
      gsap.to(beam, {
        opacity: 0,
        scaleY: 0,
        duration: 0.15,
        ease: "power2.in",
      });
    };

    const toButton = () => {
      kill();
      gsap.set(beam, { opacity: 0, scaleY: 0 });
      gsap.to(resize, {
        opacity: 0,
        scale: 0.5,
        duration: 0.12,
        ease: "power2.in",
      });
      gsap.to(arrow, {
        opacity: 1,
        scale: 1.3,
        rotate: -5,
        transformOrigin: "4px 4px",
        duration: 0.45,
        ease: "back.out(2.5)",
      });
    };

    const toInput = () => {
      kill();
      gsap.to(arrow, {
        opacity: 0,
        scale: 0.5,
        duration: 0.18,
        ease: "power2.in",
      });
      gsap.to(resize, {
        opacity: 0,
        scale: 0.5,
        duration: 0.12,
        ease: "power2.in",
      });
      gsap.to(label, { opacity: 0, duration: 0.18, ease: "power2.in" });
      gsap.to(beam, {
        opacity: 1,
        scaleY: 1,
        duration: 0.28,
        ease: "back.out(2.5)",
      });
    };

    const toResize = (rotation: number) => {
      kill();
      gsap.set(beam, { opacity: 0, scaleY: 0 });
      gsap.to(arrow, {
        opacity: 0,
        scale: 0.5,
        duration: 0.15,
        ease: "power2.in",
      });
      gsap.to(resize, {
        opacity: 1,
        scale: 1,
        rotate: rotation,
        transformOrigin: "50% 50%",
        duration: 0.25,
        ease: "back.out(2)",
      });
    };

    const setArrowX = gsap.quickSetter(arrowContainer, "x", "px");
    const setArrowY = gsap.quickSetter(arrowContainer, "y", "px");
    const setLabelX = gsap.quickSetter(labelContainer, "x", "px");
    const setLabelY = gsap.quickSetter(labelContainer, "y", "px");

    const setPosition = (x: number, y: number) => {
      setArrowX(x);
      setArrowY(y);
      setLabelX(x + LX);
      setLabelY(y + LY);
    };

    // ── mouse events ──────────────────────────────────────────────────────────

    const onMove = (e: MouseEvent) => {
      pointerButtons = e.buttons;
      setPosition(e.clientX, e.clientY);
      if (!entered) {
        entered = true;
        gsap.to(arrowContainer, {
          opacity: 1,
          duration: 0.3,
          ease: "power2.out",
        });
        gsap.to(labelContainer, {
          opacity: 1,
          duration: 0.3,
          ease: "power2.out",
        });
      }
    };

    const onDocLeave = () => {
      gsap.to(arrowContainer, { opacity: 0, duration: 0.3, ease: "power2.in" });
      gsap.to(labelContainer, { opacity: 0, duration: 0.3, ease: "power2.in" });
    };
    const onDocEnter = () => {
      if (!entered) return;
      gsap.to(arrowContainer, { opacity: 1, duration: 0.25 });
      gsap.to(labelContainer, { opacity: 1, duration: 0.25 });
    };

    const onOver = (e: MouseEvent) => {
      // Dragging (carousel, etc.) — ignore synthetic enter/leave as nodes slide under fixed pointer.
      if (isPrimaryHeld()) return;
      const t = e.target as Element;
      const related = e.relatedTarget as Element | null;

      // Resize handle — checked first so it wins over button/a if needed
      const rot = isResizeCursor(t);
      if (rot !== null) {
        if (hoverState.current === "resize") return; // already in resize, rotation updates via onMove
        hoverState.current = "resize";
        toResize(rot);
        return;
      }

      if (t.closest("button, a")) {
        if (related?.closest("button, a")) return;
        hoverState.current = "button";
        toButton();
      } else if (t.closest("input, textarea")) {
        if (related?.closest("input, textarea")) return;
        hoverState.current = "input";
        toInput();
      }
    };

    const onOut = (e: MouseEvent) => {
      if (isPrimaryHeld()) return;
      const t = e.target as Element;
      const related = e.relatedTarget as Element | null;

      if (hoverState.current === "resize") {
        if (isResizeCursor(related) !== null) return;
        hoverState.current = "none";
        toIdle();
        return;
      }

      if (t.closest("button, a") && hoverState.current === "button") {
        if (related?.closest("button, a")) return;
        hoverState.current = "none";
        toIdle();
      } else if (
        t.closest("input, textarea") &&
        hoverState.current === "input"
      ) {
        if (related?.closest("input, textarea")) return;
        hoverState.current = "none";
        toIdle();
      }
    };

    // Update resize arrow rotation live as you move between handles
    const onMoveResize = (e: MouseEvent) => {
      if (hoverState.current !== "resize") return;
      const rot = isResizeCursor(e.target as Element);
      if (rot !== null) {
        gsap.to(resize, { rotate: rot, duration: 0.15, ease: "power2.out" });
      }
    };

    const onDown = () => {
      if (hoverState.current !== "button") return;
      gsap.killTweensOf(arrow);
      gsap.to(arrow, { scale: 0.85, duration: 0.08, ease: "power2.in" });
    };
    const onUp = () => {
      if (hoverState.current !== "button") return;
      gsap.killTweensOf(arrow);
      gsap.to(arrow, {
        scale: 1.3,
        rotate: -5,
        duration: 0.3,
        ease: "back.out(2.5)",
      });
    };

    const clearPointerButtons = () => {
      pointerButtons = 0;
    };

    const syncPointerButtons = (e: MouseEvent) => {
      pointerButtons = e.buttons;
    };

    window.addEventListener("mousedown", syncPointerButtons);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mousemove", onMoveResize);
    window.addEventListener("mouseup", clearPointerButtons);
    window.addEventListener("blur", clearPointerButtons);
    document.addEventListener("mouseleave", onDocLeave);
    document.addEventListener("mouseenter", onDocEnter);
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout", onOut);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("mouseup", onUp);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousemove", onMoveResize);
      window.removeEventListener("mousedown", syncPointerButtons);
      window.removeEventListener("mouseup", clearPointerButtons);
      window.removeEventListener("blur", clearPointerButtons);
      document.removeEventListener("mouseleave", onDocLeave);
      document.removeEventListener("mouseenter", onDocEnter);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("mouseup", onUp);
    };
  }, [color]);

  return (
    <>
      {/* Arrow + resize indicator — same fixed layer */}
      <div
        ref={arrowContainerRef}
        className="fixed top-0 left-0 pointer-events-none z-9998 opacity-0"
      >
        {/* Normal pointer arrow */}
        <svg ref={arrowRef} width="32" height="48" viewBox="0 0 24 36" fill="none">
          <path
            d="M5.65 12.37H5.46l-.14.13L.5 16.88V1.2l11.28 11.17H5.65z"
            fill={color}
          />
        </svg>

        {/* Double-headed resize arrow — hidden by default, rotated per direction */}
        <svg
          ref={resizeRef}
          className="absolute top-0 left-0 opacity-0"
          width="28"
          height="28"
          viewBox="0 0 28 28"
          fill="none"
          style={{ transform: "scale(0.5)", transformOrigin: "50% 50%" }}
        >
          <circle cx="14" cy="14" r="13" fill={color} />
          {/* Left arrowhead */}
          <path d="M5 14h18M5 14l4.5-3.5M5 14l4.5 3.5" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          {/* Right arrowhead */}
          <path d="M23 14l-4.5-3.5M23 14l-4.5 3.5" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>

        {/* I-beam on input hover */}
        <div
          ref={beamRef}
          className="absolute top-0 left-0.5 opacity-0 scale-y-0 origin-center rounded-sm"
          style={{ background: color, width: 2, height: 22 }}
        />
      </div>

      {/* Label — separate fixed layer, always above arrow */}
      <div
        ref={labelContainerRef}
        className="fixed top-0 left-0 pointer-events-none z-9999 opacity-0"
      >
        <div
          ref={labelRef}
          className="rounded-tr-lg rounded-br-lg rounded-bl-lg font-google-sans text-white text-xs px-2 py-0.5 whitespace-nowrap"
          style={{ background: color }}
        >
          {name}
        </div>
      </div>
    </>
  );
}
