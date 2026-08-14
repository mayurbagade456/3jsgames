import type { Metadata } from "next";
import { Nunito, Baloo_2 } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { StoreProvider } from "@/lib/store";
import { Toaster } from "@/components/ui/sonner";

const sans = Nunito({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const display = Baloo_2({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ClayArcade — play, chill, repeat",
  description:
    "A tiny pastel arcade of browser games. Pick one, waste ten good minutes, and get back to it.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${sans.variable} ${display.variable}`}>
      <body className="font-sans">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <StoreProvider>
            {/* soft pastel background blobs */}
            <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
              <div className="absolute -left-24 -top-24 size-96 rounded-full bg-lilac/50 blur-3xl animate-blob" />
              <div className="absolute right-[-6rem] top-10 size-96 rounded-full bg-blush/40 blur-3xl animate-blob [animation-delay:3s]" />
              <div className="absolute bottom-[-8rem] left-1/3 size-96 rounded-full bg-mint/40 blur-3xl animate-blob [animation-delay:6s]" />
              <div className="absolute inset-0 dotted opacity-60" />
            </div>
            {children}
            <Toaster position="bottom-center" />
          </StoreProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
