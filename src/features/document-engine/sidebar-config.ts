import { FileText, List, Tag } from "lucide-react";

export const documentEngineSidebar = {
  title: "Document Engine",
  sections: [
    {
      label: "Documents",
      items: [
        { label: "Search", href: "/document-engine/documents", icon: FileText },
      ],
    },
    {
      label: "Items",
      items: [
        { label: "Search", href: "/document-engine/items", icon: List },
      ],
    },
    {
      label: "Types",
      items: [
        { label: "Search", href: "/document-engine/types", icon: Tag },
      ],
    },
  ],
};
