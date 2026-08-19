"use client";

import * as React from "react";
import Link from "next/link";
import {
  Download,
  FileUp,
  Link2,
  Lock,
  LogOut,
  Pencil,
  Play,
  Plus,
  Save,
  Trash2,
  Code2,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  ADMIN_PASSWORD,
  EMOJIS,
  TONES,
  TONE_CLASSES,
  type Game,
  type PastelTone,
} from "@/lib/games";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

type SourceMode = "file" | "path" | "paste";

export default function AdminPage() {
  const [unlocked, setUnlocked] = React.useState(false);

  React.useEffect(() => {
    setUnlocked(sessionStorage.getItem("arcade.admin") === "1");
  }, []);

  return (
    <>
      <Navbar />
      {unlocked ? (
        <AdminPanel onLock={() => setUnlocked(false)} />
      ) : (
        <Gate onUnlock={() => setUnlocked(true)} />
      )}
    </>
  );
}

/* ---------------- password gate ---------------- */
function Gate({ onUnlock }: { onUnlock: () => void }) {
  const [pw, setPw] = React.useState("");

  const submit = () => {
    if (pw === ADMIN_PASSWORD) {
      sessionStorage.setItem("arcade.admin", "1");
      onUnlock();
    } else {
      toast.error("Wrong password");
    }
  };

  return (
    <main className="container grid place-items-center py-24">
      <Card className="w-full max-w-sm p-8 text-center">
        <div className="mx-auto grid size-16 place-items-center rounded-3xl bg-primary text-3xl shadow-clay-sm">
          🔐
        </div>
        <h1 className="mt-5 font-display text-2xl font-bold">Admin access</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Enter the password to manage games.
        </p>
        <div className="mt-6 space-y-2 text-left">
          <Label htmlFor="pw">Password</Label>
          <Input
            id="pw"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            placeholder="Enter password…"
          />
          <p className="text-xs text-muted-foreground">
            Default is <code className="rounded bg-muted px-1.5 py-0.5">arcade</code>{" "}
            — change it in <code className="rounded bg-muted px-1.5 py-0.5">lib/games.ts</code>.
          </p>
        </div>
        <Button onClick={submit} className="mt-6 w-full">
          <Lock /> Unlock
        </Button>
      </Card>
    </main>
  );
}

/* ---------------- admin panel ---------------- */
const emptyForm = {
  title: "",
  description: "",
  category: "",
  emoji: EMOJIS[0],
  tone: "lilac" as PastelTone,
};

function AdminPanel({ onLock }: { onLock: () => void }) {
  const store = useStore();
  const [form, setForm] = React.useState(emptyForm);
  const [sourceMode, setSourceMode] = React.useState<SourceMode>("file");
  const [path, setPath] = React.useState("");
  const [html, setHtml] = React.useState("");
  const [fileName, setFileName] = React.useState<string | null>(null);
  const [helpText, setHelpText] = React.useState("");
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [tab, setTab] = React.useState("add");
  const fileInput = React.useRef<HTMLInputElement>(null);

  const reset = () => {
    setForm(emptyForm);
    setSourceMode("file");
    setPath("");
    setHtml("");
    setFileName(null);
    setHelpText("");
    setEditingId(null);
    if (fileInput.current) fileInput.current.value = "";
  };

  const onFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      setHtml(String(reader.result));
      setFileName(`${file.name} · ${Math.round(file.size / 1024)} KB`);
      if (!form.title) setForm((f) => ({ ...f, title: file.name.replace(/\.html?$/i, "") }));
      toast.success("File loaded");
    };
    reader.onerror = () => toast.error("Couldn't read that file");
    reader.readAsText(file);
  };

  const save = () => {
    if (!form.title.trim()) return toast.error("Please enter a title");

    const base = {
      title: form.title.trim(),
      description: form.description.trim(),
      category: form.category.trim() || "Game",
      emoji: form.emoji,
      tone: form.tone,
      help: helpText.trim()
        ? { tips: helpText.split("\n").map((s) => s.trim()).filter(Boolean) }
        : undefined,
    };

    let payload: Partial<Game>;
    if (sourceMode === "path") {
      if (!path.trim()) return toast.error("Enter a file path or URL");
      payload = { ...base, src: path.trim(), html: "" };
    } else if (sourceMode === "paste") {
      if (!html.trim()) return toast.error("Paste the game HTML first");
      payload = { ...base, html: html.trim(), src: "" };
    } else {
      const existing = editingId ? store.getGame(editingId)?.html : "";
      const finalHtml = html || existing;
      if (!finalHtml) return toast.error("Choose an .html file first");
      payload = { ...base, html: finalHtml, src: "" };
    }

    try {
      if (editingId) {
        store.updateCustomGame(editingId, payload);
        toast.success("Game updated");
      } else {
        store.addCustomGame(payload as Omit<Game, "id" | "builtin" | "createdAt">);
        toast.success("Game added — it's live in the arcade! 🎉");
      }
      reset();
      setTab("manage");
    } catch {
      toast.error("Storage full — try the File path option for big games");
    }
  };

  const startEdit = (g: Game) => {
    setEditingId(g.id);
    setForm({
      title: g.title,
      description: g.description,
      category: g.category,
      emoji: g.emoji,
      tone: g.tone,
    });
    setHelpText((g.help?.tips ?? []).join("\n"));
    if (g.html) {
      setSourceMode("file");
      setHtml(g.html);
      setFileName(`Embedded HTML · ${Math.round(g.html.length / 1024)} KB (upload to replace)`);
    } else {
      setSourceMode("path");
      setPath(g.src ?? "");
    }
    setTab("add");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const exportJson = () => {
    if (store.custom.length === 0) return toast.error("No added games to export");
    const blob = new Blob([JSON.stringify(store.custom, null, 2)], {
      type: "application/json",
    });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "clay-arcade-games.json";
    a.click();
    toast.success("Exported");
  };

  const lock = () => {
    sessionStorage.removeItem("arcade.admin");
    onLock();
  };

  return (
    <main className="container py-10">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-extrabold tracking-tight">
            Admin studio
          </h1>
          <p className="text-sm text-muted-foreground">
            Add, upload and manage the games in your arcade.
          </p>
        </div>
        <Button variant="soft" size="sm" onClick={lock}>
          <LogOut /> Lock
        </Button>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="add">
            <Plus className="size-4" /> {editingId ? "Edit game" : "Add game"}
          </TabsTrigger>
          <TabsTrigger value="manage">Manage games</TabsTrigger>
        </TabsList>

        {/* ---- add / edit ---- */}
        <TabsContent value="add">
          <div className="grid min-w-0 grid-cols-1 gap-6 lg:grid-cols-[1.15fr_.85fr]">
            <Card className="p-6">
              <div className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="title">
                    Game title <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="title"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="e.g. Asteroid Blaster"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="desc">Description</Label>
                  <Textarea
                    id="desc"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="A short blurb shown on the game card…"
                    className="min-h-[72px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="help">How to play (optional)</Label>
                  <Textarea
                    id="help"
                    value={helpText}
                    onChange={(e) => setHelpText(e.target.value)}
                    placeholder={"One rule or control per line, e.g.\nArrow keys — move\nSpace — jump"}
                    className="min-h-[72px]"
                  />
                  <p className="text-xs text-muted-foreground">
                    Shown in the game&apos;s “How to play” popup. One line per tip.
                    Or embed a <code className="rounded bg-muted px-1 py-0.5">&lt;script id=&quot;game-help&quot;&gt;</code> block
                    in the game&apos;s HTML and it&apos;s picked up automatically.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="cat">Category</Label>
                    <Input
                      id="cat"
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                      placeholder="e.g. Arcade"
                      list="cats"
                    />
                    <datalist id="cats">
                      {store.categories.map((c) => (
                        <option key={c} value={c} />
                      ))}
                    </datalist>
                  </div>
                  <div className="space-y-2">
                    <Label>Pastel tone</Label>
                    <div className="flex flex-wrap gap-2">
                      {TONES.map((t) => (
                        <button
                          key={t}
                          type="button"
                          aria-label={t}
                          onClick={() => setForm({ ...form, tone: t })}
                          className={cn(
                            "size-9 rounded-2xl shadow-clay-sm transition-transform",
                            TONE_CLASSES[t].bg,
                            form.tone === t
                              ? "ring-2 ring-foreground/40 ring-offset-2 ring-offset-background"
                              : "hover:-translate-y-0.5"
                          )}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Icon</Label>
                  <div className="flex flex-wrap gap-2">
                    {EMOJIS.map((e) => (
                      <button
                        key={e}
                        type="button"
                        onClick={() => setForm({ ...form, emoji: e })}
                        className={cn(
                          "grid size-10 place-items-center rounded-xl bg-muted text-lg transition-transform",
                          form.emoji === e
                            ? "shadow-clay-sm ring-2 ring-primary"
                            : "hover:-translate-y-0.5"
                        )}
                      >
                        {e}
                      </button>
                    ))}
                  </div>
                </div>

                {/* source */}
                <div className="space-y-3">
                  <Label>
                    How should the game load?{" "}
                    <span className="text-destructive">*</span>
                  </Label>
                  <Tabs
                    value={sourceMode}
                    onValueChange={(v) => setSourceMode(v as SourceMode)}
                  >
                    <TabsList>
                      <TabsTrigger value="file">
                        <FileUp className="size-4" /> Upload
                      </TabsTrigger>
                      <TabsTrigger value="path">
                        <Link2 className="size-4" /> Path / URL
                      </TabsTrigger>
                      <TabsTrigger value="paste">
                        <Code2 className="size-4" /> Paste HTML
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="file" className="mt-4">
                      <input
                        ref={fileInput}
                        type="file"
                        accept=".html,.htm"
                        className="hidden"
                        onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={() => fileInput.current?.click()}
                      >
                        <FileUp /> Choose an .html file…
                      </Button>
                      <p className="mt-2 text-xs text-muted-foreground">
                        {fileName ? (
                          <span className="font-semibold text-foreground">✅ {fileName}</span>
                        ) : (
                          "The whole game is embedded & stored in this browser — perfect for single-file Three.js games."
                        )}
                      </p>
                    </TabsContent>

                    <TabsContent value="path" className="mt-4">
                      <Input
                        value={path}
                        onChange={(e) => setPath(e.target.value)}
                        placeholder="/games/mygame.html  or  https://example.com/game"
                      />
                      <p className="mt-2 text-xs text-muted-foreground">
                        Point to a file in <code className="rounded bg-muted px-1 py-0.5">public/games/</code>{" "}
                        or any hosted URL. Best for permanent games shared with everyone.
                      </p>
                    </TabsContent>

                    <TabsContent value="paste" className="mt-4">
                      <Textarea
                        value={html}
                        onChange={(e) => setHtml(e.target.value)}
                        placeholder="<!DOCTYPE html> … paste the full game HTML here …"
                        className="min-h-[140px] font-mono text-xs"
                      />
                    </TabsContent>
                  </Tabs>
                </div>

                <div className="flex gap-3 pt-1">
                  <Button onClick={save}>
                    <Save /> {editingId ? "Update game" : "Save game"}
                  </Button>
                  {editingId && (
                    <Button variant="ghost" onClick={reset}>
                      <X /> Cancel edit
                    </Button>
                  )}
                </div>
              </div>
            </Card>

            {/* live preview */}
            <div className="space-y-4">
              <h3 className="font-display text-lg font-bold">Live preview</h3>
              <PreviewCard form={form} />
              <Card className="bg-muted/40 p-5">
                <p className="text-sm leading-relaxed text-muted-foreground">
                  💡 <b className="text-foreground">Tip:</b> for a game everyone can
                  play, drop the <code className="rounded bg-muted px-1 py-0.5">.html</code>{" "}
                  file into <code className="rounded bg-muted px-1 py-0.5">public/games/</code>{" "}
                  and use the <b className="text-foreground">Path / URL</b> option.
                  Uploaded &amp; pasted games are saved in this browser only.
                </p>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* ---- manage ---- */}
        <TabsContent value="manage">
          <Card className="p-6">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="font-display text-lg font-bold">All games</h3>
                <p className="text-sm text-muted-foreground">
                  Built-in games are protected. Added games can be edited or removed.
                </p>
              </div>
              <Button variant="soft" size="sm" onClick={exportJson}>
                <Download /> Export added (JSON)
              </Button>
            </div>

            <div className="space-y-3">
              {store.allGames.map((g) => (
                <div
                  key={g.id}
                  className="flex items-center gap-4 rounded-2xl bg-muted/40 p-3 shadow-clay-inset"
                >
                  <div
                    className={cn(
                      "grid size-12 shrink-0 place-items-center rounded-2xl text-2xl shadow-clay-sm",
                      TONE_CLASSES[g.tone].bg
                    )}
                  >
                    {g.emoji}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="truncate font-display font-bold">{g.title}</h4>
                      <Badge variant={g.builtin ? "secondary" : "default"}>
                        {g.builtin ? "Built-in" : "Added"}
                      </Badge>
                    </div>
                    <p className="truncate text-xs text-muted-foreground">
                      {g.category} · {g.html ? "Embedded HTML" : g.src} ·{" "}
                      {store.playCount(g.id)} plays
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <Button asChild variant="ghost" size="icon-sm" aria-label="Play">
                      <Link href={`/play/${g.id}`}>
                        <Play />
                      </Link>
                    </Button>
                    {!g.builtin && (
                      <>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          aria-label="Edit"
                          onClick={() => startEdit(g)}
                        >
                          <Pencil />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          aria-label="Delete"
                          className="text-destructive hover:bg-destructive/15"
                          onClick={() => {
                            if (confirm(`Delete “${g.title}”? This can't be undone.`)) {
                              store.removeCustomGame(g.id);
                              toast("Game deleted");
                            }
                          }}
                        >
                          <Trash2 />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  );
}

function PreviewCard({ form }: { form: typeof emptyForm }) {
  const tone = TONE_CLASSES[form.tone];
  return (
    <div className="clay overflow-hidden p-0">
      <div className={cn("relative grid h-40 place-items-center rounded-clay", tone.bg)}>
        <span className="pointer-events-none absolute -left-6 -top-8 size-24 rounded-full bg-white/40 blur-xl" />
        <span className="text-6xl drop-shadow-sm">{form.emoji}</span>
        <Badge
          variant="soft"
          className="absolute left-3 top-3 bg-background/85 text-foreground backdrop-blur"
        >
          {form.category || "Game"}
        </Badge>
      </div>
      <div className="space-y-1.5 p-5">
        <h3 className="font-display text-lg font-bold">
          {form.title || "Your game title"}
        </h3>
        <p className="text-sm text-muted-foreground">
          {form.description || "Your description will appear here."}
        </p>
      </div>
    </div>
  );
}
