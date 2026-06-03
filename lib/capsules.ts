import type { Capsule, CreateCapsuleInput } from "@/types/capsule";

const STORAGE_KEY = "vyom_capsules";
const LOCAL_IDS_KEY = "vyom_capsule_ids";

type ApiError = {
  code?: string;
  error?: string;
};

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

    return parsed.filter(isCapsule);
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

function isCapsule(value: unknown): value is Capsule {
  if (!value || typeof value !== "object") {
    return false;
  }

  const capsule = value as Capsule;
  return (
    typeof capsule.id === "string" &&
    typeof capsule.title === "string" &&
    typeof capsule.message === "string" &&
    typeof capsule.unlockAt === "number" &&
    typeof capsule.createdAt === "number" &&
    (capsule.visibility === "private" || capsule.visibility === "link") &&
    (typeof capsule.recipient === "undefined" || typeof capsule.recipient === "string")
  );
}

function createId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `capsule_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

function createLocalCapsule(data: CreateCapsuleInput): Capsule {
  return {
    id: createId(),
    title: data.title.trim(),
    message: data.message.trim(),
    recipient: data.recipient?.trim() || undefined,
    unlockAt: data.unlockAt,
    visibility: data.visibility,
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
  const ids = readLocalCapsuleIds();

  if (ids.length === 0) {
    return [];
  }

  const localById = new Map(readLocalCapsules().map((capsule) => [capsule.id, capsule]));
  const capsules = await Promise.all(
    ids.map(async (id) => {
      try {
        const capsule = await getCapsuleById(id);
        if (capsule) {
          localById.set(capsule.id, capsule);
        }
        return capsule;
      } catch {
        return localById.get(id);
      }
    }),
  );

  const availableCapsules = capsules.filter((capsule): capsule is Capsule => Boolean(capsule));
  writeLocalCapsules(availableCapsules);

  return availableCapsules.sort((a, b) => b.createdAt - a.createdAt);
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
