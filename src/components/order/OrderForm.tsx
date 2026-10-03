"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { CircleAlert, CircleCheck, Copy, MessageCircle, Phone, ShoppingCart } from "lucide-react";
import { TrackedAnchor } from "@/components/analytics/Track";
import { EmptyState } from "@/components/ui/EmptyState";
import { OrderSteps } from "./OrderSteps";
import { Skeleton } from "@/components/ui/Skeleton";
import { business, type FulfilmentMethod } from "@/config/business";
import { track } from "@/lib/analytics";
import { dispatchCart, useCart, useHydrated } from "@/lib/cart/use-cart";
import { cx } from "@/lib/cx";
import { formatPrice } from "@/lib/format";
import {
  buildOrderMessage,
  LIMITS,
  validateOrder,
  whatsAppUrl,
  type CustomerDetails,
  type OrderErrors,
} from "@/lib/order";

type Method = `wa:${number}` | "call";
type Status = "editing" | "whatsapp-opened" | "whatsapp-blocked" | "call";

const emptyCustomer: CustomerDetails = { name: "", phone: "", address: "", motorcycle: "", notes: "" };
const fieldOrder: (keyof CustomerDetails)[] = ["name", "phone", "address", "motorcycle", "notes"];

export function OrderForm() {
  const hydrated = useHydrated();
  const { lines, totals } = useCart();
  const [customer, setCustomer] = useState<CustomerDetails>(emptyCustomer);
  const [fulfilment, setFulfilment] = useState<FulfilmentMethod>("pickup");
  const [method, setMethod] = useState<Method>("wa:0");
  const [errors, setErrors] = useState<OrderErrors>({});
  const [attempted, setAttempted] = useState(false);
  const [status, setStatus] = useState<Status>("editing");
  const [copied, setCopied] = useState<"idle" | "done" | "failed">("idle");
  const summaryRef = useRef<HTMLDivElement>(null);
  const id = useId();
  const began = useRef(false);

  useEffect(() => {
    if (hydrated && lines.length > 0 && !began.current) {
      began.current = true;
      track("begin_order", { items: lines.length });
    }
  }, [hydrated, lines.length]);

  if (!hydrated) {
    return (
      <div className="space-y-3" role="status" aria-label="Loading order">
        <Skeleton className="h-40 w-full rounded-xl" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  const order = { customer, fulfilment, lines };
  const message = buildOrderMessage(order);
  const waIndex = method.startsWith("wa:") ? Number(method.slice(3)) : -1;
  const waNumber = business.whatsapp[waIndex];
  const waLink = waNumber ? whatsAppUrl(waNumber.waId, message) : "";

  if (lines.length === 0 && status === "editing") {
    return (
      <EmptyState
        icon={ShoppingCart}
        title="Nothing to order yet"
        description="Add products to your cart first, then come back here to send your order request."
        actions={[
          { label: "Shop parts", href: "/shop" },
          { label: "Find parts by bike", href: "/part-finder", variant: "outline" },
        ]}
      />
    );
  }

  const update = (field: keyof CustomerDetails) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const next = { ...customer, [field]: e.target.value };
    setCustomer(next);
    if (attempted) setErrors(validateOrder({ ...order, customer: next }));
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAttempted(true);
    const found = validateOrder(order);
    setErrors(found);
    const firstInvalid = fieldOrder.find((f) => found[f]);
    if (firstInvalid) {
      document.getElementById(`${id}-${firstInvalid}`)?.focus();
      return;
    }
    if (found.lines) return;

    track("order_request_submitted", { method: method === "call" ? "call" : "whatsapp", fulfilment, items: lines.length });

    if (method === "call") {
      setStatus("call");
    } else {
      // Opened from the submit handler so the browser treats it as a user action.
      const win = window.open(waLink, "_blank");
      if (win) win.opener = null;
      setStatus(win ? "whatsapp-opened" : "whatsapp-blocked");
    }
    requestAnimationFrame(() => summaryRef.current?.focus());
  };

  const copyMessage = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setCopied("done");
    } catch {
      setCopied("failed");
    }
  };

  if (status !== "editing") {
    return (
      <div className="space-y-6">
        <OrderSteps current={3} />
        <div ref={summaryRef} tabIndex={-1} className="card animate-fade-up space-y-5 p-5 outline-none sm:p-6" aria-live="polite">
          {status === "whatsapp-opened" && (
            <Notice tone="success" title="WhatsApp is opening with your order">
              Your request is sent only when you press <strong>Send</strong> in WhatsApp. {business.name} will reply to confirm
              price, availability{fulfilment === "courier" ? " and the delivery charge" : ""}.
            </Notice>
          )}
          {status === "whatsapp-blocked" && (
            <Notice tone="warning" title="WhatsApp did not open">
              Your browser blocked the new window. Tap the button below to open WhatsApp, or copy the message and send it to{" "}
              {waNumber?.display}.
            </Notice>
          )}
          {status === "call" && (
            <Notice tone="success" title="Call the store with this order">
              Call {business.phones.orders.display} and read out the list below. Nothing has been sent yet.
            </Notice>
          )}

          <div>
            <h2 className="mb-2 font-semibold text-ink">Your order message</h2>
            <pre className="max-h-80 overflow-auto whitespace-pre-wrap rounded-lg border border-line bg-canvas p-3 font-sans text-sm text-ink">
              {message}
            </pre>
            <button type="button" onClick={copyMessage} className="btn btn-ghost btn-sm mt-2">
              <Copy className="size-4" aria-hidden="true" />
              {copied === "done" ? "Copied" : "Copy message"}
            </button>
            {copied === "failed" && (
              <p className="text-sm text-danger">Copy didn’t work on this device. Select the text above and copy it manually.</p>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {status === "call" ? (
              <TrackedAnchor
                href={`tel:${business.phones.orders.e164}`}
                event="phone_click"
                eventProps={{ source: "order" }}
                className="btn btn-primary btn-lg"
              >
                <Phone className="size-5" aria-hidden="true" /> Call {business.phones.orders.display}
              </TrackedAnchor>
            ) : (
              <TrackedAnchor
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                event="whatsapp_click"
                eventProps={{ source: "order" }}
                className="btn btn-whatsapp btn-lg"
              >
                <MessageCircle className="size-5" aria-hidden="true" />
                {status === "whatsapp-blocked" ? "Open WhatsApp" : "Open WhatsApp again"}
              </TrackedAnchor>
            )}
            <button type="button" className="btn btn-outline btn-lg" onClick={() => setStatus("editing")}>
              Edit details
            </button>
          </div>

          <div className="border-t border-line pt-4 text-sm text-muted">
            <p>Once the store has confirmed your order you can clear your cart.</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => {
                  dispatchCart({ type: "clear" });
                  setStatus("editing");
                }}
              >
                Clear cart
              </button>
              <Link href="/shop" className="btn btn-ghost btn-sm">
                Back to shop
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const errorList = attempted ? fieldOrder.filter((f) => errors[f]) : [];

  return (
    <form onSubmit={onSubmit} noValidate className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
      <OrderSteps current={2} className="lg:col-span-2" />
      <div className="space-y-6">
        {errorList.length > 0 && (
          <div role="alert" className="rounded-lg border border-danger/30 bg-danger-soft p-4 text-sm">
            <p className="font-semibold text-danger">Please fix {errorList.length === 1 ? "this" : "these"} before sending:</p>
            <ul className="mt-1 list-disc pl-5">
              {errorList.map((f) => (
                <li key={f}>
                  <a href={`#${id}-${f}`} className="text-ink underline">
                    {errors[f]}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        <fieldset className="card space-y-4 p-5">
          <legend className="float-left mb-1 w-full font-display text-xl font-bold text-ink">1. Your details</legend>
          <Field id={`${id}-name`} label="Name" error={errors.name} required>
            <input
              id={`${id}-name`}
              className="input"
              autoComplete="name"
              maxLength={LIMITS.name}
              value={customer.name}
              onChange={update("name")}
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? `${id}-name-error` : undefined}
              required
            />
          </Field>
          <Field id={`${id}-phone`} label="Mobile number" hint="The store will call or message you on this number." error={errors.phone} required>
            <input
              id={`${id}-phone`}
              className="input"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder="01XXX-XXXXXX"
              maxLength={20}
              value={customer.phone}
              onChange={update("phone")}
              aria-invalid={Boolean(errors.phone)}
              aria-describedby={`${id}-phone-hint${errors.phone ? ` ${id}-phone-error` : ""}`}
              required
            />
          </Field>
          <Field id={`${id}-motorcycle`} label="Your motorcycle" hint="Optional. Brand, model and year help the store check fit." error={errors.motorcycle}>
            <input
              id={`${id}-motorcycle`}
              className="input"
              placeholder="e.g. Yamaha FZS V3, 2021"
              maxLength={LIMITS.motorcycle}
              value={customer.motorcycle}
              onChange={update("motorcycle")}
              aria-invalid={Boolean(errors.motorcycle)}
              aria-describedby={`${id}-motorcycle-hint${errors.motorcycle ? ` ${id}-motorcycle-error` : ""}`}
            />
          </Field>
        </fieldset>

        <fieldset className="card space-y-3 p-5">
          <legend className="float-left mb-1 w-full font-display text-xl font-bold text-ink">2. Pickup or delivery</legend>
          {(Object.keys(business.fulfilment) as FulfilmentMethod[]).map((key) => (
            <Choice
              key={key}
              name="fulfilment"
              value={key}
              checked={fulfilment === key}
              onChange={() => {
                setFulfilment(key);
                if (attempted) setErrors(validateOrder({ ...order, fulfilment: key }));
              }}
              title={business.fulfilment[key].label}
              description={business.fulfilment[key].description}
            />
          ))}
          {fulfilment === "courier" && (
            <Field id={`${id}-address`} label="Delivery address" hint="House or road, area, upazila and district." error={errors.address} required>
              <textarea
                id={`${id}-address`}
                className="input min-h-24"
                autoComplete="street-address"
                maxLength={LIMITS.address}
                value={customer.address}
                onChange={update("address")}
                aria-invalid={Boolean(errors.address)}
                aria-describedby={`${id}-address-hint${errors.address ? ` ${id}-address-error` : ""}`}
                required
              />
            </Field>
          )}
          <Field id={`${id}-notes`} label="Notes" hint="Optional. Anything the store should know." error={errors.notes}>
            <textarea
              id={`${id}-notes`}
              className="input min-h-20"
              maxLength={LIMITS.notes}
              value={customer.notes}
              onChange={update("notes")}
              aria-invalid={Boolean(errors.notes)}
              aria-describedby={`${id}-notes-hint${errors.notes ? ` ${id}-notes-error` : ""}`}
            />
          </Field>
        </fieldset>

        <fieldset className="card space-y-3 p-5">
          <legend className="float-left mb-1 w-full font-display text-xl font-bold text-ink">3. How to send your order</legend>
          {business.whatsapp.map((w, i) => (
            <Choice
              key={w.waId}
              name="method"
              value={`wa:${i}`}
              checked={method === `wa:${i}`}
              onChange={() => setMethod(`wa:${i}`)}
              title={`WhatsApp ${w.display}`}
              description={i === 0 ? "Recommended. Opens WhatsApp with your order already written." : "Alternative WhatsApp number."}
            />
          ))}
          <Choice
            name="method"
            value="call"
            checked={method === "call"}
            onChange={() => setMethod("call")}
            title={`Phone call ${business.phones.orders.display}`}
            description="Shows your order list to read out on the call."
          />
        </fieldset>
      </div>

      <aside className="card h-fit space-y-4 p-5 lg:sticky-below-header" aria-labelledby="order-summary-title">
        <h2 id="order-summary-title" className="font-display text-xl font-bold text-ink">
          Order summary
        </h2>
        <ul className="divide-y divide-line text-sm">
          {lines.map((l) => (
            <li key={l.productId} className="flex justify-between gap-3 py-2">
              <span className="min-w-0">
                <span className="block font-medium text-ink">{l.name}</span>
                <span className="text-muted">Qty {l.quantity}</span>
              </span>
              <span className="shrink-0 text-right font-semibold">
                {l.price !== undefined ? formatPrice(l.price * l.quantity) : "To confirm"}
              </span>
            </li>
          ))}
        </ul>
        {totals.pricedSubtotal > 0 && (
          <p className="flex justify-between text-sm">
            <span className="text-muted">Listed prices</span>
            <span className="font-semibold">{formatPrice(totals.pricedSubtotal)}</span>
          </p>
        )}
        <Link href="/cart" className="inline-block text-sm font-semibold text-brand underline">
          Edit cart
        </Link>
        <p className="rounded-lg bg-steel-soft p-3 text-sm text-ink">
          This sends an order <strong>request</strong>. No payment is taken here. The store confirms price, availability
          {fulfilment === "courier" ? " and delivery charge" : ""} before anything is final.
        </p>
        <button
          type="submit"
          className={cx("btn btn-lg w-full whitespace-normal", method === "call" ? "btn-primary" : "btn-whatsapp")}
        >
          {method === "call" ? (
            <>
              <Phone className="size-5" aria-hidden="true" /> Continue to call
            </>
          ) : (
            <>
              <MessageCircle className="size-5" aria-hidden="true" /> Send order on WhatsApp
            </>
          )}
        </button>
      </aside>
    </form>
  );
}

function Field({
  id,
  label,
  hint,
  error,
  required,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-semibold text-ink">
        {label}
        {required ? <span className="text-danger"> *</span> : <span className="font-normal text-muted"> (optional)</span>}
      </label>
      {hint && (
        <p id={`${id}-hint`} className="mb-1.5 text-sm text-muted">
          {hint}
        </p>
      )}
      {children}
      {error && (
        <p id={`${id}-error`} className="mt-1.5 flex gap-1.5 text-sm text-danger">
          <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  );
}

function Choice({
  name,
  value,
  checked,
  onChange,
  title,
  description,
}: {
  name: string;
  value: string;
  checked: boolean;
  onChange: () => void;
  title: string;
  description: string;
}) {
  return (
    <label
      className={cx(
        "flex cursor-pointer gap-3 rounded-lg border p-3 transition-colors",
        checked ? "border-brand bg-brand-soft" : "border-line hover:border-line-strong",
      )}
    >
      <input type="radio" name={name} value={value} checked={checked} onChange={onChange} className="mt-1 size-4 shrink-0 accent-brand" />
      <span>
        <span className="block font-semibold text-ink">{title}</span>
        <span className="block text-sm text-muted">{description}</span>
      </span>
    </label>
  );
}

function Notice({ tone, title, children }: { tone: "success" | "warning"; title: string; children: React.ReactNode }) {
  const Icon = tone === "success" ? CircleCheck : CircleAlert;
  return (
    <div className={cx("flex gap-3 rounded-lg p-4", tone === "success" ? "bg-success-soft" : "bg-warning-soft")}>
      <Icon className={cx("mt-0.5 size-5 shrink-0", tone === "success" ? "text-success" : "text-warning")} aria-hidden="true" />
      <div>
        <p className="font-semibold text-ink">{title}</p>
        <p className="mt-1 text-sm text-ink">{children}</p>
      </div>
    </div>
  );
}
