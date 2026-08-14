"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, ChevronUp, Eraser, HelpCircle, Maximize, RotateCw, Star } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ResetDataDialog } from "@/components/reset-data-dialog";
import { HowToPlayDialog } from "@/components/how-to-play-dialog";
import { useStore, resolveGameSrc, loadGameHelp } from "@/lib/store";
import type { GameHelp } from "@/lib/games";
import { cn } from "@/lib/utils";

export default function PlayPage() {
  const params = useParams<{ id: string }>();
  const { ready, getGame, isFavorite, toggleFavorite, recordPlay } = useStore();

  const game = ready ? getGame(params.id) : undefined;
  const frameRef = React.useRef<HTMLIFrameElement>(null);
  const [src, setSrc] = React.useState<string | null>(null);
  const [help, setHelp] = React.useState<GameHelp | null>(null);
  const [barHidden, setBarHidden] = React.useState(false);
  const recorded = React.useRef(false);

  React.useEffect(() => {
    if (!ready) return;
    if (game) {
      setSrc(resolveGameSrc(game));
      loadGameHelp(game).then(setHelp);
      if (!recorded.current) {
        recordPlay(game.id);
        recorded.current = true;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, game?.id]);

  // reveal bar when the mouse hits the very top
  React.useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (barHidden && e.clientY < 6) setBarHidden(false);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [barHidden]);

  if (ready && !game) {
    return (
      <div className="grid min-h-dvh place-items-center bg-background p-6">
        <div className="clay grid max-w-md place-items-center gap-3 px-8 py-14 text-center">
          <span className="text-6xl">🫥</span>
          <h1 className="font-display text-2xl font-bold">Game not found</h1>
          <p className="text-sm text-muted-foreground">
            This game isn&apos;t available — it may have been removed.
          </p>
          <Button asChild variant="secondary" className="mt-2">
            <Link href="/">
              <ArrowLeft /> Back to the arcade
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const fav = game ? isFavorite(game.id) : false;

  const restart = () => {
    if (game) {
      setSrc(resolveGameSrc(game));
      toast("Game restarted", { icon: "🔄" });
    }
  };

  const fullscreen = () => {
    frameRef.current?.requestFullscreen?.();
  };

  return (
    <div className="fixed inset-0 flex flex-col bg-[#0a0a12]">
      {/* top control bar */}
      <div
        className={cn(
          "z-20 flex items-center gap-2 px-3 py-2.5 transition-transform duration-300",
          "bg-background/80 backdrop-blur-xl",
          barHidden && "-translate-y-full"
        )}
      >
        <Button asChild variant="soft" size="sm">
          <Link href="/">
            <ArrowLeft /> Arcade
          </Link>
        </Button>

        <div className="ml-1 flex min-w-0 items-center gap-2">
          <span className="text-xl">{game?.emoji ?? "🎮"}</span>
          <span className="truncate font-display font-bold">
            {game?.title ?? "Loading…"}
          </span>
        </div>

        <div className="flex-1" />

        {game && (
          <HowToPlayDialog
            game={game}
            help={help}
            trigger={
              <Button variant="soft" size="sm">
                <HelpCircle /> <span className="hidden sm:inline">How to play</span>
              </Button>
            }
          />
        )}
        <Button
          variant="soft"
          size="sm"
          onClick={() => {
            if (!game) return;
            const added = toggleFavorite(game.id);
            toast(added ? "Added to favorites" : "Removed from favorites", {
              icon: added ? "⭐" : "🤍",
            });
          }}
        >
          <Star className={cn("size-4", fav && "fill-butter text-butter")} />
          <span className="hidden sm:inline">{fav ? "Favorited" : "Favorite"}</span>
        </Button>
        <Button variant="soft" size="sm" onClick={restart}>
          <RotateCw /> <span className="hidden sm:inline">Restart</span>
        </Button>
        <Button variant="soft" size="sm" onClick={fullscreen}>
          <Maximize /> <span className="hidden sm:inline">Fullscreen</span>
        </Button>
        <ResetDataDialog
          trigger={
            <Button variant="soft" size="icon-sm" aria-label="Reset saved data">
              <Eraser />
            </Button>
          }
        />
        <Button
          variant="soft"
          size="icon-sm"
          aria-label="Hide bar"
          onClick={() => {
            setBarHidden(true);
            toast("Bar hidden — move mouse to the top to show it");
          }}
        >
          <ChevronUp />
        </Button>
      </div>

      {/* game frame */}
      <div className="relative flex-1">
        {src ? (
          <iframe
            ref={frameRef}
            src={src}
            title={game?.title ?? "Game"}
            className="absolute inset-0 size-full border-0 bg-black"
            allow="fullscreen; autoplay; gamepad"
          />
        ) : (
          <div className="grid size-full place-items-center text-muted-foreground">
            Loading…
          </div>
        )}
      </div>
    </div>
  );
}
