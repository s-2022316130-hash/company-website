"use client";

import Form from "next/form";
import { useId, useRef } from "react";

/** Sort dropdown that submits on change, carrying the other query params as hidden fields. */
export function SortSelect({
  basePath,
  options,
  value,
  hidden,
}: {
  basePath: string;
  options: { value: string; label: string }[];
  value: string;
  hidden: [string, string][];
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const id = useId();
  if (options.length < 2) return null;
  return (
    <Form ref={formRef} action={basePath} scroll={false} className="flex items-center gap-2">
      {hidden.map(([name, v], i) => (
        <input key={`${name}-${v}-${i}`} type="hidden" name={name} value={v} />
      ))}
      <label htmlFor={id} className="whitespace-nowrap text-sm text-muted">
        Sort by
      </label>
      <select
        id={id}
        name="sort"
        defaultValue={value}
        onChange={() => formRef.current?.requestSubmit()}
        className="input min-h-10 w-auto py-1.5 pr-8 text-sm"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <noscript>
        <button type="submit" className="btn btn-outline btn-sm">
          Sort
        </button>
      </noscript>
    </Form>
  );
}
