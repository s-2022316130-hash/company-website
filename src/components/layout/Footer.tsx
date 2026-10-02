import Link from "next/link";
import { business } from "@/config/business";
import { footerInfoLinks, footerShopLinks } from "@/config/navigation";
import { categoryPath, loadCatalog } from "@/lib/catalog/catalog";
import { Logo } from "./Logo";

function LinkColumn({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <h2 className="mb-3 font-display text-sm font-bold uppercase tracking-wider text-white">{title}</h2>
      <ul className="space-y-1">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="inline-flex min-h-8 items-center text-sm text-white/75 hover:text-white hover:underline">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export async function Footer() {
  const { brands, groups } = await loadCatalog();
  return (
    <footer className="mt-16 bg-steel text-white">
      <div className="container-page grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1fr]">
        <div className="space-y-4">
          <Logo inverted />
          <p className="text-sm text-white/75">{business.tagline}</p>
          <address className="space-y-1.5 text-sm not-italic text-white/90">
            <p>{business.address.full}</p>
            <p>
              Orders:{" "}
              <a href={`tel:${business.phones.orders.e164}`} className="font-semibold hover:underline">
                {business.phones.orders.display}
              </a>
            </p>
            <p>
              Store:{" "}
              <a href={`tel:${business.phones.store.e164}`} className="hover:underline">
                {business.phones.store.display}
              </a>
            </p>
            <p>WhatsApp: {business.whatsapp.map((w) => w.display).join(", ")}</p>
            <p>{business.hours.label}</p>
          </address>
        </div>
        <LinkColumn title="Shop" links={footerShopLinks} />
        <LinkColumn title="Brands" links={brands.map((b) => ({ label: `${b.name} parts`, href: `/brands/${b.slug}` }))} />
        <LinkColumn
          title="Categories"
          links={groups.slice(0, 7).map((g) => ({ label: g.name, href: categoryPath(g.slug) }))}
        />
        <LinkColumn title="Information" links={footerInfoLinks} />
      </div>
      <div className="border-t border-white/15">
        <div className="container-page py-5 text-xs text-white/70">
          <p>
            © {new Date().getFullYear()} {business.name} | <span lang="bn">{business.banglaName}</span>. Motorcycle brand
            names show which bikes a part is listed for and do not indicate an official dealership.
          </p>
        </div>
      </div>
    </footer>
  );
}
