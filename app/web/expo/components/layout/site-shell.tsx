"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { clearStoredAuth, getStoredAuth } from "@/lib/auth";

type SiteShellProps = {
  children: React.ReactNode;
};

export function SiteShell({ children }: SiteShellProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const refreshAuth = () => {
      setIsAuthenticated(Boolean(getStoredAuth()?.token));
    };

    refreshAuth();
    window.addEventListener("storage", refreshAuth);

    return () => {
      window.removeEventListener("storage", refreshAuth);
    };
  }, [pathname]);

  const navLinks = useMemo(
    () => [
      { href: "/", label: "Home" },
      { href: "/dashboard", label: "Dashboard" },
      ...(isAuthenticated
        ? []
        : [
            { href: "/login", label: "Log in" },
            { href: "/signup", label: "Sign up" },
          ]),
    ],
    [isAuthenticated],
  );

  const handleLogout = () => {
    clearStoredAuth();
    setIsAuthenticated(false);
    router.push("/login");
  };

  return (
    <>
      <header className="sticky top-0 z-20 border-b border-[var(--theme-border)] bg-[color:rgb(245_247_251_/_0.9)] backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-[var(--theme-text-primary)]">
            <Icon name="calendar_month" className="text-[22px] text-[var(--theme-brand)]" />
            Expo
          </Link>
          <nav aria-label="Main navigation">
            <ul className="flex items-center gap-1 sm:gap-2">
              {navLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="rounded-full px-3 py-1.5 text-sm text-[var(--theme-text-secondary)] transition hover:bg-white hover:text-[var(--theme-text-primary)]"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          {isAuthenticated ? (
            <Button
              variant="secondary"
              className="hidden sm:inline-flex"
              leadingIcon={<Icon name="logout" className="text-base" />}
              onClick={handleLogout}
            >
              Log out
            </Button>
          ) : null}
        </div>
      </header>
      {children}
      <footer className="mt-auto border-t border-[var(--theme-border)] bg-white">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4 text-xs text-[var(--theme-text-secondary)] sm:px-6">
          <p>© {new Date().getFullYear()} Expo Management System.</p>
          <p>Built for scale with reusable UI primitives.</p>
        </div>
      </footer>
    </>
  );
}
