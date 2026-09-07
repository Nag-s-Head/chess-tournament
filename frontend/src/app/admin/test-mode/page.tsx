"use client";
import { Heading, Text } from "@/lib/components/Typography";
import { Footer } from "@/lib/components/Footer";
import { doLogin } from "./actions";
import { useRouter } from "next/navigation";

export default function TestModePage() {
  const router = useRouter();
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
            <button
              onClick={() => {
                doLogin("valid")
                  .then(() => {})
                  .catch((error: unknown) => {
                    console.error("Cannot login", error);
                  });
              }}
              className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition-colors text-sm"
            >
              Simulate Valid Admin Login
            </button>
            <button
              onClick={() => {
                router.replace("/auth-error?reason=token_exchange");
              }}
              className="w-full py-3 px-4 rounded-xl bg-rose-600/80 hover:bg-rose-600 text-white font-medium transition-colors text-sm"
            >
              Simulate Invalid Session Token
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
