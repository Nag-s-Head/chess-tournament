import { ReactNode } from "react";
import { Footer } from "@/lib/components/Footer";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-zinc-950 text-white">
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-16 relative overflow-hidden">
        {children}
      </main>
      <Footer />
    </div>
  );
}
