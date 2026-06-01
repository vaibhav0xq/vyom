"use client";

import { LockKeyhole, Radio, Sparkles } from "lucide-react";
import type { CSSProperties } from "react";
import { useState } from "react";

const traces = ["create", "lock", "share", "open"];

const innerParticles = [
  { size: 3, left: "38%", top: "34%", color: "rgba(195, 250, 255, 0.28)" },
  { size: 2, left: "62%", top: "42%", color: "rgba(255, 255, 255, 0.22)" },
  { size: 4, left: "45%", top: "58%", color: "rgba(64, 221, 255, 0.24)" },
  { size: 2, left: "55%", top: "28%", color: "rgba(195, 250, 255, 0.2)" },
  { size: 3, left: "35%", top: "68%", color: "rgba(255, 255, 255, 0.18)" },
  { size: 2, left: "60%", top: "72%", color: "rgba(64, 221, 255, 0.2)" },
];

export function CapsuleHero({ compact = false }: { compact?: boolean }) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  return (
    <div
      className={[
        "capsule-stage reveal-up relative z-10 w-full min-w-0 overflow-hidden",
        compact ? "lg:overflow-visible" : "sm:overflow-visible",
        compact ? "min-h-[320px] sm:min-h-[390px] lg:min-h-[470px]" : "min-h-[460px] sm:min-h-[540px] lg:min-h-[620px]",
      ].join(" ")}
      aria-label="Interactive encrypted capsule visualization"
      onMouseMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        setTilt({
          x: ((event.clientX - rect.left) / rect.width - 0.5) * 2,
          y: ((event.clientY - rect.top) / rect.height - 0.5) * 2,
        });
      }}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
      style={
        {
          "--tilt-x": `${tilt.x}`,
          "--tilt-y": `${tilt.y}`,
        } as CSSProperties
      }
    >
      {/* Depth glow — controlled */}
      <div className="hero-depth-glow absolute left-1/2 top-1/2 h-[28rem] w-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full sm:h-[34rem] sm:w-[34rem]" />

      {/* Outermost ring — very soft */}
      <div className="absolute left-1/2 top-1/2 h-[20rem] w-[20rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-100/[0.04] sm:h-[32rem] sm:w-[32rem]" />

      {/* Orbital rings — softer outer, sharper inner */}
      <div className="orbital-ring orbital-ring-a absolute left-1/2 top-1/2 h-[18rem] w-[18rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-100/[0.08] sm:h-[28rem] sm:w-[28rem]" />
      <div className="orbital-ring orbital-ring-b absolute left-1/2 top-1/2 h-[14rem] w-[25rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-violet-100/[0.07] sm:h-[22rem] sm:w-[36rem]" />
      <div className="orbital-ring orbital-ring-c absolute left-1/2 top-1/2 h-[10rem] w-[27rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.05] sm:h-[15rem] sm:w-[40rem]" />
      <div className="orbital-ring orbital-ring-d absolute left-1/2 top-1/2 h-[25rem] w-[10rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-100/[0.06] sm:h-[28rem] sm:w-[12rem]" />
      <div className="orbital-ring orbital-ring-e absolute left-1/2 top-1/2 h-[8rem] w-[21rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-100/[0.1]" />

      {/* Particle traces */}
      {traces.map((trace, index) => (
        <span
          key={trace}
          className="particle-trace absolute left-1/2 top-1/2 h-2 w-2 rounded-full bg-cyan-50 shadow-[0_0_18px_rgba(195,250,255,0.7)]"
          style={{ "--trace-index": index } as CSSProperties}
        />
      ))}

      {/* Floating chip — LOCKED (liquid glass) */}
      <div
        className={[
          "capsule-orbiting-ui capsule-chip-left liquid-glass absolute z-30 hidden w-52 p-5 sm:block",
          compact ? "left-[2%] top-[15%] lg:left-[4%] xl:left-[7%]" : "left-[3%] top-[18%]",
        ].join(" ")}
      >
        <div className="absolute inset-x-0 top-0 h-[1px] rounded-t-[inherit] bg-gradient-to-r from-transparent via-white/[0.15] to-transparent" />
        <div className="mb-8 flex items-center gap-3 text-cyan-100/70">
          <LockKeyhole className="h-4 w-4" aria-hidden="true" />
          <span className="text-xs font-medium uppercase tracking-[0.14em]">locked</span>
        </div>
        <p className="text-sm text-white/58">Unlocks Jun 30, 2026</p>
        <div className="mt-4 h-1 overflow-hidden rounded-sm bg-white/[0.06]">
          <span className="loading-shimmer block h-full w-2/3 bg-cyan-100/40" />
        </div>
      </div>

      {/* Floating chip — PRIVATE LINK (liquid glass) */}
      <div
        className={[
          "capsule-orbiting-ui capsule-chip-right liquid-glass absolute z-30 hidden w-52 p-5 md:block",
          compact ? "bottom-[18%] right-[2%] lg:right-[5%] xl:right-[8%]" : "bottom-[13%] right-[2%]",
        ].join(" ")}
      >
        <div className="absolute inset-x-0 top-0 h-[1px] rounded-t-[inherit] bg-gradient-to-r from-transparent via-cyan-100/[0.18] to-transparent" />
        <div className="mb-8 flex items-center gap-3 text-violet-100/68">
          <Sparkles className="h-4 w-4" aria-hidden="true" />
          <span className="text-xs font-medium uppercase tracking-[0.14em]">private link</span>
        </div>
        <p className="text-sm text-white/58">Ready to share</p>
        <div className="mt-4 grid grid-cols-5 gap-1">
          {Array.from({ length: 10 }).map((_, index) => (
            <span key={index} className="h-1 rounded-sm bg-cyan-100/16" />
          ))}
        </div>
      </div>

      {/* Capsule core — glass + metallic hybrid */}
      <div className="capsule-core absolute left-1/2 top-1/2 z-20 h-[23rem] w-[11rem] -translate-x-1/2 -translate-y-1/2 overflow-hidden border border-cyan-100/20 bg-[#06111b]/80 shadow-[0_0_90px_rgba(64,221,255,0.2)] backdrop-blur-[3px] sm:h-[28rem] sm:w-[13.2rem]">
        <div className="capsule-sheen absolute inset-0" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_20%,rgba(255,255,255,0.14),transparent_28%),radial-gradient(ellipse_at_50%_74%,rgba(138,109,255,0.09),transparent_38%)]" />

        {/* Edge highlights */}
        <div className="capsule-edge capsule-edge-left absolute inset-y-10 left-4 w-px" />
        <div className="capsule-edge capsule-edge-right absolute inset-y-10 right-4 w-px" />

        {/* Internal panels */}
        <div className="absolute inset-x-6 top-7 h-20 rounded-[4px] border border-cyan-100/12 bg-cyan-100/[0.035] sm:h-24" />
        <div className="absolute inset-x-6 bottom-8 h-24 rounded-[4px] border border-violet-100/[0.08] bg-violet-100/[0.03] sm:h-28" />

        {/* Metallic bands */}
        <div className="capsule-band absolute left-1/2 top-[31%] h-px w-[74%] -translate-x-1/2" />
        <div className="capsule-band absolute left-1/2 top-[68%] h-px w-[74%] -translate-x-1/2" />

        {/* Central lens — sharper inner core */}
        <div className="capsule-lens absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-100/18 bg-cyan-100/[0.06] shadow-[0_0_60px_rgba(64,221,255,0.22)] sm:h-32 sm:w-32" />
        <div className="capsule-pulse absolute left-1/2 top-1/2 h-11 w-11 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-50/75 shadow-[0_0_45px_rgba(195,250,255,0.6)]" />

        {/* Inner particles — max 6, slow drift, low opacity */}
        {innerParticles.map((p, i) => (
          <span
            key={i}
            className="capsule-inner-particle"
            style={{
              width: p.size,
              height: p.size,
              left: p.left,
              top: p.top,
              backgroundColor: p.color,
              boxShadow: `0 0 ${p.size * 3}px ${p.color}`,
            }}
          />
        ))}

        {/* Data lines */}
        <div className="data-lines absolute inset-x-8 top-32 grid gap-3 sm:top-40">
          <span />
          <span />
          <span />
          <span />
          <span />
        </div>
      </div>

      {/* Bottom label */}
      <div
        className={[
          "liquid-glass absolute left-1/2 z-10 hidden -translate-x-1/2 items-center gap-3 px-5 py-3.5 text-xs font-medium uppercase tracking-[0.14em] text-white/60 lg:flex",
          compact ? "bottom-1 w-[min(24rem,58%)] justify-center" : "bottom-8",
        ].join(" ")}
      >
        <Radio className="h-4 w-4 text-cyan-100/60" aria-hidden="true" />
        encrypted capsule preview
      </div>
    </div>
  );
}
