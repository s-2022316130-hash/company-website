import { Clock, MapPin, MessageCircle, Phone, Store, Truck } from "lucide-react";
import { business } from "@/config/business";
import { CallButton, DirectionsButton, WhatsAppButton } from "./ContactActions";

/** Store details with call / WhatsApp / directions actions. Everything comes from config/business.ts. */
export function StoreContactCard({ showMap = false }: { showMap?: boolean }) {
  return (
    <div className="card grid overflow-hidden md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <div className="space-y-5 p-5 sm:p-6">
        <div>
          <p className="font-display text-2xl font-bold text-ink">{business.name}</p>
          <p lang="bn" className="text-muted">
            {business.banglaName}
          </p>
        </div>
        <dl className="space-y-3 text-[0.9375rem]">
          <Row icon={MapPin} label="Address">
            {business.address.full}
          </Row>
          <Row icon={Clock} label="Opening hours">
            {business.hours.label}
          </Row>
          <Row icon={Phone} label="Phone">
            <span className="block">
              Orders:{" "}
              <a href={`tel:${business.phones.orders.e164}`} className="font-semibold text-brand hover:underline">
                {business.phones.orders.display}
              </a>
            </span>
            <span className="block">
              Store:{" "}
              <a href={`tel:${business.phones.store.e164}`} className="font-semibold text-brand hover:underline">
                {business.phones.store.display}
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
                className="block font-semibold text-whatsapp hover:underline"
              >
                {w.display}
              </a>
            ))}
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
        </div>
      </div>
      <div className="tech-grid min-h-56 border-t border-line md:border-l md:border-t-0">
        {showMap && business.mapEmbedUrl ? (
          <iframe
            src={business.mapEmbedUrl}
            title={`Map showing ${business.name}`}
            className="size-full min-h-72 border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        ) : (
          <div className="flex size-full min-h-56 flex-col items-center justify-center gap-3 p-6 text-center">
            <MapPin className="size-10 text-brand" aria-hidden="true" />
            <p className="max-w-xs text-sm text-muted">
              {business.address.full}. Open Google Maps for directions to the shop.
            </p>
            <DirectionsButton size="sm" />
          </div>
        )}
      </div>
    </div>
  );
}

function Row({ icon: Icon, label, children }: { icon: typeof MapPin; label: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-3">
      <Icon className="mt-0.5 size-5 shrink-0 text-steel" aria-hidden="true" />
      <div>
        <dt className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</dt>
        <dd className="text-ink">{children}</dd>
      </div>
    </div>
  );
}
