"use client";

import { ArrowUpRight, LockKeyhole } from "lucide-react";
import { CapsuleFlow } from "@/components/vyom/CapsuleFlow";
import { CapsuleHero } from "@/components/vyom/CapsuleHero";
import { CapsuleCard } from "@/components/vyom/ProductSurfaces";
import { VyomButton } from "@/components/vyom/VyomButton";
import { VyomShell } from "@/components/vyom/VyomShell";
import { useCapsules } from "@/hooks/useCapsules";

export default function Home() {
  const { capsules, isLoading } = useCapsules();
  const latestCapsules = capsules.slice(0, 3);

  return (
    <VyomShell>
      <section className="cinematic-section relative mx-auto grid min-h-[86vh] w-full max-w-7xl items-center gap-8 px-5 pb-14 pt-28 sm:px-8 lg:grid-cols-[0.82fr_1.18fr] lg:pt-24">
        <div className="reveal-stack relative z-10 min-w-0 max-sm:max-w-[350px]">
          <div className="liquid-glass mb-7 inline-flex w-full max-w-full items-center gap-3 px-5 py-3.5 text-[0.68rem] font-medium uppercase tracking-[0.12em] text-cyan-50/80 sm:w-auto sm:text-xs sm:tracking-[0.16em]">
            <LockKeyhole className="h-4 w-4 shrink-0 text-cyan-100/80" aria-hidden="true" />
            <span className="min-w-0 whitespace-normal leading-5">Encrypted capsules for private messages</span>
          </div>

          <h1 className="max-w-[13ch] text-[2.85rem] font-medium leading-[0.96] tracking-[-0.018em] text-white min-[430px]:text-[3.4rem] sm:max-w-4xl sm:text-6xl lg:text-[4.7rem] xl:text-[5.7rem]">
            Seal a message for the future.
          </h1>

          <p className="mt-7 max-w-[25rem] text-base leading-8 tracking-[0.003em] text-white/62 sm:max-w-2xl sm:text-lg sm:leading-8">
            Write something private, choose when it can be opened, and let it
            wait safely until the right moment arrives.
          </p>

          <div className="mt-11 flex flex-col gap-4 sm:flex-row">
            <VyomButton href="/create">
              Create capsule
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </VyomButton>
            <VyomButton href="/vault" variant="secondary">
              View my vault
            </VyomButton>
          </div>
        </div>

        <CapsuleHero />
      </section>

      <section className="cinematic-section relative border-y border-white/[0.06]">
        <div className="section-ribbon absolute inset-x-0 top-0 h-36" />
        <div className="mx-auto grid w-full max-w-7xl gap-10 px-5 py-18 sm:px-8 sm:py-20 lg:grid-cols-[0.72fr_1.28fr]">
          <div className="reveal-stack">
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-cyan-100/60">
              How Vyom works
            </p>
            <h2 className="mt-4 max-w-2xl text-4xl font-medium leading-[1.02] tracking-[-0.016em] text-white sm:text-5xl">
              Three simple steps.
            </h2>
            <p className="mt-5 max-w-md text-base leading-8 text-white/52">
              Write the message, choose the unlock rule, then share the capsule.
            </p>
          </div>

          <CapsuleFlow />
        </div>
      </section>

      <section className="cinematic-section relative mx-auto w-full max-w-7xl px-5 py-18 sm:px-8 sm:py-20">
        <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-cyan-100/60">
              Your capsules
            </p>
            <h2 className="mt-4 max-w-3xl text-4xl font-medium leading-[1.04] tracking-[-0.016em] text-white sm:text-5xl">
              {latestCapsules.length > 0 ? "Continue where you left off." : "Create your first capsule."}
            </h2>
          </div>
          <VyomButton href="/create" variant="secondary">
            Create capsule
          </VyomButton>
        </div>

        {isLoading ? (
          <div className="product-surface border border-white/[0.08] bg-white/[0.025] p-8 text-white/50 backdrop-blur-none">
            Loading capsules...
          </div>
        ) : latestCapsules.length > 0 ? (
          <div className="grid gap-5 lg:grid-cols-3">
            {latestCapsules.map((capsule) => (
              <CapsuleCard key={capsule.id} capsule={capsule} />
            ))}
          </div>
        ) : (
          <div className="product-surface border border-white/[0.08] bg-white/[0.025] p-8 backdrop-blur-none">
            <h3 className="text-2xl font-medium tracking-[-0.012em] text-white">No capsules yet</h3>
            <p className="mt-4 max-w-xl text-white/52">
              Create a private message, set an unlock date, and it will appear here.
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
