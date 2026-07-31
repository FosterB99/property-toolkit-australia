"use client";

import { useState } from "react";
import Link from "next/link";
import { NavLink } from "./NavLink";

const links = [
  { href: "/", label: "Home" },
  { href: "/buy", label: "Buy" },
  { href: "/invest", label: "Invest" },
  { href: "/grants", label: "Grants" },
  { href: "/renovate", label: "Renovate" },
  { href: "/calculators", label: "Calculators" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function SiteNav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3" onClick={() => setIsOpen(false)}>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-emerald-600 to-sky-600 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20">
            PT
          </div>
          <div>
            <p className="text-base font-semibold tracking-tight text-slate-900">Property Toolkit</p>
            <p className="text-sm text-slate-500">Australia</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          {links.map((link) => (
            <NavLink key={link.href} href={link.href} label={link.label} />
          ))}
        </nav>

        <button
          type="button"
          className="rounded-full border border-slate-200 p-2 text-slate-700 transition hover:border-emerald-300 hover:text-emerald-700 md:hidden"
          aria-expanded={isOpen}
          aria-label="Toggle navigation"
          onClick={() => setIsOpen((value) => !value)}
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
            {isOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6 6 18" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </button>
      </div>

      {isOpen ? (
        <div className="border-t border-slate-200/80 bg-white/95 md:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4 sm:px-6">
            {links.map((link) => (
              <NavLink
                key={link.href}
                href={link.href}
                label={link.label}
                onNavigate={() => setIsOpen(false)}
                className="w-full"
              />
            ))}
          </nav>
        </div>
      ) : null}
    </header>
  );
}
