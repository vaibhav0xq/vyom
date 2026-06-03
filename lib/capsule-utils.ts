import type { Capsule } from "@/types/capsule";

export type Countdown = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

export function isCapsuleUnlocked(capsule: Capsule, now = Date.now()) {
  return now >= capsule.unlockAt;
}

export function getCapsuleStatus(capsule: Capsule, now = Date.now()) {
  return isCapsuleUnlocked(capsule, now) ? "Unlocked" : "Locked";
}

export function getCountdown(unlockAt: number, now = Date.now()): Countdown {
  const remaining = Math.max(0, unlockAt - now);
  const totalSeconds = Math.floor(remaining / 1000);

  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}

export function formatDateTime(timestamp: number) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(timestamp));
}

export function formatAccessMode(capsule: Pick<Capsule, "accessType">) {
  return capsule.accessType === "wallet" ? "Wallet gated" : "Link access";
}

export function formatWalletAddress(address?: string | null) {
  const value = address?.trim();
  if (!value) {
    return "";
  }

  if (value.length <= 14) {
    return value;
  }

  return `${value.slice(0, 6)}...${value.slice(-4)}`;
}

export function formatRecipient(capsule: Capsule) {
  if (capsule.accessType === "wallet") {
    return formatWalletAddress(capsule.recipient) || "Wallet required";
  }

  return capsule.recipient?.trim() || "Only you";
}

export function createEncryptedPreview(message: string) {
  const seed = Array.from(message).reduce((total, char) => total + char.charCodeAt(0), 0);

  return Array.from({ length: 8 }, (_, index) => 34 + ((seed + index * 17) % 58));
}
