"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { queryKeys } from "@/lib/api/queries";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { EmailInput } from "@/components/shared/email-input";
import { PhoneInput } from "@/components/shared/phone-input";
import { NameInput } from "@/components/shared/name-input";

// `clave_valor`: TenantLite refleja el tenant real (snake_case del backend)
export type TenantLite = {
  id: string;
  code: string;
  business_name: string;
  active: boolean;
};

const formSchema = z.object({
  tenantId: z.string().uuid("Tenant requerido"),
  code: z.string().min(3, "Código: mínimo 3 caracteres"),
  businessName: z
    .string()
    .min(1, "Nombre requerido")
    .transform((v) => v.toUpperCase()),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  phone: z.string().optional(),
  address: z.string().optional(),
  active: z.boolean(),
});

export type BusinessUnitFormValues = z.infer<typeof formSchema>;

interface BusinessUnitFormProps {
  defaultValues?: Partial<BusinessUnitFormValues>;
  onSubmit: (values: BusinessUnitFormValues) => Promise<void>;
  isSubmitting?: boolean;
  mode: "create" | "edit";
}

export function BusinessUnitForm({
  defaultValues,
  onSubmit,
  isSubmitting = false,
  mode,
}: BusinessUnitFormProps) {
  const { data: tenants } = useQuery({
    queryKey: queryKeys.tenants.list(),
    queryFn: () => apiClient<TenantLite[]>("/tenant"),
  });

  const form = useForm<BusinessUnitFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tenantId: "",
      code: "",
      businessName: "",
      email: "",
      phone: "",
      address: "",
      active: true,
      ...defaultValues,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="tenantId"
            render={({ field }) => {
              const selected = tenants?.find((t) => t.id === field.value);
              return (
                <FormItem>
                  <FormLabel>Tenant</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={(v: string | null) => {
                        if (v) {
                          field.onChange(v);
                        }
                      }}
                      disabled={mode === "edit"}
                    >
                      <SelectTrigger className="min-w-[200px]">
                        <SelectValue placeholder="Selecciona un tenant" className="truncate">
                          {selected ? selected.business_name : "Selecciona un tenant"}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent className="max-w-[300px]">
                        {tenants?.map((t) => (
                          <SelectItem key={t.id} value={t.id} className="truncate">
                            {t.business_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />

          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Código</FormLabel>
                <FormControl>
                  <Input placeholder="BU001" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="businessName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre Comercial</FormLabel>
              <FormControl>
                <NameInput
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  placeholder="CONSULTORIOS MÉDICOS"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <EmailInput
                    value={field.value ?? ""}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    placeholder="unidad@example.com"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Teléfono</FormLabel>
                <FormControl>
                  <PhoneInput
                    value={field.value ?? ""}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    placeholder="+XX-XXX-XXX-XXXX"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Dirección</FormLabel>
              <FormControl>
                <Textarea placeholder="Dirección completa, referencia, etc." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="active"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Activo/Inactivo</FormLabel>
              <FormControl>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                    className="sr-only"
                  />
                  <div
                    data-checked={field.value}
                    className="relative h-6 w-11 rounded-full bg-input transition-colors data-[checked=true]:bg-primary"
                  >
                    <div
                      data-checked={field.value}
                      className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform data-[checked=true]:translate-x-5"
                    />
                  </div>
                  <span className="text-sm">{field.value ? "Activo" : "Inactivo"}</span>
                </label>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-2 pt-2">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Guardando..." : mode === "create" ? "Crear" : "Guardar"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
