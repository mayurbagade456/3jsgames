# 🧸 ClayArcade

A tiny **pastel claymorphism** arcade built with **Next.js (App Router)**, **Tailwind CSS**, and **shadcn/ui** — pick a game, waste ten good minutes, close the tab. Deployable to **Vercel** in one click.

## Run locally

```bash
npm install
npm run dev        # http://localhost:3000
```

```bash
npm run build      # production build
npm start          # serve the production build
```

## Deploy to Vercel

1. Push this folder to a GitHub repo.
2. On [vercel.com](https://vercel.com) → **Add New → Project** → import the repo.
3. Framework preset is auto-detected as **Next.js** — just hit **Deploy**. No env vars needed.

## Adding games

Go to **/admin** (default password `arcade`, change it in [`lib/games.ts`](lib/games.ts)). Three ways to add a game:

| Option | Where it's stored | Best for |
| --- | --- | --- |
| **Upload / Paste HTML** | this browser (localStorage) | quick personal tests |
| **Path / URL** | the file itself | games everyone can play |

For a **permanent** game shared with all visitors:

1. Drop the self-contained `.html` file into [`public/games/`](public/games).
2. In **/admin → Add game**, choose **Path / URL** and enter `/games/yourfile.html`.

Or hard-code it into the `BUILTIN_GAMES` array in [`lib/games.ts`](lib/games.ts) so it ships with the site.

## Project map

```
app/
  page.tsx           # hub — search, categories, favorites, recents
  play/[id]/page.tsx # immersive game player (iframe + clay control bar)
  admin/page.tsx     # add / upload / manage games
  layout.tsx         # fonts, theme, pastel background blobs
components/ui/        # shadcn primitives (clay-styled)
lib/games.ts          # built-in games + palette + admin password
lib/store.tsx         # client store (favorites, plays, custom games)
public/games/         # the actual game HTML files
```
