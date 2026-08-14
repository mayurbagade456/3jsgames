"use client";

import * as React from "react";
import { Target, Gamepad2, Lightbulb } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { Game, GameHelp } from "@/lib/games";

export function HowToPlayDialog({
  game,
  help,
  trigger,
}: {
  game: Game;
  help: GameHelp | null;
  trigger: React.ReactNode;
}) {
  const goal = help?.goal || game.description;
  const controls = help?.controls ?? [];
  const tips = help?.tips ?? [];

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="text-2xl">{game.emoji}</span> How to play — {game.title}
          </DialogTitle>
          <DialogDescription>Quick rules to get you going.</DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          {goal && (
            <section className="space-y-2">
              <h3 className="flex items-center gap-2 text-sm font-bold">
                <Target className="size-4 text-primary" /> Goal
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{goal}</p>
            </section>
          )}

          {controls.length > 0 && (
            <section className="space-y-2">
              <h3 className="flex items-center gap-2 text-sm font-bold">
                <Gamepad2 className="size-4 text-primary" /> Controls
              </h3>
              <ul className="space-y-2">
                {controls.map((c, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <kbd className="clay-inset inline-flex shrink-0 items-center rounded-lg bg-muted px-2.5 py-1 text-xs font-bold">
                      {c.keys}
                    </kbd>
                    <span className="text-sm text-muted-foreground">{c.action}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {tips.length > 0 && (
            <section className="space-y-2">
              <h3 className="flex items-center gap-2 text-sm font-bold">
                <Lightbulb className="size-4 text-primary" /> Tips
              </h3>
              <ul className="space-y-1.5">
                {tips.map((t, i) => (
                  <li key={i} className="flex gap-2 text-sm text-muted-foreground">
                    <span className="text-primary">•</span>
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {!goal && controls.length === 0 && tips.length === 0 && (
            <p className="text-sm text-muted-foreground">
              This one is pick-up-and-play — just dive in and experiment! 🎮
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
