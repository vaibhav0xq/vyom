import type { Capsule, CapsuleSummary, CreateCapsuleInput } from "@/types/capsule";
import { normalizeAccessType, normalizeSuiAddress } from "./capsule-access";

const STORAGE_KEY = "vyom_capsules";
const LOCAL_IDS_KEY = "vyom_capsule_ids";

type ApiError = {
  code?: string;
  error?: string;
};

function sortNewestFirst<T extends { createdAt: number }>(capsules: T[]) {
  return capsules.sort((a, b) => b.createdAt - a.createdAt);
}

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function readLocalCapsules(): Capsule[] {
  if (!canUseStorage()) {
    return [];
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.map(normalizeCapsule).filter((capsule): capsule is Capsule => Boolean(capsule));
  } catch {
    return [];
  }
}

function writeLocalCapsules(capsules: Capsule[]) {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(capsules));
}

function readLocalCapsuleIds() {
  if (!canUseStorage()) {
    return [];
  }

  const raw = window.localStorage.getItem(LOCAL_IDS_KEY);
  if (!raw) {
    return readLocalCapsules().map((capsule) => capsule.id);
  }

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter((id): id is string => typeof id === "string" && id.length > 0);
  } catch {
    return [];
  }
}

function writeLocalCapsuleIds(ids: string[]) {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(LOCAL_IDS_KEY, JSON.stringify(Array.from(new Set(ids))));
}

function rememberLocalCapsule(capsule: Capsule) {
  writeLocalCapsules([capsule, ...readLocalCapsules().filter((item) => item.id !== capsule.id)]);
  writeLocalCapsuleIds([capsule.id, ...readLocalCapsuleIds()]);
}

function normalizeCapsule(value: unknown): Capsule | undefined {
  if (!value || typeof value !== "object") {
    return undefined;
  }

  const capsule = value as Partial<Capsule>;
  const { id, title, message, unlockAt, createdAt, recipient } = capsule;
  const isValid =
    typeof id === "string" &&
    typeof title === "string" &&
    typeof message === "string" &&
    typeof unlockAt === "number" &&
    typeof createdAt === "number" &&
    (typeof capsule.recipient === "undefined" || typeof capsule.recipient === "string");

  if (!isValid) {
    return undefined;
  }

  const accessType = normalizeAccessType({
    accessType: capsule.accessType,
    visibility: capsule.visibility,
  });

  return {
    id,
    title,
    message,
    recipient,
    ownerWallet: normalizeSuiAddress(capsule.ownerWallet),
    unlockAt,
    accessType,
    visibility: capsule.visibility ?? (accessType === "wallet" ? "private" : "link"),
    createdAt,
  };
}

function createId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `capsule_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

function createLocalCapsule(data: CreateCapsuleInput): Capsule {
  const accessType = normalizeAccessType(data);

  return {
    id: createId(),
    title: data.title.trim(),
    message: data.message.trim(),
    recipient: data.recipient?.trim() || undefined,
    ownerWallet: normalizeSuiAddress(data.ownerWallet),
    unlockAt: data.unlockAt,
    accessType,
    visibility: accessType === "wallet" ? "private" : "link",
    createdAt: Date.now(),
  };
}

async function readApiError(response: Response): Promise<ApiError> {
  try {
    return (await response.json()) as ApiError;
  } catch {
    return {};
  }
}

function isMissingRemoteStore(error: ApiError) {
  return error.code === "SUPABASE_NOT_CONFIGURED";
}

export async function getCapsules() {
  return getCapsulesForVault();
}

function dedupeCapsules(capsules: CapsuleSummary[]) {
  const byId = new Map<string, CapsuleSummary>();
  capsules.forEach((capsule) => byId.set(capsule.id, capsule));
  return sortNewestFirst(Array.from(byId.values()));
}

export async function getCapsulesForVault(ownerWallet?: string | null): Promise<CapsuleSummary[]> {
  const normalizedOwnerWallet = normalizeSuiAddress(ownerWallet);

  if (!normalizedOwnerWallet) {
    return [];
  }

  let remoteCapsules: CapsuleSummary[] = [];

  try {
    const response = await fetch(`/api/capsules?owner_wallet=${encodeURIComponent(normalizedOwnerWallet)}`, {
      cache: "no-store",
    });

    if (response.ok) {
      remoteCapsules = (await response.json()) as CapsuleSummary[];
    }
  } catch {
    remoteCapsules = [];
  }

  return dedupeCapsules(remoteCapsules);
}

export async function getCapsuleById(id: string) {
  let response: Response;

  try {
    response = await fetch(`/api/capsules/${encodeURIComponent(id)}`, {
      cache: "no-store",
    });
  } catch {
    return readLocalCapsules()
      .sort((a, b) => b.createdAt - a.createdAt)
      .find((capsule) => capsule.id === id);
  }

  if (response?.ok) {
    return (await response.json()) as Capsule;
  }

  const error = await readApiError(response);
  const localCapsule = readLocalCapsules()
    .sort((a, b) => b.createdAt - a.createdAt)
    .find((capsule) => capsule.id === id);

  if (response.status === 404 || isMissingRemoteStore(error)) {
    return localCapsule;
  }

  throw new Error(error.error || "Capsule could not be loaded.");
}

export async function createCapsule(data: CreateCapsuleInput) {
  let response: Response | undefined;

  try {
    response = await fetch("/api/capsules", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  } catch {
    response = undefined;
  }

  if (response?.ok) {
    const capsule = (await response.json()) as Capsule;
    rememberLocalCapsule(capsule);
    return capsule;
  }

  if (response) {
    const error = await readApiError(response);
    if (!isMissingRemoteStore(error)) {
      throw new Error(error.error || "Capsule could not be saved.");
    }
  }

  const capsule = createLocalCapsule(data);
  rememberLocalCapsule(capsule);
  return capsule;
}

export async function deleteCapsule(id: string) {
  writeLocalCapsules(readLocalCapsules().filter((capsule) => capsule.id !== id));
  writeLocalCapsuleIds(readLocalCapsuleIds().filter((capsuleId) => capsuleId !== id));
}
