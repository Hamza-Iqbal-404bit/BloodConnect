import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertCircle, Clock, XCircle, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { ApprovalStatus, RequestStatus } from "@/types";

type InventoryStatus = "available" | "low" | "urgent";
type LegacyStatus = "pending" | "approved" | "rejected" | "in_progress" | "completed" | "cancelled";

interface StatusBadgeProps {
  status: ApprovalStatus | RequestStatus | InventoryStatus | LegacyStatus | string;
  className?: string;
}

interface StatusConfig {
  label: string;
  icon: typeof CheckCircle2;
  className: string;
}

function getStatusConfig(status: string): StatusConfig {
  // Inventory statuses
  if (status === "available") {
    return {
      label: "Available",
      icon: CheckCircle2,
      className: "bg-green-100 text-green-800 border-green-300 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800",
    };
  }
  if (status === "low") {
    return {
      label: "Low",
      icon: AlertCircle,
      className: "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800",
    };
  }
  if (status === "urgent") {
    return {
      label: "Urgent",
      icon: AlertCircle,
      className: "bg-red-100 text-red-800 border-red-300 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800",
    };
  }

  // Pending status (both approval and request)
  if (status === ApprovalStatus.PENDING || status === "pending") {
    return {
      label: "Pending",
      icon: Clock,
      className: "bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700",
    };
  }

  // Approved status
  if (status === ApprovalStatus.APPROVED || status === "approved") {
    return {
      label: "Approved",
      icon: CheckCircle2,
      className: "bg-green-100 text-green-800 border-green-300 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800",
    };
  }

  // Rejected status
  if (status === ApprovalStatus.REJECTED || status === RequestStatus.REJECTED || status === "rejected") {
    return {
      label: "Rejected",
      icon: XCircle,
      className: "bg-red-100 text-red-800 border-red-300 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800",
    };
  }

  // Assigned / In Progress
  if (status === RequestStatus.ASSIGNED || status === "in_progress") {
    return {
      label: "In Progress",
      icon: Users,
      className: "bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800",
    };
  }

  // Fulfilled / Completed
  if (status === RequestStatus.FULFILLED || status === "completed") {
    return {
      label: "Completed",
      icon: CheckCircle2,
      className: "bg-green-100 text-green-800 border-green-300 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800",
    };
  }

  // Cancelled
  if (status === "cancelled") {
    return {
      label: "Cancelled",
      icon: XCircle,
      className: "bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700",
    };
  }

  // Default fallback
  return {
    label: status,
    icon: Clock,
    className: "bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700",
  };
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const { label, icon: Icon, className: badgeClassName } = getStatusConfig(status);

  return (
    <Badge
      variant="outline"
      className={cn("border font-medium gap-1", badgeClassName, className)}
      data-testid={`badge-status-${status}`}
    >
      <Icon className="w-3 h-3" />
      {label}
    </Badge>
  );
}
