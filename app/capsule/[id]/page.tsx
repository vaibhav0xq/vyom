"use client";

import { ConnectButton, useCurrentAccount, useCurrentWallet, useDisconnectWallet, useWallets } from "@mysten/dapp-kit";
import { ArrowLeft, LockKeyhole, Share2 } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { CapsuleHero } from "@/components/vyom/CapsuleHero";
import { EncryptedPreview, LockedCapsulePanel, UnlockedCapsulePanel, WalletAccessPanel } from "@/components/vyom/ProductSurfaces";
import { VyomButton } from "@/components/vyom/VyomButton";
import { VyomShell } from "@/components/vyom/VyomShell";
import { getCapsuleRevealState } from "@/lib/capsule-access";
import { formatAccessMode, formatDateTime, formatWalletAddress, getCountdown } from "@/lib/capsule-utils";
import { getCapsuleById } from "@/lib/capsules";
import type { Capsule } from "@/types/capsule";

function createDemoCapsule(): Capsule {
  return {
    id: "demo",
    title: "Demo capsule",
    message:
      "This is a preview message. In a real capsule, the sealed message remains hidden until the unlock conditions are met.",
    recipient: undefined,
    unlockAt: Date.now() + 1000 * 60 * 60 * 36,
    accessType: "link",
    visibility: "link",
    createdAt: Date.now(),
  };
}

export default function CapsulePage() {
  const params = useParams<{ id: string }>();
  const isDemoCapsule = params.id === "demo" || params.id === "vyom-001";
  const currentAccount = useCurrentAccount();
  const { isConnecting } = useCurrentWallet();
  const { mutate: disconnectWallet, isPending: isDisconnecting } = useDisconnectWallet();
  const suiWallets = useWallets();
  const [capsule, setCapsule] = useState<Capsule | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const [now, setNow] = useState(0);
  const [copyLabel, setCopyLabel] = useState("Copy link");

  useEffect(() => {
    const handle = window.setTimeout(() => {
      async function loadCapsule() {
        if (isDemoCapsule) {
          setCapsule(createDemoCapsule());
          setIsLoading(false);
          return;
        }

        try {
          setCapsule(await getCapsuleById(params.id));
        } catch {
          setCapsule(undefined);
        }
        setIsLoading(false);
      }

      void loadCapsule();
    }, 0);

    return () => window.clearTimeout(handle);
  }, [isDemoCapsule, params.id]);

  useEffect(() => {
    const initialTick = window.setTimeout(() => setNow(Date.now()), 0);
    const timer = window.setInterval(() => setNow(Date.now()), 1000);

    return () => {
      window.clearTimeout(initialTick);
      window.clearInterval(timer);
    };
  }, []);

  const revealState = capsule
    ? getCapsuleRevealState(capsule, { now, walletAddress: currentAccount?.address })
    : "time_locked";
  const unlocked = revealState === "unlocked";
  const hasSuiWallet = suiWallets.length > 0;
  const countdown = useMemo(
    () => getCountdown(capsule?.unlockAt ?? now, now),
    [capsule?.unlockAt, now],
  );

  async function copyLink() {
    const url = window.location.href;
    try {
      await window.navigator.clipboard.writeText(url);
      setCopyLabel("Copied");
      window.setTimeout(() => setCopyLabel("Copy link"), 1600);
    } catch {
      setCopyLabel("Copy failed");
      window.setTimeout(() => setCopyLabel("Copy link"), 1600);
    }
  }

  return (
    <VyomShell>
      <section className="cinematic-section relative mx-auto grid min-h-[50vh] w-full max-w-7xl items-center gap-8 px-5 pb-8 pt-28 sm:min-h-[54vh] sm:px-8 lg:min-h-[56vh] lg:grid-cols-[0.88fr_1.12fr]">
        <div className="reveal-stack max-w-2xl">
          <Link href="/vault" className="mb-7 inline-flex items-center gap-3 text-xs font-medium uppercase tracking-[0.14em] text-white/44 transition duration-280 hover:text-cyan-100">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to vault
          </Link>
          <div className="liquid-glass mb-5 inline-flex max-w-full items-center gap-3 px-5 py-3.5 text-xs font-medium uppercase tracking-[0.14em] text-cyan-50/80">
            <LockKeyhole className="h-4 w-4 text-cyan-100/80" aria-hidden="true" />
            <span className="min-w-0 truncate">
              {capsule ? formatAccessMode(capsule) : "Sealed capsule"}
            </span>
          </div>
          <h1 className="max-w-3xl text-4xl font-medium leading-[1.02] tracking-[-0.018em] text-white sm:text-5xl lg:text-6xl">
            {isLoading ? "Loading capsule..." : isDemoCapsule ? "Demo capsule." : capsule ? unlocked ? "This capsule is ready." : "This capsule is sealed." : "Capsule not found."}
          </h1>
          <p className="mt-5 max-w-xl text-base leading-8 tracking-[0.003em] text-white/58 sm:text-lg">
            {isDemoCapsule
              ? "This is a preview of how a sealed capsule appears before unlock."
              : capsule
              ? unlocked
                ? "The message can now be opened."
                : capsule.accessType === "wallet" && revealState !== "time_locked"
                  ? "Connect the recipient wallet to reveal the message."
                  : `It will stay hidden until ${formatDateTime(capsule.unlockAt)}.`
              : "This link does not match a saved capsule."}
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <VyomButton href="/vault">Back to vault</VyomButton>
            {capsule ? (
              <VyomButton variant="secondary" onClick={copyLink}>
                {copyLabel}
                <Share2 className="h-4 w-4" aria-hidden="true" />
              </VyomButton>
            ) : null}
          </div>
          {currentAccount ? (
            <div className="mt-5 flex flex-col gap-3 rounded-[var(--glass-radius)] border border-cyan-100/10 bg-cyan-100/[0.025] px-4 py-3 sm:inline-flex sm:flex-row sm:items-center">
              <p
                className="text-sm font-medium text-cyan-50/66"
                title={currentAccount.address}
                aria-label={`Connected wallet ${currentAccount.address}`}
              >
                Connected wallet: {formatWalletAddress(currentAccount.address)}
              </p>
              <button
                type="button"
                className="glass-btn glass-btn-secondary min-h-10 px-4 py-2 text-sm"
                onClick={() => disconnectWallet()}
                disabled={isDisconnecting}
              >
                {isDisconnecting ? "Disconnecting..." : "Disconnect"}
              </button>
            </div>
          ) : null}
        </div>
        <CapsuleHero compact />
      </section>

      <section className="relative border-y border-white/[0.06]">
        <div className="mx-auto grid w-full max-w-7xl gap-6 px-5 py-12 sm:px-8 sm:py-14 lg:grid-cols-[1fr_0.8fr]">
          {isLoading ? (
            <div className="product-surface border border-white/[0.08] bg-white/[0.025] p-8 text-white/50 backdrop-blur-none">
              Loading capsule...
            </div>
          ) : capsule ? (
            unlocked ? (
              <>
                <UnlockedCapsulePanel capsule={capsule} copyLabel={copyLabel} onCopyLink={copyLink} />
                <div className="product-surface border border-white/[0.08] bg-white/[0.025] p-6 backdrop-blur-none">
                  <h2 className="text-3xl font-medium tracking-[-0.014em] text-white">Sealed preview</h2>
                  <p className="mt-4 text-white/52">The sealed texture remains as a quiet record of what was protected.</p>
                  <EncryptedPreview message={capsule.message} />
                </div>
              </>
            ) : revealState === "wallet_required" || revealState === "wallet_mismatch" ? (
              <>
                <WalletAccessPanel
                  capsule={capsule}
                  state={revealState}
                  walletAddress={currentAccount?.address}
                  walletControl={
                    currentAccount ? (
                      <button
                        type="button"
                        className="glass-btn glass-btn-secondary min-h-12 w-full px-5 py-3 text-sm"
                        onClick={() => disconnectWallet()}
                        disabled={isDisconnecting}
                      >
                        {isDisconnecting ? "Disconnecting..." : "Disconnect wallet"}
                      </button>
                    ) : (
                      <ConnectButton
                        connectText={isConnecting ? "Connecting..." : "Connect Sui wallet to unlock"}
                        className="vyom-connect-button glass-btn glass-btn-primary min-h-12 w-full px-5 py-3 text-sm"
                      />
                    )
                  }
                />
                <div className="product-surface border border-white/[0.08] bg-white/[0.025] p-6 backdrop-blur-none">
                  <h2 className="text-3xl font-medium tracking-[-0.014em] text-white">Wallet gated capsule</h2>
                  <p className="mt-4 text-white/52">
                    Time unlock is complete. The message remains hidden until the recipient wallet is connected.
                  </p>
                  {!hasSuiWallet && !currentAccount ? (
                    <p className="mt-5 rounded-[var(--glass-radius)] border border-white/[0.08] bg-black/22 p-4 text-sm leading-7 text-white/66">
                      Sui wallet not found. Install a Sui-compatible wallet to continue.
                    </p>
                  ) : null}
                  <div className="mt-6">
                    <VyomButton variant="secondary" onClick={copyLink}>
                      {copyLabel}
                    </VyomButton>
                  </div>
                </div>
              </>
            ) : (
              <>
                <LockedCapsulePanel capsule={capsule} countdown={countdown} />
                <div className="product-surface border border-white/[0.08] bg-white/[0.025] p-6 backdrop-blur-none">
                  <h2 className="text-3xl font-medium tracking-[-0.014em] text-white">Share sealed capsule</h2>
                  <p className="mt-4 text-white/52">
                    {isDemoCapsule
                      ? "This demo does not create or save a capsule. It shows the sealed state before unlock."
                      : "Anyone with this link can see the capsule page. The message stays hidden until unlock conditions are met."}
                  </p>
                  <div className="mt-6">
                    <VyomButton onClick={copyLink}>
                      {copyLabel}
                    </VyomButton>
                  </div>
                </div>
              </>
            )
          ) : (
            <div className="product-surface border border-white/[0.08] bg-white/[0.025] p-8 backdrop-blur-none lg:col-span-2">
              <h2 className="text-3xl font-medium tracking-[-0.014em] text-white">Capsule not found</h2>
              <p className="mt-4 max-w-xl text-white/52">
                Create a capsule or check that the shared link is complete.
              </p>
              <div className="mt-6">
                <VyomButton href="/create">Create capsule</VyomButton>
              </div>
            </div>
          )}
        </div>
      </section>
    </VyomShell>
  );
}
