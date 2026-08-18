import Link from "next/link";

interface TicketButtonProps {
  className?: string;
}

export function TicketButton({ className = "" }: TicketButtonProps) {
  return (
    <Link
      href="#"
      title="Coming soon — tickets will be available on Pretix"
      className={`
        group relative inline-flex items-center justify-center
        rounded-full px-8 py-4
        text-lg font-bold tracking-wide
        text-zinc-950
        bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400
        shadow-lg shadow-amber-500/25
        transition-all duration-300
        hover:shadow-xl hover:shadow-amber-500/40
        hover:scale-105
        active:scale-100
        animate-ticket-glow
        ${className}
      `}
    >
      <span className="relative z-10 flex items-center gap-2">
        <TicketIcon />
        Get Tickets
      </span>
    </Link>
  );
}

function TicketIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
      <path d="M13 5v2" />
      <path d="M13 17v2" />
      <path d="M13 11v2" />
    </svg>
  );
}
