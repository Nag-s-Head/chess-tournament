import { Heading, Text } from "@/lib/components/Typography";

export default function AdminPage() {
  return (
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
  );
}
