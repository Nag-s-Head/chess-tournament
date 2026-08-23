import { Heading, Text } from "@/lib/components/Typography";
import { TicketButton } from "@/lib/components/TicketButton";
import { Footer } from "@/lib/components/Footer";
import {
  TOURNAMENT_DATE_TIME,
  TOURNAMENT_NAME,
  TOURNAMENT_TAGLINE,
} from "@/lib/constants";

export default function Home() {
  return (
    <div className="flex flex-col flex-1">
      <section className="relative flex flex-col items-center justify-end min-h-screen overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/hero.webp')" }}
        />

        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,0.6)_100%)]" />

        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[70%] bg-gradient-to-t from-zinc-950 via-zinc-950/90 to-transparent backdrop-blur-[2px]"
          style={{
            maskImage: "linear-gradient(to top, black 40%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to top, black 40%, transparent 100%)",
          }}
        />

        <div className="relative z-10 flex flex-col items-center gap-6 px-6 pb-20 pt-40 text-center max-w-4xl mx-auto">
          <Heading
            as="h1"
            size="xl"
            className="animate-fade-in-up text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)]"
            style={{
              textShadow:
                "0 2px 12px rgba(0,0,0,0.9), 0 4px 32px rgba(0,0,0,0.6)",
            }}
          >
            {TOURNAMENT_NAME}
          </Heading>

          <Text
            size="lg"
            className="max-w-2xl animate-fade-in-up [animation-delay:200ms] text-zinc-200 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
            style={{
              textShadow:
                "0 1px 8px rgba(0,0,0,0.9), 0 2px 16px rgba(0,0,0,0.5)",
            }}
          >
            {TOURNAMENT_DATE_TIME}
          </Text>

          <Text
            size="lg"
            className="max-w-2xl animate-fade-in-up [animation-delay:200ms] text-zinc-200 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
            style={{
              textShadow:
                "0 1px 8px rgba(0,0,0,0.9), 0 2px 16px rgba(0,0,0,0.5)",
            }}
          >
            {TOURNAMENT_TAGLINE}
          </Text>

          <div className="animate-fade-in-up [animation-delay:400ms] mt-4">
            <TicketButton />
          </div>
        </div>
      </section>

      <section className="relative py-24 px-6 bg-zinc-950">
        <div className="mx-auto max-w-4xl">
          <Heading
            as="h2"
            size="lg"
            className="text-center mb-12 bg-gradient-to-r from-zinc-100 to-zinc-400 bg-clip-text text-transparent"
          >
            What is {TOURNAMENT_NAME}?
          </Heading>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <InfoCard
              emoji="♟️"
              title="Knockout Format"
              description="Players get put into two groups after an initial round, then both groups play until we have two contenders for a winner in the grand finale."
            />
            <InfoCard
              emoji="🏆"
              title="All Skill Levels"
              description="Players of all skill levels are welcome and will have plenty of fun."
            />
            <InfoCard
              emoji="🎉"
              title="More Than Chess"
              description="We are raising money for charity, as well as enjoying a fun night of chess."
            />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

interface InfoCardProps {
  emoji: string;
  title: string;
  description: string;
}

function InfoCard({ emoji, title, description }: InfoCardProps) {
  return (
    <div className="group rounded-2xl border border-white/5 bg-white/[0.02] p-6 transition-all duration-300 hover:border-amber-500/20 hover:bg-white/[0.04]">
      <div className="mb-4 text-4xl" aria-hidden="true">
        {emoji}
      </div>
      <Heading as="h3" size="sm" className="mb-2 text-zinc-100">
        {title}
      </Heading>
      <Text size="sm" variant="muted" className="text-zinc-500">
        {description}
      </Text>
    </div>
  );
}
