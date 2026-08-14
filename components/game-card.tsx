"use client";

import Link from "next/link";
import { Play, Star } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useStore } from "@/lib/store";
import { TONE_CLASSES, type Game } from "@/lib/games";
import { cn } from "@/lib/utils";

export function GameCard({ game, index = 0 }: { game: Game; index?: number }) {
  const { isFavorite, toggleFavorite, playCount } = useStore();
  const fav = isFavorite(game.id);
  const tone = TONE_CLASSES[game.tone];
  const plays = playCount(game.id);

  return (
    <div
      className="group clay flex flex-col overflow-hidden p-0 animate-fade-up"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {/* clay art panel */}
      <Link
        href={`/play/${game.id}`}
        className={cn(
          "relative grid h-40 place-items-center overflow-hidden rounded-clay",
          tone.bg
        )}
      >
        <span className="pointer-events-none absolute -left-6 -top-8 size-24 rounded-full bg-white/40 blur-xl" />
        <span className="pointer-events-none absolute -bottom-8 -right-4 size-24 rounded-full bg-black/5 blur-xl" />
        <span className="text-6xl drop-shadow-sm transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110">
          {game.emoji}
        </span>
        <Badge
          variant="soft"
          className="absolute left-3 top-3 bg-background/85 text-foreground backdrop-blur"
        >
          {game.category}
        </Badge>
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-lg font-bold leading-tight">
            {game.title}
          </h3>
          <button
            aria-label="Toggle favorite"
            onClick={() => {
              const added = toggleFavorite(game.id);
              toast(added ? "Added to favorites" : "Removed from favorites", {
                icon: added ? "⭐" : "🤍",
              });
            }}
            className="-m-1.5 shrink-0 rounded-full p-2 transition hover:scale-110"
          >
            <Star
              className={cn(
                "size-5 transition-colors",
                fav
                  ? "fill-butter text-butter"
                  : "text-muted-foreground/50"
              )}
            />
          </button>
        </div>

        <p className="flex-1 text-sm leading-relaxed text-muted-foreground">
          {game.description}
        </p>

        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Play className="size-3.5" /> {plays} play{plays === 1 ? "" : "s"}
          </span>
          <span>·</span>
          <span>{game.builtin ? "🎁 Built-in" : "✨ Added"}</span>
        </div>

        <Button asChild className="mt-2 w-full">
          <Link href={`/play/${game.id}`}>
            <Play className="fill-current" /> Play now
          </Link>
        </Button>
      </div>
    </div>
  );
}
