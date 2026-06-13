import { ClipboardList, Plus } from "lucide-react";

export const serviceOrdersSidebar = {
  title: "Service Orders",
  sections: [
    {
      label: "Orders",
      items: [
        {
          label: "Search",
          href: "/service-orders",
          icon: ClipboardList,
        },
        {
          label: "Create",
          href: "/service-orders/new",
          icon: Plus,
        },
      ],
    },
  ],
};
