"use client";

import * as React from "react";
import useEmblaCarousel, {
  type UseEmblaCarouselType,
} from "embla-carousel-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type CarouselApi = UseEmblaCarouselType[1];
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>;
type CarouselOptions = UseCarouselParameters[0];
type CarouselPlugin = UseCarouselParameters[1];

type CarouselProps = {
  opts?: CarouselOptions;
  plugins?: CarouselPlugin;
  orientation?: "horizontal" | "vertical";
  setApi?: (api: CarouselApi) => void;
};

type CarouselContextProps = {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0];
  api: ReturnType<typeof useEmblaCarousel>[1];
  scrollPrev: () => void;
  scrollNext: () => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
  orientation: "horizontal" | "vertical";
  /** When true, prev/next stay enabled (no disabled styling) for infinite loop carousels. */
  loop: boolean;
};

const CarouselContext = React.createContext<CarouselContextProps | null>(null);

function useCarousel() {
  const context = React.useContext(CarouselContext);
  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />");
  }
  return context;
}

function Carousel({
  orientation = "horizontal",
  opts,
  setApi,
  plugins,
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & CarouselProps) {
  const loopEnabled = opts?.loop === true;
  const [carouselRef, api] = useEmblaCarousel(
    { ...opts, axis: orientation === "horizontal" ? "x" : "y" },
    plugins,
  );
  const [canScrollPrev, setCanScrollPrev] = React.useState(false);
  const [canScrollNext, setCanScrollNext] = React.useState(false);

  const onSelect = React.useCallback((apiInstance: CarouselApi) => {
    if (!apiInstance) return;
    setCanScrollPrev(apiInstance.canScrollPrev());
    setCanScrollNext(apiInstance.canScrollNext());
  }, []);

  const scrollPrev = React.useCallback(() => {
    api?.scrollPrev();
  }, [api]);

  const scrollNext = React.useCallback(() => {
    api?.scrollNext();
  }, [api]);

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        scrollPrev();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        scrollNext();
      }
    },
    [scrollPrev, scrollNext],
  );

  React.useEffect(() => {
    if (!api || !setApi) return;
    setApi(api);
  }, [api, setApi]);

  React.useEffect(() => {
    if (!api) return;
    onSelect(api);
    api.on("reInit", onSelect);
    api.on("select", onSelect);
    return () => {
      api.off("reInit", onSelect);
      api.off("select", onSelect);
    };
  }, [api, onSelect]);

  return (
    <CarouselContext.Provider
      value={{
        carouselRef,
        api,
        orientation,
        scrollPrev,
        scrollNext,
        canScrollPrev,
        canScrollNext,
        loop: loopEnabled,
      }}
    >
      <div
        onKeyDownCapture={handleKeyDown}
        className={cn("relative", className)}
        role="region"
        aria-roledescription="carousel"
        {...props}
      >
        {children}
      </div>
    </CarouselContext.Provider>
  );
}

function CarouselContent({ className, ...props }: React.ComponentProps<"div">) {
  const { carouselRef, orientation } = useCarousel();

  return (
    <div ref={carouselRef} className="overflow-hidden">
      <div
        className={cn(
          "flex",
          orientation === "horizontal" ? "-ml-4" : "flex-col -mt-4",
          className,
        )}
        {...props}
      />
    </div>
  );
}

function CarouselItem({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { orientation } = useCarousel();

  return (
    <div
      role="group"
      aria-roledescription="slide"
      className={cn(
        "min-w-0 shrink-0 grow-0 basis-full",
        orientation === "horizontal" ? "pl-4" : "pt-4",
        className,
      )}
      {...props}
    />
  );
}

function CarouselPrevious({
  className,
  variant = "outline",
  size = "icon-sm",
  ...props
}: React.ComponentProps<typeof Button>) {
  const { orientation, scrollPrev, canScrollPrev, loop } = useCarousel();

  return (
    <Button
      data-slot="carousel-previous"
      variant={variant}
      size={size}
      type="button"
      className={cn(
        "absolute z-30 size-8 border-border bg-background/95 backdrop-blur-sm pointer-events-auto",
        orientation === "horizontal"
          ? "left-2 top-1/2 -translate-y-1/2 md:left-3"
          : "-top-12 left-1/2 -translate-x-1/2 rotate-90",
        className,
      )}
      disabled={!loop && !canScrollPrev}
      onClick={scrollPrev}
      aria-label="Previous slide"
      {...props}
    >
      <ChevronSvg dir="prev" />
    </Button>
  );
}

function CarouselNext({
  className,
  variant = "outline",
  size = "icon-sm",
  ...props
}: React.ComponentProps<typeof Button>) {
  const { orientation, scrollNext, canScrollNext, loop } = useCarousel();

  return (
    <Button
      data-slot="carousel-next"
      variant={variant}
      size={size}
      type="button"
      className={cn(
        "absolute z-30 size-8 border-border bg-background/95 pointer-events-auto",
        orientation === "horizontal"
          ? "right-2 top-1/2 -translate-y-1/2 md:right-3"
          : "-bottom-12 left-1/2 -translate-x-1/2 rotate-90",
        className,
      )}
      disabled={!loop && !canScrollNext}
      onClick={scrollNext}
      aria-label="Next slide"
      {...props}
    >
      <ChevronSvg dir="next" />
    </Button>
  );
}

function CarouselDots({ className }: React.ComponentProps<"div">) {
  const { api } = useCarousel();
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [scrollSnaps, setScrollSnaps] = React.useState<number[]>([]);

  React.useEffect(() => {
    if (!api) return;
    const update = () => {
      setScrollSnaps(api.scrollSnapList());
      setSelectedIndex(api.selectedScrollSnap());
    };
    update();
    api.on("reInit", update);
    api.on("select", update);
    return () => {
      api.off("reInit", update);
      api.off("select", update);
    };
  }, [api]);

  return (
    <div
      role="tablist"
      aria-label="Slide indicators"
      className={cn("flex items-center justify-center gap-2", className)}
    >
      {scrollSnaps.map((_, index) => (
        <button
          key={index}
          type="button"
          role="tab"
          aria-selected={selectedIndex === index}
          aria-label={`Slide ${index + 1} of ${scrollSnaps.length}`}
          className={cn(
            "size-2 shrink-0 transition-[background-color,border-color,opacity]",
            selectedIndex === index
              ? "bg-orange-500 dark:bg-orange-800 opacity-100"
              : "border-transparent bg-[#E5E7EB] opacity-100 hover:opacity-80 dark:bg-neutral-600 dark:hover:bg-neutral-500",
          )}
          onClick={() => api?.scrollTo(index)}
        />
      ))}
    </div>
  );
}

function CarouselCaption({
  captions,
  className,
}: {
  captions: string[];
  className?: string;
}) {
  const { api } = useCarousel();
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  React.useEffect(() => {
    if (!api) return;
    const update = () => setSelectedIndex(api.selectedScrollSnap());
    update();
    api.on("reInit", update);
    api.on("select", update);
    return () => {
      api.off("reInit", update);
      api.off("select", update);
    };
  }, [api]);

  const text = captions[selectedIndex] ?? "";

  return (
    <p
      className={cn("text-center text-sm text-muted-foreground", className)}
    >
      {text}
    </p>
  );
}

function ChevronSvg({ dir }: { dir: "prev" | "next" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn(dir === "prev" && "rotate-180")}
      aria-hidden
    >
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}

export {
  type CarouselApi,
  Carousel,
  CarouselCaption,
  CarouselContent,
  CarouselDots,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  useCarousel,
};
