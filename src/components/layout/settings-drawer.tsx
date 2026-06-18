"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useLogout } from "@/hooks/use-logout";

const settingsSections = [
  {
    label: "Parameters",
    items: [
      {
        label: "Identification Types",
        href: "/settings/params/identification-types",
      },
    ],
  },
  {
    label: "Platform Catalog",
    items: [
      { label: "Platforms", href: "/settings/platform-catalog/platforms" },
      { label: "Modules", href: "/settings/platform-catalog/modules" },
      { label: "Sub Modules", href: "/settings/platform-catalog/sub-modules" },
    ],
  },
  {
    label: "Account",
    items: [
      { label: "Profile", href: "/settings/profile" },
    ],
  },
];

interface SettingsDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SettingsDrawer({ open, onOpenChange }: SettingsDrawerProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useLogout();

  const handleLogout = async () => {
    await logout();
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Settings</SheetTitle>
        </SheetHeader>
        <nav className="mt-6 flex flex-col gap-4">
          {settingsSections.map((section) => (
            <div key={section.label}>
              <h4 className="mb-1 px-2 text-xs font-medium text-muted-foreground">
                {section.label}
              </h4>
              <ul className="flex flex-col gap-0.5">
                {section.items.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={() => onOpenChange(false)}
                        className={cn(
                          "block rounded-md px-2 py-1.5 text-sm transition-colors",
                          isActive
                            ? "bg-accent text-accent-foreground font-medium"
                            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                        )}
                      >
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
          <div className="mt-4 border-t pt-4">
            <button
              onClick={handleLogout}
              className="block w-full text-left rounded-md px-2 py-1.5 text-sm text-destructive hover:bg-destructive/10"
            >
              Logout
            </button>
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
