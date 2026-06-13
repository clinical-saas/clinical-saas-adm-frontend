import { BookOpen, Layers, DoorOpen, Package } from "lucide-react";

export const catalogSidebar = {
  title: "Catalog",
  sections: [
    {
      label: "Service Catalogs",
      items: [
        {
          label: "Search",
          href: "/catalog/service-catalogs",
          icon: BookOpen,
        },
        {
          label: "Create",
          href: "/catalog/service-catalogs/new",
          icon: BookOpen,
        },
      ],
    },
    {
      label: "Services",
      items: [
        { label: "Search", href: "/catalog/services", icon: Layers },
        { label: "Create", href: "/catalog/services/new", icon: Layers },
      ],
    },
    {
      label: "Rooms",
      items: [
        { label: "Search", href: "/catalog/rooms", icon: DoorOpen },
        { label: "Create", href: "/catalog/rooms/new", icon: DoorOpen },
      ],
    },
    {
      label: "Materials",
      items: [
        { label: "Search", href: "/catalog/materials", icon: Package },
        { label: "Create", href: "/catalog/materials/new", icon: Package },
      ],
    },
  ],
};
