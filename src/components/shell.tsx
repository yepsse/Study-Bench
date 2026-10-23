import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

export function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <header className="border-b border-line bg-navy text-paper">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4">
          <Link to="/" className="no-underline">
            <span className="font-display text-xl font-semibold tracking-tight text-paper">Study Bench</span>
          </Link>
          <p className="hidden text-sm text-teal-soft sm:block">Anatomy · Chemistry · Physics · English</p>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-6">{children}</main>
    </div>
  );
}
