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
  code: string;
  name: string;
  tenantId: string;
  isActive: boolean;
  createdAt: string;
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
  name: string;
  email: string;
  phone?: string;
  specialty?: string;
  isActive: boolean;
  createdAt: string;
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
