import { Users, UserPlus } from "lucide-react";

export const businessPartnersSidebar = {
  title: "Business Partners",
  sections: [
    {
      label: "Customers",
      items: [
        { label: "Search", href: "/business-partners/customers", icon: Users },
        {
          label: "Create",
          href: "/business-partners/customers/new",
          icon: UserPlus,
        },
      ],
    },
    {
      label: "Specialists",
      items: [
        {
          label: "Search",
          href: "/business-partners/specialists",
          icon: Users,
        },
        {
          label: "Create",
          href: "/business-partners/specialists/new",
          icon: UserPlus,
        },
      ],
    },
  ],
};
