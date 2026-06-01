"use client";

import type { ComponentProps } from "react";
import { clsx } from "clsx";

type InputBaseProps = {
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  error?: string;
  className?: string;
};

type AsInput = InputBaseProps & {
  as?: "input";
} & Omit<ComponentProps<"input">, "className">;

type AsTextarea = InputBaseProps & {
  as: "textarea";
} & Omit<ComponentProps<"textarea">, "className">;

type VyomInputProps = AsInput | AsTextarea;

export function VyomInput({
  label,
  icon: Icon,
  error,
  className,
  ...rest
}: VyomInputProps) {
  const isTextarea = rest.as === "textarea";

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { as: _as, ...domProps } = rest;

  return (
    <label className={clsx("glass-input-wrapper block p-5", className)}>
      <span className="relative z-[2] flex items-center gap-3 text-xs font-medium uppercase tracking-[0.14em] text-white/40">
        {Icon && <Icon className="h-4 w-4 text-cyan-100/60" aria-hidden="true" />}
        {label}
      </span>
      {isTextarea ? (
        <textarea
          className="glass-input mt-4 min-h-28 resize-none rounded-[4px] px-4 py-3"
          {...(domProps as Omit<ComponentProps<"textarea">, "className">)}
        />
      ) : (
        <input
          className="glass-input mt-4 rounded-[4px] px-4 py-3"
          {...(domProps as Omit<ComponentProps<"input">, "className">)}
        />
      )}
      {error && (
        <span className="relative z-[2] mt-3 block text-sm text-red-300/90">{error}</span>
      )}
    </label>
  );
}
