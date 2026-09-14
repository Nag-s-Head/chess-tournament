import { apiClient } from "@/lib/api/api";
import { Footer } from "@/lib/components/Footer";
import { Heading, Text } from "@/lib/components/Typography";
import { Logger } from "@/lib/logger/logger";
import Link from "next/link";

export const dynamic = "force-dynamic";

const logger = new Logger();

export default async function Page() {
  const backendStatus = await apiClient.health
    .getHealthCheck()
    .then((x) => {
      const good = !!x.data?.status;
      if (!good) {
        x.text().then((text) =>
          logger.error("Health check failed", {
            good,
            text,
          }),
        );
      }
      return good;
    })
    .catch((error: unknown) => {
      logger.error("Cannot get backend status", { error });
      return false;
    });

  return (
    <div className="flex flex-col min-h-screen bg-zinc-950 text-white">
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-16 relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(239,68,68,0.06)_0%,transparent_70%)]" />

        <div className="relative z-10 w-full max-w-md p-8 rounded-3xl border border-rose-500/20 bg-rose-500/5 backdrop-blur-xl shadow-2xl flex flex-col items-center text-center">
          <div className="w-16 h-16 mb-6 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-3xl">
            📡
          </div>
          <Heading>System Status</Heading>
          <Text className="text-green-500">Frontend Status: OK</Text>
          <Text className={backendStatus ? "text-green-500" : "text-red-500"}>
            Backend Status: {backendStatus ? "OK" : "FAILED"}
          </Text>

          <Link
            href="/"
            className="mt-8 w-full py-3.5 px-6 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold transition-colors flex items-center justify-center gap-2"
          >
            ← Back to home page
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
