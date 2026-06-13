"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navLinks = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Business Partners", href: "/business-partners/customers" },
  { label: "Catalog", href: "/catalog/services" },
  { label: "Service Orders", href: "/service-orders" },
  { label: "Document Engine", href: "/document-engine/documents" },
  { label: "Organization", href: "/organization/tenants" },
  { label: "Reports", href: "/reports/customers" },
];

interface TopBarProps {
  onOpenSettings: () => void;
}

export function TopBar({ onOpenSettings }: TopBarProps) {
  const pathname = usePathname();

  const isActive = (href: string) => pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 flex h-14 items-center gap-1 border-b bg-background px-4">
      <Link
        href="/dashboard"
        className="mr-4 text-lg font-bold tracking-tight"
      >
        Clinical SaaS
      </Link>

      <nav className="flex flex-1 items-center gap-1">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
              isActive(link.href)
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
            )}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <Button variant="ghost" size="icon" onClick={onOpenSettings}>
        <Settings className="h-5 w-5" />
      </Button>
    </header>
  );
}
