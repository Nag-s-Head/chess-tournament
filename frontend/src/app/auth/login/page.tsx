import Link from "next/link";
import { Heading, Text } from "@/lib/components/Typography";
import { apiClient } from "@/lib/api/api";
import { redirect } from "next/navigation";
import { Logger } from "@/lib/logger/logger";

export const dynamic = "force-dynamic";

const logger = new Logger();

export default async function LoginPage() {
  let isValid = false;
  try {
    isValid = !!(await apiClient.auth.getValidate()).data?.valid;
  } catch (error: unknown) {
    console.error("Checking if logged in failed", error);
  }

  if (isValid) {
    redirect("/admin");
  }

  let authUrl = "/auth/error?reason=backend_error";
  try {
    const resp = await apiClient.auth.getLogin();
    const data = resp.data;
    if (data?.url) {
      authUrl = data.url;
    }
  } catch (error: unknown) {
    console.error("Getting Login URL failed", error);
  }

  return (
    <>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.08)_0%,transparent_70%)]" />

      <div className="relative z-10 w-full max-w-md p-8 rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl shadow-2xl flex flex-col items-center text-center">
        <div className="w-16 h-16 mb-6 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-3xl">
          ♟️
        </div>

        <Heading as="h1" size="md" className="mb-2 text-zinc-100">
          Admin Portal
        </Heading>

        <Text size="sm" variant="muted" className="mb-8 text-zinc-400">
          Sign in with your authorized GitHub account to manage the knockout
          tournament.
        </Text>

        <Link
          href={authUrl}
          className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-semibold shadow-lg shadow-amber-500/20 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3"
        >
          <svg
            className="w-5 h-5 fill-current"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
          </svg>
          Continue with GitHub
        </Link>
      </div>
    </>
  );
}
