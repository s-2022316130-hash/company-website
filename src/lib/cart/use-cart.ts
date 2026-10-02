"use client";

import { useMemo, useSyncExternalStore } from "react";
import { track } from "@/lib/analytics";
import { cartReducer, cartTotals, parseStoredCart, type CartAction, type CartLine } from "./cart";

/**
 * Browser cart store, persisted to localStorage and synced across tabs.
 * Uses useSyncExternalStore so server HTML (empty cart) hydrates without mismatch.
 */

const STORAGE_KEY = "nirob-autos:cart:v1";
const EMPTY: CartLine[] = [];

let lines: CartLine[] = EMPTY;
let loaded = false;
const listeners = new Set<() => void>();

function readStorage(): CartLine[] {
  try {
    return parseStoredCart(window.localStorage.getItem(STORAGE_KEY));
  } catch {
    return EMPTY;
  }
}

function ensureLoaded() {
  if (!loaded && typeof window !== "undefined") {
    lines = readStorage();
    loaded = true;
  }
}

function emit() {
  listeners.forEach((l) => l());
}

function onStorage(e: StorageEvent) {
  if (e.key !== STORAGE_KEY) return;
  lines = readStorage();
  emit();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (listeners.size === 1) window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) window.removeEventListener("storage", onStorage);
  };
}

function getSnapshot() {
  ensureLoaded();
  return lines;
}

function getServerSnapshot() {
  return EMPTY;
}

export function dispatchCart(action: CartAction) {
  ensureLoaded();
  const before = lines;
  lines = cartReducer(lines, action);
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  } catch {
    // Storage full or blocked (private mode): the cart still works for this page view.
  }
  emit();

  if (action.type === "add") {
    track("add_to_cart", { product_id: action.line.productId, quantity: action.quantity ?? 1 });
  } else if (action.type === "remove") {
    if (before.some((l) => l.productId === action.productId)) track("remove_from_cart", { product_id: action.productId });
  }
}

const noopSubscribe = () => () => {};

/** False during server render and hydration, true once the stored cart has been read. */
export function useHydrated(): boolean {
  return useSyncExternalStore(noopSubscribe, () => true, () => false);
}

export function useCart() {
  const current = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const totals = useMemo(() => cartTotals(current), [current]);
  return { lines: current, totals };
}
