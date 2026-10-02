import { PackageX } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";

export default function ProductNotFound() {
  return (
    <div className="container-page py-12">
      <EmptyState
        icon={PackageX}
        title="This product isn’t listed"
        description="The link may be old, or the product has been removed. Search for the part or find it by your bike."
        actions={[
          { label: "Shop parts", href: "/shop" },
          { label: "Find parts by bike", href: "/part-finder", variant: "outline" },
        ]}
      />
    </div>
  );
}
