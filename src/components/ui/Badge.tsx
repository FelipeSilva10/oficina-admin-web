import { cn } from "@/lib/utils";

interface BadgeProps {
  variant?: "blue" | "green" | "amber" | "red" | "gray" | "purple";
  children: React.ReactNode;
  className?: string;
}

const variants = {
  blue:   "bg-blue-50 text-blue-700 border border-blue-200",
  green:  "bg-green-50 text-green-700 border border-green-200",
  amber:  "bg-amber-50 text-amber-700 border border-amber-200",
  red:    "bg-red-50 text-red-700 border border-red-200",
  gray:   "bg-gray-100 text-gray-600 border border-gray-200",
  purple: "bg-purple-50 text-purple-700 border border-purple-200",
};

export default function Badge({ variant = "gray", children, className }: BadgeProps) {
  return (
    <span className={cn(
      "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold",
      variants[variant],
      className
    )}>
      {children}
    </span>
  );
}
