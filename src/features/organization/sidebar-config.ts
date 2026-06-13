import { Building2, Building, Shield, Users } from "lucide-react";

export const organizationSidebar = {
  title: "Organization",
  sections: [
    {
      label: "Tenants",
      items: [
        { label: "Search", href: "/organization/tenants", icon: Building2 },
        { label: "Create", href: "/organization/tenants/new", icon: Building2 },
      ],
    },
    {
      label: "Business Units",
      items: [
        { label: "Search", href: "/organization/business-units", icon: Building },
        { label: "Create", href: "/organization/business-units/new", icon: Building },
      ],
    },
    {
      label: "Roles",
      items: [
        { label: "Search", href: "/organization/roles", icon: Shield },
        { label: "Create", href: "/organization/roles/new", icon: Shield },
      ],
    },
    {
      label: "Platform Users",
      items: [
        { label: "Search", href: "/organization/users", icon: Users },
        { label: "Create", href: "/organization/users/new", icon: Users },
      ],
    },
  ],
};
