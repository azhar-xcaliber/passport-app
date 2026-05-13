"use client";

import { createContext, useContext } from "react";
import type { PracticeConfig } from "@/lib/ai/mock-data/practices";

const PracticeContext = createContext<PracticeConfig | null>(null);

export function PracticeProvider({
  value,
  children,
}: {
  value: PracticeConfig | null;
  children: React.ReactNode;
}) {
  return (
    <PracticeContext.Provider value={value}>
      {children}
    </PracticeContext.Provider>
  );
}

export function usePracticeContext(): PracticeConfig | null {
  return useContext(PracticeContext);
}

export function useEmbedOrigin(): string {
  if (typeof window === "undefined") { return ""; }
  return new URLSearchParams(window.location.search).get("embed_origin") ?? "";
}
