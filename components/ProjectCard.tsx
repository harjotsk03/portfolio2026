"use client";

import { forwardRef, useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Button } from "./ui/button";
import { ArrowRightIcon } from "lucide-react";
import Image, { StaticImageData } from "next/image";
import { useRouter } from "next/navigation";

export interface ProjectCardData {
  index: number;
  date: string;
  title: string;
  subtitle: string;
  tags: string[];
  lightimage: StaticImageData;
  darkimage: StaticImageData;
  link: string;
}

export const ProjectCard = forwardRef<
  HTMLDivElement,
  { project: ProjectCardData }
>(function ProjectCard({ project }, ref) {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();
  const router = useRouter();
  useEffect(() => {
    setMounted(true);
  }, []);

  // SSR + first client paint: light asset only — avoids next-themes / dark class mismatch hydration errors.
  const coverSrc =
    mounted && resolvedTheme === "dark" ? project.darkimage : project.lightimage;

  return (
    <div
      onClick={() => router.push(project.link)}
      ref={ref}
      className="bg-background hover:bg-muted transition-all duration-300 ease-in-out group p-4 border border-border"
    >
      <div className="relative w-full h-52 lg:h-48 overflow-hidden border border-border bg-muted">
        <Image
          src={coverSrc}
          alt={project.title}
          fill
          className="object-cover"
        />
      </div>
      <h3 className="text-xl googlesans-semibold tracking-tighter mt-3">
        {project.title}
      </h3>
      <p className="text-sm googlesans-regular mt-1">{project.subtitle}</p>
      {/* <div className="flex flex-wrap gap-2 mt-5">
        {project.tags.map((tag) => (
          <span
            key={tag}
            className="text-xs googlesans-regular bg-accent text-stone-500 dark:text-stone-400 px-2 py-1"
          >
            {tag}
          </span>
        ))}
      </div> */}
      <Button
        size="sm"
        variant="orange"
        className="mt-4 googlesans-medium text-xs flex-1 w-full"
        onClick={() => router.push(project.link)}
      >
        View Case Study{" "}
        <ArrowRightIcon className="ml-0.5 group-hover:translate-x-1 transition-all duration-300 size-3" />
      </Button>
    </div>
  );
});

ProjectCard.displayName = "ProjectCard";
