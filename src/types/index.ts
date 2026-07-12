export interface Tenant {
  id: string;
  code: string;
  name: string;
  email: string;
  phone?: string;
  isActive: boolean;
  createdAt: string;
}

export interface BusinessUnit {
  id: string;
  tenant_id: string;
  code: string;
  business_name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  active: boolean;
  created_at: string;
  created_by: string | null;
  updated_at: string | null;
  updated_by: string | null;
  removed_at: string | null;
  removed_by: string | null;
}

export interface Role {
  id: string;
  code: string;
  name: string;
  description?: string;
  createdAt: string;
}

export interface PlatformUser {
  id: string;
  username: string;
  email: string;
  name: string;
  isActive: boolean;
  createdAt: string;
}

export interface IdentificationType {
  id: string;
  code: string;
  name: string;
  description?: string;
  item_order?: number;
}

export interface Platform {
  id: string;
  code: string;
  name: string;
  description?: string;
}

export interface AppModule {
  id: string;
  code: string;
  name: string;
  platformId: string;
  description?: string;
}

export interface AppSubModule {
  id: string;
  code: string;
  name: string;
  moduleId: string;
  description?: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  identificationType?: string;
  identificationNumber?: string;
  isActive: boolean;
  createdAt: string;
}

export interface Specialist {
  id: string;
  tenant_id: string;
  identification_type_id: number;
  identification_number: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone: string | null;
  birth_date: string | null;
  short_address: string | null;
  address: string | null;
  is_customer: boolean;
  is_supplier: boolean;
  is_agent: boolean;
  active: boolean;
  readonly: boolean;
  extra_data: Record<string, unknown> | null;
  businessUnitIds?: string[];
  created_at: string;
  updated_at: string | null;
}

export interface ServiceCategory {
  id: string;
  code: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
}

export interface ServiceItem {
  id: string;
  code: string;
  name: string;
  categoryId: string;
  description?: string;
  duration?: number;
  price?: number;
  isActive: boolean;
  createdAt: string;
}

export interface ServiceHistoryEntry {
  id: string;
  serviceDate: string;
  serviceDescription: string;
  status: string;
  businessUnit?: string;
}

export interface Room {
  id: string;
  name: string;
  code?: string;
  businessUnitId: string;
  capacity?: number;
  isActive: boolean;
  createdAt: string;
}

export interface MaterialResource {
  id: string;
  code: string;
  name: string;
  typeId?: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
}

export interface MaterialResourceType {
  id: string;
  code: string;
  name: string;
  description?: string;
}

export interface ServiceOrder {
  id: string;
  code: string;
  customerId: string;
  specialistId?: string;
  status: string;
  totalAmount?: number;
  scheduledDate?: string;
  createdAt: string;
}

export interface Document {
  id: string;
  code: string;
  name: string;
  documentTypeId?: string;
  status?: string;
  createdAt: string;
}

export interface DocumentItem {
  id: string;
  code?: string;
  name: string;
  documentId: string;
  description?: string;
}

export interface DocumentType {
  id: string;
  code: string;
  name: string;
  description?: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  lastPage: number;
}

export interface ApiResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface SearchSpecialistsFilters {
  search?: string;
  page?: number;
  pageSize?: number;
  order?: string;
  filterApplyVersion?: number;
  tenantIds?: string[];
  businessUnitIds?: string[];
  statuses?: string[];
}
