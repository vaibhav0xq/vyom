"use client";

import { Plus, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { CapsuleCard } from "@/components/vyom/ProductSurfaces";
import { VyomButton } from "@/components/vyom/VyomButton";
import { VyomShell } from "@/components/vyom/VyomShell";
import { getCapsuleStatus } from "@/lib/capsule-utils";
import { useCapsules } from "@/hooks/useCapsules";

export default function VaultPage() {
  const { capsules, isLoading } = useCapsules();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"all" | "locked" | "unlocked">("all");

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

        {capsules.length > 0 ? (
        <div className="mb-6 grid gap-4 border border-white/[0.08] bg-white/[0.025] p-4 backdrop-blur-2xl md:grid-cols-[1fr_auto_auto]">
          <label className="flex min-h-12 items-center gap-3 border border-white/[0.07] bg-black/25 px-4 text-white/70">
            <Search className="h-4 w-4 text-cyan-100/60" aria-hidden="true" />
            <input
              className="w-full bg-transparent text-sm font-normal outline-none placeholder:text-white/34"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search capsules"
              value={query}
            />
          </label>
          <select
            className="min-h-12 border border-cyan-100/18 bg-cyan-100/[0.06] px-5 text-sm font-medium text-cyan-50 outline-none"
            onChange={(event) => setStatus(event.target.value as typeof status)}
            value={status}
          >
            <option value="all">All statuses</option>
            <option value="locked">Locked</option>
            <option value="unlocked">Unlocked</option>
          </select>
          <div className="flex min-h-12 items-center border border-white/[0.08] bg-white/[0.035] px-5 text-sm font-medium text-white/70">
            Newest first
          </div>
        </div>
        ) : null}

        {isLoading ? (
          <div className="product-surface border border-white/[0.08] bg-white/[0.025] p-8 text-white/52 backdrop-blur-2xl">
            Loading capsules...
          </div>
        ) : filteredCapsules.length > 0 ? (
          <div className="grid gap-5 lg:grid-cols-3">
            {filteredCapsules.map((capsule) => (
              <CapsuleCard key={capsule.id} capsule={capsule} />
            ))}
          </div>
        ) : (
          <div className="product-surface border border-white/[0.08] bg-white/[0.025] p-8 backdrop-blur-2xl">
            <h2 className="text-3xl font-medium tracking-[-0.014em] text-white">No capsules saved on this device yet.</h2>
            <p className="mt-4 max-w-[18rem] text-white/54 sm:max-w-xl">
              {capsules.length === 0
                ? "Seal your first message on this browser and it will wait here until its unlock time."
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
