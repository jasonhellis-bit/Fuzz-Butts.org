import HeartDoodle from "@/components/ui/HeartDoodle";

const SIZES = {
  md: "text-3xl sm:text-4xl",
  lg: "text-4xl sm:text-5xl",
};

export default function SectionHeading({
  children,
  as: Tag = "h2",
  size = "md",
  heart = true,
  className = "",
}: {
  children: React.ReactNode;
  as?: "h1" | "h2" | "h3";
  size?: keyof typeof SIZES;
  heart?: boolean;
  className?: string;
}) {
  return (
    <Tag
      className={`flex items-center gap-2 font-bold tracking-tight text-brand ${SIZES[size]} ${className}`}>
      <span>{children}</span>
      {heart && <HeartDoodle className="h-[0.9em] w-[0.9em] shrink-0 -translate-y-1 text-gold" />}
    </Tag>
  );
}
