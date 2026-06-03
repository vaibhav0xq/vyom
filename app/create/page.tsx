"use client";

import { ArrowUpRight, CalendarClock, Link2, LockKeyhole, MessageSquareText, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { type FormEvent, useMemo, useState } from "react";
import { CapsuleHero } from "@/components/vyom/CapsuleHero";
import { CreatePreview } from "@/components/vyom/ProductSurfaces";
import { VyomButton } from "@/components/vyom/VyomButton";
import { VyomInput } from "@/components/vyom/VyomInput";
import { VyomShell } from "@/components/vyom/VyomShell";
import { useCapsules } from "@/hooks/useCapsules";
import type { CapsuleVisibility } from "@/types/capsule";

type FormErrors = Partial<Record<"title" | "message" | "unlockAt", string>>;

function getDefaultUnlockValue() {
  const date = new Date(Date.now() + 60 * 60 * 1000);
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().slice(0, 16);
}

export default function CreatePage() {
  const router = useRouter();
  const { createCapsule } = useCapsules();
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [recipient, setRecipient] = useState("");
  const [unlockAt, setUnlockAt] = useState(getDefaultUnlockValue);
  const visibility: CapsuleVisibility = "link";
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState("");

  const unlockTimestamp = useMemo(() => {
    const value = new Date(unlockAt).getTime();
    return Number.isNaN(value) ? undefined : value;
  }, [unlockAt]);

  function validate() {
    const nextErrors: FormErrors = {};
    if (!title.trim()) {
      nextErrors.title = "Add a capsule title.";
    }
    if (!message.trim()) {
      nextErrors.message = "Add a message to the future.";
    }
    if (!unlockTimestamp || unlockTimestamp <= Date.now()) {
      nextErrors.unlockAt = "Choose a future unlock date.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFeedback("");

    if (!validate() || !unlockTimestamp) {
      return;
    }

    setIsSubmitting(true);
    setFeedback("Creating capsule...");

    try {
      const capsule = await createCapsule({
        title,
        message,
        recipient,
        unlockAt: unlockTimestamp,
        visibility,
      });

      setFeedback("Capsule created.");
      window.setTimeout(() => {
        router.push(`/capsule/${capsule.id}`);
      }, 450);
    } catch {
      setFeedback("Capsule could not be saved. Check your connection and try again.");
      setIsSubmitting(false);
    }
  }

  return (
    <VyomShell>
      <section className="cinematic-section relative mx-auto grid min-h-[52vh] w-full max-w-7xl items-center gap-8 px-5 pb-8 pt-32 sm:min-h-[58vh] sm:px-8 sm:pt-28 lg:grid-cols-[0.86fr_1.14fr]">
        <div className="reveal-stack max-w-2xl">
          <div className="liquid-glass mb-5 inline-flex items-center gap-3 px-5 py-3.5 text-xs font-medium uppercase tracking-[0.16em] text-cyan-50/80">
            <LockKeyhole className="h-4 w-4 text-cyan-100/80" aria-hidden="true" />
            Create capsule
          </div>
          <h1 className="max-w-3xl text-4xl font-medium leading-[1.02] tracking-[-0.018em] text-white sm:text-5xl lg:text-6xl">
            Seal your capsule.
          </h1>
          <p className="mt-5 max-w-[20rem] text-base leading-8 tracking-[0.003em] text-white/58 sm:max-w-xl sm:text-lg">
            Write a private message, choose its unlock time, and keep it sealed
            until the moment you choose.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <VyomButton href="/vault">
              View my vault
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </VyomButton>
          </div>
        </div>
        <CapsuleHero compact />
      </section>

      <section className="relative border-y border-white/[0.06]">
        <div className="mx-auto grid w-full max-w-7xl gap-5 px-5 py-10 sm:px-8 sm:py-12 lg:grid-cols-[1.05fr_0.95fr]">
          <form className="product-surface border border-white/[0.08] bg-white/[0.025] p-5 backdrop-blur-none sm:p-6" onSubmit={handleSubmit}>
            <div className="mb-5">
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-cyan-100/50">new capsule</p>
              <h2 className="mt-2 text-3xl font-medium tracking-[-0.014em] text-white">Seal your capsule.</h2>
            </div>

            <div className="grid gap-3.5">
              <VyomInput
                as="textarea"
                icon={MessageSquareText}
                label="Message to the future"
                error={errors.message}
                className="primary-message-field"
                value={message}
                onChange={(event) => setMessage((event.target as HTMLTextAreaElement).value)}
                placeholder="Write the message you want to preserve"
              />
              <div className="grid gap-3.5 md:grid-cols-2">
                <VyomInput
                  icon={LockKeyhole}
                  label="Capsule title"
                  error={errors.title}
                  className="secondary-form-field compact-form-field"
                  value={title}
                  onChange={(event) => setTitle((event.target as HTMLInputElement).value)}
                  placeholder="A note for June"
                />
                <VyomInput
                  icon={UserRound}
                  label="Recipient optional"
                  className="secondary-form-field compact-form-field"
                  value={recipient}
                  onChange={(event) => setRecipient((event.target as HTMLInputElement).value)}
                  placeholder="Name, email, or private note"
                />
                <VyomInput
                  icon={CalendarClock}
                  label="Unlock date/time"
                  error={errors.unlockAt}
                  className="secondary-form-field compact-form-field"
                  type="datetime-local"
                  value={unlockAt}
                  onChange={(event) => setUnlockAt((event.target as HTMLInputElement).value)}
                />
                <div className="glass-input-wrapper secondary-form-field compact-form-field block p-4">
                  <span className="relative z-[2] flex items-center gap-3 text-xs font-medium uppercase tracking-[0.14em] text-white/40">
                    <Link2 className="h-4 w-4 text-cyan-100/60" aria-hidden="true" />
                    Access
                  </span>
                  <div className="relative z-[2] mt-3 rounded-[4px] border border-cyan-100/10 bg-cyan-100/[0.045] px-4 py-3 text-sm font-medium text-cyan-50/90">
                    Private link
                  </div>
                </div>
              </div>
            </div>

            {feedback ? <p className="mt-5 text-sm font-medium text-cyan-100/72">{feedback}</p> : null}

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <VyomButton
                type="submit"
                disabled={isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? "Creating..." : "Create capsule"}
              </VyomButton>
              <VyomButton
                variant="secondary"
                type="button"
                className="flex-1"
                onClick={() => {
                  setTitle("");
                  setMessage("");
                  setRecipient("");
                  setUnlockAt(getDefaultUnlockValue());
                  setErrors({});
                  setFeedback("");
                }}
              >
                Clear
              </VyomButton>
            </div>
          </form>

          <CreatePreview data={{ title, message, recipient, unlockAt: unlockTimestamp, visibility }} />
        </div>
      </section>
    </VyomShell>
  );
}
