import Link from "next/link";
import { ChevronRight } from "lucide-react";

type Variant = "primary" | "outline" | "onDark";
type Size = "sm" | "md";

const VARIANTS: Record<Variant, string> = {
  primary: "bg-brand text-white shadow-sm shadow-brand/20 hover:bg-brand-dark",
  outline: "border border-gold bg-surface text-brand hover:bg-brand-tint",
  onDark: "border border-gold-light/70 text-white hover:bg-white/10",
};

const SIZES: Record<Size, string> = {
  sm: "gap-1.5 px-4 py-1.5 text-sm",
  md: "gap-2 px-6 py-3 text-base",
};

interface CommonProps {
  children: React.ReactNode;
  variant?: Variant;
  size?: Size;
  chevron?: boolean;
  className?: string;
}

type ButtonProps = CommonProps &
  (
    | ({ href: string } & Omit<React.ComponentProps<typeof Link>, "href" | "className" | "children">)
    | ({ href?: undefined } & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children">)
  );

// Button styling for elements that can't be a Button themselves, e.g. a
// button-looking <span> inside a card that is already a link.
export function buttonClasses(variant: Variant = "primary", size: Size = "md") {
  return `inline-flex items-center justify-center rounded-full font-semibold transition-colors disabled:opacity-50 ${VARIANTS[variant]} ${SIZES[size]}`;
}

// Pill-shaped button. Renders a Next <Link> when `href` is given, otherwise a <button>.
export default function Button({
  children,
  variant = "primary",
  size = "md",
  chevron = false,
  className = "",
  ...rest
}: ButtonProps) {
  const classes = `${buttonClasses(variant, size)} ${className}`;
  const content = (
    <>
      {children}
      {chevron && <ChevronRight size={size === "sm" ? 14 : 18} aria-hidden="true" />}
    </>
  );

  if (rest.href !== undefined) {
    return (
      <Link {...rest} className={classes}>
        {content}
      </Link>
    );
  }
  return (
    <button type="button" {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)} className={classes}>
      {content}
    </button>
  );
}
