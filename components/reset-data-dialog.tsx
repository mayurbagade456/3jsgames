"use client";

import * as React from "react";
import { Gamepad2, Star, Trash2, Info } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

// localStorage keys that belong to the site itself (not game saves)
const ARCADE_PREFIX = "arcade.";
const SYSTEM_KEYS = ["theme"]; // next-themes

type Mode = "games" | "arcade" | "all";

export function ResetDataDialog({ trigger }: { trigger: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const [counts, setCounts] = React.useState({ games: 0, arcade: 0 });

  React.useEffect(() => {
    if (!open) return;
    const keys = Object.keys(localStorage);
    setCounts({
      arcade: keys.filter((k) => k.startsWith(ARCADE_PREFIX)).length,
      games: keys.filter(
        (k) => !k.startsWith(ARCADE_PREFIX) && !SYSTEM_KEYS.includes(k)
      ).length,
    });
  }, [open]);

  const clear = (mode: Mode) => {
    if (mode === "all" && !window.confirm("Erase ALL saved data for this arcade? This can't be undone.")) {
      return;
    }
    const keys = Object.keys(localStorage);
    if (mode === "games") {
      keys
        .filter((k) => !k.startsWith(ARCADE_PREFIX) && !SYSTEM_KEYS.includes(k))
        .forEach((k) => localStorage.removeItem(k));
    } else if (mode === "arcade") {
      keys.filter((k) => k.startsWith(ARCADE_PREFIX)).forEach((k) => localStorage.removeItem(k));
    } else {
      keys
        .filter((k) => !SYSTEM_KEYS.includes(k))
        .forEach((k) => localStorage.removeItem(k));
    }
    setOpen(false);
    toast.success("Data cleared — refreshing…", { icon: "🧹" });
    window.setTimeout(() => window.location.reload(), 700);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Reset your data</DialogTitle>
          <DialogDescription>
            Everything is saved only in this browser — nothing leaves your device.
            Pick what you&apos;d like to clear.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-3">
          <Button
            variant="soft"
            className="h-auto justify-start gap-3 py-3 text-left"
            onClick={() => clear("games")}
          >
            <Gamepad2 className="shrink-0" />
            <span className="flex-1">
              <span className="block font-bold">Clear game progress</span>
              <span className="block text-xs font-normal text-muted-foreground">
                High scores, coins &amp; in-game saves ({counts.games} item
                {counts.games === 1 ? "" : "s"})
              </span>
            </span>
          </Button>

          <Button
            variant="soft"
            className="h-auto justify-start gap-3 py-3 text-left"
            onClick={() => clear("arcade")}
          >
            <Star className="shrink-0" />
            <span className="flex-1">
              <span className="block font-bold">Clear favorites &amp; history</span>
              <span className="block text-xs font-normal text-muted-foreground">
                Favorites, play counts &amp; “continue playing”
              </span>
            </span>
          </Button>

          <Button
            variant="destructive"
            className="h-auto justify-start gap-3 py-3 text-left"
            onClick={() => clear("all")}
          >
            <Trash2 className="shrink-0" />
            <span className="flex-1">
              <span className="block font-bold">Erase everything</span>
              <span className="block text-xs font-normal opacity-80">
                Wipes all of the above (added games too)
              </span>
            </span>
          </Button>
        </div>

        <p className="flex items-center gap-2 text-xs text-muted-foreground">
          <Info className="size-3.5 shrink-0" />
          Uploaded games run in a sandbox, so their saves clear on their own too.
        </p>
      </DialogContent>
    </Dialog>
  );
}
