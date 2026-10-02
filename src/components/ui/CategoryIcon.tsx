import {
  Battery,
  Cable,
  CircleDot,
  Cog,
  Disc3,
  Droplet,
  Fuel,
  Funnel,
  Link2,
  Nut,
  Settings2,
  Shield,
  Smartphone,
  type LucideIcon,
  ArrowUpDown,
} from "lucide-react";
import type { CategoryIcon as CategoryIconName } from "@/lib/types";

const icons: Record<CategoryIconName, LucideIcon> = {
  engine: Cog,
  clutch: Settings2,
  brakes: Disc3,
  chain: Link2,
  filters: Funnel,
  electrical: Battery,
  fuel: Fuel,
  suspension: ArrowUpDown,
  wheels: CircleDot,
  cables: Cable,
  body: Shield,
  bearings: Nut,
  oils: Droplet,
  accessories: Smartphone,
};

export function CategoryIcon({ name, className }: { name: CategoryIconName; className?: string }) {
  const Icon = icons[name];
  return <Icon className={className} aria-hidden="true" strokeWidth={1.75} />;
}
