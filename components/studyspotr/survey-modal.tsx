"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { getLenis } from "@/components/smooth-scroll";

const COLUMNS = [
  { key: "community", label: "Sense of community?" },
  { key: "studyGroup", label: "Want study group?" },
  { key: "spotChallenges", label: "Spot challenges" },
  { key: "isolation", label: "Feels isolated?" },
  { key: "collab", label: "Collab helps?" },
  { key: "spotNeeds", label: "Study spot needs" },
  { key: "needPlatform", label: "Need a platform?" },
] as const;

type Row = Record<(typeof COLUMNS)[number]["key"], string>;

const RESPONSES: Row[] = [
  {
    community: "Yes, people just come for class and leave. Harder to learn without community.",
    studyGroup: "Yes",
    spotChallenges: "Most spots are full all the time.",
    isolation: "Sometimes",
    collab: "Yes",
    spotNeeds: "WiFi, Power Outlets",
    needPlatform: "Yes",
  },
  {
    community: "At SFU it's tough — 50-min classes, everyone rushes out. Really isolating.",
    studyGroup: "Yes",
    spotChallenges: "Quiet places with minimal distractions are hard to find.",
    isolation: "Sometimes",
    collab: "Yes",
    spotNeeds: "Food, Whiteboards, Power Outlets",
    needPlatform: "Yes",
  },
  {
    community: "Yes, it makes me feel disconnected and sad.",
    studyGroup: "Yes",
    spotChallenges: "Lighting and ambience.",
    isolation: "Always",
    collab: "Yes",
    spotNeeds: "WiFi, Whiteboards, Power Outlets, Quiet Spaces",
    needPlatform: "Yes",
  },
  {
    community: "Yes — lack of community leads to poor collaboration.",
    studyGroup: "Yes",
    spotChallenges: "Too crowded, hard to know if a spot is available.",
    isolation: "Sometimes",
    collab: "Yes",
    spotNeeds: "WiFi, Whiteboards, Power Outlets, Quiet Spaces",
    needPlatform: "Maybe",
  },
  {
    community: "Students would benefit from being more tight-knit.",
    studyGroup: "Yes",
    spotChallenges: "Usually able to find one at UBC.",
    isolation: "Often",
    collab: "Depends",
    spotNeeds: "WiFi, Food, Whiteboards, Power Outlets, Quiet Spaces",
    needPlatform: "Maybe",
  },
  {
    community: "Yes, more clusters from the same faculty would help.",
    studyGroup: "No",
    spotChallenges: "Don't really face challenges.",
    isolation: "Sometimes",
    collab: "Depends",
    spotNeeds: "WiFi, Whiteboards, Power Outlets",
    needPlatform: "Yes",
  },
  {
    community: "Depends — some work better solo, but group projects benefit from groups.",
    studyGroup: "Yes",
    spotChallenges: "Need quiet area, minimal distractions.",
    isolation: "Sometimes",
    collab: "Depends",
    spotNeeds: "WiFi, Power Outlets, Quiet Spaces",
    needPlatform: "Maybe",
  },
  {
    community: "Yes.",
    studyGroup: "Yes",
    spotChallenges: "Need a location without disturbance.",
    isolation: "Sometimes",
    collab: "Yes",
    spotNeeds: "WiFi, Whiteboards, Power Outlets, Quiet Spaces",
    needPlatform: "Yes",
  },
  {
    community: "Yes — feels like taking courses online at my own pace.",
    studyGroup: "Yes",
    spotChallenges: "None — I usually study at home.",
    isolation: "Always",
    collab: "Yes",
    spotNeeds: "WiFi, Power Outlets, Quiet Spaces",
    needPlatform: "Yes",
  },
  {
    community: "Sometimes — studying with friends boosts energy.",
    studyGroup: "Yes",
    spotChallenges: "Most SFU spots are cramped.",
    isolation: "Sometimes",
    collab: "Depends",
    spotNeeds: "WiFi, Food, Power Outlets, Quiet Spaces",
    needPlatform: "Maybe",
  },
  {
    community: "Togetherness within project groups but separated otherwise.",
    studyGroup: "Yes",
    spotChallenges: "Too loud, too busy, or no group space.",
    isolation: "Sometimes",
    collab: "Yes",
    spotNeeds: "WiFi, Whiteboards, Power Outlets, Quiet Spaces",
    needPlatform: "Yes",
  },
  {
    community: "I love my community! Lots of friends to run into.",
    studyGroup: "Yes",
    spotChallenges: "Everything taken, don't know campus well enough.",
    isolation: "Rarely",
    collab: "Yes",
    spotNeeds: "WiFi, Food, Power Outlets, Friends nearby",
    needPlatform: "Maybe",
  },
  {
    community: "Not in Sauder — the community there is pretty strong.",
    studyGroup: "Yes",
    spotChallenges: "Not enough individual rooms to book.",
    isolation: "Often",
    collab: "Yes",
    spotNeeds: "WiFi, Power Outlets, Quiet Spaces",
    needPlatform: "Yes",
  },
  {
    community: "Yes — post-COVID students still struggle to reconnect.",
    studyGroup: "Yes",
    spotChallenges: "Lack of prof availability outside school hours.",
    isolation: "Sometimes",
    collab: "Sometimes",
    spotNeeds: "WiFi, Food, Whiteboards, Power Outlets",
    needPlatform: "Yes",
  },
  {
    community: "Did uni through COVID — unusual major + off campus made it hard.",
    studyGroup: "No",
    spotChallenges: "None.",
    isolation: "Often",
    collab: "Depends",
    spotNeeds: "WiFi, Power Outlets, Quiet Spaces",
    needPlatform: "Maybe",
  },
  {
    community: "Yes — rarely feel connected in class. \"Dead culture\" stops people from engaging.",
    studyGroup: "Yes",
    spotChallenges: "Certain amenities like chargers.",
    isolation: "Often",
    collab: "Depends",
    spotNeeds: "WiFi, Food, Power Outlets",
    needPlatform: "Yes",
  },
  {
    community: "Yes — quite isolated and always feeling behind.",
    studyGroup: "Yes",
    spotChallenges: "Quiet spaces are hard to find.",
    isolation: "Often",
    collab: "Sometimes",
    spotNeeds: "WiFi, Whiteboards, Power Outlets, Quiet Spaces",
    needPlatform: "Yes",
  },
  {
    community: "Strong within communities of same background, but weak across groups.",
    studyGroup: "Yes",
    spotChallenges: "Places always crowded, not suitable for big groups.",
    isolation: "Sometimes",
    collab: "Yes",
    spotNeeds: "Food, Power Outlets, Quiet Spaces",
    needPlatform: "Maybe",
  },
  {
    community: "Not really — my program has a great Discord community.",
    studyGroup: "Yes",
    spotChallenges: "Finding the right level of quietness.",
    isolation: "Sometimes",
    collab: "Yes",
    spotNeeds: "WiFi, Food, Whiteboards, Power Outlets, Quiet Spaces",
    needPlatform: "Maybe",
  },
  {
    community: "Yes — wish there were people to connect to.",
    studyGroup: "Yes",
    spotChallenges: "Finding same-minded people.",
    isolation: "Always",
    collab: "Yes",
    spotNeeds: "WiFi, Power Outlets, Quiet Spaces, Prayer room",
    needPlatform: "Maybe",
  },
  {
    community: "Finding community in school is easier than after — harder post-graduation.",
    studyGroup: "Yes",
    spotChallenges: "Limited access.",
    isolation: "Sometimes",
    collab: "Yes",
    spotNeeds: "WiFi, Whiteboards, Power Outlets, Quiet Spaces",
    needPlatform: "Yes",
  },
];

const BADGE: Record<string, string> = {
  Yes: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  No: "bg-rose-500/10 text-rose-700 dark:text-rose-400",
  Maybe: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
  Sometimes: "bg-sky-500/10 text-sky-700 dark:text-sky-400",
  Often: "bg-orange-500/10 text-orange-700 dark:text-orange-400",
  Always: "bg-red-500/10 text-red-700 dark:text-red-400",
  Rarely: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  Depends: "bg-purple-500/10 text-purple-700 dark:text-purple-400",
};

const SHORT_ANSWERS = new Set([
  "Yes", "No", "Maybe", "Sometimes", "Often", "Always", "Rarely", "Depends",
]);

function Cell({ value }: { value: string }) {
  const isShort = SHORT_ANSWERS.has(value);
  return (
    <td className="px-4 py-3 align-top text-sm">
      {isShort ? (
        <span
          className={cn(
            "inline-block rounded-full px-2.5 py-0.5 text-xs font-medium",
            BADGE[value] ?? "bg-muted text-muted-foreground",
          )}
        >
          {value}
        </span>
      ) : (
        <p className="googlesans-regular max-w-[18rem] leading-snug text-muted-foreground">
          {value}
        </p>
      )}
    </td>
  );
}

export function SurveyModal({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  function handleOpenChange(next: boolean) {
    setOpen(next);
    const lenis = getLenis();
    if (next) {
      lenis?.stop();
    } else {
      lenis?.start();
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="flex max-h-[85vh] max-w-[92vw] flex-col gap-0 p-0 xl:max-w-6xl">
        <DialogHeader className="shrink-0 border-b border-border px-6 py-4">
          <DialogTitle className="googlesans-semibold text-base text-foreground">
            Survey responses
            <span className="googlesans-regular ml-2 text-sm text-muted-foreground">
              21 students · Jan – Mar 2025
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="overflow-auto" data-lenis-prevent>
          <table className="w-full border-collapse text-sm">
            <thead className="sticky top-0 z-10 bg-muted/80 backdrop-blur-sm">
              <tr>
                <th className="px-4 py-3 text-left">
                  <span className="googlesans-medium text-[10px] uppercase tracking-wider text-muted-foreground">
                    #
                  </span>
                </th>
                {COLUMNS.map((col) => (
                  <th key={col.key} className="px-4 py-3 text-left">
                    <span className="googlesans-medium text-[10px] uppercase tracking-wider text-muted-foreground">
                      {col.label}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {RESPONSES.map((row, i) => (
                <tr
                  key={i}
                  className="border-t border-border transition-colors hover:bg-muted/30"
                >
                  <td className="px-4 py-3 align-top text-xs text-muted-foreground/50">
                    {String(i + 1).padStart(2, "0")}
                  </td>
                  {COLUMNS.map((col) => (
                    <Cell key={col.key} value={row[col.key]} />
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DialogContent>
    </Dialog>
  );
}
