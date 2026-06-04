type VyomLogoProps = {
  variant?: "icon" | "full";
  size?: "sm" | "md" | "lg";
  className?: string;
};

const sizes = {
  sm: {
    mark: "h-6 w-6",
    text: "text-xs",
    gap: "gap-2.5",
  },
  md: {
    mark: "h-8 w-8",
    text: "text-sm",
    gap: "gap-3",
  },
  lg: {
    mark: "h-10 w-10",
    text: "text-base",
    gap: "gap-3.5",
  },
};

function LogoMark({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 48 48"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M24 5.75c8.8 0 14.25 5.58 14.25 14.54v7.42c0 8.96-5.45 14.54-14.25 14.54S9.75 36.67 9.75 27.71v-7.42C9.75 11.33 15.2 5.75 24 5.75Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.6"
      />
      <path
        d="M15.75 17.25c2.26 2.08 4.58 5.96 6.17 11.08.55 1.76 3.61 1.76 4.16 0 1.59-5.12 3.91-9 6.17-11.08"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.6"
      />
      <path
        d="M12.25 30.55c5.83-3.37 15.72-4.32 24.08-1.71"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.8"
        opacity="0.5"
      />
      <circle cx="36.15" cy="28.82" fill="currentColor" r="2.15" />
    </svg>
  );
}

export function VyomLogo({ variant = "full", size = "md", className = "" }: VyomLogoProps) {
  const sizeClass = sizes[size];

  if (variant === "icon") {
    return (
      <span className={["inline-grid place-items-center text-cyan-100", className].filter(Boolean).join(" ")}>
        <LogoMark className={sizeClass.mark} />
      </span>
    );
  }

  return (
    <span className={["inline-flex items-center", sizeClass.gap, className].filter(Boolean).join(" ")}>
      <span className="liquid-glass relative grid h-10 w-10 place-items-center !rounded-full text-cyan-100 transition duration-300 group-hover:text-cyan-50">
        <span className="absolute inset-1 rounded-full border border-cyan-100/10" />
        <LogoMark className={sizeClass.mark} />
      </span>
      <span className={["font-medium uppercase tracking-[0.22em] text-white/85", sizeClass.text].join(" ")}>
        VYOM
      </span>
    </span>
  );
}
