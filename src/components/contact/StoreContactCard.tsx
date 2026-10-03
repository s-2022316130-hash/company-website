import { Clock, Contact, Mail, MapPin, MessageCircle, Phone, Store, Truck, Wallet } from "lucide-react";
import { GearRing } from "@/components/ui/Mechanical";
import { business } from "@/config/business";
import { CallButton, DirectionsButton, WhatsAppButton } from "./ContactActions";

/**
 * Store details with call / WhatsApp / directions actions, on a dark panel.
 * Everything comes from config/business.ts. No storefront photo is shown because none has
 * been supplied; a stock photo of another shop would be misleading.
 */
export function StoreContactCard({ showMap = false }: { showMap?: boolean }) {
  return (
    <div className="card-dark grid overflow-hidden md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <div className="space-y-5 p-5 sm:p-7">
        <div>
          <p className="display text-3xl text-white">{business.name}</p>
          <p className="text-on-dark-muted">
            <span lang="bn">{business.banglaName}</span> · {business.trade} since {business.foundedYear}
          </p>
        </div>
        <dl className="space-y-3 text-[0.9375rem]">
          <Row icon={MapPin} label="Address">
            {business.address.full}
            <span lang="bn" className="block text-on-dark-muted">
              {business.address.bn}
            </span>
          </Row>
          <Row icon={Clock} label="Opening hours">
            {business.hours.label}
          </Row>
          <Row icon={Phone} label="Phone">
            <span className="block">
              Orders:{" "}
              <a href={`tel:${business.phones.orders.e164}`} className="whitespace-nowrap font-semibold text-brand-bright hover:underline">
                {business.phones.orders.display}
              </a>
            </span>
            <span className="block">
              Store:{" "}
              <a href={`tel:${business.phones.store.e164}`} className="whitespace-nowrap font-semibold text-brand-bright hover:underline">
                {business.phones.store.display}
              </a>
              ,{" "}
              <a href={`tel:${business.phones.store2.e164}`} className="whitespace-nowrap font-semibold text-brand-bright hover:underline">
                {business.phones.store2.display}
              </a>
            </span>
          </Row>
          <Row icon={MessageCircle} label="WhatsApp">
            {business.whatsapp.map((w) => (
              <a
                key={w.waId}
                href={`https://wa.me/${w.waId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block font-semibold text-[#4ade80] hover:underline"
              >
                {w.display}
              </a>
            ))}
          </Row>
          <Row icon={Wallet} label={business.mobileBanking.services.join(" & ")}>
            <span className="font-semibold">{business.mobileBanking.number.display}</span>
            <span className="block text-sm text-on-dark-muted">Pay once the shop has confirmed your order and the amount.</span>
          </Row>
          <Row icon={Mail} label="Email">
            <a href={`mailto:${business.email}`} className="font-semibold text-brand-bright hover:underline">
              {business.email}
            </a>
          </Row>
          <Row icon={Store} label="Pickup">
            {business.fulfilment.pickup.description}
          </Row>
          <Row icon={Truck} label="Courier">
            {business.fulfilment.courier.description}
          </Row>
        </dl>
        <div className="flex flex-wrap gap-2">
          <CallButton label="Call now" />
          <WhatsAppButton />
          <DirectionsButton />
          <a href="/nirob-autos.vcf" download className="btn btn-outline-dark">
            <Contact className="size-4" aria-hidden="true" />
            Save contact
          </a>
        </div>
      </div>
      <div className="blueprint relative min-h-60 border-t border-graphite-3 md:border-l md:border-t-0">
        {showMap && business.mapEmbedUrl ? (
          <iframe
            src={business.mapEmbedUrl}
            title={`Map showing ${business.name}`}
            className="size-full min-h-72 border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        ) : (
          <div className="relative flex size-full min-h-60 flex-col items-center justify-center gap-3 overflow-hidden p-6 text-center">
            <GearRing teeth={28} className="absolute size-72 text-white/[0.06]" />
            <span className="relative grid size-14 place-items-center rounded-full bg-brand text-white shadow-[0_0_0_10px_rgb(194_65_12/0.2)]">
              <MapPin className="size-7" aria-hidden="true" />
            </span>
            <p className="display relative text-2xl text-white">{business.address.full}</p>
            <p className="relative max-w-xs text-sm text-on-dark-muted">Open Google Maps for directions to the shop.</p>
            <DirectionsButton size="sm" className="relative" />
          </div>
        )}
      </div>
    </div>
  );
}

function Row({ icon: Icon, label, children }: { icon: typeof MapPin; label: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-3">
      <Icon className="mt-0.5 size-5 shrink-0 text-brand-bright" aria-hidden="true" />
      <div>
        <dt className="font-display text-xs font-semibold uppercase tracking-[0.14em] text-on-dark-muted">{label}</dt>
        <dd className="text-on-dark">{children}</dd>
      </div>
    </div>
  );
}
