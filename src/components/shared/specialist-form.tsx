"use client";

import { useMemo, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/auth";
import { apiClient } from "@/lib/api/client";
import { queryKeys } from "@/lib/api/queries";
import type { IdentificationType } from "@/types";
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
import { CommercialRelationChips } from "@/components/shared/commercial-relation-chips";
import { NameInput } from "@/components/shared/name-input";
import { PhoneInput } from "@/components/shared/phone-input";
import { EmailInput } from "@/components/shared/email-input";

const formSchema = z.object({
  providerId: z.string().uuid().optional(),
  tenantId: z.string().uuid(),
  businessUnitIds: z.array(z.string().uuid()).min(1, "Unidades de negocio requerido"),
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
  identificationTypeId: z.number({
    error: "Tipo de identificacion requerido",
  }),
  identificationNumber: z
    .string()
    .min(1, "Numero de identificacion requerido")
    .min(6, "Minimo 6 caracteres")
    .transform((v) => v.toUpperCase().replace(/\s/g, ""))
    .refine(
      (v) => /^[0-9A-Z](?:-)?[0-9A-Z]+(?:-)?$/.test(v),
      "Formato invalido: letras (A-Z), numeros (0-9), guion en posicion 2 o penultima",
    ),
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
  const businessUnits = useAuthStore((s) => s.businessUnits);

  const { data: identificationTypes } = useQuery({
    queryKey: queryKeys.identificationTypes.list(),
    queryFn: () => apiClient<IdentificationType[]>("/identification-type"),
  });

  const form = useForm<SpecialistFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      providerId: undefined,
      tenantId: "",
      businessUnitIds: [],
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
      identificationTypeId: 0,
      identificationNumber: "",
      ...defaultValues,
    },
  });

  const watchedTenantId = form.watch("tenantId");
  const watchedBusinessUnitIds = form.watch("businessUnitIds");

  const filteredBusinessUnits = useMemo(() => {
    if (!watchedTenantId || !businessUnits) return [];
    return businessUnits.filter((bu) => bu.tenantId === watchedTenantId);
  }, [watchedTenantId, businessUnits]);

  const isAllBusinessUnitsSelected = useMemo(() => {
    if (filteredBusinessUnits.length === 0) return false;
    return filteredBusinessUnits.every((bu) => watchedBusinessUnitIds.includes(bu.id));
  }, [filteredBusinessUnits, watchedBusinessUnitIds]);

  const prevTenantId = useRef<string | undefined>(undefined);
  useEffect(() => {
    if (
      prevTenantId.current !== undefined &&
      prevTenantId.current !== watchedTenantId
    ) {
      form.setValue("businessUnitIds", [], { shouldValidate: true });
    }
    prevTenantId.current = watchedTenantId;
  }, [watchedTenantId, form]);

  const toggleBusinessUnit = (buId: string) => {
    const current = form.getValues("businessUnitIds");
    if (current.includes(buId)) {
      form.setValue(
        "businessUnitIds",
        current.filter((id) => id !== buId),
        { shouldValidate: true }
      );
    } else {
      form.setValue("businessUnitIds", [...current, buId], { shouldValidate: true });
    }
  };

  const toggleAllBusinessUnits = () => {
    if (isAllBusinessUnitsSelected) {
      form.setValue("businessUnitIds", [], { shouldValidate: true });
    } else {
      form.setValue(
        "businessUnitIds",
        filteredBusinessUnits.map((bu) => bu.id),
        { shouldValidate: true }
      );
    }
  };

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

  const watchedValues = form.watch(["isSupplier", "isAgent", "isCustomer"]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="hidden">
          <FormField
            control={form.control}
            name="providerId"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input {...field} value={field.value ?? ""} disabled />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="tenantId"
            render={({ field }) => {
              const selectedTenant = tenants?.find((t) => t.id === field.value);
              return (
                <FormItem>
                  <FormLabel>Tenant</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={(v: string | null) => v && field.onChange(v)}
                    >
                      <SelectTrigger className="min-w-[200px]">
                        <SelectValue placeholder="Selecciona un tenant" className="truncate">
                          {selectedTenant ? selectedTenant.businessName : "Selecciona un tenant"}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent className="max-w-[300px]">
                        {tenants?.map((t) => (
                          <SelectItem key={t.id} value={t.id} className="truncate">
                            <span className="truncate block w-full max-w-[280px]">
                              {t.businessName}
                            </span>
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

          <FormItem>
            <FormLabel>Unidades de Negocio</FormLabel>
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2">
                {filteredBusinessUnits.length > 0 && (
                  <>
                    <span
                      onClick={toggleAllBusinessUnits}
                      data-active={isAllBusinessUnitsSelected}
                      className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium transition-colors cursor-pointer data-[active=true]:border-primary data-[active=true]:bg-primary/10 data-[active=true]:text-primary data-[active=false]:border-input data-[active=false]:text-muted-foreground"
                    >
                      {isAllBusinessUnitsSelected ? "Deseleccionar todos" : "Seleccionar todos"}
                    </span>
                    {filteredBusinessUnits.map((bu) => (
                      <span
                        key={bu.id}
                        onClick={() => toggleBusinessUnit(bu.id)}
                        data-active={watchedBusinessUnitIds.includes(bu.id)}
                        className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium transition-colors cursor-pointer data-[active=true]:border-primary data-[active=true]:bg-primary/10 data-[active=true]:text-primary data-[active=false]:border-input data-[active=false]:text-muted-foreground"
                      >
                        {bu.businessName}
                      </span>
                    ))}
                  </>
                )}
                {filteredBusinessUnits.length === 0 && (
                  <span className="text-sm text-muted-foreground">
                    {watchedTenantId ? "Sin unidades de negocio" : "Selecciona un tenant primero"}
                  </span>
                )}
              </div>
              {form.formState.errors.businessUnitIds && (
                <FormMessage />
              )}
            </div>
          </FormItem>
        </div>

        <div className="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
          <FormItem>
            <FormLabel>Relación Comercial</FormLabel>
            <CommercialRelationChips
              isSupplier={watchedValues[0]}
              isAgent={watchedValues[1]}
              isCustomer={watchedValues[2]}
            />
          </FormItem>
        </div>

        <hr className="border-border" />

        <div className="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="identificationTypeId"
            render={({ field }) => {
              const selectedIdType = identificationTypes?.find(
                (t) => String(t.id) === String(field.value)
              );
              return (
                <FormItem>
                  <FormLabel>Tipo de Identificación</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value ? String(field.value) : ""}
                      onValueChange={(v) => field.onChange(Number(v))}
                    >
                      <SelectTrigger className="min-w-[200px]">
                        <SelectValue placeholder="Selecciona un tipo" className="truncate">
                          {selectedIdType ? selectedIdType.name : "Selecciona un tipo"}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {identificationTypes
                          ?.slice()
                          .sort((a, b) => (a.item_order ?? 0) - (b.item_order ?? 0))
                          .map((it) => (
                            <SelectItem key={it.id} value={String(it.id)} className="truncate">
                              {it.name}
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
            name="identificationNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Numero de Identificacion</FormLabel>
                <FormControl>
                  <Input
                    placeholder="V-12345678"
                    value={field.value}
                    onChange={(e) =>
                      field.onChange(e.target.value.toUpperCase().replace(/\s/g, ""))
                    }
                    onBlur={field.onBlur}
                    name={field.name}
                    ref={field.ref}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          </div>

        <div className="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">

          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombres</FormLabel>
                <FormControl>
                  <NameInput
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    placeholder="Juan"
                  />
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
                  <NameInput
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    placeholder="Perez"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          </div>

        <div className="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">

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

          </div>

        <div className="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <EmailInput
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    placeholder="juan@example.com"
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
                  <PhoneInput
                    value={field.value}
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

        <div className="space-y-4">
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
              <FormItem>
                <FormLabel>Direccion Larga</FormLabel>
                <FormControl>
                  <Textarea placeholder="Direccion completa, referencia, etc." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        

        <hr className="border-border" />

        <div className="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
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
        </div>

        <div className="flex gap-2 pt-2">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Guardando..." : mode === "create" ? "Crear" : "Guardar"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
