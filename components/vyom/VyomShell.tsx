import { Orbit } from "lucide-react";
import Link from "next/link";
import { CosmicBackground } from "@/components/vyom/CosmicBackground";
import { VyomButton } from "@/components/vyom/VyomButton";

const links = [
  { href: "/", label: "Home" },
  { href: "/create", label: "Create" },
  { href: "/vault", label: "Vault" },
  { href: "/capsule/vyom-001", label: "Capsule Demo" },
];

export function VyomShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-vyom-black text-vyom-white">
      <CosmicBackground />
      <header className="fixed left-0 right-0 top-0 z-50 border-b border-white/[0.06] bg-[#02040a]/50 backdrop-blur-[3px]">
        <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />
        <nav className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-5 sm:px-8">
          <Link href="/" className="group flex items-center gap-3" aria-label="Vyom home">
            <span className="liquid-glass relative grid h-10 w-10 place-items-center !rounded-full">
              <span className="absolute inset-1 rounded-full border border-violet-200/8" />
              <Orbit className="h-4 w-4 text-cyan-100 transition duration-300 group-hover:rotate-45" aria-hidden="true" />
            </span>
            <span className="text-sm font-medium uppercase tracking-[0.22em] text-white/85">
              Vyom
            </span>
          </Link>

          <div className="hidden items-center gap-8 text-xs font-medium uppercase tracking-[0.14em] text-white/48 md:flex">
            {links.map((link) => (
              <Link key={link.href} href={link.href} className="transition duration-280 hover:text-cyan-100">
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden sm:block">
            <VyomButton href="/create" variant="ghost">
              Create capsule
            </VyomButton>
          </div>
        </nav>
      </header>
      {children}
    </main>
  );
}
