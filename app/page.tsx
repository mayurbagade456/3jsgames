"use client";

import * as React from "react";
import Link from "next/link";
import { Search, SlidersHorizontal, Sparkles, Star, Eraser } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { GameCard } from "@/components/game-card";
import { ResetDataDialog } from "@/components/reset-data-dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export default function HomePage() {
  const { ready, allGames, categories, favorites, totalPlays, recents, getGame } =
    useStore();
  const [query, setQuery] = React.useState("");
  const [cat, setCat] = React.useState("All");
  const [showFilters, setShowFilters] = React.useState(false);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return allGames.filter((g) => {
      if (cat !== "All" && g.category !== cat) return false;
      if (!q) return true;
      return (
        g.title.toLowerCase().includes(q) ||
        g.description.toLowerCase().includes(q) ||
        g.category.toLowerCase().includes(q)
      );
    });
  }, [allGames, query, cat]);

  const favGames = allGames.filter((g) => favorites.includes(g.id));
  const recentGames = recents
    .map((id) => getGame(id))
    .filter(Boolean)
    .slice(0, 4) as ReturnType<typeof getGame>[];

  const chips = ["All", ...categories];

  const renderChip = (c: string) => (
    <button
      key={c}
      onClick={() => {
        setCat(c);
        setShowFilters(false);
      }}
      className={cn(
        "rounded-full px-4 py-2 text-sm font-semibold transition-all",
        cat === c
          ? "bg-primary text-primary-foreground shadow-clay-sm"
          : "bg-card text-muted-foreground shadow-clay-sm hover:-translate-y-0.5"
      )}
    >
      {c}
    </button>
  );

  return (
    <>
      <Navbar />

      <main className="container pb-24">
        {/* hero */}
        <section className="relative py-9 text-center sm:py-14">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full bg-card px-4 py-1.5 text-xs font-semibold text-muted-foreground shadow-clay-sm">
            <Sparkles className="size-3.5 text-primary" />
            Free to play · no sign-up · just vibes
          </div>
          <h1 className="mx-auto mt-4 max-w-2xl font-display text-3xl font-extrabold leading-[1.05] tracking-tight text-balance sm:text-5xl">
            Take a break.{" "}
            <span className="text-primary">Play something soft.</span>
          </h1>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
            <Stat value={ready ? allGames.length : 0} label="Games" />
            <Dot />
            <Stat value={ready ? totalPlays : 0} label="Sessions" />
            <Dot />
            <Stat value={ready ? favorites.length : 0} label="Favorites" />
          </div>
        </section>

        {/* search + filters (flows with the page — not sticky) */}
        <div className="mb-8">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="game-search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setShowFilters(true)}
                placeholder="Search games…"
                className="pl-11"
              />
            </div>

            {/* mobile: collapse categories behind a filter button */}
            <Button
              type="button"
              size="icon"
              variant={cat !== "All" ? "default" : "soft"}
              aria-label="Filter by category"
              aria-expanded={showFilters}
              onClick={() => setShowFilters((v) => !v)}
              className="relative shrink-0 sm:hidden"
            >
              <SlidersHorizontal />
              {cat !== "All" && (
                <span className="absolute -right-0.5 -top-0.5 size-2.5 rounded-full bg-blush ring-2 ring-background" />
              )}
            </Button>

            {/* desktop: inline pills */}
            <div className="hidden flex-wrap gap-2 sm:flex">{chips.map(renderChip)}</div>
          </div>

          {/* mobile: revealed category suggestions */}
          {showFilters && (
            <div className="mt-3 flex flex-wrap gap-2 animate-fade-up sm:hidden">
              {chips.map(renderChip)}
            </div>
          )}
        </div>

        {/* continue playing */}
        {ready && recentGames.length > 0 && !query && cat === "All" && (
          <section className="mb-12">
            <SectionHead title="Continue playing" />
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {recentGames.map((g, i) => (
                <GameCard key={g!.id} game={g!} index={i} />
              ))}
            </div>
          </section>
        )}

        {/* favorites */}
        {ready && favGames.length > 0 && (
          <section className="mb-12">
            <SectionHead
              title="Your favorites"
              icon={<Star className="size-5 fill-butter text-butter" />}
              count={favGames.length}
            />
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {favGames.map((g, i) => (
                <GameCard key={g.id} game={g} index={i} />
              ))}
            </div>
          </section>
        )}

        {/* all games */}
        <section>
          <SectionHead
            title={query ? "Search results" : cat === "All" ? "All games" : cat}
            count={filtered.length}
          />
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((g, i) => (
                <GameCard key={g.id} game={g} index={i} />
              ))}
            </div>
          ) : (
            <div className="clay grid place-items-center gap-3 px-6 py-20 text-center">
              <span className="text-5xl">🧸</span>
              <h3 className="font-display text-xl font-bold">No games here yet</h3>
              <p className="max-w-xs text-sm text-muted-foreground">
                {query
                  ? "Try a different search."
                  : "Head to the admin panel to add your first one."}
              </p>
              <Button asChild variant="secondary" className="mt-2">
                <Link href="/admin">Open admin</Link>
              </Button>
            </div>
          )}
        </section>
      </main>

      <footer className="border-t border-border/60 py-10">
        <div className="container flex flex-col items-center justify-between gap-3 text-sm text-muted-foreground sm:flex-row">
          <span>Made with 🧸 clay, pastels & Three.js</span>
          <div className="flex items-center gap-4">
            <ResetDataDialog
              trigger={
                <button className="inline-flex items-center gap-1.5 font-semibold hover:text-foreground">
                  <Eraser className="size-4" /> Reset data
                </button>
              }
            />
            <Link href="/admin" className="font-semibold text-primary hover:underline">
              Are you the admin? Add a game →
            </Link>
          </div>
        </div>
      </footer>
    </>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div className="text-center">
      <div className="font-display text-3xl font-extrabold">{value}</div>
      <div className="text-xs uppercase tracking-wide text-muted-foreground">
        {label}
      </div>
    </div>
  );
}

function Dot() {
  return <span className="size-1.5 rounded-full bg-muted-foreground/30" />;
}

function SectionHead({
  title,
  count,
  icon,
}: {
  title: string;
  count?: number;
  icon?: React.ReactNode;
}) {
  return (
    <div className="mb-5 flex items-center gap-3">
      {icon}
      <h2 className="font-display text-2xl font-bold tracking-tight">{title}</h2>
      {count !== undefined && (
        <span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">
          {count}
        </span>
      )}
    </div>
  );
}
