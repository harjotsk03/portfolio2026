"use client";

import { forwardRef, useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Button } from "./ui/button";
import { ArrowRightIcon } from "lucide-react";
import Image, { StaticImageData } from "next/image";
import { useRouter } from "next/navigation";

export type ProjectType =
  | "Work"
  | "Startup"
  | "Personal"
  | "Academic"
  | "Client Work";

const TYPE_STYLES: Record<ProjectType, string> = {
  Work: "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border-emerald-300/60 dark:border-emerald-700/60",
  Startup:
    "bg-orange-100  dark:bg-orange-950  text-orange-700  dark:text-orange-300  border-orange-300/60  dark:border-orange-700/60",
  Personal:
    "bg-sky-100     dark:bg-sky-950     text-sky-700     dark:text-sky-300     border-sky-300/60     dark:border-sky-700/60",
  Academic:
    "bg-violet-100  dark:bg-violet-950  text-violet-700  dark:text-violet-300  border-violet-300/60  dark:border-violet-700/60",
  "Client Work":
    "bg-purple-100  dark:bg-purple-950  text-purple-700  dark:text-purple-300  border-purple-300/60  dark:border-purple-700/60",
};

export interface ProjectCardData {
  index: number;
  date: string;
  title: string;
  subtitle: string;
  tags: string[];
  lightimage: StaticImageData;
  darkimage: StaticImageData;
  link: string;
  projectType: ProjectType;
  team: string;
}

const LAST_VIEWED_KEY = "lastViewedProject";

export const ProjectCard = forwardRef<
  HTMLDivElement,
  { project: ProjectCardData }
>(function ProjectCard({ project }, ref) {
  const [mounted, setMounted] = useState(false);
  const [isLastViewed, setIsLastViewed] = useState(false);
  const { resolvedTheme } = useTheme();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    setIsLastViewed(localStorage.getItem(LAST_VIEWED_KEY) === project.link);
  }, [project.link]);

  function handleClick() {
    localStorage.setItem(LAST_VIEWED_KEY, project.link);
    router.push(project.link);
  }

  // SSR + first client paint: light asset only — avoids next-themes / dark class mismatch hydration errors.
  const coverSrc =
    mounted && resolvedTheme === "dark" ? project.darkimage : project.lightimage;

  return (
    <div
      onClick={handleClick}
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
        {isLastViewed && (
          <div className="absolute right-2 top-2 flex items-center gap-1 bg-background/90 px-2 py-1 backdrop-blur-sm border border-border">
            <span className="size-1.5 rounded-full bg-orange-500" />
            <span className="googlesans-medium text-[10px] uppercase tracking-wider text-foreground">
              Last viewed
            </span>
          </div>
        )}
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <span
          className={`inline-block border px-2 py-0.5 googlesans-regular text-xs ${TYPE_STYLES[project.projectType]}`}
        >
          {project.projectType}
        </span>
      </div>
      <h3 className="text-xl googlesans-semibold tracking-tighter mt-1.5">
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
        onClick={(e) => {
          e.stopPropagation();
          handleClick();
        }}
      >
        View Case Study{" "}
        <ArrowRightIcon className="ml-0.5 group-hover:translate-x-1 transition-all duration-300 size-3" />
      </Button>
    </div>
  );
});

ProjectCard.displayName = "ProjectCard";
