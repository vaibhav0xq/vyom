import { Link2, LockKeyhole, MessageSquareText } from "lucide-react";
import type { CSSProperties } from "react";

const steps = [
  {
    icon: MessageSquareText,
    title: "Create a capsule",
    detail: "Write a message and choose when it should unlock.",
  },
  {
    icon: LockKeyhole,
    title: "Choose access",
    detail: "Share by link or restrict reveal to a Sui wallet.",
  },
  {
    icon: Link2,
    title: "Reveal later",
    detail: "The capsule stays sealed until time and access conditions are met.",
  },
];

export function CapsuleFlow() {
  return (
    <div className="capsule-flow relative overflow-hidden border border-white/[0.08] bg-white/[0.025] p-5 backdrop-blur-none">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-100/35 to-transparent" />
      <div className="flow-beam absolute left-8 right-8 top-[5.5rem] h-px bg-cyan-100/16" />
      <div className="grid gap-4 md:grid-cols-3">
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <div
              key={step.title}
              className="flow-node group relative min-h-60 overflow-hidden border border-white/[0.06] bg-black/22 p-5 rounded-[var(--glass-radius)] transition duration-500 hover:border-cyan-100/18 hover:bg-cyan-100/[0.02]"
              style={{ "--stagger": index } as CSSProperties}
            >
              <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full bg-cyan-100/[0.03] blur-2xl transition duration-500 group-hover:bg-cyan-100/[0.07]" />
              <div className="relative z-10 flex items-center justify-between">
                {/* Glass icon circle */}
                <span className="liquid-glass grid h-12 w-12 place-items-center text-cyan-100">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="text-xs font-medium tabular-nums text-white/28">0{index + 1}</span>
              </div>
              <div className="relative z-10 mt-12">
                <h3 className="text-2xl font-medium tracking-[-0.014em] text-white">{step.title}</h3>
                <p className="mt-4 text-sm leading-7 text-white/50">{step.detail}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
