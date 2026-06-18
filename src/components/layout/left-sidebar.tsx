"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { businessPartnersSidebar } from "@/features/business-partners/sidebar-config";
import { catalogSidebar } from "@/features/catalog/sidebar-config";
import { serviceOrdersSidebar } from "@/features/service-orders/sidebar-config";
import { documentEngineSidebar } from "@/features/document-engine/sidebar-config";
import { organizationSidebar } from "@/features/organization/sidebar-config";
import type { LucideIcon } from "lucide-react";

const sidebarConfigs: Record<
  string,
  { title: string; sections: { label: string; items: { label: string; href: string; icon: LucideIcon }[] }[] }
> = {
  "/business-partners": businessPartnersSidebar,
  "/catalog": catalogSidebar,
  "/service-orders": serviceOrdersSidebar,
  "/document-engine": documentEngineSidebar,
  "/organization": organizationSidebar,
};

function getActiveConfig(pathname: string) {
  const prefix = Object.keys(sidebarConfigs).find((key) =>
    pathname.startsWith(key),
  );
  return prefix ? sidebarConfigs[prefix] : null;
}

export function LeftSidebar() {
  const pathname = usePathname();
  const config = getActiveConfig(pathname);

  if (!config) return null;

  return (
    <aside className="flex w-56 flex-col gap-4 border-r bg-muted/30 p-4">
      <h3 className="text-sm font-semibold text-muted-foreground">
        {config.title}
      </h3>
      <nav className="flex flex-col gap-4">
        {config.sections.map((section) => (
          <div key={section.label}>
            <h4 className="mb-1 px-2 text-xs font-medium text-muted-foreground">
              {section.label}
            </h4>
            <ul className="flex flex-col gap-0.5">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors",
                        isActive
                          ? "bg-accent text-accent-foreground font-medium"
                          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}
