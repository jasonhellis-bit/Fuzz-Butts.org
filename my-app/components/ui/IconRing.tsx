// Gold circular frame for a lucide icon, e.g. <IconRing><PawPrint /></IconRing>.
const SIZES = {
  sm: "h-10 w-10 [&>svg]:h-5 [&>svg]:w-5",
  md: "h-14 w-14 [&>svg]:h-7 [&>svg]:w-7",
  lg: "h-16 w-16 [&>svg]:h-8 [&>svg]:w-8",
};

export default function IconRing({
  children,
  size = "md",
  className = "",
}: {
  children: React.ReactNode;
  size?: keyof typeof SIZES;
  className?: string;
}) {
  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-full border-2 border-gold bg-surface text-brand ${SIZES[size]} ${className}`}>
      {children}
    </span>
  );
}
