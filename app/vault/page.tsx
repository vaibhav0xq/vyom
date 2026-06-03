"use client";

import { ConnectButton, useCurrentAccount, useCurrentWallet, useWallets } from "@mysten/dapp-kit";
import { Plus, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { CapsuleCard } from "@/components/vyom/ProductSurfaces";
import { VyomButton } from "@/components/vyom/VyomButton";
import { VyomShell } from "@/components/vyom/VyomShell";
import { getCapsuleStatus } from "@/lib/capsule-utils";
import { useCapsules } from "@/hooks/useCapsules";

export default function VaultPage() {
  const currentAccount = useCurrentAccount();
  const { isConnecting } = useCurrentWallet();
  const suiWallets = useWallets();
  const { capsules, isLoading } = useCapsules(currentAccount?.address);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"all" | "locked" | "unlocked">("all");
  const hasVisibleCapsules = capsules.length > 0;
  const hasSuiWallet = suiWallets.length > 0;
  const statusOptions = [
    { value: "all", label: "All statuses" },
    { value: "locked", label: "Locked" },
    { value: "unlocked", label: "Unlocked" },
  ] as const;

  const filteredCapsules = useMemo(() => {
    return capsules.filter((capsule) => {
      const matchesQuery =
        capsule.title.toLowerCase().includes(query.toLowerCase()) ||
        capsule.recipient?.toLowerCase().includes(query.toLowerCase());
      const capsuleStatus = getCapsuleStatus(capsule).toLowerCase();
      const matchesStatus = status === "all" || status === capsuleStatus;
      return matchesQuery && matchesStatus;
    });
  }, [capsules, query, status]);

  return (
    <VyomShell>
      <section className="cinematic-section relative mx-auto w-full max-w-7xl px-5 pb-16 pt-28 sm:px-8">
        <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="reveal-stack max-w-4xl">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-cyan-100/70">
              Your capsules
            </p>
            <h1 className="mt-4 max-w-3xl text-4xl font-medium leading-[1.02] tracking-[-0.018em] text-white sm:text-5xl lg:text-6xl">
              Your sealed capsules.
            </h1>
            <p className="mt-5 max-w-[20rem] text-base leading-8 tracking-[0.003em] text-white/56 sm:max-w-2xl sm:text-lg">
              Return to the messages you&apos;ve sealed and see when each one opens.
            </p>
          </div>
          <VyomButton href="/create">
            Create capsule
            <Plus className="h-4 w-4" aria-hidden="true" />
          </VyomButton>
        </div>

        {!currentAccount && !isLoading && !hasVisibleCapsules ? (
          <div className="product-surface mb-6 border border-cyan-100/12 bg-cyan-100/[0.025] p-6 backdrop-blur-2xl">
            <h2 className="text-3xl font-medium tracking-[-0.014em] text-white">Connect Sui wallet to view your vault.</h2>
            <p className="mt-4 max-w-xl text-white/54">
              Capsules created with this wallet will appear here.
            </p>
            <div className="mt-6">
              <ConnectButton
                connectText={isConnecting ? "Connecting..." : "Connect Sui wallet"}
                className="vyom-connect-button glass-btn glass-btn-primary min-h-12 px-5 py-3 text-sm"
              />
            </div>
            {!hasSuiWallet ? (
              <p className="mt-4 text-sm leading-6 text-white/46">
                Sui wallet not found. Install a Sui-compatible wallet to continue.
              </p>
            ) : null}
          </div>
        ) : null}

        {!currentAccount && hasVisibleCapsules ? (
          <div className="mb-6 flex flex-col gap-4 border border-cyan-100/10 bg-cyan-100/[0.025] p-4 backdrop-blur-2xl sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-base font-medium text-white">Connect Sui wallet to sync your vault across browsers.</h2>
              <p className="mt-2 text-sm leading-6 text-white/50">
                Capsules created from this browser remain visible here.
              </p>
            </div>
            <ConnectButton
              connectText={isConnecting ? "Connecting..." : "Connect Sui wallet"}
              className="vyom-connect-button glass-btn glass-btn-secondary min-h-11 px-4 py-2.5 text-sm"
            />
            {!hasSuiWallet ? (
              <p className="text-sm leading-6 text-white/46 sm:max-w-56">
                Sui wallet not found. Install a Sui-compatible wallet to continue.
              </p>
            ) : null}
          </div>
        ) : null}

        {hasVisibleCapsules ? (
        <div className="mb-6 grid gap-4 border border-white/[0.08] bg-white/[0.025] p-4 backdrop-blur-2xl lg:grid-cols-[1fr_auto_auto]">
          <label className="flex min-h-12 items-center gap-3 border border-white/[0.07] bg-black/25 px-4 text-white/70">
            <Search className="h-4 w-4 text-cyan-100/60" aria-hidden="true" />
            <input
              className="w-full bg-transparent text-sm font-normal outline-none placeholder:text-white/34"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search capsules"
              value={query}
            />
          </label>
          <div className="grid min-h-12 grid-cols-3 gap-2 border border-cyan-100/10 bg-black/20 p-1.5">
            {statusOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                aria-pressed={status === option.value}
                className={[
                  "min-h-9 px-3 text-xs font-medium uppercase tracking-[0.1em] transition duration-300",
                  status === option.value
                    ? "border border-cyan-100/28 bg-cyan-100/[0.09] text-cyan-50 shadow-[0_0_20px_rgba(64,221,255,0.08)]"
                    : "border border-transparent bg-transparent text-white/44 hover:border-cyan-100/12 hover:text-white/76",
                ].join(" ")}
                onClick={() => setStatus(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
          <div className="flex min-h-12 items-center border border-white/[0.08] bg-white/[0.035] px-5 text-sm font-medium text-white/70">
            Newest first
          </div>
        </div>
        ) : null}

        {isLoading ? (
          <div className="product-surface border border-white/[0.08] bg-white/[0.025] p-8 text-white/52 backdrop-blur-2xl">
            Loading capsules...
          </div>
        ) : !currentAccount && !hasVisibleCapsules ? null : filteredCapsules.length > 0 ? (
          <div className="grid gap-5 lg:grid-cols-3">
            {filteredCapsules.map((capsule) => (
              <CapsuleCard key={capsule.id} capsule={capsule} />
            ))}
          </div>
        ) : (
          <div className="product-surface border border-white/[0.08] bg-white/[0.025] p-8 backdrop-blur-2xl">
            <h2 className="text-3xl font-medium tracking-[-0.014em] text-white">
              {currentAccount ? "No capsules found for this wallet." : "Connect Sui wallet to view your vault."}
            </h2>
            <p className="mt-4 max-w-[18rem] text-white/54 sm:max-w-xl">
              {capsules.length === 0
                ? currentAccount
                  ? "Create a capsule while this wallet is connected and it will appear here."
                  : "Capsules created with this wallet will appear here."
                : "Try changing the search or status filter."}
            </p>
            <div className="mt-6">
              <VyomButton href="/create">Create capsule</VyomButton>
            </div>
          </div>
        )}
      </section>
    </VyomShell>
  );
}
