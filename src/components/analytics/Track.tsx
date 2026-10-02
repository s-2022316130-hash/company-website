"use client";

import { useEffect, type AnchorHTMLAttributes } from "react";
import { track, type AnalyticsEvent, type AnalyticsProps } from "@/lib/analytics";

/** Fires one analytics event when the page mounts. */
export function TrackView({ event, props }: { event: AnalyticsEvent; props?: AnalyticsProps }) {
  const key = JSON.stringify(props ?? {});
  useEffect(() => {
    track(event, JSON.parse(key) as AnalyticsProps);
  }, [event, key]);
  return null;
}

/** External link (tel:, wa.me, maps) that records a click event. */
export function TrackedAnchor({
  event,
  eventProps,
  onClick,
  ...rest
}: AnchorHTMLAttributes<HTMLAnchorElement> & { event: AnalyticsEvent; eventProps?: AnalyticsProps }) {
  return (
    <a
      {...rest}
      onClick={(e) => {
        track(event, eventProps);
        onClick?.(e);
      }}
    />
  );
}
