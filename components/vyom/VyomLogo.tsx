type VyomLogoProps = {
  variant?: "icon" | "full";
  size?: "sm" | "md" | "lg";
  className?: string;
};

const sizes = {
  sm: {
    text: "text-xs",
    dot: "h-1 w-1",
  },
  md: {
    text: "text-sm",
    dot: "h-1.5 w-1.5",
  },
  lg: {
    text: "text-base",
    dot: "h-2 w-2",
  },
};

export function VyomLogo({ variant = "full", size = "md", className = "" }: VyomLogoProps) {
  const sizeClass = sizes[size];

  if (variant === "icon") {
    return (
      <span
        className={[
          "inline-flex font-medium uppercase tracking-[0.16em] text-cyan-50",
          sizeClass.text,
          className,
        ].filter(Boolean).join(" ")}
      >
        V
      </span>
    );
  }

  return (
    <span className={["inline-flex items-center gap-2", className].filter(Boolean).join(" ")}>
      <span className={["font-medium uppercase tracking-[0.24em] text-white/88 transition duration-300 group-hover:text-cyan-50", sizeClass.text].join(" ")}>
        VYOM
      </span>
      <span className={["rounded-full bg-cyan-100/80 shadow-[0_0_12px_rgba(143,246,255,0.45)]", sizeClass.dot].join(" ")} />
    </span>
  );
}
