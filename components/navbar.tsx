"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export function Navbar() {
  return (
    <header className="fixed top-0 inset-x-0 z-50 h-14 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-full items-center justify-between pl-6 pr-3">
        {/* Logo */}
        <Image
          src="/logo.svg"
          alt="Logo"
          width={20}
          height={20}
          className="invert dark:invert-0"
          priority
        />

        {/* Right controls */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button
            variant="outline"
            size="sm"
            className="hidden md:flex font-google-sans text-xs gap-1.5"
            onClick={() => window.dispatchEvent(new CustomEvent("cursor:edit"))}
          >
            Change name &amp; colour
          </Button>
          <Button
            variant="blue"
            size="sm"
            className="hidden md:flex font-google-sans text-xs gap-1.5"
            onClick={() => window.dispatchEvent(new CustomEvent("cursor:edit"))}
          >
            Let's Chat
          </Button>
        </div>
      </div>
    </header>
  );
}
