// Hand-drawn style outline heart used as a decorative accent beside headings
// and on photo corners. Inherits color from `currentColor` (gold by default).
export default function HeartDoodle({
  className = "h-8 w-8 text-gold",
  strokeWidth = 1.75,
}: {
  className?: string;
  strokeWidth?: number;
}) {
  return (
    <svg
      viewBox="0 0 24 28"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true">
      <path d="M12.2 22.5C9.4 19.6 3.1 14.6 2.6 9.4 2.2 5.6 4.6 3 7.5 3.2c2.2.1 3.9 1.8 4.6 4.1.9-2.6 2.9-4.6 5.4-4.4 2.9.2 4.6 3 3.9 6.4-1 4.9-5.6 9-8.7 13.4-.5.7-.9 1.6-1.1 2.8" />
    </svg>
  );
}
