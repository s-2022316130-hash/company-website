import { MapPin, MessageCircle, Phone } from "lucide-react";
import { TrackedAnchor } from "@/components/analytics/Track";
import { business, primaryWhatsApp, type WhatsAppNumber } from "@/config/business";
import { cx } from "@/lib/cx";
import { whatsAppUrl } from "@/lib/order";

type Variant = "primary" | "outline" | "dark" | "outline-dark";

const variantClass: Record<Variant, string> = {
  primary: "btn-primary",
  outline: "btn-outline",
  dark: "btn-dark",
  "outline-dark": "btn-outline-dark",
};

export function CallButton({
  variant = "primary",
  size,
  label,
  className,
  number = business.phones.orders,
}: {
  variant?: Variant;
  size?: "sm" | "lg";
  label?: string;
  className?: string;
  number?: { display: string; e164: string };
}) {
  return (
    <TrackedAnchor
      href={`tel:${number.e164}`}
      event="phone_click"
      eventProps={{ number: number.e164 }}
      className={cx("btn", variantClass[variant], size && `btn-${size}`, className)}
    >
      <Phone className="size-4" aria-hidden="true" />
      {label ?? `Call ${number.display}`}
    </TrackedAnchor>
  );
}

export function WhatsAppButton({
  message,
  size,
  label,
  className,
  number = primaryWhatsApp,
}: {
  message?: string;
  size?: "sm" | "lg";
  label?: string;
  className?: string;
  number?: WhatsAppNumber;
}) {
  return (
    <TrackedAnchor
      href={whatsAppUrl(number.waId, message)}
      target="_blank"
      rel="noopener noreferrer"
      event="whatsapp_click"
      eventProps={{ number: number.e164 }}
      className={cx("btn btn-whatsapp", size && `btn-${size}`, className)}
    >
      <MessageCircle className="size-4" aria-hidden="true" />
      {label ?? "WhatsApp"}
      <span className="sr-only"> (opens WhatsApp)</span>
    </TrackedAnchor>
  );
}

export function DirectionsButton({ className, size }: { className?: string; size?: "sm" | "lg" }) {
  return (
    <TrackedAnchor
      href={business.directionsUrl}
      target="_blank"
      rel="noopener noreferrer"
      event="directions_click"
      className={cx("btn btn-outline", size && `btn-${size}`, className)}
    >
      <MapPin className="size-4" aria-hidden="true" />
      Get directions
      <span className="sr-only"> (opens Google Maps)</span>
    </TrackedAnchor>
  );
}
