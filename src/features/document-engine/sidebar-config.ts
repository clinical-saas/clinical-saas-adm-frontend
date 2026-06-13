import { FileText, List, Tag } from "lucide-react";

export const documentEngineSidebar = {
  title: "Document Engine",
  sections: [
    {
      label: "Documents",
      items: [
        { label: "Search", href: "/document-engine/documents", icon: FileText },
        { label: "Create", href: "/document-engine/documents/new", icon: FileText },
      ],
    },
    {
      label: "Items",
      items: [
        { label: "Search", href: "/document-engine/items", icon: List },
        { label: "Create", href: "/document-engine/items/new", icon: List },
      ],
    },
    {
      label: "Types",
      items: [
        { label: "Search", href: "/document-engine/types", icon: Tag },
        { label: "Create", href: "/document-engine/types/new", icon: Tag },
      ],
    },
  ],
};
