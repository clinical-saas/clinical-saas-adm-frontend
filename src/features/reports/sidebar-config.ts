import { BarChart3 } from "lucide-react";

export const reportsSidebar = {
  title: "Reports",
  sections: [
    {
      label: "Reports",
      items: [
        {
          label: "Customers",
          href: "/reports/customers",
          icon: BarChart3,
        },
        {
          label: "Specialists",
          href: "/reports/specialists",
          icon: BarChart3,
        },
        {
          label: "Services",
          href: "/reports/services",
          icon: BarChart3,
        },
        {
          label: "Rooms",
          href: "/reports/rooms",
          icon: BarChart3,
        },
        {
          label: "Materials",
          href: "/reports/materials",
          icon: BarChart3,
        },
      ],
    },
  ],
};
