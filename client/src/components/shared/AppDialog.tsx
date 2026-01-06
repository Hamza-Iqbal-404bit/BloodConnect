import type { ReactNode } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const MAX_WIDTH_CLASSES: Record<"sm" | "md" | "lg" | "xl" | "2xl" | "3xl", string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  "3xl": "max-w-3xl",
};

interface AppDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
  maxWidth?: keyof typeof MAX_WIDTH_CLASSES;
  maxHeightClassName?: string;
  showCloseButton?: boolean;
  closeButtonAriaLabel?: string;
  contentClassName?: string;
  bodyClassName?: string;
  header?: ReactNode;
  footer?: ReactNode;
}

export function AppDialog({
  open,
  onOpenChange,
  children,
  maxWidth = "3xl",
  maxHeightClassName = "max-h-[90vh]",
  showCloseButton = true,
  closeButtonAriaLabel = "Close",
  contentClassName,
  bodyClassName,
  header,
  footer,
}: AppDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          MAX_WIDTH_CLASSES[maxWidth],
          maxHeightClassName,
          "overflow-y-auto p-0",
          contentClassName,
        )}
      >
        {header ?? (
          showCloseButton && (
            <div className="sticky top-0 z-10 flex justify-end bg-background/80 backdrop-blur px-4 py-2 border-b">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onOpenChange(false)}
                aria-label={closeButtonAriaLabel}
              >
                ×
              </Button>
            </div>
          )
        )}
        <div className={cn("p-4 sm:p-6", bodyClassName)}>
          {children}
          {footer && <div className="mt-4">{footer}</div>}
        </div>
      </DialogContent>
    </Dialog>
  );
}
