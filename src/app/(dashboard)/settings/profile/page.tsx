"use client";

import { useAuthStore } from "@/stores/auth";
import { useLogout } from "@/hooks/use-logout";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ProfilePage() {
  const { user } = useAuthStore();
  const { logout } = useLogout();

  if (!user) {
    return (
      <div className="space-y-6">
        <PageHeader title="Profile" />
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            No session data available.
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Profile" />
      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">Username</p>
            <p className="font-medium">{user.username}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Role ID</p>
            <p className="font-medium">{user.roleId}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">User ID</p>
            <p className="font-medium">{user.id}</p>
          </div>
          <div className="pt-4">
            <Button variant="destructive" onClick={logout}>
              Logout
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
