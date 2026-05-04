"use client";

import { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { getLenis } from "@/components/smooth-scroll";

export function FlowVideo({ src, caption }: { src: string; caption: string }) {
  const [open, setOpen] = useState(false);
  const modalVideoRef = useRef<HTMLVideoElement>(null);

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (next) {
      getLenis()?.stop();
    } else {
      getLenis()?.start();
    }
  }

  // Autoplay from beginning when modal opens
  useEffect(() => {
    const video = modalVideoRef.current;
    if (!video) return;
    if (open) {
      video.currentTime = 0;
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {/* Phone frame trigger */}
      <button
        onClick={() => handleOpenChange(true)}
        className="group mx-auto block w-44 shrink-0 cursor-zoom-in sm:mx-0"
        aria-label={`Play ${caption} fullscreen`}
      >
        <div className="relative overflow-hidden bg-background transition-transform duration-200 group-hover:scale-[1.02]">
          <video
            src={src}
            autoPlay
            loop
            muted
            playsInline
            className="w-full"
          />
          {/* Expand hint on hover */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            <div className="bg-background/80 p-2 backdrop-blur-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="size-5 text-foreground"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path d="M8 3H5a2 2 0 0 0-2 2v3" />
                <path d="M21 8V5a2 2 0 0 0-2-2h-3" />
                <path d="M3 16v3a2 2 0 0 0 2 2h3" />
                <path d="M16 21h3a2 2 0 0 0 2-2v-3" />
              </svg>
            </div>
          </div>
        </div>
        <p className="googlesans-regular mt-2 text-center text-[10px] text-muted-foreground">
          {caption} · click to expand
        </p>
      </button>

      {/* Modal */}
      <DialogContent
        className="flex items-center justify-center border-0 bg-transparent p-0 shadow-none"
        style={{ width: "auto", maxWidth: "none" }}
      >
        {/* Visually hidden title for accessibility */}
        <DialogTitle className="sr-only">{caption}</DialogTitle>
        <video
          ref={modalVideoRef}
          src={src}
          autoPlay
          controls
          playsInline
          className="rounded-2xl shadow-2xl"
          style={{ maxHeight: "90vh", width: "auto" }}
        />
      </DialogContent>
    </Dialog>
  );
}
