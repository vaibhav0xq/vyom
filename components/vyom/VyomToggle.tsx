"use client";

import { clsx } from "clsx";

type VyomToggleProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  className?: string;
};

export function VyomToggle({ checked, onChange, label, className }: VyomToggleProps) {
  return (
    <div className={clsx("flex items-center gap-3", className)}>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        className="glass-toggle"
        data-active={checked}
        onClick={() => onChange(!checked)}
      >
        <span className="glass-toggle-thumb" />
      </button>
      {label && (
        <span className="text-sm text-white/62">{label}</span>
      )}
    </div>
  );
}
