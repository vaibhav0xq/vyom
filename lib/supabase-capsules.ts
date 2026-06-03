import type { Capsule, CapsuleSummary, CreateCapsuleInput } from "@/types/capsule";
import { normalizeAccessType, normalizeSuiAddress } from "./capsule-access";

const SUPABASE_TABLE = "capsules";

type SupabaseCapsuleRow = {
  id: string;
  title: string;
  message?: string;
  recipient: string | null;
  owner_wallet?: string | null;
  unlock_at: number;
  access_type?: Capsule["accessType"] | null;
  visibility?: Capsule["visibility"] | null;
  created_at: number;
};

export function hasSupabaseServerConfig() {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

function supabaseEndpoint(path: string) {
  const baseUrl = process.env.SUPABASE_URL?.replace(/\/$/, "");
  return `${baseUrl}/rest/v1/${path}`;
}

function supabaseHeaders(extra?: HeadersInit) {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

  return {
    apikey: serviceRoleKey,
    Authorization: `Bearer ${serviceRoleKey}`,
    "Content-Type": "application/json",
    ...extra,
  };
}

async function requestSupabase<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(supabaseEndpoint(path), {
    ...init,
    headers: supabaseHeaders(init?.headers),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Supabase request failed.");
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

function createId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `capsule_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

function toRow(capsule: Capsule): SupabaseCapsuleRow {
  return {
    id: capsule.id,
    title: capsule.title,
    message: capsule.message,
    recipient: capsule.recipient ?? null,
    owner_wallet: normalizeSuiAddress(capsule.ownerWallet) ?? null,
    unlock_at: capsule.unlockAt,
    access_type: capsule.accessType,
    visibility: capsule.accessType === "wallet" ? "private" : "link",
    created_at: capsule.createdAt,
  };
}

function fromRow(row: SupabaseCapsuleRow): Capsule {
  return {
    id: row.id,
    title: row.title,
    message: row.message ?? "",
    recipient: row.recipient ?? undefined,
    ownerWallet: normalizeSuiAddress(row.owner_wallet),
    unlockAt: row.unlock_at,
    accessType: normalizeAccessType({
      access_type: row.access_type ?? undefined,
      visibility: row.visibility ?? undefined,
    }),
    visibility: row.visibility ?? (row.access_type === "wallet" ? "private" : "link"),
    createdAt: row.created_at,
  };
}

function fromSummaryRow(row: SupabaseCapsuleRow): CapsuleSummary {
  return {
    id: row.id,
    title: row.title,
    recipient: row.recipient ?? undefined,
    ownerWallet: normalizeSuiAddress(row.owner_wallet),
    unlockAt: row.unlock_at,
    accessType: normalizeAccessType({
      access_type: row.access_type ?? undefined,
      visibility: row.visibility ?? undefined,
    }),
    visibility: row.visibility ?? (row.access_type === "wallet" ? "private" : "link"),
    createdAt: row.created_at,
  };
}

export async function createRemoteCapsule(data: CreateCapsuleInput) {
  const accessType = normalizeAccessType(data);
  const capsule: Capsule = {
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

  const rows = await requestSupabase<SupabaseCapsuleRow[]>(SUPABASE_TABLE, {
    method: "POST",
    headers: {
      Prefer: "return=representation",
    },
    body: JSON.stringify(toRow(capsule)),
  });

  return rows[0] ? fromRow(rows[0]) : capsule;
}

export async function getRemoteCapsuleById(id: string) {
  const rows = await requestSupabase<SupabaseCapsuleRow[]>(
    `${SUPABASE_TABLE}?id=eq.${encodeURIComponent(id)}&select=*&limit=1`,
  );

  return rows[0] ? fromRow(rows[0]) : undefined;
}

export async function getRemoteCapsulesByOwnerWallet(ownerWallet: string) {
  const select = "id,title,recipient,owner_wallet,unlock_at,access_type,visibility,created_at";
  const rows = await requestSupabase<SupabaseCapsuleRow[]>(
    `${SUPABASE_TABLE}?owner_wallet=eq.${encodeURIComponent(ownerWallet)}&select=${select}&order=created_at.desc`,
  );

  return rows.map(fromSummaryRow);
}
