import type { Capsule, CapsuleAccessType, CapsuleVisibility } from "@/types/capsule";

export type CapsuleRevealState =
  | "time_locked"
  | "wallet_required"
  | "wallet_mismatch"
  | "unlocked";

export function isValidEvmAddress(value: string) {
  return /^0x[a-fA-F0-9]{40}$/.test(value.trim());
}

export function normalizeAccessType(input?: {
  accessType?: CapsuleAccessType;
  access_type?: CapsuleAccessType;
  visibility?: CapsuleVisibility;
}) {
  if (input?.accessType === "wallet" || input?.access_type === "wallet") {
    return "wallet";
  }

  return "link";
}

export function canWalletOpenCapsule(capsule: Capsule, walletAddress?: string | null) {
  const recipient = capsule.recipient?.trim();
  const wallet = walletAddress?.trim();

  return Boolean(
    recipient &&
      wallet &&
      recipient.toLowerCase() === wallet.toLowerCase(),
  );
}

export function getCapsuleRevealState(
  capsule: Capsule,
  options?: {
    now?: number;
    walletAddress?: string | null;
  },
): CapsuleRevealState {
  const now = options?.now ?? Date.now();

  if (now < capsule.unlockAt) {
    return "time_locked";
  }

  if (capsule.accessType === "link") {
    return "unlocked";
  }

  if (!options?.walletAddress) {
    return "wallet_required";
  }

  return canWalletOpenCapsule(capsule, options.walletAddress)
    ? "unlocked"
    : "wallet_mismatch";
}
