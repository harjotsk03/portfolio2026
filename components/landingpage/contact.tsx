"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon, Loader2 } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const inputBase =
  "w-full border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground transition-colors focus-visible:border-orange-500 focus-visible:ring-0.5 focus-visible:ring-orange-500/20 googlesans-regular";
export function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorText, setErrorText] = useState("");
  const maxMessage = 500;

  // When navigating from another page via /#contact, scroll here after mount
  useEffect(() => {
    if (window.location.hash === "#contact") {
      const el = sectionRef.current;
      if (!el) return;
      // Small delay to let the page finish rendering
      const t = setTimeout(() => el.scrollIntoView({ behavior: "smooth" }), 300);
      return () => clearTimeout(t);
    }
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.from('[data-contact="head"]', {
        scrollTrigger: { trigger: section, start: "top 80%", once: true },
        opacity: 0, y: 28, duration: 0.65, ease: "power2.out",
      });
      gsap.from('[data-contact="info"]', {
        scrollTrigger: { trigger: section, start: "top 80%", once: true },
        opacity: 0, y: 22, duration: 0.55, ease: "power2.out", delay: 0.1,
      });
      gsap.from('[data-contact="form"]', {
        scrollTrigger: { trigger: section, start: "top 78%", once: true },
        opacity: 0, y: 32, scale: 0.98,
        duration: 0.7, ease: "power3.out", delay: 0.15,
      });
    }, section);

    return () => ctx.revert();
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorText("");
    setStatus("loading");

    const form = e.currentTarget;
    const fd = new FormData(form);
    const payload = {
      firstName: String(fd.get("firstName") ?? "").trim(),
      lastName: String(fd.get("lastName") ?? "").trim(),
      email: String(fd.get("email") ?? "").trim(),
      message: String(fd.get("message") ?? "").trim(),
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json()) as { error?: string; ok?: boolean };

      if (!res.ok) {
        setErrorText(data.error ?? "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }

      setStatus("success");
      form.reset();
      setMessage("");
    } catch {
      setErrorText("Network error. Please check your connection and try again.");
      setStatus("error");
    }
  }

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="w-full bg-transparent px-4 py-20 md:py-28"
    >
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col gap-12 lg:flex-row lg:gap-16 xl:gap-24">
          {/* ── Left: heading + info ── */}
          <div className="flex-1 space-y-8 lg:max-w-sm">
            <div data-contact="head" className="space-y-4">
              <p className="gamja-regular text-lg tracking-tighter text-muted-foreground">
                Let&apos;s talk
              </p>
              <h2
                className="font-modak text-5xl leading-none text-primary lg:text-6xl"
                style={{ transform: "skewX(-3deg)" }}
              >
                Get in touch
              </h2>
              <p className="googlesans-regular text-base leading-relaxed text-muted-foreground">
                Whether it&apos;s a role, a project, or just a conversation —
                I&apos;m always happy to connect.
              </p>
            </div>

            <div data-contact="info" className="space-y-4">
              <div className="border border-dashed border-border bg-muted/20 px-4 py-4">
                <p className="googlesans-medium mb-0.5 text-xs uppercase tracking-wider text-muted-foreground">
                  Email
                </p>
                <a
                  href="mailto:harjotsk03@gmail.com"
                  className="googlesans-medium text-sm text-foreground transition-colors hover:text-orange-600 dark:hover:text-orange-400"
                >
                  harjotsk03@gmail.com
                </a>
              </div>
              <div className="border border-dashed border-border bg-muted/20 px-4 py-4">
                <p className="googlesans-medium mb-0.5 text-xs uppercase tracking-wider text-muted-foreground">
                  LinkedIn
                </p>
                <a
                  href="https://www.linkedin.com/in/harjotsingh7"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="googlesans-medium text-sm text-foreground transition-colors hover:text-orange-600 dark:hover:text-orange-400"
                >
                  linkedin.com/in/harjotsingh7
                </a>
              </div>
            </div>
          </div>

          {/* ── Right: form ── */}
          <div data-contact="form" className="w-full lg:flex-1">
            <div className="border border-border bg-muted/10 p-6 sm:p-8">
              <form className="space-y-5" onSubmit={handleSubmit}>
                {/* Name row */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="firstName"
                      className="googlesans-medium text-xs uppercase tracking-wider text-muted-foreground"
                    >
                      First name <span className="text-orange-500">*</span>
                    </label>
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      autoComplete="given-name"
                      placeholder="Harjot"
                      required
                      className={inputBase}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="lastName"
                      className="googlesans-medium text-xs uppercase tracking-wider text-muted-foreground"
                    >
                      Last name <span className="text-orange-500">*</span>
                    </label>
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      autoComplete="family-name"
                      placeholder="Singh"
                      required
                      className={inputBase}
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="email"
                    className="googlesans-medium text-xs uppercase tracking-wider text-muted-foreground"
                  >
                    Email <span className="text-orange-500">*</span>
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="hello@example.com"
                    required
                    className={inputBase}
                  />
                </div>

                {/* Message */}
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="message"
                    className="googlesans-medium text-xs uppercase tracking-wider text-muted-foreground"
                  >
                    Message
                  </label>
                  <div className="relative">
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      maxLength={maxMessage}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="What's on your mind?"
                      className={cn(inputBase, "min-h-[140px] resize-y pb-7")}
                    />
                    <span className="pointer-events-none absolute bottom-2.5 right-3 text-[11px] text-muted-foreground/60">
                      {message.length}/{maxMessage}
                    </span>
                  </div>
                </div>

                {/* Feedback */}
                {status === "success" && (
                  <p className="border border-dashed border-orange-500/40 bg-orange-500/5 px-3 py-2.5 text-sm text-orange-700 dark:text-orange-300 googlesans-regular">
                    Message sent — I&apos;ll get back to you soon. 👋
                  </p>
                )}
                {status === "error" && errorText && (
                  <p className="border border-dashed border-destructive/40 bg-destructive/5 px-3 py-2.5 text-sm text-destructive googlesans-regular">
                    {errorText}
                  </p>
                )}

                <Button
                  type="submit"
                  variant="orange"
                  disabled={status === "loading"}
                  className="w-full gap-2 googlesans-medium text-sm disabled:opacity-60"
                >
                  {status === "loading" ? "Sending…" : "Send message"}
                  {status !== "loading" ? (
                    <ArrowRightIcon className="size-3 transition-transform duration-300 group-hover:translate-x-1" />
                  ) : (
                    <Loader2 className="size-3 animate-spin" />
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
