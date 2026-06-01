import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { clsx } from "clsx";

type BaseProps = {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
};

type LinkProps = BaseProps & {
  href: string;
} & Omit<ComponentProps<typeof Link>, "href" | "className">;

type ButtonProps = BaseProps & {
  href?: never;
} & Omit<ComponentProps<"button">, "className">;

type VyomButtonProps = LinkProps | ButtonProps;

const variantClass: Record<string, string> = {
  primary: "glass-btn-primary",
  secondary: "glass-btn-secondary",
  ghost: "glass-btn-ghost",
};

export function VyomButton({
  children,
  variant = "primary",
  className,
  ...props
}: VyomButtonProps) {
  const classes = clsx(
    "glass-btn min-h-12 px-5 py-3 text-sm",
    variant === "ghost" && "min-h-10 px-4 py-2",
    variantClass[variant],
    className,
  );

  if ("href" in props && props.href) {
    const { href, ...rest } = props as LinkProps;
    return (
      <Link href={href} className={classes} {...rest}>
        <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
      </Link>
    );
  }

  const buttonProps = props as ButtonProps;
  return (
    <button className={classes} {...buttonProps}>
      <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
    </button>
  );
}
