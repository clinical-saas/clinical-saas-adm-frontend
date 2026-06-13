"use client";

import { useState } from "react";
import { TopBar } from "@/components/layout/top-bar";
import { LeftSidebar } from "@/components/layout/left-sidebar";
import { SettingsDrawer } from "@/components/layout/settings-drawer";
import { AuthGuard } from "@/components/auth/auth-guard";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <AuthGuard>
      <div className="flex h-screen flex-col">
        <TopBar onOpenSettings={() => setSettingsOpen(true)} />
        <div className="flex flex-1 overflow-hidden">
          <LeftSidebar />
          <main className="flex-1 overflow-auto p-6">{children}</main>
        </div>
        <SettingsDrawer
          open={settingsOpen}
          onOpenChange={setSettingsOpen}
        />
      </div>
    </AuthGuard>
  );
}
