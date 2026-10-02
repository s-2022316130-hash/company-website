export interface NavItem {
  label: string;
  href: string;
}

export const mainNav: NavItem[] = [
  { label: "Shop", href: "/shop" },
  { label: "Part Finder", href: "/part-finder" },
  { label: "Brands", href: "/brands" },
  { label: "Motorcycles", href: "/models" },
  { label: "Categories", href: "/categories" },
  { label: "Accessories", href: "/accessories" },
  { label: "Engine Oil", href: "/engine-oil" },
  { label: "Contact", href: "/contact" },
];

export const footerShopLinks: NavItem[] = [
  { label: "All products", href: "/shop" },
  { label: "Part finder", href: "/part-finder" },
  { label: "Accessories", href: "/accessories" },
  { label: "Engine oil & fluids", href: "/engine-oil" },
  { label: "Cart", href: "/cart" },
];

export const footerInfoLinks: NavItem[] = [
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "FAQ", href: "/faq" },
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
];
