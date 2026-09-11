"use client";
import { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heading } from "@/lib/components/Typography";
import { Footer } from "@/lib/components/Footer";
import { logout } from "./layoutActions";

function formatSegment(segment: string) {
  return segment
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  // Extract path segments after '/admin' (max 2 levels deep)
  const segments = (pathname || "").split("/").filter(Boolean).slice(1, 3);

  return (
    <div className="flex flex-col min-h-screen bg-zinc-950 text-white">
      <header className="border-b border-white/10 bg-zinc-900/50 backdrop-blur-md px-6 py-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          {/* Top Row: Title Link + Breadcrumbs (Desktop) + Sign Out */}
          <div className="flex items-center justify-between w-full gap-4">
            <div className="flex items-center gap-3">
              {/* Logo & Title as a Link back to /admin */}
              <Link
                href="/admin"
                className="flex items-center gap-3 hover:opacity-90 transition-opacity"
              >
                <span className="text-2xl">♟️</span>
                <Heading as="h1" size="sm" className="text-zinc-100">
                  Admin Portal
                </Heading>
              </Link>

              {/* Breadcrumbs - Desktop (Inline) */}
              {segments.length > 0 && (
                <nav
                  aria-label="Breadcrumb"
                  className="hidden sm:flex items-center gap-2 text-sm text-zinc-400 pl-3 border-l border-white/10"
                >
                  {segments.map((segment, index) => {
                    const href = `/admin/${segments.slice(0, index + 1).join("/")}`;
                    const isLast = index === segments.length - 1;

                    return (
                      <div key={href} className="flex items-center gap-2">
                        <span>/</span>
                        {isLast ? (
                          <span className="text-zinc-200 font-medium">
                            {formatSegment(segment)}
                          </span>
                        ) : (
                          <Link
                            href={href}
                            className="hover:text-zinc-200 transition-colors"
                          >
                            {formatSegment(segment)}
                          </Link>
                        )}
                      </div>
                    );
                  })}
                </nav>
              )}
            </div>

            <button
              className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm font-medium transition-colors whitespace-nowrap ml-auto"
              onClick={() => {
                await logout();
              }}
            >
              Sign Out
            </button>
          </div>

          {/* Breadcrumbs - Mobile */}
          {segments.length > 0 && (
            <nav
              aria-label="Mobile Breadcrumb"
              className="flex sm:hidden items-center gap-2 text-xs text-zinc-400 pt-1 border-t border-white/5"
            >
              <Link href="/admin" className="hover:text-zinc-200">
                Dashboard
              </Link>
              {segments.map((segment, index) => {
                const href = `/admin/${segments.slice(0, index + 1).join("/")}`;
                const isLast = index === segments.length - 1;

                return (
                  <div key={href} className="flex items-center gap-2">
                    <span>/</span>
                    {isLast ? (
                      <span className="text-zinc-200 font-medium">
                        {formatSegment(segment)}
                      </span>
                    ) : (
                      <Link
                        href={href}
                        className="hover:text-zinc-200 transition-colors"
                      >
                        {formatSegment(segment)}
                      </Link>
                    )}
                  </div>
                );
              })}
            </nav>
          )}
        </div>
      </header>

      <main className="flex-1 flex flex-col px-6 py-10 max-w-6xl w-full mx-auto">
        {children}
      </main>

      <Footer />
    </div>
  );
}
