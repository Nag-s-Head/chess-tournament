import Link from "next/link";
import { Heading, Text } from "@/lib/components/Typography";
import { Footer } from "@/lib/components/Footer";

export default function TestModePage() {
  return (
    <div className="flex flex-col min-h-screen bg-zinc-950 text-white">
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-16">
        <div className="w-full max-w-md p-8 rounded-3xl border border-amber-500/20 bg-amber-500/5 text-center shadow-2xl">
          <div className="w-16 h-16 mb-6 mx-auto rounded-2xl bg-amber-500/10 flex items-center justify-center text-3xl">
            🧪
          </div>
          <Heading as="h1" size="md" className="mb-2 text-amber-400">
            Test Mode Login
          </Heading>
          <Text size="sm" variant="muted" className="mb-8">
            Select a precanned session mode to test authentication flows.
          </Text>

          <div className="flex flex-col gap-3">
            <Link
              href="/auth/test-login?session=valid"
              className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition-colors text-sm"
            >
              Simulate Valid Admin Login
            </Link>
            <Link
              href="/auth/test-login?session=invalid"
              className="w-full py-3 px-4 rounded-xl bg-rose-600/80 hover:bg-rose-600 text-white font-medium transition-colors text-sm"
            >
              Simulate Invalid Session Token
            </Link>
            <Link
              href="/auth/test-login?session=clear"
              className="w-full py-3 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-medium transition-colors text-sm"
            >
              Clear Session & Logout
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
