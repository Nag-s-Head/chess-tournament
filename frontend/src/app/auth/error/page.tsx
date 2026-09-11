import Link from "next/link";
import { Heading, Text } from "@/lib/components/Typography";

const reasons: Record<string, { title: string; description: string }> = {
  not_member: {
    title: "Access Denied",
    description:
      "Your GitHub account is not a member of the required organisation. Contact an administrator if you believe this is an error.",
  },
  invalid_session: {
    title: "Invalid Session",
    description:
      "Your session token is invalid or has expired. Please sign in again.",
  },
  token_exchange: {
    title: "Authentication Failed",
    description:
      "We were unable to complete the OAuth exchange with GitHub. Please try again.",
  },
  user_info: {
    title: "Could Not Fetch Profile",
    description:
      "We were unable to retrieve your GitHub profile. Please try again.",
  },
  org_check: {
    title: "Organisation Check Failed",
    description:
      "We were unable to verify your organisation membership. Please try again later.",
  },
  db_error: {
    title: "Server Error",
    description:
      "An internal error occurred while logging you in. Please try again.",
  },
  backend_error: {
    title: "Server Error",
    description:
      "An internal error occurred while logging you in. Please try again.",
  },
  no_code: {
    title: "Missing Authorisation Code",
    description:
      "No authorisation code was received from GitHub. Please start the login flow again.",
  },
};

const defaultReason = {
  title: "Authentication Error",
  description: "Something went wrong during sign-in. Please try again.",
};

interface SearchParams {
  reason?: string;
}

export default function AuthErrorPage({
  searchParams,
}: {
  searchParams?: SearchParams;
}) {
  return (
    <>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(239,68,68,0.06)_0%,transparent_70%)]" />

      <div className="relative z-10 w-full max-w-md p-8 rounded-3xl border border-rose-500/20 bg-rose-500/5 backdrop-blur-xl shadow-2xl flex flex-col items-center text-center">
        <div className="w-16 h-16 mb-6 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-3xl">
          ⛔
        </div>

        <ContentFromParams searchParams={searchParams} />

        <Link
          href="/auth/login"
          className="mt-8 w-full py-3.5 px-6 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold transition-colors flex items-center justify-center gap-2"
        >
          ← Back to Sign In
        </Link>
      </div>
    </>
  );
}

function ContentFromParams({ searchParams }: { searchParams?: SearchParams }) {
  const key = searchParams?.reason ?? "";
  const { title, description } = reasons[key] ?? defaultReason;

  return (
    <>
      <Heading as="h1" size="md" className="mb-2 text-rose-400">
        {title}
      </Heading>
      <Text size="sm" variant="muted" className="text-zinc-400">
        {description}
      </Text>
    </>
  );
}
