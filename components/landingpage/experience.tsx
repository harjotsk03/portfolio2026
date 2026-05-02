"use client";

import Image, { StaticImageData } from "next/image";
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  useLayoutEffect,
  useMemo,
  useRef,
  type ReactNode,
} from "react";
import image1 from "@/assets/83C5510D-A78D-4B1A-8435-E8218927F633 2.png";
import image2 from "@/assets/IMG_0326.png";
import image3 from "@/assets/IMG_5317.png";
import image4 from "@/assets/IMG_7091.png";
import image5 from "@/assets/IMG_7682.png";
import {
  Carousel,
  CarouselCaption,
  CarouselContent,
  CarouselDots,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

gsap.registerPlugin(ScrollTrigger);

type CompactEntry = {
  entity: string;
  detail: string;
  dates: string;
};

const EXPERIENCE: CompactEntry[] = [
  {
    entity: "Aether Automation",
    detail: "Design Engineer + Software Engineer",
    dates: "Jul 2025 – Present",
  },
  {
    entity: "Study Spotr",
    detail: "Founder & Design Engineer",
    dates: "Aug 2024 – Present",
  },
  {
    entity: "Aether Automation",
    detail: "Software Engineer Co-op",
    dates: "Apr 2025 – Jun 2025",
  },
  {
    entity: "SFU Robot Soccer",
    detail: "Director of Web Design & Development",
    dates: "Feb 2024 – Mar 2026",
  },
];

const EDUCATION: CompactEntry[] = [
  {
    entity: "Simon Fraser University",
    detail: "BSc. Interactive Arts and Technology + Computer Science",
    dates: "2022 – Present",
  },
];

const CAROUSEL_SLIDES: {
  label: string;
  image: StaticImageData;
  imagePosition?: "center" | "top" | "bottom";
}[] = [
  {
    label: "Girlfriend and I going to a Canucks game.",
    image: image1,
    imagePosition: "center",
  },
  {
    label: "Bruno (my dog) and I on a hike.",
    image: image2,
    imagePosition: "center",
  },
  {
    label: "My first year snowboarding, a trip to Cypress Mountain.",
    image: image3,
    imagePosition: "center",
  },
  {
    label: "Me and my Study Spotr team working on our landing page.",
    image: image4,
    imagePosition: "center",
  },
  {
    label: "Watching Man United vs Grimbsy Town at a pub in London.",
    image: image5,
    imagePosition: "bottom",
  },
];

function SectionHeading({
  id,
  children,
  exp,
}: {
  id: string;
  children: ReactNode;
  exp: "work-head" | "edu-head";
}) {
  return (
    <div
      className="flex min-w-0 items-center gap-3 pb-4"
      data-exp={exp}
    >
      <h2
        id={id}
        className="gamja-semibold tracking-tighter shrink-0 text-3xl lg:text-4xl text-foreground"
      >
        {children}
      </h2>
    </div>
  );
}

function CompactList({
  ariaLabelledBy,
  entries,
  rowExp,
}: {
  ariaLabelledBy: string;
  entries: CompactEntry[];
  rowExp: "work-row" | "edu-row";
}) {
  return (
    <ul className="flex flex-col" aria-labelledby={ariaLabelledBy}>
      {entries.map((row) => (
        <li
          key={`${row.entity}-${row.detail}-${row.dates}`}
          data-exp={rowExp}
          className="flex flex-col lg:flex-row items-baseline justify-between gap-2 lg:gap-4 py-2 text-[13px] leading-snug md:text-sm"
        >
          <p className="min-w-0 flex flex-col gap-1">
            <span className="googlesans-semibold text-xl lg:text-lg text-foreground">
              {row.detail}
            </span>{" "}
            <span className="googlesans-regular text-base lg:text-base text-muted-foreground">
              {row.entity}
            </span>
          </p>
          <span className="lg:max-w-[40%] text-base shrink-0 lg:text-right googlesans-regular text-muted-foreground tabular-nums">
            {row.dates}
          </span>
        </li>
      ))}
    </ul>
  );
}

function CarouselSlideCover({
  image,
  alt,
  imagePosition,
}: {
  image: StaticImageData;
  alt: string;
  imagePosition?: "center" | "top" | "bottom";
}) {
  const objectPositionClass =
    imagePosition === "top"
      ? "object-top"
      : imagePosition === "bottom"
        ? "object-bottom"
        : "object-center";

  return (
    <div className="relative aspect-4/3 w-full overflow-hidden border border-border bg-muted">
      <Image
        src={image}
        alt={alt}
        fill
        className={`object-cover ${objectPositionClass}`}
        sizes="(max-width: 768px) 90vw, 45vw"
        priority={false}
      />
    </div>
  );
}

export function ExperienceSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const carouselPlugins = useMemo(
    () => [WheelGesturesPlugin({ forceWheelAxis: "x" })],
    [],
  );

  useLayoutEffect(() => {
    const root = sectionRef.current;
    if (!root) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const ctx = gsap.context(() => {
      const workHead = root.querySelector<HTMLElement>("[data-exp='work-head']");
      const workRows = root.querySelectorAll<HTMLElement>("[data-exp='work-row']");
      const eduHead = root.querySelector<HTMLElement>("[data-exp='edu-head']");
      const eduRows = root.querySelectorAll<HTMLElement>("[data-exp='edu-row']");
      const carouselInner = root.querySelector<HTMLElement>(
        "[data-exp='carousel-inner']",
      );
      const carouselMeta = root.querySelector<HTMLElement>(
        "[data-exp='carousel-meta']",
      );

      if (
        !workHead ||
        !eduHead ||
        !carouselInner ||
        !carouselMeta ||
        workRows.length === 0
      ) {
        return;
      }

      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        scrollTrigger: {
          trigger: root,
          start: "top 78%",
          toggleActions: "play none none none",
        },
      });

      gsap.set(workHead, { opacity: 0, y: 44 });
      gsap.set(workRows, { opacity: 0, y: 30 });
      gsap.set(eduHead, { opacity: 0, y: 36 });
      gsap.set(eduRows, { opacity: 0, y: 26 });
      gsap.set(carouselInner, {
        opacity: 0,
        x: 52,
        scale: 0.94,
        rotateY: -5,
        transformOrigin: "center right",
        transformPerspective: 1200,
      });
      gsap.set(carouselMeta, { opacity: 0, y: 22, filter: "blur(8px)" });

      tl.to(workHead, { opacity: 1, y: 0, duration: 0.72 }, 0)
        .to(
          workRows,
          {
            opacity: 1,
            y: 0,
            duration: 0.52,
            stagger: { each: 0.085, from: "start" },
            ease: "power2.out",
          },
          0.08,
        )
        .to(eduHead, { opacity: 1, y: 0, duration: 0.62, ease: "power3.out" }, 0.18)
        .to(
          eduRows,
          {
            opacity: 1,
            y: 0,
            duration: 0.48,
            stagger: { each: 0.11, from: "start" },
            ease: "power2.out",
          },
          0.28,
        )
        .to(
          carouselInner,
          {
            opacity: 1,
            x: 0,
            scale: 1,
            rotateY: 0,
            duration: 0.92,
            ease: "power3.out",
          },
          0.06,
        )
        .to(
          carouselMeta,
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.55,
            ease: "power2.out",
          },
          0.42,
        );
    }, root);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-label="Experience, education, and selected work"
      className="relative w-full border-y border-border bg-background px-4 py-16 md:py-24 mt-16"
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-12 lg:flex-row lg:items-start lg:justify-between lg:gap-x-12 lg:gap-y-16 xl:gap-x-16">
        {/* Left — experience & education */}
        <div className="flex min-w-0 flex-1 flex-col lg:max-w-2xl">
          <SectionHeading id="experience-heading" exp="work-head">
            where i&apos;ve worked
          </SectionHeading>
          <CompactList
            ariaLabelledBy="experience-heading"
            entries={EXPERIENCE}
            rowExp="work-row"
          />

          <div className="mt-12 lg:mt-14">
            <SectionHeading id="education-heading" exp="edu-head">
              where did i study?
            </SectionHeading>
            <CompactList
              ariaLabelledBy="education-heading"
              entries={EDUCATION}
              rowExp="edu-row"
            />
          </div>
        </div>

        {/* Right — carousel (sticky wrapper; transform animates on inner only) */}
        <div className="flex w-full shrink-0 flex-col lg:sticky lg:top-24 lg:max-w-xl lg:self-start">
          <div
            data-exp="carousel-inner"
            className="w-full will-change-transform"
          >
            <Carousel
              plugins={carouselPlugins}
              opts={{
                loop: true,
                align: "center",
                skipSnaps: false,
                dragFree: false,
                watchDrag: true,
                watchResize: true,
                containScroll: false,
              }}
              className="relative w-full outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              tabIndex={0}
            >
              <div className="relative isolate">
                <CarouselContent className="ml-0">
                  {CAROUSEL_SLIDES.map((slide) => (
                    <CarouselItem
                      key={slide.label}
                      className="min-w-0 shrink-0 grow-0 basis-[85%] pl-0 sm:basis-[82%] mr-3"
                    >
                      <CarouselSlideCover
                        image={slide.image}
                        alt={slide.label}
                        imagePosition={slide.imagePosition}
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious
                  variant="outline"
                  className="border-border bg-background/95"
                />
                <CarouselNext
                  variant="outline"
                  className="border-border bg-background/95"
                />
              </div>
              <div
                data-exp="carousel-meta"
                className="will-change-[transform,opacity,filter]"
              >
                <CarouselCaption
                  captions={CAROUSEL_SLIDES.map((s) => s.label)}
                  className="googlesans-regular mt-4 min-h-10 px-3 text-center text-muted-foreground"
                />
                <CarouselDots className="mt-3 md:mt-4" />
              </div>
            </Carousel>
          </div>
        </div>
      </div>
    </section>
  );
}
