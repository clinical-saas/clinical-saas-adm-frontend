'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { apiClient } from '@/lib/api/client';
import { useAuthStore, type TenantInfo } from '@/stores/auth';

type SelectTenantSuccess = {
  user: { id: string; username: string; roleId: string };
  tenantId: string;
};

export default function SelectTenantPage() {
  const router = useRouter();
  const tenants = useAuthStore((s) => s.tenants);
  const setAuth = useAuthStore((s) => s.setAuth);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<string | null>(null);

  async function handleSelect(tenant: TenantInfo) {
    setLoading(tenant.id);
    setError(null);

    try {
      const res = await apiClient<SelectTenantSuccess>('/auth/select-tenant', {
        method: 'POST',
        body: JSON.stringify({ tenantId: tenant.id }),
      });

      setAuth(res.user, res.tenantId);
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to select tenant');
    } finally {
      setLoading(null);
    }
  }

  if (!tenants || tenants.length === 0) {
    return (
      <div className='flex h-screen items-center justify-center'>
        <p className='text-muted-foreground'>No tenants available.</p>
      </div>
    );
  }

  return (
    <div className='flex h-screen items-center justify-center'>
      <div className='w-full max-w-md space-y-6'>
        <h1 className='text-center text-2xl font-semibold'>
          Select a Tenant
        </h1>
        <p className='text-center text-sm text-muted-foreground'>
          Your email is associated with multiple tenants. Choose one to continue.
        </p>
        <div className='space-y-3'>
          {tenants.map((tenant) => (
            <Card
              key={tenant.id}
              className='cursor-pointer transition-shadow hover:shadow-md'
              onClick={() => handleSelect(tenant)}
            >
              <CardHeader>
                <CardTitle className='text-lg'>{tenant.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <Button
                  className='w-full'
                  disabled={loading === tenant.id}
                >
                  {loading === tenant.id ? 'Loading...' : 'Select'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        {error && (
          <p className='text-center text-sm text-destructive'>{error}</p>
        )}
      </div>
    </div>
  );
}
