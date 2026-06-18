"use client";

import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuthStore } from "@/stores/auth";
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

const formSchema = z.object({
  tenantId: z.string().uuid(),
  active: z.boolean(),
  firstName: z.string().min(1, "Nombres requerido"),
  lastName: z.string().min(1, "Apellidos requerido"),
  birthDate: z.string().optional(),
  shortAddress: z.string().optional(),
  address: z.string().optional(),
  email: z.string().email("Email invalido").optional().or(z.literal("")),
  phone: z.string().optional(),
  isSupplier: z.boolean(),
  isAgent: z.boolean(),
  isCustomer: z.boolean(),
  readonly: z.boolean(),
});

export type SpecialistFormValues = z.infer<typeof formSchema>;

interface SpecialistFormProps {
  defaultValues?: Partial<SpecialistFormValues>;
  onSubmit: (values: SpecialistFormValues) => Promise<void>;
  isSubmitting?: boolean;
  mode: "create" | "edit";
}

export function SpecialistForm({
  defaultValues,
  onSubmit,
  isSubmitting = false,
  mode,
}: SpecialistFormProps) {
  const tenants = useAuthStore((s) => s.tenants);

  console.log("tenants: ", tenants);

  const form = useForm<SpecialistFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tenantId: "",
      active: true,
      firstName: "",
      lastName: "",
      birthDate: "",
      shortAddress: "",
      address: "",
      email: "",
      phone: "",
      isSupplier: true,
      isAgent: false,
      isCustomer: false,
      readonly: false,
      ...defaultValues,
    },
  });

  const age = useMemo(() => {
    const bd = form.watch("birthDate");
    if (!bd) return null;
    const birth = new Date(bd);
    if (isNaN(birth.getTime())) return null;
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
  }, [form.watch("birthDate")]);

  const watchedRoleChips = form.watch(["isSupplier", "isAgent", "isCustomer"]);

  const roleChips = [
    { key: "isSupplier", label: "Proveedor", active: !!watchedRoleChips[0] },
    { key: "isAgent", label: "Agente", active: !!watchedRoleChips[1] },
    { key: "isCustomer", label: "Cliente", active: !!watchedRoleChips[2] },
  ];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
          {mode === "edit" && (
            <FormField
              control={form.control}
              name="tenantId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ID</FormLabel>
                  <FormControl>
                    <Input disabled value={defaultValues?.tenantId ?? ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name="tenantId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tenant</FormLabel>
                <FormControl>
                  <Select
                    value={field.value}
                    onValueChange={(v: string | null) => v && field.onChange(v)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {tenants?.map((t) => (
                        <SelectItem key={t.id} value={t.id}>
                          {t.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                    <span className="text-sm">
                      {field.value ? "Activo" : "Inactivo"}
                    </span>
                  </label>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombres</FormLabel>
                <FormControl>
                  <Input placeholder="Juan" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Apellidos</FormLabel>
                <FormControl>
                  <Input placeholder="Perez" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="birthDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fecha de Nacimiento</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormItem>
            <FormLabel>Edad</FormLabel>
            <FormControl>
              <div className="flex h-9 items-center">
                {age !== null ? (
                  <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                    {age} años
                  </span>
                ) : (
                  <span className="text-sm text-muted-foreground">—</span>
                )}
              </div>
            </FormControl>
          </FormItem>

          <FormField
            control={form.control}
            name="shortAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Direccion Corta</FormLabel>
                <FormControl>
                  <Input placeholder="Calle y numero" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Direccion Larga</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Direccion completa, referencia, etc."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="juan@example.com"
                    {...field}
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
                <FormLabel>Telefono</FormLabel>
                <FormControl>
                  <Input placeholder="+1234567890" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-2">
          <FormLabel>Roles</FormLabel>
          <div className="flex flex-wrap gap-2">
            {roleChips.map((chip) => (
              <span
                key={chip.key}
                data-active={chip.active}
                className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium transition-colors data-[active=true]:border-primary data-[active=true]:bg-primary/10 data-[active=true]:text-primary data-[active=false]:border-input data-[active=false]:text-muted-foreground"
              >
                {chip.label}
              </span>
            ))}
          </div>
          {/*<!-- Hidden checkboxes to keep state in sync 
          <div className="flex flex-wrap gap-4 pt-1">
            {roleChips.map((chip) => (
              <FormField
                key={chip.key}
                control={form.control}
                name={chip.key as "isSupplier" | "isAgent" | "isCustomer"}
                render={({ field }) => (
                  <label className="flex items-center gap-1.5 cursor-pointer text-sm">
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                      className="h-4 w-4 rounded border-input accent-primary"
                    />
                    {chip.label}
                  </label>
                )}
              />
            ))}
          </div>
          */}
        </div>

        <FormField
          control={form.control}
          name="readonly"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Readonly</FormLabel>
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
                  <span className="text-sm">
                    {field.value ? "Si" : "No"}
                  </span>
                </label>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-2 pt-2">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? "Guardando..."
              : mode === "create"
                ? "Crear"
                : "Guardar"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
