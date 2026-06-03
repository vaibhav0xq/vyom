import { NextResponse } from "next/server";
import { createRemoteCapsule, hasSupabaseServerConfig } from "@/lib/supabase-capsules";
import { isValidSuiAddress, normalizeAccessType } from "@/lib/capsule-access";
import type { CapsuleAccessType, CapsuleVisibility, CreateCapsuleInput } from "@/types/capsule";

function isVisibility(value: unknown): value is CapsuleVisibility {
  return value === "private" || value === "link";
}

function isAccessType(value: unknown): value is CapsuleAccessType {
  return value === "link" || value === "wallet";
}

function parseCreateInput(value: unknown): CreateCapsuleInput | undefined {
  if (!value || typeof value !== "object") {
    return undefined;
  }

  const data = value as CreateCapsuleInput & {
    access_type?: CapsuleAccessType;
  };
  if (
    typeof data.title !== "string" ||
    typeof data.message !== "string" ||
    typeof data.unlockAt !== "number"
  ) {
    return undefined;
  }

  const accessType = normalizeAccessType({
    accessType: isAccessType(data.accessType) ? data.accessType : undefined,
    access_type: isAccessType(data.access_type) ? data.access_type : undefined,
    visibility: isVisibility(data.visibility) ? data.visibility : undefined,
  });

  return {
    title: data.title,
    message: data.message,
    recipient: typeof data.recipient === "string" ? data.recipient : undefined,
    unlockAt: data.unlockAt,
    accessType,
    visibility: accessType === "wallet" ? "private" : "link",
  };
}

type SafeDebugError = {
  code?: unknown;
  details?: unknown;
  hint?: unknown;
  message: string;
};

function getSafeDebugError(error: unknown): SafeDebugError {
  if (error instanceof Error) {
    try {
      const parsed = JSON.parse(error.message) as Partial<SafeDebugError>;
      return {
        code: parsed.code,
        details: parsed.details,
        hint: parsed.hint,
        message: typeof parsed.message === "string" ? parsed.message : error.message,
      };
    } catch {
      return { message: error.message };
    }
  }

  return { message: "Unknown error" };
}

export async function POST(request: Request) {
  if (!hasSupabaseServerConfig()) {
    return NextResponse.json(
      { code: "SUPABASE_NOT_CONFIGURED", error: "Supabase is not configured." },
      { status: 503 },
    );
  }

  const input = parseCreateInput(await request.json().catch(() => undefined));
  if (!input || !input.title.trim() || !input.message.trim() || input.unlockAt <= Date.now()) {
    return NextResponse.json({ error: "Invalid capsule data." }, { status: 400 });
  }

  if (input.accessType === "wallet" && !isValidSuiAddress(input.recipient ?? "")) {
    return NextResponse.json(
      { error: "Wallet gated capsules require a valid Sui recipient wallet." },
      { status: 400 },
    );
  }

  try {
    const capsule = await createRemoteCapsule(input);
    return NextResponse.json(capsule, { status: 201 });
  } catch (error) {
    const debug = getSafeDebugError(error);

    if (process.env.NODE_ENV === "development") {
      console.error("POST /api/capsules failed", debug);
    }

    return NextResponse.json(
      {
        error: "Capsule could not be saved.",
        ...(process.env.NODE_ENV === "development" ? { debug } : {}),
      },
      { status: 500 },
    );
  }
}
