import { Building2, Building, Shield, Users } from "lucide-react";

export const organizationSidebar = {
  title: "Organization",
  sections: [
    {
      label: "Tenants",
      items: [
        { label: "Search", href: "/organization/tenants", icon: Building2 },
      ],
    },
    {
      label: "Business Units",
      items: [
        { label: "Search", href: "/organization/business-units", icon: Building },
      ],
    },
    {
      label: "Roles",
      items: [
        { label: "Search", href: "/organization/roles", icon: Shield },
      ],
    },
    {
      label: "Platform Users",
      items: [
        { label: "Search", href: "/organization/users", icon: Users },
      ],
    },
  ],
};
