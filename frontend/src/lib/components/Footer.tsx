import { Text } from "@/lib/components/Typography";
import {
  SOURCE_CODE_URL,
  COPYRIGHT_HOLDER,
  COPYRIGHT_YEAR,
  LICENSE_NAME,
  LICENSE_URL,
} from "@/lib/constants";

interface FooterLink {
  label: string;
  href: string;
  external?: boolean;
  comingSoon?: boolean;
}

const footerLinks: FooterLink[] = [
  { label: "System Status", href: "/status" },
  { label: "Code of Conduct", href: "#", comingSoon: true },
  { label: "Source Code", href: SOURCE_CODE_URL, external: true },
  { label: "Sponsors", href: "#", comingSoon: true },
  { label: "FAQ", href: "#", comingSoon: true },
];

export function Footer() {
  return (
    <footer className="w-full border-t border-white/10 bg-zinc-950/80 backdrop-blur-md">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <nav aria-label="Footer navigation">
          <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            {footerLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="text-sm text-zinc-400 transition-colors hover:text-amber-400"
                  title={link.comingSoon ? "Coming soon" : undefined}
                  {...(link.external
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="my-6 h-px bg-white/5" />

        <Text size="sm" variant="muted" className="text-center text-zinc-500">
          © {COPYRIGHT_YEAR} {COPYRIGHT_HOLDER}. Licensed under the{" "}
          <a
            href={LICENSE_URL}
            className="underline underline-offset-2 transition-colors hover:text-amber-400"
            target="_blank"
            rel="noopener noreferrer"
          >
            {LICENSE_NAME}
          </a>
          .
        </Text>
      </div>
    </footer>
  );
}
