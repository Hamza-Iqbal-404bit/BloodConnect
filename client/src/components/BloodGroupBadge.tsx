import { cn } from "@/lib/utils";
import { BloodGroup } from "@/types";
import { bloodGroupDisplay } from "@/lib/enum-utils";

interface BloodGroupBadgeProps {
  bloodGroup: BloodGroup | string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function BloodGroupBadge({ bloodGroup, size = "md", className }: BloodGroupBadgeProps) {
  const sizeClasses = {
    sm: "w-12 h-12 text-sm",
    md: "w-16 h-16 text-base",
    lg: "w-20 h-20 text-lg",
  };

  // Get display string (A+, B-, etc.) from enum value
  const displayValue = Object.values(BloodGroup).includes(bloodGroup as BloodGroup)
    ? bloodGroupDisplay[bloodGroup as BloodGroup]
    : bloodGroup;

  return (
    <div
      className={cn(
        "rounded-full border-2 border-primary flex items-center justify-center font-bold text-primary bg-card",
        sizeClasses[size],
        className
      )}
      data-testid={`badge-bloodgroup-${bloodGroup}`}
    >
      {displayValue}
    </div>
  );
}
