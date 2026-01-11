import { Badge } from "@/components/ui/badge";
import { Clock, AlertTriangle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { UrgencyLevel } from "@/types";
import { urgencyDisplay } from "@/lib/enum-utils";

interface UrgencyBadgeProps {
  urgency: UrgencyLevel | "normal" | "urgent" | "emergency";
  showTime?: boolean;
  className?: string;
}

// Map old urgency values to new enum values
const legacyToEnum: Record<string, UrgencyLevel> = {
  normal: UrgencyLevel.LOW,
  urgent: UrgencyLevel.MEDIUM,
  emergency: UrgencyLevel.CRITICAL,
};

export function UrgencyBadge({ urgency, showTime = true, className }: UrgencyBadgeProps) {
  // Normalize to new enum format
  const normalizedUrgency = Object.values(UrgencyLevel).includes(urgency as UrgencyLevel)
    ? (urgency as UrgencyLevel)
    : legacyToEnum[urgency] || UrgencyLevel.LOW;

  const config = {
    [UrgencyLevel.LOW]: {
      label: "Normal",
      time: "24 hrs",
      icon: Clock,
      className: "bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700",
    },
    [UrgencyLevel.MEDIUM]: {
      label: "Urgent",
      time: "6 hrs",
      icon: AlertTriangle,
      className: "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800 animate-pulse",
    },
    [UrgencyLevel.HIGH]: {
      label: "High Priority",
      time: "2 hrs",
      icon: AlertTriangle,
      className: "bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800 animate-pulse",
    },
    [UrgencyLevel.CRITICAL]: {
      label: "Emergency",
      time: "Immediate",
      icon: AlertCircle,
      className: "bg-red-100 text-red-800 border-red-300 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800 animate-pulse",
    },
  };

  const { label, time, icon: Icon, className: badgeClassName } = config[normalizedUrgency];

  return (
    <Badge
      variant="outline"
      className={cn("border font-semibold gap-1.5", badgeClassName, className)}
      data-testid={`badge-urgency-${urgency}`}
    >
      <Icon className="w-3.5 h-3.5" />
      {label}
      {showTime && <span className="text-xs">({time})</span>}
    </Badge>
  );
}
