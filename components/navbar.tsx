"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Gamepad2, Search, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 200);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const focusSearch = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    window.setTimeout(() => document.getElementById("game-search")?.focus(), 320);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="container flex h-16 items-center gap-2 sm:gap-3">
        <Link href="/" className="flex items-center gap-2 font-display sm:gap-2.5">
          <span className="grid size-9 place-items-center rounded-2xl bg-primary text-lg shadow-clay-sm">
            🎮
          </span>
          <span className="text-base font-extrabold tracking-tight sm:text-lg">
            Clay<span className="text-primary">Arcade</span>
          </span>
        </Link>

        <div className="flex-1" />

        <nav className="flex items-center gap-1.5 sm:gap-2">
          {isHome && scrolled && (
            <Button
              variant="soft"
              size="icon"
              aria-label="Search games"
              onClick={focusSearch}
              className="animate-fade-up"
            >
              <Search />
            </Button>
          )}
          <Button
            asChild
            variant={!isAdmin ? "soft" : "ghost"}
            size="sm"
            className={cn("px-3 sm:px-4", !isAdmin && "text-foreground")}
          >
            <Link href="/">
              <Gamepad2 /> <span className="hidden sm:inline">Games</span>
            </Link>
          </Button>
          <Button
            asChild
            variant={isAdmin ? "soft" : "ghost"}
            size="sm"
            className="px-3 sm:px-4"
          >
            <Link href="/admin">
              <Settings /> <span className="hidden sm:inline">Admin</span>
            </Link>
          </Button>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
