import Link from "next/link";
import { Heading, Text } from "@/lib/components/Typography";
import { Footer } from "@/lib/components/Footer";

export default function AdminPage() {
  return (
    <div className="flex flex-col min-h-screen bg-zinc-950 text-white">
      <header className="border-b border-white/10 bg-zinc-900/50 backdrop-blur-md px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">♟️</span>
            <Heading as="h1" size="sm" className="text-zinc-100">
              Admin Dashboard
            </Heading>
          </div>
          <Link
            href="/auth/logout"
            className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm font-medium transition-colors"
          >
            Sign Out
          </Link>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6 py-16">
        <div className="w-full max-w-md p-8 rounded-3xl border border-emerald-500/20 bg-emerald-500/5 text-center shadow-2xl">
          <div className="w-16 h-16 mb-6 mx-auto rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-3xl">
            ✅
          </div>
          <Heading as="h2" size="md" className="mb-3 text-emerald-400">
            You are logged in
          </Heading>
          <Text size="sm" variant="muted" className="text-zinc-400">
            Tournament management features coming soon.
          </Text>
        </div>
      </main>

      <Footer />
    </div>
  );
}
