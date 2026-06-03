import { CalendarClock, EyeOff, KeyRound, Link2, LockKeyhole, MessageSquareText, UserRound, Wallet } from "lucide-react";
import {
  createEncryptedPreview,
  formatDateTime,
  formatRecipient,
  formatAccessMode,
  getCapsuleStatus,
  type Countdown,
} from "@/lib/capsule-utils";
import type { Capsule, CapsuleAccessType } from "@/types/capsule";
import { VyomButton } from "./VyomButton";

type PreviewData = {
  title: string;
  message: string;
  recipient?: string;
  unlockAt?: number;
  accessType: CapsuleAccessType;
};

export function CreatePreview({ data }: { data: PreviewData }) {
  const title = data.title.trim() || "Untitled capsule";
  const hasMessage = data.message.trim().length > 0;

  return (
    <div className="product-surface relative overflow-hidden border border-white/[0.08] bg-white/[0.025] p-6 backdrop-blur-none">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-100/35 to-transparent" />
      <div className="flex items-center justify-between gap-5">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-cyan-100/55">Capsule preview</p>
          <h3 className="mt-3 text-3xl font-medium leading-tight tracking-[-0.014em] text-white">{title}</h3>
        </div>
        <LockKeyhole className="h-10 w-10 shrink-0 text-cyan-100/60" aria-hidden="true" />
      </div>
      <div className="mt-8 grid gap-4">
        <PreviewRow icon={MessageSquareText} label="Message to the future" value={hasMessage ? "Hidden until unlock" : "Add a message"} />
        <PreviewRow icon={CalendarClock} label="Unlock time" value={data.unlockAt ? formatDateTime(data.unlockAt) : "Choose unlock time"} />
        <PreviewRow
          icon={data.accessType === "wallet" ? Wallet : UserRound}
          label={data.accessType === "wallet" ? "Recipient wallet" : "Recipient optional"}
          value={data.recipient?.trim() || (data.accessType === "wallet" ? "Wallet required" : "Optional")}
        />
        <PreviewRow icon={Link2} label="Access" value={formatAccessMode(data)} />
      </div>
      <div className="sealed-preview mt-5 rounded-[var(--glass-radius)] border border-cyan-100/10 bg-cyan-100/[0.025] p-5">
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-cyan-100/46">Sealed note</p>
        <p className="mt-3 text-sm leading-7 text-white/52">
          {hasMessage ? "The message will stay hidden inside the capsule until the unlock time." : "Your message preview will remain hidden here as you write."}
        </p>
      </div>
    </div>
  );
}

function PreviewRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof MessageSquareText;
  label: string;
  value: string;
}) {
  return (
    <div className="border border-white/[0.06] bg-black/22 p-4 rounded-[var(--glass-radius)]">
      <div className="flex items-center gap-3">
        <Icon className="h-4 w-4 text-cyan-100/60" aria-hidden="true" />
        <span className="text-xs font-medium uppercase tracking-[0.14em] text-white/38">{label}</span>
      </div>
      <p className="mt-4 text-base leading-7 text-white/85">{value}</p>
    </div>
  );
}

export function CapsuleCard({ capsule }: { capsule: Capsule }) {
  const status = getCapsuleStatus(capsule);
  const ready = status === "Unlocked";
  const statusLabel = ready ? "Ready" : "Sealed";

  return (
    <div className="product-surface flex min-h-72 flex-col justify-between border border-white/[0.08] bg-white/[0.025] p-6 backdrop-blur-none">
      <div>
        <p className="mb-4 text-xs font-medium uppercase tracking-[0.14em] text-cyan-100/46">
          Preserved capsule
        </p>
        <div className="flex items-start justify-between gap-4">
          <h3 className="min-w-0 break-words text-2xl font-medium leading-tight tracking-[-0.014em] text-white">{capsule.title}</h3>
          <span className={ready ? "status-pill-ready" : "status-pill-locked"}>{statusLabel}</span>
        </div>
        <div className="mt-7 grid gap-4 text-sm text-white/58">
          <p className="flex items-center gap-3">
            <CalendarClock className="h-4 w-4 text-cyan-100/50" aria-hidden="true" />
            {ready ? `Ready since ${formatDateTime(capsule.unlockAt)}` : `Sealed until ${formatDateTime(capsule.unlockAt)}`}
          </p>
          <p className="flex items-center gap-3">
            <UserRound className="h-4 w-4 text-cyan-100/50" aria-hidden="true" />
            {formatRecipient(capsule)}
          </p>
          <p className="flex items-center gap-3">
            <Link2 className="h-4 w-4 text-cyan-100/50" aria-hidden="true" />
            {formatAccessMode(capsule)}
          </p>
        </div>
      </div>
      <VyomButton href={`/capsule/${capsule.id}`} className="mt-8 w-full">
        {ready ? "Open capsule" : "View sealed capsule"}
      </VyomButton>
    </div>
  );
}

export function LockedCapsulePanel({
  capsule,
  countdown,
}: {
  capsule: Capsule;
  countdown: Countdown;
}) {
  return (
    <div className="product-surface locked-emphasis relative overflow-hidden border border-white/[0.08] bg-white/[0.025] p-6 backdrop-blur-none">
      <div className="flex items-start justify-between gap-5">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-cyan-100/55">sealed capsule</p>
          <h2 className="mt-3 break-words text-3xl font-medium leading-tight tracking-[-0.014em] text-white sm:text-4xl">{capsule.title}</h2>
          <p className="mt-4 max-w-xl text-sm leading-7 text-white/52">
            Your message is preserved and hidden until the unlock time arrives.
          </p>
        </div>
        <LockKeyhole className="h-10 w-10 shrink-0 text-cyan-100/60" aria-hidden="true" />
      </div>

      {/* Countdown — glass cells */}
      <CountdownGrid countdown={countdown} />

      <CapsuleMeta capsule={capsule} />
      <EncryptedPreview message={capsule.message} />

      <VyomButton
        disabled
        variant="secondary"
        className="mt-6 w-full cursor-not-allowed !text-white/64 opacity-60"
      >
        Message sealed until unlock
      </VyomButton>
    </div>
  );
}

export function UnlockedCapsulePanel({
  capsule,
  onCopyLink,
  copyLabel,
}: {
  capsule: Capsule;
  onCopyLink: () => void;
  copyLabel: string;
}) {
  return (
    <div className="product-surface border border-cyan-100/12 bg-cyan-100/[0.025] p-6 backdrop-blur-none">
      <div className="flex items-center gap-3 text-cyan-100/68">
        <KeyRound className="h-5 w-5" aria-hidden="true" />
        <span className="text-xs font-medium uppercase tracking-[0.16em]">capsule opened</span>
      </div>
      <h3 className="mt-8 text-3xl font-medium leading-tight tracking-[-0.014em] text-white">{capsule.title}</h3>
      <p className="mt-3 text-sm leading-7 text-white/52">The sealed message is now visible.</p>
      <div className="mt-5 whitespace-pre-wrap break-words rounded-[var(--glass-radius)] border border-white/[0.07] bg-black/22 p-5 text-base leading-8 text-white/82 transition duration-500 hover:border-cyan-100/16 hover:bg-black/30">
        {capsule.message}
      </div>
      <CapsuleMeta capsule={capsule} />
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <VyomButton href="/vault">Back to vault</VyomButton>
        <VyomButton variant="secondary" onClick={onCopyLink}>
          {copyLabel}
        </VyomButton>
      </div>
    </div>
  );
}

export function WalletAccessPanel({
  capsule,
  state,
  walletAddress,
  onConnect,
  isConnecting,
}: {
  capsule: Capsule;
  state: "wallet_required" | "wallet_mismatch";
  walletAddress?: string | null;
  onConnect: () => void;
  isConnecting: boolean;
}) {
  const title =
    state === "wallet_mismatch"
      ? "This wallet cannot open this capsule."
      : "Connect wallet to unlock";
  const body =
    state === "wallet_mismatch"
      ? "The connected wallet does not match the recipient wallet for this capsule."
      : "This capsule is wallet gated. Connect the recipient wallet after the unlock time to reveal the message.";

  return (
    <div className="product-surface locked-emphasis relative overflow-hidden border border-white/[0.08] bg-white/[0.025] p-6 backdrop-blur-none">
      <div className="flex items-start justify-between gap-5">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-cyan-100/55">wallet gated</p>
          <h2 className="mt-3 break-words text-3xl font-medium leading-tight tracking-[-0.014em] text-white sm:text-4xl">{title}</h2>
          <p className="mt-4 max-w-xl text-sm leading-7 text-white/52">{body}</p>
        </div>
        <Wallet className="h-10 w-10 shrink-0 text-cyan-100/60" aria-hidden="true" />
      </div>

      <CapsuleMeta capsule={capsule} />
      <EncryptedPreview message={capsule.message} />

      {walletAddress ? (
        <p className="mt-5 break-words rounded-[var(--glass-radius)] border border-white/[0.06] bg-black/22 p-4 text-sm leading-7 text-white/58">
          Connected wallet: {walletAddress}
        </p>
      ) : null}

      <VyomButton className="mt-6 w-full" onClick={onConnect} disabled={isConnecting}>
        {isConnecting ? "Connecting..." : "Connect wallet"}
      </VyomButton>
    </div>
  );
}

export function EncryptedPreview({ message }: { message: string }) {
  return (
    <div className="sealed-preview mt-5 rounded-[var(--glass-radius)] border border-cyan-100/10 bg-cyan-100/[0.025] p-5">
      <div className="mb-5 flex items-center gap-3 text-xs font-medium uppercase tracking-[0.14em] text-cyan-100/50">
        <EyeOff className="h-4 w-4" aria-hidden="true" />
        sealed preview
      </div>
      <p className="mb-5 text-sm leading-7 text-white/46">
        Only the sealed texture is visible before unlock.
      </p>
      <div className="grid gap-2">
        {createEncryptedPreview(message).map((width, index) => (
          <span
            key={`${width}-${index}`}
            className="encrypted-line h-1 rounded-sm bg-white/8"
            style={{ width: `${width}%`, animationDelay: `${index * 140}ms` }}
          />
        ))}
      </div>
    </div>
  );
}

function CountdownGrid({ countdown }: { countdown: Countdown }) {
  return (
    <div className="mt-8">
      <p className="mb-3 text-xs font-medium uppercase tracking-[0.14em] text-white/34">
        Opens in
      </p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          [countdown.days, "days"],
          [countdown.hours, "hours"],
          [countdown.minutes, "min"],
          [countdown.seconds, "sec"],
        ].map(([value, label]) => (
          <div key={label} className="glass-countdown-cell p-4 text-center">
            <p className="text-3xl font-medium tabular-nums tracking-[-0.012em] text-white" style={{ minWidth: "2.5ch" }}>
              {String(value).padStart(2, "0")}
            </p>
            <p className="mt-2 text-xs font-medium uppercase tracking-[0.14em] text-white/32">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function CapsuleMeta({ capsule }: { capsule: Capsule }) {
  return (
    <div className="mt-5 grid gap-4 sm:grid-cols-3">
      <MetaBlock icon={CalendarClock} label="Unlock date" value={formatDateTime(capsule.unlockAt)} />
      <MetaBlock icon={UserRound} label="Recipient" value={formatRecipient(capsule)} />
      <MetaBlock icon={Link2} label="Access" value={formatAccessMode(capsule)} />
    </div>
  );
}

function MetaBlock({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof CalendarClock;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[var(--glass-radius)] border border-white/[0.06] bg-black/22 p-5">
      <Icon className="h-5 w-5 text-cyan-100/60" aria-hidden="true" />
      <p className="mt-6 text-xs font-medium uppercase tracking-[0.14em] text-white/32">{label}</p>
      <p className="mt-2 break-words text-base leading-7 text-white/90">{value}</p>
    </div>
  );
}
