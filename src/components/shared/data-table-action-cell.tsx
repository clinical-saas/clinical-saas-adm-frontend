"use client";

import { Eye, Pencil, ToggleLeft, ToggleRight, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type ActionVariant = "view" | "edit" | "toggle";

export interface Action {
  variant: ActionVariant;
  onClick: () => void;
  title: string;
  disabled?: boolean;
  isActive?: boolean;
}

export interface DataTableActionCellProps {
  actions: Action[];
  className?: string;
}

const defaultIconMap: Record<ActionVariant, LucideIcon> = {
  view: Eye,
  edit: Pencil,
  toggle: ToggleRight,
};

const iconColorMap: Record<ActionVariant, (isActive?: boolean) => string> = {
  view: () => "text-blue-600 dark:text-blue-400",
  edit: () => "text-amber-600 dark:text-amber-400",
  toggle: (isActive?: boolean) =>
    isActive
      ? "text-green-600 dark:text-green-400"
      : "text-red-600 dark:text-red-400",
};

const toggleIconMap: Record<string, LucideIcon> = {
  true: ToggleRight,
  false: ToggleLeft,
};

export function DataTableActionCell({ actions, className }: DataTableActionCellProps) {
  return (
    <div className={cn("flex items-center gap-1 cursor-pointer", className)}>
      {actions.map((action, index) => {
        const Icon =
          action.variant === "toggle"
            ? toggleIconMap[String(action.isActive ?? true)]
            : defaultIconMap[action.variant];
        const colorClass = iconColorMap[action.variant](action.isActive);

        return (
          <Button
            key={index}
            variant="ghost"
            size="icon"
            onClick={action.onClick}
            title={action.title}
            disabled={action.disabled}
            className="cursor-pointer"
          >
            <Icon className={cn("h-4 w-4", colorClass)} />
          </Button>
        );
      })}
    </div>
  );
}

export { Eye, Pencil, ToggleLeft, ToggleRight };
