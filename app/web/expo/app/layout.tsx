import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SiteShell } from "@/components/layout/site-shell";
import { expoTheme } from "@/lib/theme";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Expo | Management Dashboard",
  description:
    "MVP web experience for managing expo events, booths, and team operations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      style={{
        ["--theme-background" as string]: expoTheme.colors.background,
        ["--theme-surface" as string]: expoTheme.colors.surface,
        ["--theme-surface-muted" as string]: expoTheme.colors.surfaceMuted,
        ["--theme-border" as string]: expoTheme.colors.border,
        ["--theme-text-primary" as string]: expoTheme.colors.textPrimary,
        ["--theme-text-secondary" as string]: expoTheme.colors.textSecondary,
        ["--theme-brand" as string]: expoTheme.colors.brand,
        ["--theme-brand-muted" as string]: expoTheme.colors.brandMuted,
        ["--theme-success" as string]: expoTheme.colors.success,
        ["--theme-warning" as string]: expoTheme.colors.warning,
        ["--theme-danger" as string]: expoTheme.colors.danger,
        ["--theme-radius-sm" as string]: expoTheme.radius.sm,
        ["--theme-radius-md" as string]: expoTheme.radius.md,
        ["--theme-radius-lg" as string]: expoTheme.radius.lg,
        ["--theme-radius-pill" as string]: expoTheme.radius.pill,
        ["--theme-shadow-sm" as string]: expoTheme.shadow.sm,
        ["--theme-shadow-md" as string]: expoTheme.shadow.md,
        ["--theme-spacing-section" as string]: expoTheme.spacing.section,
      }}
    >
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Icons&family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
      </head>
      <body className="flex min-h-full flex-col bg-[var(--theme-background)] text-[var(--theme-text-primary)] font-sans">
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
