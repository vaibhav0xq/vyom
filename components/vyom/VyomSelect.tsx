import { ChevronDown } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";
import { clsx } from "clsx";

type VyomSelectProps = {
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  className?: string;
  children: ReactNode;
} & Omit<ComponentProps<"select">, "className">;

export function VyomSelect({
  label,
  icon: Icon,
  className,
  children,
  ...props
}: VyomSelectProps) {
  return (
    <label className={clsx("glass-select-wrapper block p-5", className)}>
      <span className="relative z-[2] flex items-center gap-3 text-xs font-medium uppercase tracking-[0.14em] text-white/40">
        {Icon && <Icon className="h-4 w-4 text-cyan-100/60" aria-hidden="true" />}
        {label}
      </span>
      <div className="relative mt-4">
        <select
          className="glass-select rounded-[4px] px-4 py-3 pr-10"
          {...props}
        >
          {children}
        </select>
        <ChevronDown className="glass-select-chevron h-4 w-4" aria-hidden="true" />
      </div>
    </label>
  );
}
