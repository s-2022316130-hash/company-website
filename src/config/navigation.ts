export interface NavItem {
  label: string;
  href: string;
}

/** Desktop nav row and the phone menu. Parts only: the shop offers no servicing, so there is no Services page. */
export const mainNav: NavItem[] = [
  { label: "Shop parts", href: "/shop" },
  { label: "Part finder", href: "/part-finder" },
  { label: "Brands", href: "/brands" },
  { label: "Motorcycles", href: "/models" },
  { label: "Categories", href: "/categories" },
  { label: "Accessories", href: "/accessories" },
  { label: "Engine oil", href: "/engine-oil" },
];

/** Right-hand end of the desktop nav row, and the end of the phone menu. */
export const secondaryNav: NavItem[] = [
  { label: "Contact", href: "/contact" },
  { label: "FAQ", href: "/faq" },
];

export const footerShopLinks: NavItem[] = [
  { label: "All products", href: "/shop" },
  { label: "Part finder", href: "/part-finder" },
  { label: "Motorcycles", href: "/models" },
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
  { label: "Image credits", href: "/credits" },
];
