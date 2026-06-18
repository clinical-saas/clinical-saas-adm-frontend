import { BookOpen, Layers, DoorOpen, Package } from "lucide-react";

export const catalogSidebar = {
  title: "Catalog",
  sections: [
    {
      label: "Service Categories",
      items: [
        {
          label: "Search",
          href: "/catalog/service-catalogs",
          icon: BookOpen,
        },
      ],
    },
    {
      label: "Services",
      items: [
        { label: "Search", href: "/catalog/services", icon: Layers },
      ],
    },
    {
      label: "Rooms",
      items: [
        { label: "Search", href: "/catalog/rooms", icon: DoorOpen },
      ],
    },
    {
      label: "Materials",
      items: [
        { label: "Search", href: "/catalog/materials", icon: Package },
      ],
    },
  ],
};
